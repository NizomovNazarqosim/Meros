import nodemailer from 'nodemailer'

export function sendEmail(email: string) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nazarqosimnizomov@gmail.com',
        pass: 'q z x l o x s a x n w k e p a v'
      }
    })

    const mail_configs = {
      from: 'america@gmail.com',
      to: email,
      subject: 'Meros company',
      text: 'Hay man you are connected to meros website'
    }
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        reject(error)
      }
      resolve(info)
    })
  })
}
