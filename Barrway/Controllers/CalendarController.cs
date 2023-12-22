using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    [BusinessAuthorize(Roles = "BUSINESS_USER,SUPERADMIN_USER")]
    public class CalendarController : BaseController
    {
        private readonly IMasterService masterService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ISqlFunction sqlFunction;
        private readonly IBusinessUserService businessUserService;
        private readonly IAuthService authService;

        // GET: Calendar
        public CalendarController(IMasterService masterService, IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IBusinessUserService businessUserService, IAuthService authService)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.businessUserService = businessUserService;
            this.authService = authService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EditIndex()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetLocationMasterList(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetServiceMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceMasterList(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetServiceProviderMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceProviderMasterList(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetParticipantMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetParticipantMasterList(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetSchedularFormList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetSchedularFormList(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetTransactionMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetTransactionMasterList(data, companyCode, calendarCode);
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

        public async Task<ActionResult> PaymentReceipt(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                var paymentReceiptData = await masterService.GetPaymentReceiptData(Id.ToString());

                PaymentReceiptViewModel data = new PaymentReceiptViewModel();

                data = paymentReceiptData.Data;

                return new ViewAsPdf("PaymentReceipt", data);
            }
            else
            {
                return RedirectToAction("Dashboard", "BusinessAdmin");
            }
           
        }

        [HttpPost]
        public async Task<ActionResult> GetClientPaymentHistory(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetClientPaymentHistory(data, companyCode, calendarCode);
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
        public async Task<ActionResult> GetSingleTransactionMaster(string TransactionId)
        {
            var locationListData = await masterService.GetSingleTransactionMaster(TransactionId);
            var locationList = locationListData.Data;

            return Json(new { data = locationList });
        }

        [HttpPost]
        public async Task<ActionResult> UpdateTransactionAttendance(string TransactionId, bool IsPresent = false)
        {
            var locationListData = await masterService.GetSingleTransactionMaster(TransactionId);
            var transactionData = locationListData.Data;

            var companies = await businessUserService.GetAllCompaniesByUserId(UserIdentity.UserID.ToString());

            var validCompanyCheck = false;

            for (int i = 0; i < companies.Data.Count; i++)
            {
                if (companies.Data[i]["COMPANY_CODE"].ToString() == transactionData[0]["COMPANY_CODE"].ToString())
                {
                    validCompanyCheck = true;
                    break;
                }
            }

            if (validCompanyCheck)
            {
                var result = await businessUserService.UpdateTransactionAttendance(TransactionId, IsPresent);

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Not Found" }, JsonRequestBehavior.AllowGet);
            }



        }

        [HttpPost]
        public async Task<ActionResult> UpdateBulkTransactionAttendance(string AttendanceJsonString)
        {
            List<BulkAttendanceModel> AttendanceData = JsonConvert.DeserializeObject<List<BulkAttendanceModel>>(AttendanceJsonString);

            var result = await businessUserService.UpdateTransactionAttendance(AttendanceData, UserIdentity.UserID.ToString());

            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public async Task<ActionResult> AddLocationMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string LocationCode = "LC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[LOCATION_MASTER_1936]
                                   SET [LOCATION_CODE] = '{LocationCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddServiceMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ActivityCode = "AC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[SERVICE_MASTER_1933]
                                   SET [ACTIVITY_CODE] = '{ActivityCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddServiceProviderMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ResourceCode = "RC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[SERVICE_PROVIDER_MASTER_1934]
                                   SET [RESOURCE_CODE] = '{ResourceCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddParticipantMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ResourceCode = "PC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[PARTICIPANT_MASTER_1940]
                                   SET [PARTICIPANT_CODE] = '{ResourceCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddSchedularForm(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddTransactionMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> GetSchedule(string ScheduleId)
        {
            var schedularData = await businessUserService.GetSchedule(ScheduleId, User.Identity.Name);

            return Json(new { data = schedularData.Data });
        }

        [HttpPost]
        public async Task<ActionResult> AddSchedule(SchedularFormModel data)
        {
            try
            {
                if (UserIdentity.Role != "SUPERADMIN_USER")
                {
                    var startObject = data.SCH_FROM_DATE.Split('/');
                    var endObject = data.SCH_TO_DATE.Split('/');

                    data.SCH_FROM_DATE = Convert.ToDateTime(startObject[2] + "-" + startObject[1] + "-" + startObject[0]).ToString("yyyy-MM-dd");
                    data.SCH_TO_DATE = Convert.ToDateTime(endObject[2] + "-" + endObject[1] + "-" + endObject[0]).ToString("yyyy-MM-dd");    
                }
                

                var b = data.ToDictionary();

                data.SCH_SCHEDULE_TABLE = JsonConvert.SerializeObject(b["table"]).ToString();
                bool createNewSchedule = false;

                if (!string.IsNullOrEmpty(data.Id))
                {
                    // Edit Existing Schedule
                    if (Convert.ToInt32(data.Id) > 0)
                    {
                        string formGroupKey = CustomMethods.CreateUUID();
                        var response = await businessUserService.AddSchedularForm(data, formGroupKey);

                        return Json("Success", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        createNewSchedule = true;
                    }
                    
                }
                else
                {
                    // Create a new Schedule
                    createNewSchedule = true;
                }

                if (createNewSchedule)
                {
                    var calendarCountCheckData = await businessUserService.GetSessionsForThisMonth(data.COMPANY_CODE);
                    var package = await businessUserService.GetCompanyActiveSubscriptionDetails(data.COMPANY_CODE);

                    if (!calendarCountCheckData.Status)
                    {
                        return Json(calendarCountCheckData);
                    }
                    else
                    {
                        DateTime PackageValidity = Convert.ToDateTime(calendarCountCheckData.Data["VALID_TILL"]?.ToString());

                        if (PackageValidity < Convert.ToDateTime(data.SCH_TO_DATE))
                        {
                            data.SCH_TO_DATE = PackageValidity.ToString("yyyy-MM-dd");
                        }

                        if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) == 0)
                        {
                            return Json(new AddUpdateDelete() { Status = false, Message = "You have reached maximum limit of creating sessions for this month. Upgrade you plan to create more sessions." });
                        }
                    }

                    string script = "";
                    string formGroupKey = CustomMethods.CreateUUID();
                    
                    var response = await businessUserService.AddSchedularForm(data, formGroupKey);
                    
                    int eventCounter = 0;
                    bool caseBreak = false;

                    if (response.Status)
                    {
                        if (UserIdentity.Role == "SUPERADMIN_USER")
                        {
                            return Json("Success", JsonRequestBehavior.AllowGet);
                        }

                        var start = Convert.ToDateTime(data.SCH_FROM_DATE);

                        var end = Convert.ToDateTime(data.SCH_TO_DATE);

                        DateTime dateTracker = start;
                        int slotCounter = 1;
                        
                        while (dateTracker <= end)
                        {
                            eventCounter++;
                            if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) < eventCounter)
                            {
                                caseBreak = true;
                                break;
                            }

                            string SchedularFormId = response.Data.Id.ToString();
                            DateTime SlotStartTime = DateTime.Now;
                            DateTime SlotEndTime = DateTime.Now;

                            switch (dateTracker.DayOfWeek.ToString())
                            {
                                case "Monday":
                                    if (string.IsNullOrEmpty(data.table.Monday.Start) || string.IsNullOrEmpty(data.table.Monday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Monday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Monday.End.ToString());
                                    }

                                    break;
                                case "Tuesday":

                                    if (string.IsNullOrEmpty(data.table.Tuesday.Start) || string.IsNullOrEmpty(data.table.Tuesday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Tuesday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Tuesday.End.ToString());
                                    }


                                    break;
                                case "Wednesday":

                                    if (string.IsNullOrEmpty(data.table.Wednesday.Start) || string.IsNullOrEmpty(data.table.Wednesday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Wednesday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Wednesday.End.ToString());
                                    }

                                    break;
                                case "Thursday":

                                    if (string.IsNullOrEmpty(data.table.Thursday.Start) || string.IsNullOrEmpty(data.table.Thursday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Thursday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Thursday.End.ToString());
                                    }

                                    break;
                                case "Friday":

                                    if (string.IsNullOrEmpty(data.table.Friday.Start) || string.IsNullOrEmpty(data.table.Friday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Friday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Friday.End.ToString());
                                    }

                                    break;
                                case "Saturday":

                                    if (string.IsNullOrEmpty(data.table.Saturday.Start) || string.IsNullOrEmpty(data.table.Saturday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Saturday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Saturday.End.ToString());
                                    }

                                    break;
                                case "Sunday":

                                    if (string.IsNullOrEmpty(data.table.Sunday.Start) || string.IsNullOrEmpty(data.table.Sunday.End))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Sunday.Start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + data.table.Sunday.End.ToString());
                                    }

                                    break;
                            }

                            if (data.SCH_ALTERNATIVE_WEEK == "ALTERNATE-WEEK")
                            {
                                var weekNum = ((int)dateTracker.DayOfWeek);

                                if (weekNum % 2 == 0)
                                {
                                    dateTracker = dateTracker.AddDays(7);
                                    continue;
                                }
                            }
                            else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-3-WEEK")
                            {
                                var weekNum = GetWeekNumberOfMonth(start);
                                if (weekNum > 3)
                                {
                                    dateTracker = dateTracker.AddDays((7 * 3));
                                    continue;
                                }
                            }
                            else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-4-WEEK")
                            {
                                var weekNum = GetWeekNumberOfMonth(start.AddDays(1));
                                if (weekNum > 4)
                                {
                                    dateTracker = dateTracker.AddDays((7 * 4));
                                    continue;
                                }
                            }

                            CalendarFormModel eventData = new CalendarFormModel()
                            {
                                end = SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                resources = data.SCH_RESOURCE,
                                activities = data.SCH_ACTIVITY,
                                start = SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                title = "Slot " + slotCounter++
                            };
                            formGroupKey = Guid.NewGuid().ToString();

                            script += $@"insert into CALENDAR_FORM_1935(
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
	                                  values('{SchedularFormId}', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{data.COMPANY_CODE}', '{data.CALENDAR_CODE}', 'Slot {slotCounter}', '{SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{data.SCH_RESOURCE}', '{data.SCH_ACTIVITY}', '{package.Data["SUBS_ID"]?.ToString()}', '{data.SCH_DESCRIPTION}', getDate(), getDate(),'SCHEDULE');
                                
                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{data.SCH_RESOURCE}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_RESOURCE}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{data.SCH_ACTIVITY}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_ACTIVITY}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                        
                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{data.SCH_LOCATION}', 'LOCATION_MASTER_1936', 'LOCATION_CODE', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_LOCATION}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                                    ";

                            dateTracker = dateTracker.AddDays(1);
                        }
                    }

                    var count = await sqlFunction.ExecuteSqlCommandQuery(script);

                    if (count > 0)
                    {
                        if (caseBreak)
                        {
                            if (eventCounter == 0)
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "No Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "Only " + eventCounter + " Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                            }
                        }
                        else
                        {
                            return Json("Success", JsonRequestBehavior.AllowGet);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                return Json("Failed", JsonRequestBehavior.DenyGet);
            }

            return Json("Failed", JsonRequestBehavior.DenyGet);
        }
        private int GetWeekNumberOfMonth(DateTime date)
        {
            date = date.Date;
            DateTime firstMonthDay = new DateTime(date.Year, date.Month, 1);
            DateTime firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
            if (firstMonthMonday > date)
            {
                firstMonthDay = firstMonthDay.AddMonths(-1);
                firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
            }
            return (date - firstMonthMonday).Days / 7 + 1;
        }

        public async Task<ActionResult> GetCalendarUpcomingBookingsData(GenerateDynamicFormData data, string CompanyCode, string CalendarCode)
        {
            try
            {
                var transactionData = await businessUserService.GetCalendarUpcomingBookings(data, CompanyCode, CalendarCode);
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    last_page = Math.Floor(paging) + 1;
                }

                return Json(new { data = transactionList, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}