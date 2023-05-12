// var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const hbs = require("nodemailer-express-handlebars");
var msg =""
module.exports = {
// create reusable transport method (opens pool of SMTP connections)

send_email: function(
    name ,toAddress) {  
    
    // setup e-mail data with unicode symbols
    var transporter = nodemailer.createTransport(smtpTransport({
        host:"mail.hypersonal.video",
        port: 465,
       // service: "Gmail",
       //port: 587,
       secure: true, // true for 465, false for other ports
       auth: {
               user:"info@hypersonal.video", // Your email id
               pass:"Getmorph202@" // Your password
           },
           tls: {
               // do not fail on invalid certs
               rejectUnauthorized: false,
             },
       }));

       const options = {
        viewEngine: {
            extName: '.html',
            partialsDir: 'src/views/templates',
            layoutsDir: 'src/views/templates',
            defaultLayout: false,
        },
        viewPath: 'src/views/templates',
        extName: '.html'
      };

      
      transporter.use("compile", hbs(options));

    // var path = require('path')  
    // var templates = new EmailTemplates({
    //     root: './views/templates/'
    // });

    
    if(toAddress != ""){
        // console.log("-----------------"+toAddress)
      
            var mailOptions = {
                from:"info@hypersonal.video", // sender address
                to: toAddress, // list of receivers
                subject: "Hypersonal Video", // Subject line                  
                //text: "Hello world ", // plaintext body
               // html: html // html body
               template: "__sampleTemplate" ,
               context: {
                name: name
            }
            }
    
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, response){                
                if(error){
                    console.log(error);
                    msg=toAddress+"=====>subject==========>"+"subject"+"=========>error===========>"+error;
                    //send_email(toAddress,subject,htmltext);
                }else{
                    console.log("Message sent: " + JSON.stringify(response.response));
                    msg=toAddress+"=====>subject==========>"+"subject"+"==nodemon=======>error===========>"+response.response;
                }       
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });         
       
    }else{
        //console.log("American Dragon Jake long")
        msg = "success"
    }
        
    return msg;
}
}