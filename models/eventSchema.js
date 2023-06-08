const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  address: { type: String, required: true },
  eventDate: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  year: { type: Number, required: true },
  headquarter: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
})

const Event = mongoose.model('event', eventSchema)

module.exports = Event
