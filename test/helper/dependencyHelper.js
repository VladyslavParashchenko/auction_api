const Antl = use('Antl')
const queue = require('kue').createQueue()
const Mail = use('Mail')
const Database = use('Database')
const Event = use('Event')
const Lot = use('App/Models/Lot')
const Bid = use('App/Models/Bid')
const User = use('App/Models/User')
const Route = use('Route')
const Factory = use('Factory')
module.exports = {
  Antl, Mail, Database, Event, Lot, Bid, User, Route, Factory, queue
}
