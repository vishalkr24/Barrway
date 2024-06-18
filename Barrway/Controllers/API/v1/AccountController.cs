using Barrway.DTO.APIModels.Account;
using Barrway.DTO.AuthViewModel;
using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.DTO.PublicModels;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace Barrway.Controllers.API.v1
{
    [AllowAnonymous]
    public class AccountController : ApiController
    {
        private readonly IAuthService authService;
        private readonly ISignupService signupService;
        private readonly IPublicUserService publicUserService;

        public AccountController(IAuthService authService,ISignupService signupService,IPublicUserService publicUserService)
        {
            this.authService = authService;
            this.signupService = signupService;
            this.publicUserService = publicUserService;
        }
        [Route("api/account/login")]
        [ApiKeyAuthorizationFilter]
        [HttpPost]
        public async Task<LoginResponse> UserEmailLogin(LoginViewModel model)
        {

            var result = await authService.GetUser(model.USER_EMAIL, model.USER_PASSWORD, (int)FormRole.GENERAL_USER, true);
            if (result.Status)
            {
                var access_token = TokenManager.GenerateToken(result.Data);
                return new LoginResponse() { Status = true, Message = result.Message, Data = result.Data, access_token = access_token, expires_in = AppSettings.token_expire_time };
            }
            return new LoginResponse() { Status = false, Message = result.Message };
        }

        [Route("api/account/loginPhone")]
        [ApiKeyAuthorizationFilter]
        [HttpPost]
        public async Task<LoginResponse> UserPhoneLogin(LoginPhoneViewModel model)
        {

            var result = await authService.GetUserbyPhone(model.USER_PHONE,model.Country_Code, model.USER_PASSWORD, (int)FormRole.GENERAL_USER, true);
            if (result.Status)
            {
                var access_token = TokenManager.GenerateToken(result.Data);
                return new LoginResponse() { Status = true, Message = result.Message, Data = result.Data, access_token = access_token, expires_in = AppSettings.token_expire_time };
            }
            return new LoginResponse() { Status = false, Message = result.Message };
        }





        [Route("api/account/signup")]
        [ApiKeyAuthorizationFilter]
        [HttpPost]
        public async Task<LoginResponse> BusinessSignUp(APIEmailSignUpModel model)
        {
            var userByEmail = await authService.GetUserByEmail(model.USER_EMAIL, (int)FormRole.GENERAL_USER);
            var userByID = await authService.GetUser(model.USER_NAME, FormRole.GENERAL_USER);

            string phone = model.USER_PHONE.Trim().Replace(" ", "");
            var userByPhone = await authService.GetUserByPhone(phone, model.Country_Code, (int)FormRole.GENERAL_USER);

            string generalRoleId = ((int)FormRole.GENERAL_USER).ToString();

            if (!userByEmail.Status && !userByID.Status && !userByPhone.Status)
            {

                //var encryptPass = Aes256CbcEncrypter.Encrypt(password);

                // Insert Data in User Master
                UserMaserModel userMaserModel = new UserMaserModel()
                {
                    
                    IS_ACTIVE = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "Y",
                    IS_EMAIL_VERIFIED = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "Y",
                    IS_PHONE_VERIFIED = "Y",
                    IS_EXTERNAL_SIGNUP = (model.IS_EXTERNAL_SIGNUP) ? "Y" : "N",
                    PROFILE_STATUS = "PENDING",
                    SIGNUP_TYPE = (model.IS_EXTERNAL_SIGNUP) ? "GOOGLE" : "EMAIL",
                    USER_EMAIL = model.USER_EMAIL,
                    Country_Code = model.Country_Code,
                    USER_PHONE = model.USER_PHONE,
                    USER_PASSWORD = Aes256CbcEncrypter.Encrypt(model.USER_PASSWORD),
                    USER_ID = model.USER_NAME,
                    ROLE_ID = generalRoleId,
                    COMPANY_PROFILE_STATUS = "N",
                    COMPANY_CALENDAR_STATUS = "N",
                    CURRENT_STEP = "COMPANY PROFILE"
                };

                AddUpdateDelete result = await signupService.RegisterUser(userMaserModel.ToDictionary());

                if (!result.Status) {
                    return new LoginResponse() { Status=false,Message=result.Message};
                }

                PublicAccountModel businessModel = new PublicAccountModel()
                {
                    USER_ID = model.USER_NAME
                };

                AddUpdateDelete publicResult = await publicUserService.CreatePublicUserAccount(businessModel);
                if (!publicResult.Status)
                {
                    return new LoginResponse() { Status = false, Message = result.Message };
                }

                // Send Activation Link
                if (!model.IS_EXTERNAL_SIGNUP)
                {
                    var linkResult = await authService.sendActivationLink(model.USER_NAME, model.USER_EMAIL, FormRole.GENERAL_USER);
                    if (linkResult.Status)
                    {
                        return new LoginResponse() {Status=true,Message= "Registration successfully, verification mail send to your email." };
                    }
                    else
                    {                       
                        return new LoginResponse() { Status=false,Message= "Registration successfully, verification mail send to your email failed." };
                    }
                }
                else
                {
                    return new LoginResponse() { Status=true,Message= "Registration successfully" };
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

                return new LoginResponse() { Status = false, Message=AppMessage.InvaidRequest };
            }
        }

        

    }
}
