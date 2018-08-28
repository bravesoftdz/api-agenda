'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')
const Event = use('App/Models/Event')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   */
  async index ({ request, auth }) {
    const { page, initialDate, finalDate } = request.get()

    const events = await Event.query()
      .where({ user_id: auth.user.id })
      .whereBetween('event_date', [initialDate, finalDate])
      .with('user')
      .paginate(page)

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'localization', 'event_date'])

    const results = await Event.query().where({
      event_date: data.event_date,
      user_id: auth.user.id
    })

    if (results.length) {
      return response
        .status(400)
        .send({ error: true, message: 'Já existe evento nesta data' })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   */
  async show ({ params }) {
    const event = await Event.findOrFail(params.id)

    await event.load('user')

    return event
  }

  /**
   * Share a single event.
   * GET events/:id
   */
  async share ({ request, params, response }) {
    const { emails } = request.all()
    const event = await Event.findOrFail(params.id)

    await event.load('user')

    Kue.dispatch(Job.key, { emails, event }, { attempts: 3 })

    return { message: 'Emails enviados com sucesso' }
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   */
  async update ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response
        .status(400)
        .send({ error: true, message: 'Você não é dono deste evento' })
    }

    const data = request.only(['title', 'localization', 'event_date'])

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   */
  async destroy ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response
        .status(400)
        .send({ error: true, message: 'Você não é dono deste evento' })
    }

    await event.delete()
  }
}

module.exports = EventController
