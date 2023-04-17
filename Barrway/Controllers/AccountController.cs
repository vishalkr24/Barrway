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

namespace Barrway.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAuthService authService;
        private readonly ISqlFunction sqlFunction;
        private readonly ISignupService signupService;

        public AccountController(IAuthService authService, ISqlFunction sqlFunction, ISignupService signupService)
        {
            this.authService = authService;
            this.sqlFunction = sqlFunction;
            this.signupService = signupService;
        }
        // GET: Account
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> Login()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) {
                return View();
            }

            var loginresult = await authService.GetUser(model.Email, model.Password);

            if (loginresult.Status)
            {
                var user = loginresult.Data;
                var claims=new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);
                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = true }, claims);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ModelState.AddModelError("", loginresult.Message);
            }

            return View(model);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> SignUp()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SignUp(BusinessEmailSignUpViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL);
            var userByID = await authService.GetUser(model.USER_NAME);
            var adminRoleData = await sqlFunction.ExecuteSqlQuery("select Id from ROLE_MASTER_1917 where ROLE_NAME = 'BUSINESS'");

            string adminRoleId = "1";

            if (userByEmail.Message == AppMessage.NotFound && userByID.Message == AppMessage.NotFound)
            {
                // insert data

                UserMaserModel userMaserModel = new UserMaserModel(){
                    USER_PHONE = "",
                    IS_ACTIVE = "NO",
                    IS_EMAIL_VERIFIED = "NO",
                    IS_PHONE_VERIFIED = "NO",
                    IS_EXTERNAL_SIGNUP = "NO",
                    PROFILE_STATUS = "PENDING",
                    SIGNUP_TYPE = "EMAIL",
                    USER_EMAIL = model.USER_EMAIL,
                    USER_PASSWORD = model.USER_PASSWORD,
                    USER_ID = model.USER_NAME,
                    ROLE_ID = adminRoleId
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                TempData["VERIFICATION"] = "Pending";
                TempData["VERIFICATION_EMAIL"] = model.USER_EMAIL;
                return RedirectToAction("EmailVerification", "Account");
            }
            else
            {
                if (userByEmail.Message != AppMessage.NotFound)
                {
                    ModelState.AddModelError("USER_EMAIL", "Email already registered");
                }

                if (userByID.Message == AppMessage.NotFound)
                {
                    ModelState.AddModelError("USER_NAME", "User name already taken");
                }
                
                return View();
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
            if (result.Status && (result.Data as IDictionary<string, object>)["IS_ACTIVE"]?.ToString() == "YES")
            {
                var tokeData=result.Data as IDictionary<string, object>;
                var _createdTime = tokeData["TOKEN_TIME"]?.ToString();
                DateTime createdTime;
                if (DateTime.TryParse(_createdTime, out createdTime)) {

                    if (DateTime.Now.Subtract(createdTime).TotalHours > 24)
                    {
                        TempData["failed"] = "Email Activation Link Expired!";
                        return View();
                    }
                    var verificationResult = await authService.UserVerificatiom(token, userName);
                    if (verificationResult.Status) {
                        TempData["success"] = "Email verification successfully. you can login your account on mobile app.";
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