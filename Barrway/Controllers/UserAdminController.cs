using Barrway.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Barrway.Service.IRepository;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;
using System.IO;
using Barrway.DTO.PublicModels;
using Barrway.DTO.Common;
using Barrway.Utility.Common;
using Barrway.DTO.UserAdminModels;

namespace Barrway.Controllers
{
    [PublicAuthorize(Roles = "PUBLIC_USER")]
    public class UserAdminController : Controller
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        private readonly IAuthService authService;

        public UserAdminController(ISqlFunction sqlFunction, IPublicUserService publicUserService, IAuthService authService)
        {
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
            this.authService = authService;
        }

        // GET: UserAdmin
        public async Task<ActionResult> Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> GetSingleUserByUserId(string UserId)
        {
            var userData = await publicUserService.GetSinglePublicUserAccount(UserId);

            return Json(new { data = userData });
        }

        [HttpPost]
        public async Task<ActionResult> UpdateUserProfilePhoto()
        {
            try
            {
                if (Request.Files.Count > 0)
                {
                    var userId = User.Identity.Name.ToString();
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;

                    HttpPostedFileBase file = files[0];
                    string fname = file.FileName;

                    string folderPath = Server.MapPath("~/UploadPublicUser/ProfilePhoto/" + userId);

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    else
                    {
                        Directory.Delete(folderPath, true);
                        Directory.CreateDirectory(folderPath);
                    }

                    string path = "~/UploadPublicUser/ProfilePhoto/" + userId + "/" + file.FileName.ToString();

                    PublicAccountModel model = new PublicAccountModel()
                    {
                        USER_ID = userId,
                        PROFILE_PHOTO_NAME = fname,
                        PROFILE_PHOTO_PATH = path
                    };

                    var result = await publicUserService.UpdatePublicUserProfilePic(model);

                    file.SaveAs(Server.MapPath("~/UploadPublicUser/ProfilePhoto/" + userId + "/" + file.FileName.ToString()));
                    return Json(new AddUpdateDelete() { Status = true, Message = "Success", Data = path }, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = true, Message = "Please select an image", Data = null }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = true, Message = "Error occurred. Error details: " + ex.Message, Data = null }, JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateUserProfileData(PublicUserProfileModel model)
        {
            try
            {

                var userData = await authService.GetUser(User.Identity.Name, FormRole.PUBLIC_USER);

                bool UpdatePassword = false;

                List<CustomErrorModel> errorList = new List<CustomErrorModel>();

                if (model.USER_PASSWORD.Length < 6 || model.USER_PASSWORD.Length > 12)
                {
                    errorList.Add(new CustomErrorModel() { key = "USER_PASSWORD", message = "Password length should be between 6 and 12" });
                }
                else
                {
                    if (userData.Data["USER_PASSWORD"].ToString() != model.USER_PASSWORD)
                    {
                        UpdatePassword = true;
                    }
                }

                model.USER_ID = User.Identity.Name.ToString();

                if (errorList.Count > 0)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = errorList, Message = "Error" });
                }
                else
                {
                    var result = await publicUserService.UpdatePublicUserProfileData(model, UpdatePassword);
                }


                return Json(new AddUpdateDelete() { Status = true, Message = "Success" });
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.DenyGet);
            }


        }

        [HttpPost]
        public async Task<ActionResult> EnrollPublicUserForCalendar(CalendarEnrollModel model)
        {
            try
            {
                model.USER_ID = User.Identity.Name;

                var result = await publicUserService.EnrollPublicUserForCalendar(model);

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetAllEnrolledCompaniesData()
        {
            try
            {
                var result = await publicUserService.GetAllEnrolledCompaniesData(UserIdentity.UserEmail.ToString());

                return Json(new { data = result });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetRecentlyBookedCalendars()
        {
            try
            {
                var result = await publicUserService.GetRecentlyBookedCalendars(UserIdentity.UserEmail.ToString());

                return Json(new { data = result });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetAllEnrolledCalendarsData(string CompanyCode, string filterDate = null)
        {
            try
            {
                var result = await publicUserService.GetAllEnrolledCalendarsData(CompanyCode, UserIdentity.UserEmail, Convert.ToDateTime(filterDate).ToString("yyyy-MM-dd"));

                return Json(new { data = result });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetFullCalendarEvents(string StartDate, string EndDate)
        {
            try
            {
                var result = await publicUserService.GetFullCalendarEvents(StartDate, EndDate,UserIdentity.UserEmail);
                List<IDictionary<string, object>> finalResult = new List<IDictionary<string, object>>();

                for (int i = 0; i < result.Data.Count; i++)
                {
                    if (result.Data[i].Count > 0)
                    {
                        var splitData = result.Data[i]["customTitle"].Split(',');

                        result.Data[i].Add("customTitleSplit", splitData);
                        finalResult.Add(result.Data[i]);
                    }
                    
                }

                return Json(finalResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}