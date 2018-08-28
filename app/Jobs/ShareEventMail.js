'use strict'

const Mail = use('Mail')

class ShareEventMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'ShareEventMail-job'
  }

  async handle ({
    emails,
    event: { title, localization, event_date: eventDate, user }
  }) {
    console.log(`Job: ${ShareEventMail.key}`)
    try {
      emails.forEach(async email => {
        await Mail.send(
          ['emails.share_event'],
          { title, eventDate, localization },
          message => {
            message
              .to(email)
              .from(user.email, `${user.name} | Rocketseat`)
              .subject('Evento compartilhado com você')
          }
        )
      })
    } catch (err) {
      console.log(err)
    }

    return 'DEU CERTO!'
  }
}

module.exports = ShareEventMail
