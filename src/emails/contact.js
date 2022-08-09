const dotenv = require("dotenv");
const sgMail = require('@sendgrid/mail');
dotenv.config();
const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);


const contactUsMail = (from,message,name)=>{
    sgMail.send({
        to: 'foodtrendsfamily@gmail.com',
        from: 'foodtrendsfamily@gmail.com',
        subject: `contact mail`,
        html: ` <h1> Sender: ${name} </h1><br>
                 <p>Reply: ${from}</p>
                <strong>${message}</strong>`
    });
}
module.exports = {contactUsMail}
