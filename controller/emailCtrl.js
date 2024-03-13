const nodemailer= require("nodemailer")
const asyncHandler= require("express-async-handler")
require("dotenv").config();
const sendEmail= asyncHandler(async(data, req, res)=>{
    let transporter= nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
    })
    let info= await transporter.sendMail({
        from: '<abc@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
    })
    console.log("Message sent: ", info.messageId)

    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
})
module.exports= {sendEmail}

