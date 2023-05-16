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

                var data2 = JsonSerializer.Deserialize<IDictionary<string, object>>(requestData["SCH_SCHEDULE_TABLE"].ToString());

                // check the table data and entry to be done

                Form_DataTable requestSave = new Form_DataTable();


                requestSave.action = (int)FormAction.Save;
                requestSave.userId = (int)FormSetting.CreatedUser;
                requestSave.created_by = (int)FormSetting.CreatedUser;
                requestSave.updated_by = (int)FormSetting.CreatedUser;
                requestSave.created_at = DateTime.Now.ToString();
                requestSave.updated_at = DateTime.Now.ToString();
                requestSave.formId = (int)FormSetting.SCHEDULAR_FORM;
                string formGroupKey = Guid.NewGuid().ToString();
                requestSave.formGroupKey = formGroupKey;
                requestSave.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(requestData);

                //GenerateDynamicFormData response = await patientRegistration.GeneratedFormData(requestSave);

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

                //                    GenerateDynamicFormData responseActivity = await patientRegistration.GeneratedFormData(requestSave);
                //                    //#2ecc71


                //                    if (responseActivity.res == 1)
                //                    {
                //                        Form_DataTable requestCreateEvent = new Form_DataTable();

                //                        requestCreateEvent.action = (int)FormAction.Save;
                //                        requestCreateEvent.userId = (int)FormSetting.CreatedUser;
                //                        requestCreateEvent.formId = (int)FormSetting.CalendarForm;
                //                        requestCreateEvent.resourceFormId = (int)FormSetting.StaffMasterForm;
                //                        requestCreateEvent.ActivityFormId = (int)FormSetting.ActivityForm;
                //                        requestCreateEvent.parentID = 0;
                //                        requestCreateEvent.isDyEvent = true;
                //                        requestCreateEvent.isEventUpdatable = false;

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

                //                        if (eventResponse.res == 1)
                //                        {
                //                            FormCalenderReferrenceTable request2 = new FormCalenderReferrenceTable()
                //                            {
                //                                action = 10,
                //                                formId = (int)FormSetting.CalendarForm,
                //                                created_by = (int)FormSetting.CreatedUser,
                //                                updated_by = (int)FormSetting.CreatedUser,
                //                                formGroupKey = formGroupKey,
                //                                resourceFormId = (int)FormSetting.StaffMasterForm,
                //                                activityFormId = (int)FormSetting.ActivityForm,
                //                                resourceId = requestData["STAFF"].ToString(),
                //                                activityId = responseActivity.Id.ToString()
                //                            };
                //                            await patientRegistration.ManageFormCalenderReferrenceResp(request2);
                //                        }

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