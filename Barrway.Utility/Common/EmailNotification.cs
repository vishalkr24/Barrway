using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Barrway.Utility.Common
{
    public class EmailNotification
    {
        /// <summary>
        /// The Send email Notification
        /// </summary>
        /// <param name="DictParam">The DictParam<see cref="Dictionary{string,object}"/></param>
        /// <returns>The <see cref="string"/></returns>

        public static bool SendEmail(Dictionary<string, object> emailmodel)
        {
            // Initialization.  
            bool isSend = false;

            try
            {
                // Initialization.  
                var body = emailmodel["Body"].ToString();
                string toemail = emailmodel["ToEmail"].ToString();
                MailMessage message = new MailMessage();

                // Settings.
                message.To.Add(new MailAddress(toemail));
                message.From = new MailAddress(ConfigurationManager.AppSettings["SenderMail"].ToString().Trim()); /*support @d-law.com*/
                message.Subject = !string.IsNullOrEmpty(emailmodel["Subject"].ToString()) ? emailmodel["Subject"].ToString() : "";
                message.Body = body;
                message.IsBodyHtml = true;

                using (var smtp = new SmtpClient())
                {

                    // Settings.  
                    var credential = new NetworkCredential
                    {
                        UserName = ConfigurationManager.AppSettings["SenderMail"].ToString().Trim(), //support@d - law.com

                        Password = ConfigurationManager.AppSettings["SenderPassword"].ToString().Trim()    /*support2202*/
                    };
                    smtp.Host = "smtp.gmail.com"; /*smtp.d - law.com*/
                    smtp.Port = 587; /*225*/
                    // Settings.  
                    //smtp.EnableSsl = ConfigurationManager.AppSettings["EnableSsl"].ToString().Trim() == "1" ? true : false;
                    //smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;



                    // Sending  
                    smtp.Send(message);      // code commented for testing purpose
                    smtp.Dispose();
                    message.Dispose();
                    // Settings.  
                    isSend = true;
                }
            }
            catch (Exception ex)
            {
                // Info  
                isSend = false;
                //throw ex;
            }

            // info.  
            return isSend;
        }
        //public static bool SendEmailAsync(string toemail, string body, string subject)
        //{
        //    // Initialization.  
        //    bool isSend = false;

        //    try
        //    {
        //        MailMessage message = new MailMessage();

        //        // Settings.  
        //        message.To.Add(new MailAddress(toemail));
        //        message.From = new MailAddress("info@augursinnovation.com");
        //        message.Subject = subject;
        //        message.Body = body;
        //        message.IsBodyHtml = true;

        //        using (var smtp = new SmtpClient())
        //        {

        //            // Settings.  
        //            var credential = new NetworkCredential
        //            {
        //                UserName = "info@augursinnovation.com",
        //                Password = "Egoxx123"
        //            };

        //            // Settings.  
        //            smtp.UseDefaultCredentials = false;
        //            smtp.Credentials = credential;

        //            smtp.Host = "mail.augursinnovation.com";
        //            smtp.Port = 587;
        //            smtp.EnableSsl = false;

        //            // Sending  
        //            smtp.Send(message);
        //            smtp.Dispose();
        //            message.Dispose();
        //            // Settings.  
        //            isSend = true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // Info  
        //        isSend = false;
        //        throw ex;
        //    }

        //    // info.  
        //    return isSend;
        //}

        public static bool SendEmailAsync(string toemail, string body, string subject)
        {
            // Initialization.  
            bool isSend = false;
            string fromemail = "info@barrway.com";
            string password = "Geligulu-168";
            string host = "smtp.office365.com";
            int port = 587;
            bool enableSsl = true;
            try
            {
                MailMessage message = new MailMessage();
                
                // Settings.  
                message.To.Add(new MailAddress(toemail));
                message.From = new MailAddress(fromemail, "Barrway");
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;
                using (var smtp = new SmtpClient())
                {

                    // Settings.  
                    var credential = new NetworkCredential
                    {
                        UserName = fromemail,
                        Password = password
                    };

                    // Settings.  
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;

                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = enableSsl;

                    // Sending  
                    smtp.Send(message);
                    smtp.Dispose();
                    message.Dispose();
                    // Settings.  
                    isSend = true;
                }
            }
            catch (Exception ex)
            {
                // Info  
                isSend = false;
                throw ex;
            }

            // info.  
            return isSend;
        }
    }
}
