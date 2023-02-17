import nodemailer from "nodemailer";

const mail = 'spinacivalentino@gmail.com'
const mailPassword = 'ztymxggytpbmidar'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: mail,
        pass: mailPassword
    },
    //Importante para la seguridad del correo
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

export {transporter, mail};