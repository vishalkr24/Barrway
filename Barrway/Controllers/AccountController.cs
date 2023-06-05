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
using Barrway.DTO.PublicModels;

namespace Barrway.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAuthService authService;
        private readonly ISqlFunction sqlFunction;
        private readonly ISignupService signupService;
        private readonly IBusinessUserService businessUserService;
        private readonly IPublicUserService publicUserService;

        public AccountController(IAuthService authService, ISqlFunction sqlFunction, ISignupService signupService, IBusinessUserService businessUserService, IPublicUserService publicUserService)
        {
            this.authService = authService;
            this.sqlFunction = sqlFunction;
            this.signupService = signupService;
            this.businessUserService = businessUserService;
            this.publicUserService = publicUserService;
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
            }
            return View();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> Login(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);
                if (user.Status)
                {
                    return RedirectToAction("Index", "UserAdmin");
                }
                else
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
                    return RedirectToAction("Login");
                }
            }

            ViewBag.ReturnUrl = (string.IsNullOrEmpty(returnUrl)) ? "" : returnUrl;
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

            var loginresult = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, (int)FormRole.BUSINESS_USER, true);

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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.ReturnUrl = returnUrl;
                return View();
            }

            var loginresult = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, (int)FormRole.PUBLIC_USER, true );

            if (loginresult.Status)
            {
                var user = loginresult.Data;
                var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);


                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = model.REMEMBER_ME }, claims);

                if (string.IsNullOrEmpty(returnUrl))
                {
                    return RedirectToAction("Index", "UserAdmin");
                }
                else
                {
                    if (returnUrl.Contains("$"))
                    {
                        return Redirect(returnUrl.Replace("$", "&"));
                    }
                    else
                    {
                        return Redirect(returnUrl);
                    }
                    
                }

                
            }
            else
            {
                ViewBag.ReturnUrl = returnUrl;
                ModelState.AddModelError("ERROR_MESSAGE", loginresult.Message);
            }

            return View(model);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CheckPublicUserLogin()
        {
            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                var loginresult = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);

                if (loginresult.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
                }

            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }

        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> BusinessSignUp()
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
        [HttpGet]
        public async Task<ActionResult> SignUp()
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);
                if (user.Status)
                {
                    return RedirectToAction("Index", "UserAdmin");
                }
                else
                {
                    LogoutPublicUser();
                }


            }
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> BusinessSignUp(EmailSignUpViewModel model)
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

            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL, (int)FormRole.BUSINESS_USER);
            var userByID = await authService.GetUser(model.USER_NAME, FormRole.BUSINESS_USER);

            string BusinessRoleId = ((int)FormRole.BUSINESS_USER).ToString();

            if (!userByEmail.Status && !userByID.Status)
            {
                // Insert Data in User Master

                UserMaserModel userMaserModel = new UserMaserModel()
                {
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

                // Business Account Creation START

                BusinessAccountWebsiteModel businessModel = new BusinessAccountWebsiteModel()
                {
                    USER_ID = model.USER_NAME,
                    COMPANY_PROFILE_STATUS = "N",
                    COMPANY_CALENDAR_STATUS = "N",
                    CURRENT_STEP = "REGISTRATION"
                };

                AddUpdateDelete businessResult = await businessUserService.CreateBusinessWebsite(businessModel);

                // Send Activation Link

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

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SignUp(EmailSignUpViewModel model)
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

            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL, (int)FormRole.PUBLIC_USER);
            var userByID = await authService.GetUser(model.USER_NAME, FormRole.PUBLIC_USER);

            string PublicRoleId = ((int)FormRole.PUBLIC_USER).ToString();

            if (!userByEmail.Status && !userByID.Status)
            {
                // Insert Data in User Master

                UserMaserModel userMaserModel = new UserMaserModel(){
                    USER_PHONE = "",
                    IS_ACTIVE = "N",
                    IS_EMAIL_VERIFIED = "N",
                    IS_PHONE_VERIFIED = "N",
                    IS_EXTERNAL_SIGNUP = "N",
                    PROFILE_STATUS = "COMPLETED",
                    SIGNUP_TYPE = "EMAIL",
                    USER_EMAIL = model.USER_EMAIL,
                    USER_PASSWORD = model.USER_PASSWORD,
                    USER_ID = model.USER_NAME,
                    ROLE_ID = PublicRoleId
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                // Business Account Creation START

                PublicAccountModel businessModel = new PublicAccountModel()
                {
                    USER_ID = model.USER_NAME,
                    CURRENT_STEP = "PENDING"
                };

                AddUpdateDelete publicResult = await publicUserService.CreatePublicUserAccount(businessModel);

                // Send Activation Link

                var linkResult = await authService.sendActivationLink(model.USER_NAME, model.USER_EMAIL, FormRole.PUBLIC_USER);
                
                if (result.Status && publicResult.Status)
                {
                    TempData["VERIFICATION"] = "Pending";
                    TempData["VERIFICATION_EMAIL"] = model.USER_EMAIL;
                    return RedirectToAction("Login", "Account");

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
                    var data = await authService.GetUserByEmail(TempData.Peek("VERIFICATION_EMAIL").ToString());

                    if (data.Data["IS_EMAIL_VERIFIED"].ToString() == "Y")
                    {
                        return RedirectToAction("BusinessLogin");
                    }

                    ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL").ToString();
                }catch (Exception ex)
                {
                    ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL");
                }
                
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Home");
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

        [HttpPost]
        public ActionResult LogoutPublicUser()
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
            return RedirectToAction("Login");
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
                        }else if (role == "PUBLIC_USER")
                        {
                            int affectedRows = await sqlFunction.ExecuteSqlCommandQuery("update PUBLIC_USER_ACCOUNT_1943 set CURRENT_STEP = 'COMPLETED' where USER_ID = '" + userName + "'");
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