 const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';
sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
    to:'mnasser480@gmail.com',
    from:'mnasser480@gmail.com',
    template_id: "d-3ee3fcd8cbbe4f75a5b34fda95c0413c",
    dynamic_template_data: {
        code: "12d874"
    }
});