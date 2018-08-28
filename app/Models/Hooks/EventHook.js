'use strict'
const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')
const EventHook = (exports = module.exports = {})

EventHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

  const { email, name } = await taskInstance.user().fetch()

  const { title } = taskInstance

  Kue.dispatch(Job.key, { email, name, title }, { attempts: 3 })
}
