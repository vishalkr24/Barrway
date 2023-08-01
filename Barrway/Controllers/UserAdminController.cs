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
using Barrway.DTO.MarketplaceModels;
using System.Net.Http;

namespace Barrway.Controllers
{
    [PublicAuthorize(Roles = "PUBLIC_USER")]
    public class UserAdminController : BaseController
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        private readonly IAuthService authService;
        private readonly IMasterService masterService;

        public UserAdminController(ISqlFunction sqlFunction, IPublicUserService publicUserService, IAuthService authService, IMasterService masterService)
        {
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
            this.authService = authService;
            this.masterService = masterService;
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
                
                if (result.Status)
                {
                    // send email to user
                    var resultEmail = await masterService.SendCalendarFile(UserIdentity.UserEmail, result.Data?.ToString());
                }

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public async Task<ActionResult> GetUserCoinBalance()
        {
            try
            {
                var result = await publicUserService.GetUserCoinBalance(User.Identity.Name);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetUserCoinBalanceByCalendar(string CompanyCode, string CalendarCode)
        {
            try
            {
                var result = await publicUserService.GetUserCoinBalance(User.Identity.Name, CompanyCode, CalendarCode);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetCurrentPackageDetails(string CompanyCode, string CalendarCode, string ServiceId)
        {
            try
            {
                var result = await publicUserService.GetCurrentPackageDetails(User.Identity.Name, CompanyCode, CalendarCode, ServiceId);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> BookingService(RequestEventViewModel model)
        {
            try
            {
                var result = await publicUserService.BookingServiceEvent(model, User.Identity.Name);

                if (result.Status)
                {
                    // send email to user
                    var resultEmail = await masterService.SendCalendarFile(UserIdentity.UserEmail, result.Data?.ToString());
                }


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
        public async Task<ActionResult> GetMyAttendanceList(GenerateDynamicFormData data)
        {
            var locationListData = await publicUserService.GetMyAttendanceList(data, UserIdentity.UserEmail);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
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
        public async Task<ActionResult> GetUserBCoinMaster(GenerateDynamicFormData data)
        {
            try
            {
                var transactionData = await publicUserService.GetUserBCoinMaster(data, User.Identity.Name);
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }

                return Json(new { data = transactionData.Data, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetMyFavoriteCalendars(GenerateDynamicFormData data)
        {
            try
            {
                var transactionData = await publicUserService.GetMyFavoriteCalendars(data, User.Identity.Name);
                var transactionList = transactionData.Data[0];
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }

                return Json(new { data = transactionData.Data, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddFavoriteCalendar(FavoriteCalendarModel model)
        {
            try
            {
                model.USER_ID = User.Identity.Name;
                model.IS_PUBLIC_USER = "Y";
                var result = await publicUserService.AddFavoriteCalendar(model);

                return Json(new AddUpdateDelete() { Message = "Success", Status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> RemoveFavoriteCalendar(FavoriteCalendarModel model)
        {
            try
            {
                model.USER_ID = User.Identity.Name;
                model.IS_PUBLIC_USER = "Y";
                var result = await publicUserService.RemoveFavoriteCalendar(model);

                return Json(new AddUpdateDelete() { Message = "Success", Status = true }, JsonRequestBehavior.AllowGet);
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
                var result = await publicUserService.GetFullCalendarEvents(StartDate, EndDate, UserIdentity.UserEmail);
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