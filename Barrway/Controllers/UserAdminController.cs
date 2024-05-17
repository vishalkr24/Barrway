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
using Barrway.DTO.BusinessModels;
using static QRCoder.PayloadGenerator;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Configuration;
using System.Web.WebPages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Barrway.Controllers
{
    [PublicAuthorize(Roles = "PUBLIC_USER,GENERAL_USER")]
    public class UserAdminController : BaseController
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        private readonly IAuthService authService;
        private readonly IMasterService masterService;
        private readonly IBusinessUserService businessUserService;

        public UserAdminController(ISqlFunction sqlFunction, IPublicUserService publicUserService, IAuthService authService, IMasterService masterService, IBusinessUserService businessUserService)
        {
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
            this.authService = authService;
            this.masterService = masterService;
            this.businessUserService = businessUserService;
        }

        // GET: UserAdmin
        public async Task<ActionResult> Index()
        {
            var userData = (await publicUserService.GetSinglePublicUserAccount(User.Identity.Name)).Data as IDictionary<string, object>;

            if (userData != null)
            {
                ViewBag.ProfilePic = userData["PROFILE_PHOTO_PATH"]?.ToString();
            }

            return View();
        }

        public async Task<ActionResult> BookEvent(int Id)
        {
            if (Id > 0)
            {
                return Redirect("/Useradmin#/bookEvent/" + Id);
            }
            else
            {
                return Redirect("/Useradmin#/dashboard");
            }
        }

        public async Task<ActionResult> GetSingleEventDetailsWithFlags(string EventId)
        {
            var eventData = await publicUserService.GetSingleEventDetailsWithFlags(EventId, UserIdentity.UserEmail);

            return Json(eventData);
        }

        [HttpPost]
        public async Task<ActionResult> GetSingleUserByUserId()
        {
            var userData = await publicUserService.GetSinglePublicUserAccount(User.Identity.Name);

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
                var userData = await authService.GetUser(User.Identity.Name, FormRole.GENERAL_USER);
                
                bool UpdatePassword = false;

                List<CustomErrorModel> errorList = new List<CustomErrorModel>();

                if (model.USER_PASSWORD.Length < 8 || model.USER_PASSWORD.Length > 12)
                {
                    errorList.Add(new CustomErrorModel() { key = "USER_PASSWORD", message = "Password length should be between 8 and 12" });
                }
                else
                {
                    //if (userData.Data["USER_PASSWORD"].ToString() != model.USER_PASSWORD)
                    //{
                    //    UpdatePassword = true;
                    //}
                }

                model.USER_ID = User.Identity.Name.ToString();

                if (errorList.Count > 0)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = errorList, Message = "Error" });
                }
                else
                {
                    var result = await publicUserService.UpdatePublicUserProfileData(model, UpdatePassword);
                    UserIdentity.UpdateClaim("FirstName", model.FIRST_NAME??"");
                    UserIdentity.UpdateClaim("LastName", model.LAST_NAME??"");
                }


                return Json(new AddUpdateDelete() { Status = true, Message = "Success" });
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.DenyGet);
            }


        }

        public async Task<ActionResult> CreateDynamicFormEntry(List<IDictionary<string, string>> data, string formId, string CalendarCode)
        {
            if (!string.IsNullOrEmpty(formId))
            {
                try
                {
                    var result = await publicUserService.CreateDynamicFormEntry(data, formId, UserIdentity.UserID, CalendarCode);

                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                }
                return Json(new AddUpdateDelete() { Status = false, Message = "Something went wrong" }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "form not Found." }, JsonRequestBehavior.AllowGet);
            }
        }

        [ValidateInput(false)]
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
                    //var resultEmail = await masterService.SendCalendarFile(UserIdentity.UserEmail, result.Data?.ToString());
                }

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [ValidateInput(false)]
        [HttpPost]
        public async Task<ActionResult> EnrollCourse(CalendarEnrollModel model)
        {
            try
            {
                model.USER_ID = User.Identity.Name;
                model.USER_EMAIL = UserIdentity.UserEmail;

                var result = await publicUserService.EnrollCourse(model);

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [ValidateInput(false)]
        public async Task<ActionResult> CancelPublicUserBooking(CalendarEnrollModel model)
        {
            try
            {
                model.USER_EMAIL = UserIdentity.UserEmail;
                model.USER_ID = UserIdentity.UserName;

                var result = await publicUserService.CancelPublicUserBooking(model);

                if (result.Status)
                {
                    // send email to user
                    //var resultEmail = await masterService.SendCalendarFile(UserIdentity.UserEmail, result.Data?.ToString());
                }

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddSessionReview(SessionReviewModel model)
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    model.USER_EMAIL = UserIdentity.UserEmail;
                    var result = await publicUserService.AddSessionReview(model);
                    return Redirect("/UserAdmin#/mybookings/2354");
                }
                else
                {
                    return RedirectToAction("BusinessLogin", "Account");
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateRoomBookingSlot(CalendarFormModel model)
        {
            try
            {
                var result = await publicUserService.EnrollParticipantForCalendar(model, UserIdentity.UserName, UserIdentity.UserEmail);
                var a = Convert.ToDateTime(model.start);
                CalendarFormModel eventData = result.Data;

                var result2 = await businessUserService.CheckRoomRentalOverlapingSlots(new SchedularFormModel()
                {
                    COMPANY_CODE = model.COMPANY_CODE,
                    CALENDAR_CODE = model.CALENDAR_CODE,
                    SCH_FROM_DATE = model.start,
                    SCH_TO_DATE = model.end,
                    SCH_ACTIVITY = model.activities,
                    SCH_RESOURCE = model.resources
                });

                if (result2.Status)
                {
                    string formGroupKey = Guid.NewGuid().ToString();

                    string referenceActivityEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.PARTICIPANT_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(model.activities)}', 'PARTICIPANT_MASTER_1940', 'STUDENT_NAME', {(int)FormSetting.PARTICIPANT_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(model.activities)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";

                    string script = $@"insert into CALENDAR_FORM_1935(
                                                               [SCHEDULAR_FORM_ID]
                                                              ,[formGroupKey]
                                                              ,[formID]
                                                              ,[userID]
                                                              ,[Current_Status]
                                                              ,[cycle]
                                                              ,[MasterFormID]
                                                              ,[MasterFormRow]
                                                              ,[formRecordOrder]
                                                              ,[formRecordStatus]
                                                              ,[COMPANY_CODE]
                                                              ,[CALENDAR_CODE]
                                                              ,[title]
                                                              ,[start]
                                                              ,[end]
                                                              ,[allDay]
                                                              ,[resources]
                                                              ,[activities]
                                                              ,[COMPANY_SUBSCRIPTION_ID]
                                                              ,[description]
                                                              ,[created_at], [updated_at],[EVENT_TYPE])
	                                                          values('0', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{model.COMPANY_CODE}', '{model.CALENDAR_CODE}', '{SQLUtility.TreatSingleQuoteForQuery(eventData.title)}', '{Convert.ToDateTime(model.start).ToString("yyyy-MM-ddTHH:mm:ss")}', '{Convert.ToDateTime(model.end).ToString("yyyy-MM-ddT23:59:59")}', 'false', '{SQLUtility.TreatSingleQuoteForQuery(model.resources)}', '{SQLUtility.TreatSingleQuoteForQuery(model.activities)}', '0', '{SQLUtility.TreatSingleQuoteForQuery(model.description)}', getDate(), getDate(),'BOOKING');

                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(model.resources)}', 'LOCATION_MASTER_1936', 'LOCATION_ADDRESS', {(int)FormSetting.LOCATION_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(model.resources)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            
                                                            {referenceActivityEntry}
                                                            ";

                    var finalResult = await sqlFunction.ExecuteSqlCommandQuery(script);

                    if (finalResult > 0)
                    {
                        return Json(new AddUpdateDelete() { Status = true, Message = "Booking successfull!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new AddUpdateDelete() { Status = true, Message = "Booking failed!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(result2, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> CheckAdditionalFormDetails(string CalendarCode)
        {
            try
            {
                string UserId = UserIdentity.UserID;
                var result = await publicUserService.CheckAdditionalFormDetails(CalendarCode, UserId);

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
        public async Task<ActionResult> GetCurrentPackageDetails(string CompanyCode, string CalendarCode, string ServiceId, string start, string end)
        {
            try
            {
                var result = await publicUserService.GetCurrentPackageDetails(User.Identity.Name, CompanyCode, CalendarCode, ServiceId, new CommonTimeObject() { start = start, end = end });

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
                var result = await publicUserService.BookingServiceEvent(model, User.Identity.Name, UserIdentity.UserID);

                if (result.Status)
                {
                    // Send email to user
                    //var resultEmail = await masterService.SendCalendarFile(UserIdentity.UserEmail, result.Data?.ToString());
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
        public async Task<ActionResult> GetAllEnrolledCalendars(string cmpCode)
        {
            try
            {
                var result = await publicUserService.GetAllEnrolledCalendars(UserIdentity.UserEmail.ToString(), cmpCode);
                return Json(new { data = result });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetSingleEventDetails(string EventId, string Type)
        {
            try
            {
                SessionReviewViewModel model = new SessionReviewViewModel();
                var result = await masterService.GetMyBookings(UserIdentity.UserEmail, Type, EventId);

                if (result.Status)
                {
                    var data = result.Data;

                    model.COMPANY_CODE = data[0]["COMPANY_CODE"]?.ToString();
                    model.CALENDAR_CODE = data[0]["CALENDAR_CODE"]?.ToString();
                    model.LOCATION_NAME = data[0]["LOCATION_TITLE"]?.ToString();
                    model.SERVICE_NAME = data[0]["SERVICE_TITLE"]?.ToString();
                    model.SERVICE_PROVIDER_NAME = data[0]["SERVICE_PROVIDER_TITLE"]?.ToString();
                    model.EVENT_ID = EventId;
                    model.USER_EMAIL = UserIdentity.UserEmail;
                    model.FROM_TIME = Convert.ToDateTime(data[0]["start"]?.ToString());
                    model.TO_TIME = Convert.ToDateTime(data[0]["end"]?.ToString());
                    model.REVIEW_COMMENT = data[0]["REVIEW_COMMENT"]?.ToString();
                    model.REVIEW_SCORE = (string.IsNullOrEmpty((data[0]["REVIEW_SCORE"]?.ToString()))) ? 0 : Convert.ToInt32(data[0]["REVIEW_SCORE"]?.ToString());
                    model.SESSION_REVIEWED = (data[0]["SESSION_REVIEWED"]?.ToString() == "N") ? false : true;

                }
                else
                {

                }

                return View(model);
            }
            catch (Exception ex)
            {
                return View(new SessionReviewViewModel());
            }

        }

        [HttpPost]
        public async Task<ActionResult> GetMyBookings(string Type)
        {
            if (User.Identity.IsAuthenticated)
            {
                var result = await masterService.GetMyBookings(UserIdentity.UserEmail, Type);

                return Json(result.Data, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Kindly login and try again." }, JsonRequestBehavior.AllowGet);
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
                var result = await publicUserService.GetRecentlyBookedCalendars(UserIdentity.UserEmail.ToString(), UserIdentity.UserName);

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetUserBCoinMaster(GenerateDynamicFormData data)
        {
            try
            {
                var transactionData = await publicUserService.GetUserBCoinMaster(data, UserIdentity.UserName, UserIdentity.UserEmail);
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

        [HttpPost]
        public async Task<ActionResult> GetMyUpcomingBookings()
        {
            try
            {
                var result = await publicUserService.GetMyUpcomingBookings(UserIdentity.UserEmail);
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


        /// <summary>
        /// It will generate a QR of attendee booking for company to scan it
        /// </summary>
        /// <param name="TransactionId"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult> GenerateAttendanceQR(string TransactionId)
        {
            QRCodeModel model = new QRCodeModel();
            string Url = ConfigurationManager.AppSettings["baseurl"] + "Public/MarkPresentByCompany?TransactionId=" + TransactionId;
            Payload payload = new Url(Url);

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeAsBitmap = qrCode.GetGraphic(20);

            string base64String = Convert.ToBase64String(BitmapToByteArray(qrCodeAsBitmap));
            model.QRImageURL = "data:image/png;base64," + base64String;

            return Json(new AddUpdateDelete() { Status = true, Data = model }, JsonRequestBehavior.AllowGet);
        }

        private byte[] BitmapToByteArray(Bitmap bitmap)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                bitmap.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }

        [HttpPost]
        public async Task<ActionResult> UploadDownloadAttachment(List<HttpPostedFileBase> files, string clrcode, string eventid)
        {

            if (files == null || files.Count() == 0 || string.IsNullOrEmpty(clrcode))
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
            }
            foreach (var file in files)
            {
                if (file == null || file.ContentLength == 0)
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
                }
            }
            foreach (var file in files)
            {
                string fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!IsAllowedFileExtension(fileExtension))
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
                }
            }


            try
            {
                string baseurl = ConfigurationManager.AppSettings["baseurl"].ToString();
                List<IDictionary<string, object>> filePaths = new List<IDictionary<string, object>>();
                foreach (var file in files)
                {

                    string folderPath = "UploadCalendar/DownloadAttachment/" + clrcode + "/";
                    string url = baseurl + folderPath + file.FileName;
                    string _filepath = "/" + folderPath + file.FileName;
                    filePaths.Add(new Dictionary<string, object>() { { "url", url }, { "path", _filepath }, { "name", file.FileName }, { "type", "public" } });
                    folderPath = Server.MapPath("~/" + folderPath);
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string fileName = Path.GetFileName(file.FileName);
                    string filePath = Path.Combine(folderPath, fileName);
                    file.SaveAs(filePath);
                }
                int _eventId;
                if (int.TryParse(eventid, out _eventId))
                {

                    var result = (await businessUserService.getCalendarUploadFiles(_eventId)).Data as IDictionary<string, object>;
                    if (result != null && result.Count() > 0)
                    {
                        //[DOWNLOADABLE_ATTACHMENT],[DOWNLOAD_FILE_LIST]
                        if (result.ContainsKey("DOWNLOAD_FILE_LIST") && !string.IsNullOrEmpty(result["DOWNLOAD_FILE_LIST"]?.ToString()) && isJsonString(result["DOWNLOAD_FILE_LIST"].ToString()))
                        {
                            string DOWNLOAD_FILE_LIST = result["DOWNLOAD_FILE_LIST"].ToString();
                            var parse_json = JsonConvert.DeserializeObject<List<IDictionary<string, object>>>(DOWNLOAD_FILE_LIST);
                            parse_json.AddRange(filePaths);
                            filePaths = parse_json;
                            string DOWNLOADABLE_ATTACHMENT = string.Join(",", filePaths.Select(x => x["path"].ToString()).ToList());
                            DOWNLOAD_FILE_LIST = JsonConvert.SerializeObject(filePaths);
                            await businessUserService.updateCalendarUploadFiles(_eventId, DOWNLOADABLE_ATTACHMENT, DOWNLOAD_FILE_LIST);
                        }
                        else
                        {

                            string DOWNLOADABLE_ATTACHMENT = string.Join(",", filePaths.Select(x => x["path"].ToString()).ToList());
                            string DOWNLOAD_FILE_LIST = JsonConvert.SerializeObject(filePaths);
                            await businessUserService.updateCalendarUploadFiles(_eventId, DOWNLOADABLE_ATTACHMENT, DOWNLOAD_FILE_LIST);
                        }
                    }
                }
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = filePaths });

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }


        [HttpPost]
        public async Task<ActionResult> DeleteEventUploadFiles(string filePath, string eventid, string downloadable_attachment, string download_file_list)
        {

            if (string.IsNullOrEmpty(filePath))
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
            }
            try
            {
                filePath = Server.MapPath("~" + filePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                int _eventId;
                if (int.TryParse(eventid, out _eventId))
                {
                    await businessUserService.updateCalendarUploadFiles(_eventId, downloadable_attachment, download_file_list);
                }
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }

        [HttpPost]
        public async Task<ActionResult> UpdateEventOtherField(string eventid, string field, string value)
        {

            try
            {
                int _eventId;
                if (int.TryParse(eventid, out _eventId))
                {
                    Dictionary<string, object> data = new Dictionary<string, object>() { { field, value } };
                    await businessUserService.updateCalendarOtherField(_eventId, data);
                }
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }

        [HttpPost]
        public async Task<ActionResult> UpdateEventFieldsData(RootEventDataListModel request)
        {
            try
            {
                Dictionary<string, object> data = new Dictionary<string, object>();
                request.data.ForEach(x =>
                {
                    data.Add(x.field, x.value);
                });
                await businessUserService.updateCalendarOtherField(request.eventId, data);
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetEnrollUserDetails(int id)
        {

            if (!User.Identity.IsAuthenticated)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound }, JsonRequestBehavior.AllowGet);
            }
            return Json(await businessUserService.GetEnrollUserDetails(id, UserIdentity.UserEmail), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public async Task<ActionResult> UploadAssestementAttachment(List<HttpPostedFileBase> files, string clrcode, string eventid)
        {

            if (files == null || files.Count() == 0 || string.IsNullOrEmpty(clrcode))
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
            }
            foreach (var file in files)
            {
                if (file == null || file.ContentLength == 0)
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
                }
            }
            foreach (var file in files)
            {
                string fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!IsAllowedFileExtension(fileExtension))
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
                }
            }


            try
            {
                string baseurl = ConfigurationManager.AppSettings["baseurl"].ToString();
                List<IDictionary<string, object>> filePaths = new List<IDictionary<string, object>>();
                foreach (var file in files)
                {

                    string folderPath = "UploadCalendar/UploadAttachment/" + clrcode + "/";
                    string url = baseurl + folderPath + file.FileName;
                    string _filepath = "/" + folderPath + file.FileName;
                    filePaths.Add(new Dictionary<string, object>() { { "url", url }, { "path", _filepath }, { "name", file.FileName }, { "type", "public" } });
                    folderPath = Server.MapPath("~/" + folderPath);
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string fileName = Path.GetFileName(file.FileName);
                    string filePath = Path.Combine(folderPath, fileName);
                    file.SaveAs(filePath);
                }
                int _eventId;
                if (int.TryParse(eventid, out _eventId))
                {

                    var upload_result = (await businessUserService.GetEnrollUserDetails(_eventId, UserIdentity.UserEmail)).Data as IDictionary<string, object>;
                    if (upload_result != null)
                    {
                        var result = upload_result;
                        int transaction_id = Convert.ToInt32(result["TRANSACTION_ID"]);
                        if (result.ContainsKey("ASSESSMENT_FILES") && !string.IsNullOrEmpty(result["ASSESSMENT_FILES_LIST"]?.ToString()) && isJsonString(result["ASSESSMENT_FILES_LIST"].ToString()))
                        {
                            string ASSESSMENT_FILES_LIST = result["ASSESSMENT_FILES_LIST"].ToString();
                            var parse_json = JsonConvert.DeserializeObject<List<IDictionary<string, object>>>(ASSESSMENT_FILES_LIST);
                            parse_json.AddRange(filePaths);
                            filePaths = parse_json;
                            string ASSESSMENT_FILES = string.Join(",", filePaths.Select(x => x["path"].ToString()).ToList());
                            ASSESSMENT_FILES_LIST = JsonConvert.SerializeObject(filePaths);
                            await businessUserService.updateAssesstmentUploadFiles(transaction_id, ASSESSMENT_FILES, ASSESSMENT_FILES_LIST);
                        }
                        else
                        {

                            string ASSESSMENT_FILES = string.Join(",", filePaths.Select(x => x["path"].ToString()).ToList());
                            string ASSESSMENT_FILES_LIST = JsonConvert.SerializeObject(filePaths);
                            await businessUserService.updateAssesstmentUploadFiles(transaction_id, ASSESSMENT_FILES, ASSESSMENT_FILES_LIST);
                        }
                    }
                }
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = filePaths });

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }




        [HttpPost]
        public async Task<ActionResult> DeleteAssestementUploadFiles(string filePath, string transactionid, string downloadable_attachment, string download_file_list)
        {

            if (string.IsNullOrEmpty(filePath))
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.InvaidRequest });
            }
            try
            {
                filePath = Server.MapPath("~" + filePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                int _transactionid;
                if (int.TryParse(transactionid, out _transactionid))
                {
                    await businessUserService.updateAssesstmentUploadFiles(_transactionid, downloadable_attachment, download_file_list);
                }
                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }

        }


        private bool IsAllowedFileExtension(string fileExtension)
        {
            // Define the list of allowed file extensions
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
            return allowedExtensions.Contains(fileExtension);
        }
        private bool isJsonString(string json)
        {
            try
            {
                if (string.IsNullOrEmpty(json?.Trim()))
                {
                    return false;
                }
                var parse_json = JsonConvert.DeserializeObject<List<IDictionary<string, object>>>(json);
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }

        }
    }
}