require('dotenv').config();

const accountSid = process.env.Account_SID;
const authToken = process.env.Auth_Token;
const servicesSid = process.env.Service_SID;
const client = require('twilio')(accountSid, authToken);


const sendOtpApi = (number) =>{
    
    return new Promise ((resolve, reject) =>{

        client.verify.v2.services(servicesSid)
                        .verifications
                        .create({to: `+91${number}`, channel: 'sms'})
                        .then(verification => {resolve(verification.sid)});
    })
}


const otpVerify = (otp,number) =>{
    return new Promise((resolve,reject)=>{

        client.verify.v2.services(servicesSid)
      .verificationChecks
      .create({to: `+91${number}`, code: `${otp}`})
      .then(verification_check => {resolve(verification_check.status)});
    })
}


module.exports = {
    sendOtpApi,otpVerify,
}