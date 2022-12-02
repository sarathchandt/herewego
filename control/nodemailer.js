const { response } = require('express');
const nodemailer = require('nodemailer');
var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',

  auth: {
    user: 'sarathchand695@gmail.com',
    pass: 'meyhvngtxzbbrwof',
  }

});


module.exports = {
  sendit: (req, res) => {
    const { name, email, pass, rpassword, } = req.body
    let userdet = {}
    userdet.name = name;
    userdet.email = email;
    userdet.pass = pass;
    userdet.rpassword = rpassword;
    var mailOptions = {
      to: email,
      subject: "Otp for registration in here we go ",
      html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;color:red;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);

      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render("otp", { userdet })
    })


  },

  verifyotp: ((bodyotp) => {
    return new Promise((resolve, reject) => {
      let response = {};
      if (bodyotp.otp == otp) {
        response.status = true
        // res.send("You has been successfully registered");
        resolve(response)
      }
      else {
        // res.render('otp',{msg : 'otp is incorrect'});
        response.status = false
        resolve(response)
      }
    })
  }),

  resendit: ((email) => {



    var mailOptions = {
      to: email,
      subject: "Otp for registration in here we go ",
      html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;color:red;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);

      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // res.render("otp",{userdet})


    })

  })



}