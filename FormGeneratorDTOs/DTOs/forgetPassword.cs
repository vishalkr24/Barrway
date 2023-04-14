using System;
using System.Net.Mail;
using System.Text;

namespace FormGeneratorDTOs.DTOs
{
    public class forgetPassword
    {
        public string sendEmail(forgetPasswordParams obj)
        {


            string to = obj.recieverId.ToString(); //To address    
            string from = "info@geligulu.com"; //From address    
            MailMessage message = new MailMessage(from, to);
            string app_url = obj.baseUrl;
            string link = app_url + "#/resetPassword?name=" + obj.name + "&data=" + obj.hass.ToString();
            //string mailbody = "<html><head></head><body><b/><p>Reset your password using the link below. </p><br/><p>Link : </p><a href='"+link+"' target='_blank'>Click here</></body></html>";
            string mailbody = @"<html>

<head>
   <!-- Required meta tags -->
   <meta charset='utf-8'>
   <meta name='viewport' content='width=device-width, initial-scale=1'>
   <link rel='preconnect' href='https://fonts.googleapis.com'>
<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>

   <title>Reset Password || Geligulu!</title>
   <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      body{
         background-color: #efefef;
         margin: 0;
         padding: 0;
      }
      .reset-pass{
         width: 60%;
         margin: 20px auto;  
         font-family: 'Poppins', sans-serif;
         font-size: 18px;
         border: 1px solid #ddd;
      }
      .reset-pass .reset-header{
         display: block;
         text-align: center;
         padding: 20px;
         background-color: #F7F4FF;
         /* border-bottom: 1px solid #ddd; */
      }
      .reset-pass .reset-footer{
         display: block;
         text-align: center;
         padding: 10px;
         background-color: #F7F4FF;
         /* border-bottom: 1px solid #ddd; */
      }
      .reset-pass-container{
         background-color: #3E246B;
         background: -webkit-gradient(linear, left top, left bottom, color-stop(20%, #3E246B), color-stop(70%, #7E3D99));
               background: linear-gradient(
         180deg
         , #3E246B 20%, #7E3D99 70%);
         padding: 20px;
   
      }
      .text-white{
         color: #fff;
      }
      .text-center{
         text-align: center;
      }
      .link{
         color: blue;
      }
      .small{
         font-size: 12px;
      }

   </style>
</head>

<body>
   <div class='reset-pass'>
      <div class='reset-header'>
         <img src='logo.svg' style='height: 40px;' />
      </div>
      <div class='reset-pass-container text-white text-center'>
         <div>
            <img src='newAssets/emailtemplate/password-reset.svg' style='height: 80px;' />
         </div>
         <h1 class='text-center' style='margin-top: 0'>
               Reset Password
         </h1>
         <p>
            Reset your password using the following link
         </p>
         <p>
            Click Link below <br />

            <a class='link' href=" + link + @" target='_blank'>" + link + @"
                 
            </a>
         </p>
         <p class='small'>
            If you did not forgot your password then you can safely ignore this email !
         </p>
      </div>
      <div class='reset-footer'>
         <p class='small'>
               Geligulu.com
         </p>
         <p class='small'>
            2021, Geligulu. All right reserved.
      </p>
      </div>
   </div>
</body>

</html>";
            message.Subject = "Geligulu:Password Reset";
            message.Body = mailbody;
            message.BodyEncoding = Encoding.UTF8;
            message.IsBodyHtml = true;
            SmtpClient client = new SmtpClient("mail.geligulu.com", 587); //Gmail smtp    
            System.Net.NetworkCredential basicCredential1 = new
            System.Net.NetworkCredential("info@geligulu.com", "Egoxx456");
            client.UseDefaultCredentials = true;
            client.EnableSsl = true;

            client.Credentials = basicCredential1;
            try
            {
                client.Send(message);
                return "link sent successfully";
            }

            catch (Exception ex)
            {
                return "link not sent";
                throw ex;

            }


            // return "";
        }


    }

    public class forgetPasswordParams : CommonClass
    {

        public string reqType { get; set; }

        public string recieverId { get; set; }
        public string newPassword { get; set; }
        public string isIdExists { get; set; }
        public string hass { get; set; }
        public string name { get; set; }

        public string baseUrl { get; set; }



    }

}
