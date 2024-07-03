using Barrway.DTO.APIModels.Account;
using Barrway.DTO.Common;
using Barrway.DTO.PublicModels;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace Barrway.Controllers.API.v1
{
    [JwtAuthentication]
    public class UserProfileController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;
        private readonly IMessageRepository messageRepository;

        public UserProfileController(IMobileAPIService mobileAPIService, IMessageRepository messageRepository)
        {
            this.mobileAPIService = mobileAPIService;
            this.messageRepository = messageRepository;
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
        public async Task<AddUpdateDelete> UpdateuserProfile(UpdateUserProfileAPIViewModel model)
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
                    DATE_OF_BIRTH = model.DATE_OF_BIRTH
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
        [Route("api/user/RequestMobileNoChangeOTP")]
        public async Task<IHttpActionResult> CheckMobileNo(RequestMobileNoChangeOTPViewModel model)
        {
            var check = await mobileAPIService.CheckRegisteredPhoneNo(model, APIUserIdentity.UserName);

            if (check.Status)
            {

                var Result = messageRepository.SendOtpSmS("+" + model.Country_Code + model.New_Phone);

                if (Result)
                {
                    return Ok(new AddUpdateDelete() { Status = true, Message = "OTP Sent successfully to +" + model.Country_Code + model.New_Phone + "." });
                }
                else
                {
                    return Ok(new AddUpdateDelete() { Status = false, Message = "Failed to send OTP." });
                }

            }
            else
            {
                return Ok(check);
            }
        }

        [HttpPost]
        [Route("api/user/UpdateMobileNo")]
        public async Task<IHttpActionResult> UpdateMobileNo(UpdateMobileNoViewModel model)
        {

            var Result = messageRepository.VarifyOtp("+" + model.Country_Code + model.New_Phone, model.OTP);

            if (Result.Status == true)
            {
                var result = await mobileAPIService.UpdateRegisteredPhoneNo(model, APIUserIdentity.UserName);
                return Ok(result);
            }
            else
            {
                return Ok(new AddUpdateDelete() { Status = false, Message = "Enter a valid OTP!" });
            }
        }

        [HttpPost]
        [Route("api/user/UpdateProfilePic")]
        public async Task<IHttpActionResult> UpdateProfilePic()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return Ok(new AddUpdateDelete() { Status = false, Message = "Unsupported media type" });
            }

            var userId = User.Identity.Name.ToString();

            string folderPath = HttpContext.Current.Server.MapPath("~/UploadPublicUser/ProfilePhoto/" + userId);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            else
            {
                Directory.Delete(folderPath, true);
                Directory.CreateDirectory(folderPath);
            }

            string root = System.Web.HttpContext.Current.Server.MapPath(folderPath);
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                string newFileName = "";

                MultipartFileData file = provider.FileData.FirstOrDefault();

                // Get the uploaded file name.
                string originalFileName = file.Headers.ContentDisposition.FileName.Trim('\"');

                if (originalFileName == "")
                {
                    return Ok(new AddUpdateDelete() { Status = false, Message = "Please upload a file" });
                }
                string extension = Path.GetExtension(originalFileName).ToLower();

                // Validate the file type.
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png" && extension != ".gif")
                {
                    return Ok(new AddUpdateDelete() { Status = false, Message = "Only image files are allowed." });
                }

                string fname = originalFileName;

                string path = "~/UploadPublicUser/ProfilePhoto/" + userId + "/" + fname;

                PublicAccountModel model = new PublicAccountModel()
                {
                    USER_ID = userId,
                    PROFILE_PHOTO_NAME = fname,
                    PROFILE_PHOTO_PATH = path
                };

                var result = await mobileAPIService.UpdatePublicUserProfilePic(model);

                string filePath = Path.Combine(root, fname);

                using (var image = Image.FromFile(file.LocalFileName))
                {
                    image.Save(filePath, ImageFormat.Jpeg);
                }

                return Ok(new AddUpdateDelete() { Status = true, Message = "Success", Data = filePath });

            }
            catch (Exception ex)
            {
                return Ok(new AddUpdateDelete() { Status = false, Message = ex.Message });
            }
        }

    }
}
