const dotenv = require("dotenv");
const sgMail = require('@sendgrid/mail');
dotenv.config();
const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);


const confirmationMail = (to)=>{
    const code = Math.floor(Math.random()*90000) + 10000;
    sgMail.send({
        to: to, // Change to your recipient
        from: 'foodtrendswebsite@gmail.com', // Change to your verified sender
        subject: 'FoodTrends - Confirmation Code',
        text: 'Thanks!',
        html: `<strong>your conformation code is : ${code}</strong>`
    });
    return code;
}
module.exports = {confirmationMail}
