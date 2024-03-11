using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Barrway.Controllers
{
    //[Authorize]
    public class FormAPIController : BaseController
    {
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ICalendarService calendarService;
        private readonly IPublicUserService publicUserService;
        private readonly IBusinessUserService businessUserService;

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository, ICalendarService calendarService, IPublicUserService publicUserService, IBusinessUserService businessUserService)
        {
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
            this.publicUserService = publicUserService;
            this.businessUserService = businessUserService;
        }

        [HttpPost]
        public async Task<ActionResult> ManageLanguages(Languages data)
        {
            return Json((await formAPIRepository.ManageLanguages(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> ManageForm(FormTable data)
        {
            var result = (await formAPIRepository.ManageForm(data)).Data;
            if (data.formId == (int)FormSetting.CALENDAR_FORM && data.action == (int)FormAction.ManageForm)
            {
                if (result != null && result.Count() > 0)
                {
                    result.ForEach(x =>
                    {
                        if (x.FormDataToOneListDynamic != null && x.FormDataToOneListDynamic.Count() > 0)
                        {
                            x.FormDataToOneListDynamic.ForEach(e =>
                            {
                                if (e.ContainsKey("start") && e["start"] != null)
                                {
                                    e["start"] = Convert.ToDateTime(e["start"]).ToString("yyyy-MM-ddTHH:mm:ss");
                                }
                                if (e.ContainsKey("end") && e["end"] != null)
                                {
                                    e["end"] = Convert.ToDateTime(e["end"]).ToString("yyyy-MM-ddTHH:mm:ss");
                                }
                            });
                        }
                    });
                }
            }

            return Json(result);
        }
        [HttpPost]
        public async Task<ActionResult> ManageFormApp(FormTable data)
        {
            return Json((await formAPIRepository.ManageFormApp(data)).Data);
        }
        [HttpPost]
        public async Task<ActionResult> EditEventData(Form_DataTable data)
        {
            return Json((await formAPIRepository.EditEventData(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> GetFormList(FormListDataView data)
        {
            return Json((await formAPIRepository.GetFormList(data)));
        }

        [HttpGet]
        public async Task<ActionResult> getReferralFormFieldsAndDataGET(int actionid, string formID, string formGroupKey)
        {
            return Json(await formAPIRepository.getReferralFormFieldsAndDataGET(actionid, formID, formGroupKey), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> ManageFormRoles(Form_Roles data)
        {
            return Json((await formAPIRepository.ManageFormRoles(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> getEventDetails(FormCalenderReferrenceTable data)
        {
            return Json((await formAPIRepository.getEventDetails(data)));
        }
        [HttpPost]
        public async Task<ActionResult> GetFormRecordList(GenerateDynamicFormData data)
        {
            if (User.Identity != null) {
                var role = UserIdentity.Role;

                if (role == "PUBLIC_USER" && (data.formId == (int)FormSetting.PAYMENT_HISTORY_MASTER || data.formId == (int)FormSetting.LEDGER_MASTER))
                {
                    data.CustomFilters.Clear();
                    data.CustomFilters.Add(new CustomFilter() { FieldName = "USER_ID", Value = User.Identity.Name });
                }

                if (role == "SUPERADMIN_USER")
                {
                    data.IsCustomFilter = false;
                    data.CustomFilters.Clear();

                    if (data.formId == (int)FormSetting.USER_MASTER)
                    {
                        data.IsCustomFilter = true;
                        data.CustomFilters.Add(new CustomFilter() { FieldName = "ROLE_ID", Value = "3" });
                    }

                }
            }

            var result = (await formAPIRepository.GetFormRecordList(data)).Data;
            if (data.formId == (int)FormSetting.CALENDAR_FORM)
            {
                if (result.data != null && result.data.Count() > 0)
                {
                    result.data.ForEach(e =>
                    {
                        if (e.ContainsKey("start") && e["start"] != null)
                        {
                            e["start"] = Convert.ToDateTime(e["start"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("end") && e["end"] != null)
                        {
                            e["end"] = Convert.ToDateTime(e["end"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                    });
                }
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> GeneratedFormData(Form_DataTable data)
        {
            // Validation Check for Session Count
            if (data.formId == (int)FormSetting.CALENDAR_FORM)
            {
                try
                {
                    var deserData = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data.formfieldDataListTemp);
                    if (deserData.Any(x => x["name"]?.ToString() == "COMPANY_CODE"))
                    {
                        string companyCode = deserData.FirstOrDefault(x => x["name"]?.ToString() == "COMPANY_CODE")["value"]?.ToString();
                        string calendarCode = deserData.FirstOrDefault(x => x["name"]?.ToString() == "CALENDAR_CODE")["value"]?.ToString();

                        var checkResult = await businessUserService.GetSessionsForThisMonth(companyCode, calendarCode);

                        if (checkResult.Status)
                        {
                            DateTime PackageValidity = Convert.ToDateTime(checkResult.Data["VALID_TILL"]?.ToString());

                            if (PackageValidity < Convert.ToDateTime(deserData.FirstOrDefault(x => x["name"]?.ToString() == "start")["value"]?.ToString()))
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "Can not create event after the package expiry date." });
                            }

                            if (Convert.ToInt32(checkResult.Data["ASSIGNED_SESSIONS"]?.ToString()) == 0)
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "You have reached the maximum limit of creating Session for this month. Upgrade your Plan to create Sessions." });
                            }

                            var package = await businessUserService.GetCompanyActiveSubscriptionDetails(companyCode, true);

                            var companyIdDic = new Dictionary<string, object>();

                            companyIdDic.Add("name", "COMPANY_SUBSCRIPTION_ID");
                            companyIdDic.Add("value", package.Data["SUBS_ID"]?.ToString());

                            deserData.Add(companyIdDic);
                            data.formfieldDataListTemp = JsonConvert.SerializeObject(deserData);
                        }
                        else
                        {
                            return Json(checkResult);
                        }
                    }
                    else
                    {
                        return Json(new AddUpdateDelete() { Status = false, Message = "Event not created." });
                    }


                }
                catch (Exception ex)
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Event not created." });
                }
            }

            return Json((await formAPIRepository.GeneratedFormData(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> manageTabulatorConfig(TabulatorConfigurationsDTO data)
        {
            return Json((await formAPIRepository.manageTabulatorConfig(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> getCalenderSettingsFormData(calenderSettingsFormDetails data)
        {
            var result = await formAPIRepository.getCalenderSettingsFormData(data);
            if (data.IsPublicUser)
            {
                // filter the data of resources
                bool flag = true;
                var resourceDataCheck = result.FirstOrDefault(x => x.resourceForm != 0 & x.IsDefault == true);
                if (resourceDataCheck == null)
                {
                    flag = false;
                }

                if (flag)
                {
                    var resourceData = resourceDataCheck.formDataList;
                    List<IDictionary<string, object>> tempResults = new List<IDictionary<string, object>>();
                    try
                    {
                        var enrolledData = await publicUserService.GetAllEnrolledCompaniesData(UserIdentity.UserEmail, false);
                        for (int i = 0; i < resourceData.Count; i++)
                        {
                            for (int j = 0; j < enrolledData.Data.Count; j++)
                            {
                                if (resourceData[i]["id"].ToString() == enrolledData.Data[j]["RESOURCE"].ToString())
                                {
                                    bool insertFlag = true;

                                    if (tempResults.FirstOrDefault(x => x.Values.Contains(resourceData[i]["id"].ToString())) != null)
                                    {
                                        insertFlag = false;
                                    }

                                    if (insertFlag)
                                    {
                                        tempResults.Add(resourceData[i]);
                                    }

                                }
                            }

                        }
                    }
                    catch (Exception ex)
                    {

                    }

                    result.FirstOrDefault(x => x.resourceForm != 0 & x.IsDefault == true).formDataList = tempResults;
                }
            }

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> getAxisColumns(calenderSettingsFormDetails data)
        {
            return Json((await formAPIRepository.getAxisColumns(data)));
        }

        [HttpPost]
        public async Task<ActionResult> getReferralFormFields(Form_DataTable data)
        {
            if (!string.IsNullOrEmpty(data?.COMPANY_CODE) || !string.IsNullOrEmpty(data?.CALENDAR_CODE))
            {

                if (data.filter != null)
                {
                    if (data.IsPublicUser)
                    {
                        if (data.IsCustomInFilter)
                        {
                            data.filter.value = data.filter.value + " and F.COMPANY_CODE in (" + data.COMPANY_CODE + ")";
                        }
                        else
                        {
                            data.filter.value = data.filter.value + " and F.COMPANY_CODE=N'" + data.COMPANY_CODE + "'";
                        }
                    }
                    else
                    {
                        data.filter.value = data.filter.value + " and F.COMPANY_CODE=N'" + data.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + data.CALENDAR_CODE + "'";
                    }

                }
            }
            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

            ReferalFormDataResponseModel finalResult = new ReferalFormDataResponseModel();

            if (data.IsPublicUser)
            {
                var enrolledData = await publicUserService.GetAllEnrolledCalendarsData(data.COMPANY_CODE, UserIdentity.UserEmail, "", data.IsCustomInFilter);

                if (enrolledData.Status)
                {
                    finalResult.activityDetails = new List<DynamicDropdownNew>();
                    finalResult.resourceDetails = new List<DynamicDropdownNew>();
                    finalResult.events = new List<IDictionary<string, object>>();
                    finalResult.activityEvents = new List<IDictionary<string, object>>();

                    for (int i = 0; i < enrolledData.Data.Count; i++)
                    {
                        try
                        {
                            // filter activity Details
                            for (int j = 0; j < result.activityDetails.Count; j++)
                            {
                                if (!string.IsNullOrEmpty(result.activityDetails[j].title))
                                {
                                    if ((enrolledData.Data[i]["customForms"]).Contains(result.activityDetails[j].title))
                                    {
                                        finalResult.activityDetails.Add(result.activityDetails[j]);
                                    }
                                }

                            }
                        }
                        catch (Exception ex)
                        {

                        }



                        // filter events
                        try
                        {
                            for (int j = 0; j < result.events.Count; j++)
                            {
                                if (enrolledData.Data[i]["Id"].ToString() == result.events[j]["Id"].ToString())
                                {
                                    finalResult.events.Add(result.events[j]);
                                }
                            }

                            // filter activity events
                            for (int j = 0; j < result.activityEvents.Count; j++)
                            {
                                if (enrolledData.Data[i]["Id"].ToString() == result.activityEvents[j]["Id"].ToString())
                                {
                                    finalResult.activityEvents.Add(result.activityEvents[j]);
                                }
                            }

                            // filter resource details
                            for (int j = 0; j < result.resourceDetails.Count; j++)
                            {
                                if (!string.IsNullOrEmpty(result.resourceDetails[j].title))
                                {
                                    if ((enrolledData.Data[i]["customForms"]).Contains(result.resourceDetails[j].title))
                                    {
                                        finalResult.resourceDetails.Add(result.resourceDetails[j]);
                                    }
                                }
                            }

                        }
                        catch (Exception ex)
                        {

                        }

                    }

                    result = finalResult;

                }

            }


            if (result != null)
            {
                if (result.events != null && result.events.Count() > 0)
                {
                    result.events.ForEach(e =>
                    {
                        if (e.ContainsKey("start") && e["start"] != null)
                        {
                            e["start"] = Convert.ToDateTime(e["start"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("end") && e["end"] != null)
                        {
                            e["end"] = Convert.ToDateTime(e["end"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("title") && e["title"] != null)
                        {
                            e["title"] = "";
                        }
                    });
                }
            }
            if (!data.IsPublicUser)
            {
                var calendarDetailsResult = await businessUserService.GetCalendarDetails(data.CALENDAR_CODE);
                if (calendarDetailsResult.Status)
                {
                    var calendarDetails = calendarDetailsResult.Data as IDictionary<string, object>;
                    if (calendarDetails.ContainsKey("category") && calendarDetails["category"] != null)
                    {
                        var calendarCategory = calendarDetails["category"] as IDictionary<string, object>;
                        if (calendarCategory.ContainsKey("IS_SERVICE_TYPE"))
                        {
                            string is_service_type = calendarCategory["IS_SERVICE_TYPE"]?.ToString() ?? "";
                            if (is_service_type != "N")
                            {
                                if (result != null && result.events != null)
                                {
                                    result.events = result.events.Where(x => x.ContainsKey("EVENT_TYPE") && x["EVENT_TYPE"]?.ToString() != "BOOKING").ToList();
                                }
                            }
                        }
                    }
                }
            }

            return Json(result.ToDictionary(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> getReferralFormFieldsService(Form_DataTable data)
        {
            if (!string.IsNullOrEmpty(data?.COMPANY_CODE) || !string.IsNullOrEmpty(data?.CALENDAR_CODE))
            {

                if (data.filter != null)
                {
                    data.filter.value = data.filter.value + " and F.COMPANY_CODE=N'" + data.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + data.CALENDAR_CODE + "'";
                }
            }
            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

            List<IDictionary<string, object>> eventsData = new List<IDictionary<string, object>>();

            if (result != null && result.events != null && result.events.Count > 0)
            {
                var markSchedule = result.events.Where(x => x["EVENT_TYPE"]?.ToString() == "SCHEDULE").ToList();

                markSchedule.ForEach(x => x.Add("rendering", "background"));


                var availableSchedule = new List<IDictionary<string, object>>();
                var availableSlots = new List<IDictionary<string, DateTime>>();
                var UnavailableSlots = new List<IDictionary<string, DateTime>>();

                markSchedule.GroupBy(x => new { start = x["start"].ToString(), end = x["end"].ToString() }).ToList().ForEach(x =>
                {
                    var slot = new Dictionary<string, DateTime>();
                    slot.Add("start", Convert.ToDateTime(x.Key.start));
                    slot.Add("end", Convert.ToDateTime(x.Key.end));
                    availableSlots.Add(slot);
                    availableSchedule.AddRange(x.ToList());
                });

                availableSlots = availableSlots.OrderBy(x => x["start"]).ToList();

                DateTime start = Convert.ToDateTime(data.startDate);
                DateTime end = Convert.ToDateTime(data.endDate);

                foreach (var item in availableSlots)
                {
                    if (item["start"] > start)
                    {
                        var slot = new Dictionary<string, DateTime>();
                        slot.Add("start", start);
                        slot.Add("end", item["start"]);
                        UnavailableSlots.Add(slot);
                        start = item["end"];
                    }
                    else
                    {
                        start = item["end"];
                    }
                }

                var defaultslot = new Dictionary<string, DateTime>();
                defaultslot.Add("start", start);
                defaultslot.Add("end", end);
                UnavailableSlots.Add(defaultslot);

                var UnavailableEvents = UnavailableSlots.Select(x => new { id = 0, start = x["start"], end = x["end"], title = "", rendering = "background", color = "#ddd", customForms = ((int)FormSetting.LOCATION_MASTER).ToString(), customTitle = "Barrway", customFormIds = "1" }.ToDictionary()).ToList();
                eventsData.AddRange(UnavailableEvents);

                eventsData.AddRange(availableSchedule);

                var otherevents = result.events.Where(x => x.ContainsKey("EVENT_TYPE") && x["EVENT_TYPE"]?.ToString() != "SCHEDULE").ToList();
                eventsData.AddRange(otherevents);
                result.events = eventsData;
            }
            else
            {
                eventsData = new List<IDictionary<string, object>>();
                var UnavailableSlots = new List<IDictionary<string, DateTime>>();
                DateTime start = Convert.ToDateTime(data.startDate);
                DateTime end = Convert.ToDateTime(data.endDate);
                var defaultslot = new Dictionary<string, DateTime>();
                defaultslot.Add("start", start);
                defaultslot.Add("end", end);
                UnavailableSlots.Add(defaultslot);
                var UnavailableEvents = UnavailableSlots.Select(x => new { id = 0, start = x["start"], end = x["end"], title = "", rendering = "background", color = "#ddd", customForms = ((int)FormSetting.LOCATION_MASTER).ToString(), customTitle = "Barrway", customFormIds = "1" }.ToDictionary()).ToList();
                eventsData.AddRange(UnavailableEvents);
                result.events = eventsData;
            }

            if (result != null)
            {
                if (result.events != null && result.events.Count() > 0)
                {
                    result.events.ForEach(e =>
                    {
                        if (e.ContainsKey("start") && e["start"] != null)
                        {
                            e["start"] = Convert.ToDateTime(e["start"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("end") && e["end"] != null)
                        {
                            e["end"] = Convert.ToDateTime(e["end"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("title") && e["title"] != null)
                        {
                            e["title"] = "";
                        }
                    });
                }
            }

            if (result.events != null && result.events.Count() > 0)
            {

                var ids = string.Join(",", result.events.Where(x => x.ContainsKey("Id") && x["Id"] != null && x["Id"].ToString() != "0").Select(x => x["Id"].ToString()).ToList());
                if (!string.IsNullOrEmpty(ids))
                {
                    var getallTransactionUser = await calendarService.GetPublicUserTransactionEvent(ids);
                    if (getallTransactionUser.Data != null && getallTransactionUser.Data.Count() > 0)
                    {
                        result.events.ForEach(e =>
                        {
                            var usertrnsactionData = getallTransactionUser.Data;
                            if (e.ContainsKey("Id") && e["Id"] != null && e["Id"].ToString() != "0")
                            {
                                if (usertrnsactionData.Any(x => Convert.ToInt32(x["EventId"]) == Convert.ToInt32(e["Id"]) && x["EMAIL"] != null && x["EMAIL"].ToString() == UserIdentity.UserEmail))
                                {
                                    e["IS_PUBLIC_USER_EVENT"] = true;
                                }
                            }
                        });
                    }
                }




            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> ManageCalenderReferrenceNew(FormCalenderReferrenceTable data)
        {
            var result = await formAPIRepository.ManageCalenderReferrenceNew(data);
            if (result != null && result.Any(x => x.res == 1))
            {
                await calendarService.UpdateCalendarReference(data);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> getReferralFormFieldsAndData(Form_DataTable data)
        {
            return Json(await formAPIRepository.getReferralFormFieldsAndData(data));
        }

        [HttpGet]
        public async Task<ActionResult> getJSONjsTree(int root, string title, string formId, string resourceActivityForm, string previousSelection, string selectedRoot, string query, string id, string companyCode, string calendarCode)
        {
            return Json((await formAPIRepository.getJSONjsTree(root, title, formId, resourceActivityForm, previousSelection, selectedRoot, query, id, companyCode, calendarCode)), JsonRequestBehavior.AllowGet);
        }





        private static bool IsJson(string str)
        {
            try
            {
                JsonDocument.Parse(str);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}