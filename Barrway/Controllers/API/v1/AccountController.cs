using Barrway.DTO.APIModels.Account;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Barrway.Controllers.API.v1
{
    [AllowAnonymous]
    public class AccountController : ApiController
    {
        private readonly IAuthService authService;

        public AccountController(IAuthService authService)
        {
            this.authService = authService;
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
    }
}
