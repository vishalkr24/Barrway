using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Barrway.Service.IRepository;
using Barrway.Models;
using Barrway.Utility.Common;
using Barrway.DTO.AuthViewModel;
using Barrway.DTO.Common;
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.BusinessModels;
using System.Web.Security;

namespace Barrway.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAuthService authService;
        private readonly ISqlFunction sqlFunction;
        private readonly ISignupService signupService;
        private readonly IBusinessUserService businessUserService;

        public AccountController(IAuthService authService, ISqlFunction sqlFunction, ISignupService signupService, IBusinessUserService businessUserService)
        {
            this.authService = authService;
            this.sqlFunction = sqlFunction;
            this.signupService = signupService;
            this.businessUserService = businessUserService;
        }
        // GET: Account
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> BusinessLogin()
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.BUSINESS_USER);
                if (user.Status)
                {
                    return RedirectToAction("Dashboard", "BusinessAdmin");
                }
                else
                {
                    Logout();
                }

                
            }
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> BusinessLogin(LoginViewModel model)
        {
            if (!ModelState.IsValid) {
                return View();
            }

            var loginresult = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, true);

            if (loginresult.Status)
            {
                var user = loginresult.Data;
                var claims=new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);


                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = model.REMEMBER_ME }, claims);
                return RedirectToAction("Dashboard", "BusinessAdmin");
            }
            else
            {
                ModelState.AddModelError("ERROR_MESSAGE", loginresult.Message);
            }

            return View(model);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> BusinessSignUp()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> BusinessSignUp(BusinessEmailSignUpViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (!model.TERMS_ACCEPTED)
            {
                ModelState.AddModelError("TERMS_ACCEPTED", "Please check our terms & conditions.");
                return View(model);
            }

            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL);
            var userByID = await authService.GetUser(model.USER_NAME);

            string BusinessRoleId = ((int)FormRole.BUSINESS_USER).ToString();

            if (!userByEmail.Status && !userByID.Status)
            {
                // insert data

                UserMaserModel userMaserModel = new UserMaserModel(){
                    USER_PHONE = "",
                    IS_ACTIVE = "N",
                    IS_EMAIL_VERIFIED = "N",
                    IS_PHONE_VERIFIED = "N",
                    IS_EXTERNAL_SIGNUP = "N",
                    PROFILE_STATUS = "PENDING",
                    SIGNUP_TYPE = "EMAIL",
                    USER_EMAIL = model.USER_EMAIL,
                    USER_PASSWORD = model.USER_PASSWORD,
                    USER_ID = model.USER_NAME,
                    ROLE_ID = BusinessRoleId
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                BusinessAccountWebsiteModel businessModel = new BusinessAccountWebsiteModel()
                {
                    USER_ID = model.USER_NAME,
                    COMPANY_PROFILE_STATUS = "N",
                    COMPANY_CALENDAR_STATUS = "N",
                    TOTAL_WEBSITE_VISITS = 0,
                    CURRENT_STEP = "REGISTRATION",
                    IS_SEARCHABLE_IN_MARKETPLACE = "N"
                };

                AddUpdateDelete businessResult = await businessUserService.CreateBusinessWebsite(businessModel);

                var linkResult = await authService.sendActivationLink(model.USER_NAME, model.USER_EMAIL, FormRole.BUSINESS_USER);
                
                if (result.Status && businessResult.Status)
                {
                    TempData["VERIFICATION"] = "Pending";
                    TempData["VERIFICATION_EMAIL"] = model.USER_EMAIL;
                    return RedirectToAction("EmailVerification", "Account");

                }
                else
                {
                    ModelState.AddModelError("USER_NAME", result.Message);
                    return View(model);
                }
                
            }
            else
            {
                if (userByEmail.Status)
                {
                    ModelState.AddModelError("USER_EMAIL", "Email already registered");
                    
                }

                if (userByID.Status)
                {
                    ModelState.AddModelError("USER_NAME", "User name is already taken");
                }
                
                return View(model);
            }

        }

        public async Task<ActionResult> EmailVerification()
        {
            if (TempData.Peek("VERIFICATION") == "Pending")
            {
                try
                {
                    ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL").ToString();
                }catch (Exception ex)
                {
                    ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL");
                }
                
                return View();
            }
            else
            {
                return RedirectToAction("Home", "Index");
            }
            
        }


        [HttpPost]
        public ActionResult Logout()
        {
            Session.Clear();
            Session.RemoveAll();
            Session.Abandon();
            TempData.Clear();
            if (HttpContext != null)
            {
                HttpContext.Request.Cookies.Clear();
            }

            HttpContext.GetOwinContext().Authentication.SignOut();
            return RedirectToAction("BusinessLogin");
        }

        public ActionResult AcessDenied() {

            return View();
        }


        [HttpGet]
        public async Task<ActionResult> verification(string userName, string token, string role)
        {
            if (string.IsNullOrEmpty(token))
            {
                TempData["failed"] = "Invalid Request";
                return View();
            }

            var result = await authService.GetToken(token,userName);
            if (result.Status && (result.Data as IDictionary<string, object>)["IS_ACTIVE"]?.ToString() == "Y")
            {
                var tokeData = result.Data as IDictionary<string, object>;
                var _createdTime = tokeData["TOKEN_TIME"]?.ToString();
                
                DateTime createdTime;

                if (DateTime.TryParse(_createdTime, out createdTime)) {

                    if (DateTime.Now.Subtract(createdTime).TotalHours > 24)
                    {
                        TempData["failed"] = "Email Activation Link Expired!";
                        return View();
                    }
                    var verificationResult = await authService.UserVerification(token, userName);
                    if (verificationResult.Status) {
                        TempData["success"] = "Email verification successfull.";

                        if (role == "BUSINESS_USER")
                        {
                            int affectedRows = await sqlFunction.ExecuteSqlCommandQuery("update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY PROFILE' where USER_ID = '" + userName + "'");
                            return View();
                        }

                        return View();
                    }
                    else
                    {
                        TempData["failed"] = verificationResult.Message;
                        return View();
                    }
                }
                else{
                    TempData["failed"] = "Invalid Token";
                    return View();
                }
            }
            else
            {
                TempData["failed"] = "Invalid activation link!";
                return View();
            }
        }

        [HttpGet]
        public async Task<ActionResult> resetpassword(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                TempData["failed"] = "Invalid Request";
                return View();
            }
            var result = await authService.GetToken(token);
            if (result.Status && (result.Data as IDictionary<string, object>)["IS_ACTIVE"]?.ToString() == "YES")
            {
                var tokeData = result.Data as IDictionary<string, object>;
                var _createdTime = tokeData["TOKEN_TIME"]?.ToString();
                DateTime createdTime;
                if (DateTime.TryParse(_createdTime, out createdTime))
                {

                    if (DateTime.Now.Subtract(createdTime).TotalHours > 24)
                    {
                        TempData["failed"] = "Reset Password Link Expired!";
                        return View();
                    }
                    TempData["success"] = "reset password link verified please reset your password!";
                    ResetPasswordViewModel model = new ResetPasswordViewModel() {token=token };
                    return View(model);
                }
                else
                {
                    TempData["failed"] = "Invalid Token!";
                    return View();
                }
            }
            else
            {
                TempData["failed"] = "Invalid activation link!";
                return View();
            }
        }

        [HttpPost]
        public async Task<ActionResult> resetpassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var result = await authService.GetToken(model.token);
            if (result.Status && (result.Data as IDictionary<string, object>)["IS_ACTIVE"]?.ToString() == "YES")
            {
                var tokeData = result.Data as IDictionary<string, object>;
                var _createdTime = tokeData["TOKEN_TIME"]?.ToString();
                DateTime createdTime;
                if (DateTime.TryParse(_createdTime, out createdTime))
                {

                    if (DateTime.Now.Subtract(createdTime).TotalHours > 24)
                    {
                        ModelState.AddModelError("", "Reset Password Link Expired!");
                        return View();
                    }
                    model.newpassword = Aes256CbcEncrypter.Encrypt(model.newpassword);
                    result= await authService.ResetPassword(model.token, tokeData["USER_NAME"].ToString(), model.newpassword);
                    if (result.Status) {
                        ModelState.Clear();
                        TempData["success"] = "password reset successfully. you can login your account on mobile app.";
                    }
                    else
                    {
                        ModelState.Clear();
                        ModelState.AddModelError("",result.Message);
                    }
                    return View();
                }
                else
                {
                    ModelState.Clear();
                    ModelState.AddModelError("", "Invalid activation link!");
                    return View();
                }
            }
            else
            {
                ModelState.Clear();
                ModelState.AddModelError("", "Invalid activation link!");
                return View();
            }
        }
    }
}