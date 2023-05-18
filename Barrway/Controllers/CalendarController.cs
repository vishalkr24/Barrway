using Barrway.DTO.BusinessModels;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
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
    [Authorize]
    public class CalendarController : Controller
    {
        private readonly IMasterService masterService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ISqlFunction sqlFunction;

        // GET: Calendar
        public CalendarController(IMasterService masterService, IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
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
        public async Task<ActionResult> AddSchedule(string data)
        {
            try
            {
                IDictionary<string, object> requestData = JsonSerializer.Deserialize<IDictionary<string, object>>(data);

                data.SCH_SCHEDULE_TABLE = JsonConvert.SerializeObject(b["table"]).ToString();

                var startObject = data.SCH_FROM_DATE.Split('/');
                var endObject = data.SCH_TO_DATE.Split('/');

                data.SCH_FROM_DATE = Convert.ToDateTime(startObject[2] + "-" + startObject[1] + "-" + startObject[0]).ToString();
                data.SCH_TO_DATE = Convert.ToDateTime(endObject[2] + "-" + endObject[1] + "-" + endObject[0]).ToString();

                var response = await businessUserService.AddSchedularForm(data);

                if (response.Status)
                {
                    string formGroupKey = response.Data.formGroupKey;
                    
                    var start = Convert.ToDateTime(startObject[2] + "-" + startObject[1] + "-" + startObject[0]);
                    
                    var end = Convert.ToDateTime(endObject[2] + "-" + endObject[1] + "-" + endObject[0]);
                    
                    DateTime dateTracker = start;
                    int slotCounter = 1;

                //TempData["TmpMsg"] = response.Message;


                //if (response.res == 1)
                //{

                //    FormTable requestManageForm = new FormTable()
                //    {
                //        action = 6,
                //        created_by = (int)FormSetting.CreatedUser,
                //        formId = (int)FormSetting.CourseSchedular,
                //        updated_by = (int)FormSetting.CreatedUser,
                //        userId = (int)FormSetting.CreatedUser,
                //        Id = response.Id,
                //        formGroupKey = ""
                //    };

                //    var responseSchedular = await patientRegistration.ManageForm(requestManageForm);


                //    if (responseSchedular.Status)
                //    {
                //        var schedularlist = responseSchedular.Data.FirstOrDefault();
                //        var schedular = schedularlist.FormDataToOneListDynamic?.FirstOrDefault();
                //        if (schedular != null)
                //        {
                //            var start = Convert.ToDateTime(schedular["STARTDATE"]);
                //            //var end = Convert.ToDateTime(item["ENDDATE"]);
                //            var end = Convert.ToDateTime(schedular["ENDDATE"]);
                //            if (end > Convert.ToDateTime(schedular["ENDDATE"]))
                //            {
                //                end = Convert.ToDateTime(schedular["ENDDATE"]).AddDays(1);
                //            }
                //            var duartionStr = schedular["DURATION"].ToString();
                //            var durationMin = duartionStr.Split(':')[0];
                //            var duration = Convert.ToInt32(durationMin);
                //            var diffMin = end.Subtract(start).TotalMinutes;
                //            var diffDay = end.Subtract(start).TotalDays;
                //            var durationPart = diffMin / duration;
                //            string scheduleTable = schedular["table_scheduling"].ToString();
                //            var scheduleData = ConvertToSchedule(scheduleTable);
                //            var startTemp = start;

                //            for (int day = 0; day < diffDay; day++)
                //            {
                //                start = startTemp.AddDays(day);

                //                var DayName = start.DayOfWeek;
                //                var sData = scheduleData.Where(x => (DayOfWeek)x["Day"] == DayName).FirstOrDefault();
                //                var startTime = TimeSpan.Parse(sData["start"].ToString());
                //                var endTime = TimeSpan.Parse(sData["end"].ToString());
                //                int j = 1;


                //                if (schedular["ALTERNATIVE_WEEK_TYPE"].ToString() == "Alternative week")
                //                {
                //                    var weekNum = GetWeekNumberOfMonth(start);
                //                    if (weekNum % 2 == 0)
                //                    {
                //                        continue;
                //                    }
                //                }
                //                else if (schedular["ALTERNATIVE_WEEK_TYPE"].ToString() == "Every 3 week")
                //                {
                //                    var weekNum = GetWeekNumberOfMonth(start);
                //                    if (weekNum > 3)
                //                    {
                //                        continue;
                //                    }
                //                }
                //                else if (schedular["ALTERNATIVE_WEEK_TYPE"].ToString() == "Every 4 week")
                //                {
                //                    var weekNum = GetWeekNumberOfMonth(start.AddDays(1));
                //                    if (weekNum > 4)
                //                    {
                //                        continue;
                //                    }
                //                }



                //                for (TimeSpan i = startTime; i < endTime;)
                //                {
                //                    //2022-07-01T14:10:00
                //                    var eventData = new
                //                    {
                //                        end = (start.Date + i.Add(new TimeSpan(0, duration, 0))).ToString("yyyy-MM-ddTHH:mm:ss"),
                //                        resourceId = schedular["STAFF"].ToString(),
                //                        start = (start.Date + i).ToString("yyyy-MM-ddTHH:mm:ss"),
                //                        title = "Slot " + j,
                //                        customTitle = "Slot " + j,
                //                        customForms = "217908",
                //                        customFormIds = schedular["STAFF"].ToString(),
                //                        Id = 0
                //                    };


                //                    requestSave = new Form_DataTable();

                //                    requestSave.action = (int)FormAction.Save;
                //                    requestSave.userId = (int)FormSetting.CreatedUser;
                //                    requestSave.created_by = (int)FormSetting.CreatedUser;
                //                    requestSave.updated_by = (int)FormSetting.CreatedUser;
                //                    requestSave.created_at = DateTime.Now.ToString();
                //                    requestSave.updated_at = DateTime.Now.ToString();
                //                    requestSave.formId = (int)FormSetting.ActivityForm;
                //                    formGroupKey = Guid.NewGuid().ToString();
                //                    requestSave.formGroupKey = formGroupKey;
                //                    var requestActivity = new { TITLE = "Slot " + j, DURATION_FIELD = "00:00:60", COLOR_FIELD = "#2ecc71" };
                //                    requestSave.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(requestActivity.AsDictionary());

                        script += $@"insert into CALENDAR_FORM_1935(
                                       [formGroupKey]
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
                                      ,[description]
                                      ,[created_at], [updated_at])
	                                  values('{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{data.COMPANY_CODE}', '{data.CALENDAR_CODE}', 'Slot {slotCounter++}', '{SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{data.SCH_RESOURCE}', '{data.SCH_ACTIVITY}', '{data.SCH_DESCRIPTION}', getDate(), getDate() );
                                
                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{data.SCH_RESOURCE}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_RESOURCE}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{data.SCH_ACTIVITY}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_ACTIVITY}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                        
                                    insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                    values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{data.SCH_LOCATION}', 'LOCATION_MASTER_1936', 'LOCATION_CODE', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_LOCATION}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                //                        requestCreateEvent.seperatedResColValues = staffDta["text_1594036165685"] + "," + "Slot " + j;
                //                        requestCreateEvent.seperatedColorValues = staffDta["text_1598596816783"]?.ToString() + ",#2ecc71";
                //                        requestCreateEvent.topicId = 3906919;
                //                        requestCreateEvent.created_by = (int)FormSetting.CreatedUser;
                //                        requestCreateEvent.updated_by = (int)FormSetting.CreatedUser;
                //                        formGroupKey = Guid.NewGuid().ToString();
                //                        requestCreateEvent.formGroupKey = formGroupKey;
                //                        var eventDataEvent = new { Id = 0, title = "", start = eventData.start, end = eventData.end, color = "#2ecc71", allDay = false, service = "", description = "", resources = requestData["STAFF"].ToString(), resourcesTitle = staffDta["text_1594036165685"].ToString(), activities = responseActivity.Id.ToString(), parentID = 0, formGroupKey = formGroupKey };
                //                        requestCreateEvent.formfieldDataListTemp = CustomMethods.ConvertToNameValuePair(eventDataEvent);

                //                        GenerateDynamicFormData eventResponse = await patientRegistration.GeneratedFormData(requestCreateEvent);

                        //var responseActivity = await businessUserService.AddCalendarEventSlot(eventData, formGroupKey);

                //                    }
                //                    else
                //                    {
                //                        TempData["TmpMsg"] = "Some Teachnical issue!!";
                //                        break;
                //                    }
                //                    i = i + new TimeSpan(0, duration, 0);
                //                    j++;
                //                }
                //            }
                //        }
                //        else
                //        {
                //            TempData["TmpMsg"] = "Some Teachnical issue!!";
                //        }
                //    }
                //    else
                //    {
                //        TempData["TmpMsg"] = responseSchedular.Message;
                //    }

                //    return RedirectToAction("CourseSchedular");
                //}
            }
            catch (Exception ex)
            {
                TempData["TmpMsg"] = ex.Message;

            }


            //FormTable request = new FormTable()
            //{
            //    action = 7,
            //    created_by = (int)FormSetting.CreatedUser,
            //    formId = (int)FormSetting.CourseSchedular,
            //    updated_by = (int)FormSetting.CreatedUser,
            //    userId = (int)FormSetting.CreatedUser
            //};

            //var responseTemp = await patientRegistration.ManageForm(request);
            //if (responseTemp.Status)
            //{
            //    var resTemplate = responseTemp.Data.FirstOrDefault().formContentHTMLTemp;
            //    ViewBag.template = resTemplate;
            //}


            return View();
        }

    }
}