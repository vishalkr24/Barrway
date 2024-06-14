using Barrway.DTO.APIModels.Account;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Barrway.Controllers.API.v1
{
    [JwtAuthentication]
    public class UserProfileController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public UserProfileController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }


        [HttpGet]
        [Route("api/User/userdetails")]
        [ResponseType(typeof(UserProfile))]
        public async Task<IHttpActionResult> Getuserdetails()
        {
            try
            {
                return Ok(await mobileAPIService.GetUserProfileDetails(APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }




        [HttpPost]
        [Route("api/user/UpdateuserProfile")]
        [ResponseType(typeof(List<AddUpdateDelete>))]
        public async Task<AddUpdateDelete> UpdateuserProfile(UpdateUserProfileViewModel model)
        {
            try
            {
                var Data = new UpdateUserProfileModel
                {
                   
                    USER_ID = APIUserIdentity.UserName,
                    FIRST_NAME = model.FIRST_NAME,
                    LAST_NAME = model.LAST_NAME,
                    CHINESE_NAME = model.CHINESE_NAME,
                    NICK_NAME = model.NICK_NAME,
                    GENDER = model.GENDER,
                    DATE_OF_BIRTH = model.DATE_OF_BIRTH,
                    USER_EMAIL = model.USER_EMAIL,
                    Country_Code = model.Country_Code,
                    USER_PHONE = model.USER_PHONE
                };

                var result = await mobileAPIService.UpdateUserProfileData(Data);
                return result;
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        [HttpPost]
        [Route("api/user/changePassword")]
        [ResponseType(typeof(List<AddUpdateDelete>))]
        public async Task<AddUpdateDelete> changePassword(userPassword model)
        {
            try
            {
                

                var result = await mobileAPIService.changespassword(model, APIUserIdentity.UserName);
                return result;
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

    }
}
