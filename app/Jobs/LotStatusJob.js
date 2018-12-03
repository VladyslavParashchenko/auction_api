const kue = require('kue')
const Env = use('Env')
const Event = use('Event')
const Lot = use('App/Models/Lot')
const Logger = use('Logger')

class LotStatusJob {
  constructor () {
    this.queue = kue.createQueue(
      {
        redis: Env.get('REDIS_URL'),
        jobEvents: false
      }
    )
    this.queue.process(this.START_TIME_JOB, (job, done) => {
      this.lotStartProcessing(job, done)
    })
    this.queue.process(this.END_TIME_JOB, (job, done) => {
      this.lotEndProcessing(job, done)
    })
  }

  async lotStartProcessing (job, done) {
    try {
      console.log(job.data)
      const lot = await Lot.where({ id: job.data.id, lot_start_job_id: job.id }).firstOrFail()
      lot.status = 'inProcess'
      lot.lot_start_job_id = null
      await lot.save()
    } catch (e) {
      Logger.warning('Event error: %s', e.message)
    }
    done()
  }

  async lotEndProcessing (job, done) {
    try {
      const lot = await Lot.where({ id: job.data.id, lot_end_job_id: job.id }).firstOrFail()
      lot.status = 'closed'
      lot.lot_start_job_id = null
      await lot.save()
      Event.fire('lot::foundWinner', lot)
    } catch (e) {
      Logger.warning('Event error: %s', e.message)
    }
    done()
  }

  addJobToQueue (lot, queueName, delay) {
    let job = this.queue.create(queueName, lot).delay(delay)
    return new Promise((resolve, reject) => {
      job.save(function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(job.id)
        }
      })
    })
  }

  get START_TIME_JOB () {
    return 'lot_start'
  }

  get END_TIME_JOB () {
    return 'lot_end'
  }
}

module.exports = LotStatusJob
