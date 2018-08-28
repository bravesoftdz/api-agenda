'use strict'

const Antl = use('Antl')

class Event {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      localization: 'required',
      event_date: 'required|date'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Event
