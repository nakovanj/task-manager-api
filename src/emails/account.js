
const sgMail = require('@sendgrid/mail')
const sendgridApiKey = process.env.SGRID_API_KEY
sgMail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (email, name) => {
    console.log('Send mail to: ', name, 'at: ', email)
    sgMail.send({
        to: email,
        from: 'nakovanj@gmail.com',
        subject: 'Welcome',
        text: `Welcome to the app ${name}. I hope this works.`
    }).then(() => {console.info('Mail sent')})
      .catch((reason) => console.log('Sending error: ', reason))
}

const sendDeleteEmail = (email, name) => {
    console.log('Send mail to: ', name, 'at: ', email)
    sgMail.send({
        to: email,
        from: 'nakovanj@gmail.com',
        subject: 'Sorry to see you go',
        text: `Sorry to see you go ${name}.`
    }).then(() => {console.info('Mail sent')})
      .catch((reason) => console.log('Sending error: ', reason))
}




module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendDeleteEmail
}