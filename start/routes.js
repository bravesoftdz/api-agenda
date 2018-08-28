'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.group(() => {
  Route.resource('events', 'EventController')
    .apiOnly()
    .validator(new Map([[['events.store'], ['Event']]]))

  Route.post('events/share/:id', 'EventController.share')
}).middleware(['auth'])
