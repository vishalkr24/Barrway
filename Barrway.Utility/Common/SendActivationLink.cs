using Barrway.DTO.AuthViewModel;
using Barrway.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;


namespace Barrway.Utility.Common
{
    public class SendActivationLink
    {
        //private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static AddUpdateDelete sendlink(UserToken userToken, FormRole Role)
        {
            try
            {
                StringBuilder strBody = new StringBuilder();
                Dictionary<string, object> LookUpDict = new Dictionary<string, object>();
                var urlBuilder =
                    new UriBuilder(HttpContext.Current.Request.Url.AbsoluteUri)
                    {
                        Path = HttpContext.Current.Request.ApplicationPath,
                        Query = null,
                        Fragment = null
                    };
                string url = urlBuilder.ToString();
                string verficationlink = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"] + $"Account/verification?username={userToken.USER_ID}&token={userToken.TOKEN}&role={Role}";
                //logger.Info(verficationlink);
                //string logourl = string.Format("{0}://{1}/{2}", HttpContext.Current.Request.Url.Scheme, HttpContext.Current.Request.Url.Authority, $"/otaContent/assets/img/favicon.png");
                string logourl = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"].ToString() + "assets/marketplace/image/logo.png";
                if (Role == FormRole.BUSINESS_USER || Role == FormRole.GENERAL_USER)
                {
                    strBody.Append("<body class='ng-cloak'><div class='form-wrapper-custom-email' style='width: 50%; margin: 0 auto; padding: 1px;' id='loginForm'>" +
                  "<div class='container-custom'><div class='row form-group'><div class='row mb-4'><strong style = 'display:flex; gap:10px; align-items:center;'><img src='" + logourl + "' style='height:40px; transform:translateY(50%); padding:10px;'/><h2 style='color: #3e6b6b;'>Barrway Business</h2></strong></div></div>" +
                  "<div class='row mb-4 choices' style='text-align: center;'><h4 class='text-darkPrimary'>Verification Mail</h4></div>" +
                  "<div class='row mb-4'><h4>Dear User</h4></div><div class='row form-group'>" +
                  "<p> We would like to inform you that your registration was accepted and you have one more step to take to get ready for your account activation.</p></div>" +
                "<div class='row form-group'><p>Please click the following button for your account activation</p></div>" +
                "<div class='row form-group' style='text-align: center;'><a target = '_blank' href='" + verficationlink + "' style='height: 35px; line-height: 35px; background-color: #3e6b6b; color: #ece9e0; padding: 8px 10px; cursor: pointer; border: 0px; font-size: 15px; text-decoration: none;'>Activate Account</a></div>" +
                "<div class='row form-group'><label>User Id:</label><strong><label id = 'lblUserId'> " + userToken.USER_ID + " </label></strong></div>" +
                "<div class='row form-group'><p>* For any questions, please feel free to contact our customer service hot-line: or email to us at</p></div>" +
                "<div class='row form-group'><p>Best Regards,</p><p>Barrway</p></div>" +
                "</div></div></body>");

                }
                else if (Role == FormRole.PUBLIC_USER)
                {
                    strBody.Append("<body class='ng-cloak'><div class='form-wrapper-custom-email' style='width: 50%; margin: 0 auto; padding: 1px;' id='loginForm'>" +
                    "<div class='container-custom'><div class='row form-group'><div class='row mb-4'><strong style = 'display:flex; gap:10px; align-items:center;'><img src='" + logourl + "' style='height:40px; transform:translateY(50%); padding:10px;'/><h2 style='color: #3e6b6b;'>Barrway User</h2></strong></div></div>" +
                    "<div class='row mb-4 choices' style='text-align: center;'><h4 class='text-darkPrimary'>Verification Mail</h4></div>" +
                    "<div class='row mb-4'><h4>Dear User</h4></div><div class='row form-group'>" +
                    "<p> We would like to inform you that your registration was accepted and you have one more step to take to get ready for your account activation.</p></div>" +
                  "<div class='row form-group'><p>Please click the following button for your account activation</p></div>" +
                  "<div class='row form-group' style='text-align: center;'><a target = '_blank' href='" + verficationlink + "' style='height: 35px; line-height: 35px; background-color: #3e6b6b; color: #ece9e0; padding: 8px 10px; cursor: pointer; border: 0px; font-size: 15px; text-decoration: none;'>Activate Account</a></div>" +
                  "<div class='row form-group'><label>User Id:</label><strong><label id = 'lblUserId'> " + userToken.USER_ID + " </label></strong></div>" +
                  "<div class='row form-group'><p>* For any questions, please feel free to contact our customer service hot-line: or email to us at</p></div>" +
                  "<div class='row form-group'><p>Best Regards,</p><p>Barrway</p></div>" +
                  "</div></div></body>");
                }

                //Dictionary<string, object> dictMail = new Dictionary<string, object>();
                //dictMail.Add("ToEmail", userToken.Email);
                //dictMail.Add("Subject", "Verification Mail");
                //dictMail.Add("Body", strBody);
                var result = EmailNotification.SendEmailAsync(userToken.EMAIL, strBody.ToString(), "Verification Mail");
                if (result)
                {
                    return new AddUpdateDelete() { Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Email send Failed" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }

        public static AddUpdateDelete sendlinkForResetPassword(UserToken userToken)
        {
            try
            {
                StringBuilder strBody = new StringBuilder();
                Dictionary<string, object> LookUpDict = new Dictionary<string, object>();
                var urlBuilder =
                    new UriBuilder(HttpContext.Current.Request.Url.AbsoluteUri)
                    {
                        Path = HttpContext.Current.Request.ApplicationPath,
                        Query = null,
                        Fragment = null
                    };
                string url = urlBuilder.ToString();
                string resetlink = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"] + $"Account/resetpassword?token={userToken.TOKEN}";
                //var logourl = string.Format("{0}://{1}/{2}", HttpContext.Current.Request.Url.Scheme, HttpContext.Current.Request.Url.Authority, $"/otaContent/assets/img/favicon.png");
                string logourl = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"].ToString() + "logo.png";
                string contactlink = "";
                string contact = "";
                string fax = "";
                string appemail = "";
                strBody.Append("<body>" +
                    "<div class='container'>" +
                    "<div class='themes' style='background-color: #ffffff; width: 50%; margin:20px auto;'>" +
                    "<div style='height: 70px;line-height: 70px;background-color: #ffffff;padding:0 20px; border-radius: 8px 8px 0 0'>" +
                    "<h2 style='color: #3e6b6b;line-height: 70px;'><img src='" + logourl + "' alt='' style='vertical-align: middle;max-width:100px;width:100%;max-height:100px;height:100px'>Moodie's Care</h2>" +
                    " </div>" +
                    "<div class='content_body' style='padding:20px; text-align: left;'>" +
                    "<h3 style='margin-bottom: 10px; text-align: center;'>Forgot Password</h3>" +
                    "<p>Dear User,</p>" +
                    "<p>You are receiving this because you (or someone else) have requested the reset of the password for your account</p>" +
                    "<p>Please click on the following button to complete the process within 24 hours of receiving it:</p>" +
                    "<p style='text-align: center;'><a target='_blank' href='" + resetlink + "'" +
                " target='_blank' style='height: 35px;line-height:35px; background-color:#3e6b6b;color:#ece9e0;padding:8px 10px;cursor:pointer; border:0px;font-size:15px;text-decoration: none;'>Reset Password</a></p>" +
                "<p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>" +
                "<p><span style='color:#d7683a'>*</span> If you have any questions or need further assistance, please feel free to <a style='color:#d7683a;text-decoration: none;' target='_blank' href='" + contactlink + "'>contact us</a>.</p>" +
                "</div>" +
                "<div style='height:auto;line-height:20px;background-color: #535353;padding:0 20px; border-radius: 0 0 8px 8px; text-align: center;overflow: hidden;'>" +
                "<h5 style='color: #ece9e0;margin-top: 5px;'><img src='" + logourl + "' alt='logo' style='vertical-align: middle;height: 30px;'>Moodie's Care</h5>" +
                "<p style='color: #ece9e0;font-size: 13px;'><strong>Tel :</strong> " + AppSettings.telephone + " &nbsp;&nbsp;  <strong>Fax :</strong> " + AppSettings.fax + " &nbsp;&nbsp;  <strong>Email :</strong> " + AppSettings.email + "</p>" +
                "</div>" +
                "</div>" +
                " </div>" +
                    "</body>");
                Dictionary<string, object> dictMail = new Dictionary<string, object>();
                dictMail.Add("ToEmail", userToken.EMAIL);
                dictMail.Add("Subject", "Forgot Password");
                dictMail.Add("Body", strBody);
                //var result = EmailNotification.SendEmail(dictMail);
                var result = EmailNotification.SendEmailAsync(userToken.EMAIL, strBody.ToString(), "Forgot Password");
                //logger.Info(resetlink);
                if (result)
                {
                    return new AddUpdateDelete() { Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Email send Failed" };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }

        public static AddUpdateDelete sendvarificationLink(UserToken userToken)
        {
            try
            {
                StringBuilder strBody = new StringBuilder();
                Dictionary<string, object> LookUpDict = new Dictionary<string, object>();
                var urlBuilder =
                    new UriBuilder(HttpContext.Current.Request.Url.AbsoluteUri)
                    {
                        Path = HttpContext.Current.Request.ApplicationPath,
                        Query = null,
                        Fragment = null
                    };
                string url = urlBuilder.ToString();
                string verficationlink = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"] + $"Account/VerifiyEmailaddress?username={userToken.USER_ID}&token={userToken.TOKEN}";

                string logourl = System.Web.Configuration.WebConfigurationManager.AppSettings["baseurl"].ToString() + "assets/marketplace/image/logo.png";

                strBody.Append("<body class='ng-cloak'><div class='form-wrapper-custom-email' style='width: 50%; margin: 0 auto; padding: 1px;' id='loginForm'>" +
                                "<div class='container-custom'><div class='row form-group'><div class='row mb-4'><strong style = 'display:flex; gap:10px; align-items:center;'><img src='" + logourl + "' style='height:40px; transform:translateY(50%); padding:10px;'/><h2 style='color: #3e6b6b;'>Barrway Business</h2></strong></div></div>" +
                                "<div class='row mb-4 choices' style='text-align: center;'><h4 class='text-darkPrimary'>Verification Mail</h4></div>" +
                                "<div class='row mb-4'><h4>Dear User</h4></div><div class='row form-group'>" +
                                //"<p>Please varify your email address</p></div>" +
                                "<div class='row form-group'><p>Please click the following button to varify your email address</p></div>" +
                                "<div class='row form-group' style='text-align: center;'><a target = '_blank' href='" + verficationlink + "' style='height: 35px; line-height: 35px; background-color: #3e6b6b; color: #ece9e0; padding: 8px 10px; cursor: pointer; border: 0px; font-size: 15px; text-decoration: none;'>Verify email address</a></div>" +
                                "<div class='row form-group'><label>User Id:</label><strong><label id = 'lblUserId'> " + userToken.USER_ID + " </label></strong></div>" +
                                "<div class='row form-group'><p>* For any questions, please feel free to contact our customer service hot-line: or email to us at</p></div>" +
                                "<div class='row form-group'><p>Best Regards,</p><p>Barrway</p></div>" +
                                "</div></div></body>");


                var result = EmailNotification.SendEmailAsync(userToken.EMAIL, strBody.ToString(), "Verification Mail");
                if (result)
                {
                    return new AddUpdateDelete() { Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Email send Failed" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }

    }
}
