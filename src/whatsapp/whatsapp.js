import twilio from "twilio";

//Agregar credenciales
const accountId = "ACa6799d7902c187096fe190b1f74fc873";
const tokenTwilio = "401b898b65e25208e129cb23552ae436";
const twilioWhatsappPhone = "whatsapp:+14155238886";
const adminWhatsappPhone = "whatsapp:+5492396586971";

//Cliente que se conecta al servicio de Twilio
const twilioClient = twilio(accountId, tokenTwilio);

export {twilioClient, twilioWhatsappPhone, adminWhatsappPhone};