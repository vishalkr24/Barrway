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
using Barrway.Security;

namespace Barrway.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IAuthService authService;
        private readonly ISqlFunction sqlFunction;
        private readonly ISignupService signupService;
        private readonly IBusinessUserService businessUserService;
        private readonly IPublicUserService publicUserService;
        private readonly IMessageRepository MessageRepository;

        public AccountController(IAuthService authService, ISqlFunction sqlFunction, ISignupService signupService, IBusinessUserService businessUserService, IPublicUserService publicUserService, IMessageRepository MessageRepository)
        {
            this.authService = authService;
            this.sqlFunction = sqlFunction;
            this.signupService = signupService;
            this.businessUserService = businessUserService;
            this.publicUserService = publicUserService;
            this.MessageRepository = MessageRepository;
        }

        // GET: Account
        [AllowAnonymous]
        [HttpGet]
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> BusinessLogin(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);
                if (user.Status)
                {
                    Redirect("/UserAdmin#/userdashboard");
                    //return RedirectToAction("Dashboard", "BusinessAdmin");
                }
                else
                {
                    LogoutAllSession();
                    return RedirectToAction("BusinessLogin");
                }
            }
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        private void LogoutAllSession()
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
        }

        [AllowAnonymous]
        [HttpGet]
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> BusinessPhoneLogin(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);
                if (user.Status)
                {
                    Redirect("/UserAdmin#/userdashboard");
                    //return RedirectToAction("Dashboard", "BusinessAdmin");
                }
                else
                {
                    LogoutAllSession();
                    return RedirectToAction("BusinessLogin");
                }
            }
            return View(new PhoneLoginViewModel { ReturnUrl = returnUrl });
        }



        [AllowAnonymous]
        [HttpGet]
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> SuperAdminLogin()
        {
            if (User.Identity.IsAuthenticated)
            {
                if (UserIdentity.Role == "SUPERADMIN_USER")
                {
                    return RedirectToAction("Index","SuperAdmin");
                }
                else
                {
                    LogoutAllSession();
                }
            }
            return View(new LoginViewModel { ReturnUrl = "" });
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SuperAdminLogin(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            var loginresult = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, (int)FormRole.SUPERADMIN_USER, true);

            if (loginresult.Status)
            {
                var user = loginresult.Data;
                var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString())
                                                    }, CookieAuthenticationDefaults.AuthenticationType);


                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = model.REMEMBER_ME }, claims);
                return RedirectToAction("Index", "SuperAdmin");
            }
            else
            {
                ModelState.AddModelError("ERROR_MESSAGE", loginresult.Message);
            }

            return View(model);
        }


        [AllowAnonymous]
        [HttpGet]
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> Login(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);
                if (user.Status)
                {
                    return Redirect("/UserAdmin#/userdashboard");
                    //return RedirectToAction("Index", "UserAdmin");
                }
                else
                {
                    LogoutAllSession();
                    return RedirectToAction("Login", new { returnUrl });
                }
            }

            ViewBag.ReturnUrl = (string.IsNullOrEmpty(returnUrl)) ? "" : returnUrl;
            return View(new LoginViewModel { ReturnUrl = "" });
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> BusinessLogin(LoginViewModel model, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var loginresult = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, (int)FormRole.GENERAL_USER, true);

            if (loginresult.Status)
            {
                var user = loginresult.Data;

                //var assignedData = JsonConvert.DeserializeObject<Dictionary<string, object>>(loginresult.Data["AssignedData"].ToString());

                var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);


                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = model.REMEMBER_ME }, claims);
                if (!string.IsNullOrEmpty(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return Redirect("/UserAdmin#/userdashboard");
                //return RedirectToAction("Dashboard", "BusinessAdmin");
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
        public async Task<ActionResult> BusinessPhoneLogin(PhoneLoginViewModel model, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var loginresult = await authService.GetUserbyPhone("+"+model.countryCode + model.USER_PHONE, model.USER_PASSWORD, (int)FormRole.GENERAL_USER, true);

            if (loginresult.Status)
            {
                var user = loginresult.Data;

                //var assignedData = JsonConvert.DeserializeObject<Dictionary<string, object>>(loginresult.Data["AssignedData"].ToString());

                var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);


                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = model.REMEMBER_ME }, claims);
                if (!string.IsNullOrEmpty(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return Redirect("/UserAdmin#/userdashboard");
                //return RedirectToAction("Dashboard", "BusinessAdmin");
            }
            else
            {
                ModelState.AddModelError("ERROR_MESSAGE", "Invalied Phone number !");
            }

            return View(model);
        }




        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CheckPublicUserLogin()
        {
            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                var loginresult = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);

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
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> BusinessSignUp()
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);
                if (user.Status)
                {
                    return RedirectToAction("Dashboard", "UserAdmin");
                }
                else
                {
                    Logout();
                }


            }
            return View(new EmailSignUpViewModel() { IS_EXTERNAL_SIGNUP = false });
        }


        

        //[AllowAnonymous]
        //[HttpGet]
        //public async Task<ActionResult> SignUp()
        //{
        //    if (User.Identity.IsAuthenticated)
        //    {
        //        var user = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);
        //        if (user.Status)
        //        {
        //            return RedirectToAction("Index", "UserAdmin");
        //        }
        //        else
        //        {
        //            LogoutPublicUser();
        //        }
        //    }
        //    return View(new EmailSignUpViewModel() { ReturnUrl = "" });
        //}

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

            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL, (int)FormRole.GENERAL_USER);
            var userByID = await authService.GetUser(model.USER_NAME, FormRole.GENERAL_USER);

            string generalRoleId = ((int)FormRole.GENERAL_USER).ToString();

            if (!userByEmail.Status && !userByID.Status)
            {
                // Insert Data in User Master

                UserMaserModel userMaserModel = new UserMaserModel()
                {
                    USER_PHONE = "",
                    IS_ACTIVE = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    IS_EMAIL_VERIFIED = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    IS_PHONE_VERIFIED = "N",
                    IS_EXTERNAL_SIGNUP = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    PROFILE_STATUS = "PENDING",
                    SIGNUP_TYPE = (model.IS_EXTERNAL_SIGNUP) ? "GOOGLE" : "EMAIL",
                    USER_EMAIL = model.USER_EMAIL,
                    USER_PASSWORD = model.USER_PASSWORD,
                    USER_ID = model.USER_NAME,
                    ROLE_ID = generalRoleId,
                    COMPANY_PROFILE_STATUS = "N",
                    COMPANY_CALENDAR_STATUS = "N",
                    CURRENT_STEP = "COMPANY PROFILE"
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                // Business Account Creation START

                //BusinessAccountWebsiteModel businessModel = new BusinessAccountWebsiteModel()
                //{
                //    USER_ID = model.USER_NAME,
                //    COMPANY_PROFILE_STATUS = "N",
                //    COMPANY_CALENDAR_STATUS = "N",
                //    CURRENT_STEP = (model.IS_EXTERNAL_SIGNUP) ? "COMPANY PROFILE" : "REGISTRATION"
                //};

                PublicAccountModel businessModel = new PublicAccountModel()
                {
                    USER_ID = model.USER_NAME,
                    CURRENT_STEP = "PENDING"
                };

                AddUpdateDelete publicResult = await publicUserService.CreatePublicUserAccount(businessModel);

                // Send Activation Link
                if (!model.IS_EXTERNAL_SIGNUP && publicResult.Status)
                {
                    var linkResult = await authService.sendActivationLink(model.USER_NAME, model.USER_EMAIL, FormRole.GENERAL_USER);

                    if (result.Status)
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

                    var result2 = await authService.GetUserByEmail(model.USER_EMAIL, 1);
                    if (result2.Status)
                    {
                        var user = result2.Data;
                        var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);

                        HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = false }, claims);

                        return RedirectToAction("Dashboard", "BusinessAdmin");
                    }
                    else
                    {
                        ModelState.AddModelError("USER_NAME", "Unable to register this user.");
                        return View(model);
                    }
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
        [HttpGet]
        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        public async Task<ActionResult> BusinessSignUpPhone()
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);
                if (user.Status)
                {
                    return RedirectToAction("Dashboard", "UserAdmin");
                }
                else
                {
                    Logout();
                }


            }
            return View(new PhoenSignUpViewModel() { IS_EXTERNAL_SIGNUP = false });
        }


        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> BusinessSignUpPhone(PhoenSignUpViewModel model)
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

            var userByEmail = await authService.GetUserByPhone("+" + model.CountryCode + model.USER_PHONE, (int)FormRole.GENERAL_USER);
            var userByID = await authService.GetUser(model.USER_NAME, FormRole.GENERAL_USER);

            string generalRoleId = ((int)FormRole.GENERAL_USER).ToString();

            if (!userByEmail.Status && !userByID.Status)
            {
                // Insert Data in User Master

                UserMaserModel userMaserModel = new UserMaserModel()
                {
                    USER_EMAIL = "",
                    IS_ACTIVE = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    IS_EMAIL_VERIFIED = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    IS_PHONE_VERIFIED = "N",
                    IS_EXTERNAL_SIGNUP = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    PROFILE_STATUS = "PENDING",
                    SIGNUP_TYPE = (model.IS_EXTERNAL_SIGNUP) ? "GOOGLE" : "EMAIL",
                    USER_PHONE = "+" + model.CountryCode + model.USER_PHONE,
                    USER_PASSWORD = model.USER_PASSWORD,
                    USER_ID = model.USER_NAME,
                    ROLE_ID = generalRoleId,
                    COMPANY_PROFILE_STATUS = "N",
                    COMPANY_CALENDAR_STATUS = "N",
                    CURRENT_STEP = "COMPANY PROFILE"
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                // Business Account Creation START

                //BusinessAccountWebsiteModel businessModel = new BusinessAccountWebsiteModel()
                //{
                //    USER_ID = model.USER_NAME,
                //    COMPANY_PROFILE_STATUS = "N",
                //    COMPANY_CALENDAR_STATUS = "N",
                //    CURRENT_STEP = (model.IS_EXTERNAL_SIGNUP) ? "COMPANY PROFILE" : "REGISTRATION"
                //};

                PublicAccountModel businessModel = new PublicAccountModel()
                {
                    USER_ID = model.USER_NAME,
                    CURRENT_STEP = "PENDING"
                };

                AddUpdateDelete publicResult = await publicUserService.CreatePublicUserAccount(businessModel);

                // Send Activation Link
                if (!model.IS_EXTERNAL_SIGNUP && publicResult.Status)
                {
                    var Result = MessageRepository.SendOtpSmS("+"+model.CountryCode + model.USER_PHONE);

                    if (result.Status)
                    {
                       
                        Session["VarificationMobileNUmber"] = "+" + model.CountryCode+ model.USER_PHONE;
                        TempData["VERIFICATION"] = "Pending";
                        TempData["VERIFICATION_Phone"] = "+" + model.CountryCode + model.USER_PHONE;
                        TempData["MobileVerificationSuccessMessage"] = "an Otp message has been sent to your registered mobile number !";
                        return RedirectToAction("MobileVerification", "Account");

                    }
                    else
                    {
                        ModelState.AddModelError("USER_NAME", result.Message);
                        return View(model);
                    }
                }
                else
                {

                    var result2 = await authService.GetUserByPhone(model.USER_PHONE, 1);
                    if (result2.Status)
                    {
                        var user = result2.Data;
                        var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.MobilePhone, user["USER_PHONE"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    //new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);

                        HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = false }, claims);

                        return RedirectToAction("Dashboard", "BusinessAdmin");
                    }
                    else
                    {
                        ModelState.AddModelError("USER_NAME", "Unable to register this user.");
                        return View(model);
                    }
                }


            }
            else
            {
                if (userByEmail.Status)
                {
                    ModelState.AddModelError("USER_PHONE", "Email already registered");
                }

                if (userByID.Status)
                {
                    ModelState.AddModelError("USER_PHONE", "User name is already taken");
                }

                return View(model);
            }

        }







        [AllowAnonymous]
        
        public async Task<ActionResult> MobileVerification()
        {
            return View();

        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> MobileVerification(PhoneOtp model)
        {
            try
            {
                
                string MObileNumber = Session["VarificationMobileNUmber"].ToString();

                if(MObileNumber != "")
                {
                    var Result = MessageRepository.VarifyOtp(MObileNumber, model.OTP);
                    if (Result.Status == true)
                    {

                        var UserDetails=await authService.GetUserByPhone(MObileNumber);

                        var _result = await authService.ChangePhoneVarificationStatus(MObileNumber);


                        TempData["MobileVerificationSuccessMessage"] = "Mobile verification completed successfully !";
                        return RedirectToAction("BusinessLogin", "Account");
                    }
                    else
                    {
                        TempData["MobileVerificationErroMessage"] = "invalid OTP !";
                    }
                }

                


            }
            catch (Exception ex)
            {
                return View(model);
            }
            return View(model);
        }



        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResendVerificationOTP()
        {
            try
            {

                string MobileNumber = Session["VarificationMobileNUmber"].ToString();
                if(MobileNumber != "")
                {
                    var Result = MessageRepository.SendOtpSmS(MobileNumber);
                    TempData["MobileVerificationSuccessMessage"] = "new OTP has been sent !";
                }
                return RedirectToAction("MobileVerification", "Account");
            }
            catch (Exception ex)
            {
                ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_Phone");
            }

            return RedirectToAction("MobileVerification", "Account");

        }





        //[AllowAnonymous]
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> SignUp(EmailSignUpViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return View(model);
        //    }

        //    if (!model.TERMS_ACCEPTED)
        //    {
        //        ModelState.AddModelError("TERMS_ACCEPTED", "Please check our terms & conditions.");
        //        return View(model);
        //    }

        //    var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL, (int)FormRole.PUBLIC_USER);
        //    var userByID = await authService.GetUser(model.USER_NAME, FormRole.PUBLIC_USER);

        //    string PublicRoleId = ((int)FormRole.PUBLIC_USER).ToString();

        //    if (!userByEmail.Status && !userByID.Status)
        //    {
        //        // Insert Data in User Master

        //        UserMaserModel userMaserModel = new UserMaserModel()
        //        {
        //            USER_PHONE = "",
        //            IS_ACTIVE = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
        //            IS_EMAIL_VERIFIED = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
        //            IS_PHONE_VERIFIED = "N",
        //            IS_EXTERNAL_SIGNUP = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
        //            PROFILE_STATUS = "PENDING",
        //            SIGNUP_TYPE = (model.IS_EXTERNAL_SIGNUP) ? "GOOGLE" : "EMAIL",
        //            USER_EMAIL = model.USER_EMAIL,
        //            USER_PASSWORD = model.USER_PASSWORD,
        //            USER_ID = model.USER_NAME,
        //            ROLE_ID = PublicRoleId
        //        };

        //        AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

        //        // Business Account Creation START
        //        PublicAccountModel businessModel = new PublicAccountModel()
        //        {
        //            USER_ID = model.USER_NAME,
        //            CURRENT_STEP = "PENDING"
        //        };

        //        AddUpdateDelete publicResult = await publicUserService.CreatePublicUserAccount(businessModel);

        //        // Send Activation Link

        //        if (!model.IS_EXTERNAL_SIGNUP)
        //        {
        //            var linkResult = await authService.sendActivationLink(model.USER_NAME, model.USER_EMAIL, FormRole.PUBLIC_USER);

        //            if (result.Status && publicResult.Status)
        //            {
        //                TempData["VERIFICATION"] = "Pending";
        //                TempData["VERIFICATION_EMAIL"] = model.USER_EMAIL;
        //                return RedirectToAction("EmailVerification", "Account", new { RoleId = 2 });

        //            }
        //            else
        //            {
        //                ModelState.AddModelError("USER_NAME", result.Message);
        //                return View(model);
        //            }
        //        }
        //        else
        //        {
        //            var result2 = await authService.GetUserByEmail(model.USER_EMAIL, 2);
        //            if (result2.Status)
        //            {
        //                var user = result2.Data;
        //                var claims = new ClaimsIdentity(new[] {
        //                                            new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
        //                                            new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
        //                                            new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
        //                                            new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
        //                                            new Claim(ClaimTypes.Sid, user["Id"].ToString()),
        //                                            }, CookieAuthenticationDefaults.AuthenticationType);

        //                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = false }, claims);

        //                return RedirectToAction("Index", "Useradmin");
        //            }
        //            else
        //            {
        //                ModelState.AddModelError("USER_NAME", "Unable to register this user.");
        //                return View(model);
        //            }
        //        }


        //    }
        //    else
        //    {
        //        if (userByEmail.Status)
        //        {
        //            ModelState.AddModelError("USER_EMAIL", "Email already registered");

        //        }

        //        if (userByID.Status)
        //        {
        //            ModelState.AddModelError("USER_NAME", "User name is already taken");
        //        }

        //        return View(model);
        //    }

        //}

        public async Task<ActionResult> EmailVerification(int RoleId = 4)
        {
            try
            {
                var data = await authService.GetUserByEmail(TempData.Peek("VERIFICATION_EMAIL").ToString(), RoleId);

                if (data.Data["IS_EMAIL_VERIFIED"].ToString() == "Y")
                {
                    if (RoleId == 2)
                    {
                        return RedirectToAction("Login");
                    }
                    return RedirectToAction("BusinessLogin");
                }

                ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL").ToString();
            }
            catch (Exception ex)
            {
                ViewBag.VerificationEmail = TempData.Peek("VERIFICATION_EMAIL");
            }

            return View();

        }

       


        [HttpPost]
        public ActionResult LogoutSuperAdmin()
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
            return RedirectToAction("SuperAdminLogin", new LoginViewModel { ReturnUrl = "" });
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
            return RedirectToAction("BusinessLogin", new LoginViewModel { ReturnUrl = "" });
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
            return RedirectToAction("BusinessLogin", new LoginViewModel { ReturnUrl = "" });
        }



        public ActionResult AcessDenied()
        {

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

            var result = await authService.GetToken(token, userName);
            if (result.Status && (result.Data as IDictionary<string, object>)["IS_ACTIVE"]?.ToString() == "Y")
            {
                var tokeData = result.Data as IDictionary<string, object>;
                var _createdTime = tokeData["TOKEN_TIME"]?.ToString();

                DateTime createdTime;

                if (DateTime.TryParse(_createdTime, out createdTime))
                {

                    if (DateTime.Now.Subtract(createdTime).TotalHours > 24)
                    {
                        TempData["failed"] = "Email Activation Link Expired!";
                        return View();
                    }
                    var verificationResult = await authService.UserVerification(token, userName);
                    if (verificationResult.Status)
                    {
                        TempData["success"] = "Email verification successfull.";

                        if (role == "BUSINESS_USER")
                        {
                            int affectedRows = await sqlFunction.ExecuteSqlCommandQuery("update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY PROFILE' where USER_ID = '" + userName + "'");
                            return View();
                        }
                        else if (role == "PUBLIC_USER")
                        {
                            int affectedRows = await sqlFunction.ExecuteSqlCommandQuery("update PUBLIC_USER_ACCOUNT_1943 set CURRENT_STEP = 'COMPLETED' where USER_ID = '" + userName + "'");
                            return View();
                        }else if (role == "GENERAL_USER")
                        {
                            int affectedRows = await sqlFunction.ExecuteSqlCommandQuery("update USER_MASTER_1915 set CURRENT_STEP = 'COMPANY PROFILE' where USER_ID = '" + userName + "'; update PUBLIC_USER_ACCOUNT_1943 set CURRENT_STEP = 'COMPLETED' where USER_ID = '" + userName + "'");
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
                else
                {
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
                    ResetPasswordViewModel model = new ResetPasswordViewModel() { token = token };
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
                    result = await authService.ResetPassword(model.token, tokeData["USER_NAME"].ToString(), model.newpassword);
                    if (result.Status)
                    {
                        ModelState.Clear();
                        TempData["success"] = "password reset successfully. you can login your account on mobile app.";
                    }
                    else
                    {
                        ModelState.Clear();
                        ModelState.AddModelError("", result.Message);
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


        #region External Login
        [HttpPost]

        public dynamic ExternalSignIn(string returnUrl = "/", string provider = "", string userType = "")
        {

            if (provider == "Google")
            {
                HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties
                { RedirectUri = Url.Action("GoogleLoginCallback", "Account", new { ReturnUrl = returnUrl, UserType = userType }) }, "Google");

            }
            if (provider == "Facebook")
            {
                HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties
                { RedirectUri = Url.Action("GoogleLoginCallback", "Account", new { ReturnUrl = returnUrl, UserType = userType }) }, "Facebook");
            }
            return null;

        }

        [AllowAnonymous]
        public async Task<ActionResult> GoogleLoginCallback(string returnUrl, string userType = "")
        {
            var claimsPrincipal = HttpContext.User.Identity as ClaimsIdentity;
            var loginInfo = GoogleLoginViewModel.GetLoginInfo(claimsPrincipal);
            if (loginInfo == null)
            {
                TempData["TmpMsg"] = new AddUpdateDelete() { Status = false, Message = "External login failed" };
                return RedirectToAction("Login");
            }

            var result = await authService.GetUserByEmail(loginInfo.emailaddress, Convert.ToInt32(userType));
            if (result.Status)
            {
                var user = result.Data;
                var claims = new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Name,user["USER_ID"].ToString()),
                                                    new Claim(ClaimTypes.Email, user["USER_EMAIL"].ToString()),
                                                    new Claim(ClaimTypes.Role, user["ROLE_NAME"].ToString()),
                                                    new Claim(ClaimTypes.Sid, user["Id"].ToString()),
                                                    }, CookieAuthenticationDefaults.AuthenticationType);

                HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = false }, claims);
                if (returnUrl == "/")
                {
                    if (user["ROLE_NAME"].ToString() == "PUBLIC_USER")
                    {
                        return RedirectToAction("Index", "Useradmin");
                    }
                    else
                    {
                        return RedirectToAction("Dashboard", "BusinessAdmin");
                    }
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
                // register user
                if (userType == "1")
                {
                    return View("BusinessSignUp", new EmailSignUpViewModel() { IS_EXTERNAL_SIGNUP = true, TERMS_ACCEPTED = false, USER_EMAIL = loginInfo.emailaddress, ReturnUrl = returnUrl });
                }
                else
                {
                    return View("SignUp", new EmailSignUpViewModel() { IS_EXTERNAL_SIGNUP = true, TERMS_ACCEPTED = false, USER_EMAIL = loginInfo.emailaddress, ReturnUrl = returnUrl });
                }
            }
        }

        #endregion


        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion


        #region identity
        private ClaimsIdentity Getidentity(IDictionary<string, object> login, int Id, IDictionary<string, object> applicationUser, string role, string token, string localId, string IsTutor, string IsTherapist, string picture = "")
        {
            //var auth = new Firebase.Auth.FirebaseAuthProvider(new FirebaseConfig(ApiKey));
            //var ab =  auth.SignInWithEmailAndPasswordAsync(model.Email, model.Password.ToString());
            //string token = ab.FirebaseToken;
            //var loggedInuser = ab.User;




            return new ClaimsIdentity(new[] {
                                                    new Claim(ClaimTypes.NameIdentifier, ""),
                                                    new Claim
                                                      ("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider",
                                                                 "ASP.NET Identity",
                                                                 "http://www.w3.org/2001/XMLSchema#string"),
                                                    new Claim(ClaimTypes.Name,login["username"]?.ToString()),
                                                    new Claim(ClaimTypes.Email, login["email"]?.ToString()),
                                                    new Claim(ClaimTypes.Role, role),
                                                    new Claim(ClaimTypes.UserData,JsonConvert.SerializeObject(applicationUser)),
                                                    new Claim(ClaimTypes.Authentication, token),
                                                    new Claim(ClaimTypes.PrimarySid, localId),
                                                    new Claim(ClaimTypes.Sid, Id.ToString()),
                                                    new Claim
                                                      ("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/istutor",
                                                                 IsTutor,
                                                                 "http://www.w3.org/2001/XMLSchema#string"),
                                                    new Claim
                                                      ("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/istherapist",
                                                                 IsTherapist,
                                                                 "http://www.w3.org/2001/XMLSchema#string"),
                                                    new Claim
                                                      ("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/picture",
                                                                 picture,
                                                                 "http://www.w3.org/2001/XMLSchema#string")
                                               }, CookieAuthenticationDefaults.AuthenticationType);
        }

        #endregion

    }
}