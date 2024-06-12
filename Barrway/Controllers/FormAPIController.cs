using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;
using Barrway.Resources;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using ClosedXML.Excel;
using FormGeneratorDTOs.DTOs;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NLog;
using RestSharp;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
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
        private readonly IMasterService masterService;
        private readonly ISqlFunction sqlFunction;
        private readonly ICommonService commonService;
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository, ICalendarService calendarService, IPublicUserService publicUserService, 
            IBusinessUserService businessUserService, IMasterService masterService, ISqlFunction sqlFunction,ICommonService commonService)
        {
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
            this.publicUserService = publicUserService;
            this.businessUserService = businessUserService;
            this.masterService = masterService;
            this.sqlFunction = sqlFunction;
            this.commonService = commonService;
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

            if (User.Identity != null)
            {
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

                if (data.formId == 2326)
                {
                    data.CustomFilters.FirstOrDefault(x => x.FieldName == "USER_ID").Value = UserIdentity.UserName;
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

                    if (data.IsMarketplaceRequest)
                    {
                        var alreadyEnrolledEvents = (await publicUserService.GetAlreadyEnrolledEvents(data.COMPANY_CODE, UserIdentity.UserEmail, data.filter.value)).Data as List<IDictionary<string, object>>;
                        if (alreadyEnrolledEvents != null)
                        {
                            if (result != null)
                            {
                                foreach (var item in result.data)
                                {
                                    if (alreadyEnrolledEvents.Count > 0)
                                    {
                                        if (alreadyEnrolledEvents.Any(x => x["Id"]?.ToString() == item["Id"]?.ToString()))
                                        {
                                            item.Add("IsAlreadyBooked", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsAlreadyBooked"]);
                                            item.Add("OverlapBookingFlag", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["OverlapBookingFlag"]);
                                            item.Add("ATTEND", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["ATTEND"]);
                                            item.Add("IsReviewable", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsReviewable"]);
                                            item.Add("TransactionId", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["TransactionId"]);
                                        }
                                        else
                                        {
                                            item.Add("IsAlreadyBooked", 'N');
                                            item.Add("OverlapBookingFlag", 'Y');
                                            item.Add("IsReviewable", 'N');
                                            item.Add("ATTEND", 'N');
                                            item.Add("TransactionId", '0');
                                        }
                                    }
                                    else
                                    {
                                        item.Add("IsAlreadyBooked", 'N');
                                        item.Add("OverlapBookingFlag", 'Y');
                                        item.Add("IsReviewable", 'N');
                                        item.Add("ATTEND", 'N');
                                        item.Add("TransactionId", '0');
                                    }
                                }
                            }
                            
                        }

                        var calendarDetailsResult = await businessUserService.GetCalendarDetails(data.CALENDAR_CODE);
                        var service = await businessUserService.GetServiceList(data.CALENDAR_CODE, data.COMPANY_CODE);

                        if (calendarDetailsResult.Status)
                        {
                            var calendarDetails = calendarDetailsResult.Data as IDictionary<string, object>;

                            string needOnlinePaymentFlag = "N";

                            if (result.data != null && result.data.Count() > 0)
                            {
                                int days = 0;

                                if (service.Data != null)
                                {
                                    var serviceData = service.Data as List<IDictionary<string, object>>;
                                    if (serviceData.Any(x => x["Id"]?.ToString() == result.data[0]["activities"]?.ToString()))
                                    {
                                        needOnlinePaymentFlag = serviceData.FirstOrDefault(x => x["Id"]?.ToString() == result.data[0]["activities"]?.ToString())["NEED_ONLINE_PAYMENT"]?.ToString();
                                    }
                                }

                                if (!string.IsNullOrEmpty(calendarDetails["BOOKING_DEADLINE"]?.ToString()))
                                {
                                    try
                                    {
                                        days = Convert.ToInt32(calendarDetails["BOOKING_DEADLINE"].ToString());
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                }

                                days = (days == 0) ? 0 : days + 1;

                                foreach (var evt in result.data)
                                {
                                    DateTime deadline = Convert.ToDateTime(evt["start"].ToString());
                                    if (days > 0)
                                    {
                                        deadline = deadline.AddDays((days * -1));
                                        deadline = (new DateTime(deadline.Year, deadline.Month, deadline.Day, 23, 59, 0));
                                    }

                                    evt.Add("NEED_ONLINE_PAYMENT", needOnlinePaymentFlag);
                                    evt.Add("BOOKING_DEADLINE", deadline.ToString("yyyy-MM-dd HH:mm"));
                                }
                            }
                        }
                    }

                    

                        

                }
            }

            if (data.formId == (int)FormSetting.TRANSACTION_MASTER)
            {
                if (result.data != null && result.data.Count() > 0)
                {
                    result.data.ForEach(e =>
                    {
                        if (e.ContainsKey("SLOT") && e["SLOT"] != null)
                        {
                            if (e["SLOT"].ToString().Contains("#"))
                            {
                                try
                                {
                                    var slots = e["SLOT"].ToString().Split('#');
                                    if (slots.Count() >= 3)
                                    {
                                        e["SLOT"] = Convert.ToDateTime(slots[0]).ToString("dd MMMM yyyy (hh:mm tt)") + " - " + Convert.ToDateTime(slots[2]).ToString("dd MMMM yyyy (hh:mm tt)");
                                    }
                                }
                                catch (Exception)
                                {

                                }

                            }
                        }

                    });
                }
            }

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> GetAdditionalFormRecordList(GenerateDynamicFormData data)
        {
            var result = await publicUserService.GetAddtionalFormRecordsList(data);

            var result_list = result;
            double last_page = 0;
            if (result_list != null && result_list.Count() > 0)
            {
                var singData = result_list.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }
            return Json(new { data = result_list, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GeneratedFormData(Form_DataTable data)
        {
            // Validation Check for Session Count
            string IsCourseEvent = "N";
            string serviceId = "";
            string resourceId = "";

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

                            if (Convert.ToInt32(checkResult.Data["AVAILABLE_SESSIONS"]?.ToString()) == 0)
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "You have reached the maximum limit of creating Session for this month. Upgrade your Plan to create Sessions." });
                            }

                            var package = await businessUserService.GetCompanyActiveSubscriptionDetails(companyCode, true);

                            if (data.action == 1)
                            {
                                serviceId = deserData.Any(x => x["name"]?.ToString() == "activities") ? deserData.FirstOrDefault(x => x["name"]?.ToString() == "activities")["value"]?.ToString() : "";
                                resourceId = deserData.Any(x => x["name"]?.ToString() == "resources") ? deserData.FirstOrDefault(x => x["name"]?.ToString() == "resources")["value"]?.ToString() : "";
                            }
                            if (data.action == 2)
                            {
                                serviceId = deserData.Any(x => x["name"]?.ToString() == "activities_" + (int)FormSetting.SERVICE_MASTER) ? deserData.FirstOrDefault(x => x["name"]?.ToString() == "activities_" + (int)FormSetting.SERVICE_MASTER)["value"]?.ToString() : "";
                                resourceId = deserData.Any(x => x["name"]?.ToString() == "resources_" + (int)FormSetting.LOCATION_MASTER) ? deserData.FirstOrDefault(x => x["name"]?.ToString() == "resources_" + (int)FormSetting.LOCATION_MASTER)["value"]?.ToString() : "";
                            }
                            if (!string.IsNullOrEmpty(serviceId) && serviceId != "-1")
                            {
                                List<IDictionary<string, object>> serviceList = (await businessUserService.GetServiceList(calendarCode, companyCode)).Data;

                                var serviceData = serviceList.FirstOrDefault(x => x["Id"]?.ToString() == serviceId);

                                var companyIdDic2 = new Dictionary<string, object>();

                                companyIdDic2.Add("name", "IS_COURSE_EVENT");
                                companyIdDic2.Add("value", ((!string.IsNullOrEmpty(serviceData["SERVICE_PAY_PER"]?.ToString()) && serviceData["SERVICE_PAY_PER"]?.ToString() == "COURSE") ? "Y" : "N"));
                                if (deserData.Any(x => x["name"]?.ToString() == "IS_COURSE_EVENT"))
                                {
                                    int index = deserData.FindIndex(x => x["name"]?.ToString() == "IS_COURSE_EVENT");
                                    deserData[index] = companyIdDic2;
                                }
                                else
                                {
                                    deserData.Add(companyIdDic2);
                                }

                                IsCourseEvent = serviceData["SERVICE_PAY_PER"]?.ToString();
                            }
                            else
                            {
                                var companyIdDic2 = new Dictionary<string, object>();

                                companyIdDic2.Add("name", "IS_COURSE_EVENT");
                                companyIdDic2.Add("value", "N");
                                if (deserData.Any(x => x["name"]?.ToString() == "IS_COURSE_EVENT"))
                                {
                                    int index = deserData.FindIndex(x => x["name"]?.ToString() == "IS_COURSE_EVENT");
                                    deserData[index] = companyIdDic2;
                                }
                                else
                                {
                                    deserData.Add(companyIdDic2);
                                }
                                IsCourseEvent = "N";
                            }

                            var companyIdDic = new Dictionary<string, object>();

                            companyIdDic.Add("name", "COMPANY_SUBSCRIPTION_ID");
                            companyIdDic.Add("value", package.Data["SUBS_ID"]?.ToString());
                            if (deserData.Any(x => x["name"]?.ToString() == "COMPANY_SUBSCRIPTION_ID"))
                            {
                                int index = deserData.FindIndex(x => x["name"]?.ToString() == "COMPANY_SUBSCRIPTION_ID");
                                deserData[index] = companyIdDic;
                            }
                            else
                            {
                                deserData.Add(companyIdDic);
                            }
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

            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (IsCourseEvent == "COURSE" && data.action == 1)
            {
                try
                {
                    // Enroll already enrolled students to newly created single session
                    string query = $@"
                    declare @SlotId int = (select top 1 cf.Id from CALENDAR_FORM_1935 cf
                    join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                    where cf.IS_COURSE_EVENT = 'Y' and activities = '{serviceId}'
                    order by cf.created_at desc);

                    if (@SlotId is not null and @SlotId != '')
                    begin
                        INSERT INTO [dbo].[TRANSACTION_MASTER_1942]
                                   ([formGroupKey]
                                   ,[formID]
                                   ,[userID]
                                   ,[Current_Status]
                                   ,[cycle]
                                   ,[MasterFormID]
                                   ,[MasterFormRow]
                                   ,[formRecordOrder]
                                   ,[formRecordStatus]
                                   ,[ApprovalStatus]
                                   ,[text_1683717657815]
                                   ,[created_at]
                                   ,[updated_at]
                                   ,[created_by]
                                   ,[updated_by]
                                   ,[SLOT]
                                   ,[RESOURCE]
                                   ,[ACTIVITY]
                                   ,[STUDENT]
                                   ,[REMARKS]
                                   ,[FEES]
                                   ,[FEES_1]
                                   ,[FEES_2]
                                   ,[FEES_LIST]
                                   ,[ATTENDANCE]
                                   ,[hidden_1683717028956]
                                   ,[COMPANY_CODE]
                                   ,[CALENDAR_CODE]
                                   ,[resForm_2304]
                                   ,[actFormID]
                                   ,[parentID]
                                   ,[seperatedFormIDs]
                                   ,[seperatedTitles]
                                   ,[seperatedIds]
                                   ,[seperatedResFormIDs]
                                   ,[seperatedResEntryIDs]
                                   ,[seperatedResColValues]
                                   ,[seperatedColorValues]
                                   ,[USERTOKEN]
                                   ,[ATTACHMENT_FROM_PARTICIPANTS]
                                   ,[COMMENTS_FROM_PARTICIPANT]
                                   ,[ATTACHMENT_FROM_STAFF]
                                   ,[COMMENTS_FROM_STAFF]
                                   ,[transaction_fees]
                                   ,[ASSESSMENT_FILES]
                                   ,[ASSESSMENT_FILES_LIST])
                             select (select top 1 formGroupKey from CALENDAR_FORM_1935 where Id = '{result.Id}')
                              ,[formID]
                              ,[userID]
                              ,[Current_Status]
                              ,[cycle]
                              ,[MasterFormID]
                              ,[MasterFormRow]
                              ,[formRecordOrder]
                              ,[formRecordStatus]
                              ,[ApprovalStatus]
                              ,[text_1683717657815]
                              ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                              ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                              ,[created_by]
                              ,[updated_by]
                              ,'{result.Id}'
                              ,'{resourceId}'
                              ,[ACTIVITY]
                              ,[STUDENT]
                              ,[REMARKS]
                              ,[FEES]
                              ,[FEES_1]
                              ,[FEES_2]
                              ,[FEES_LIST]
                              ,'NOT-MARKED'
                              ,[hidden_1683717028956]
                              ,[COMPANY_CODE]
                              ,[CALENDAR_CODE]
                              ,[resForm_2304]
                              ,[actFormID]
                              ,[parentID]
                              ,[seperatedFormIDs]
                              ,[seperatedTitles]
                              ,[seperatedIds]
                              ,[seperatedResFormIDs]
                              ,[seperatedResEntryIDs]
                              ,[seperatedResColValues]
                              ,[seperatedColorValues]
                              ,[USERTOKEN]
                              ,[ATTACHMENT_FROM_PARTICIPANTS]
                              ,[COMMENTS_FROM_PARTICIPANT]
                              ,[ATTACHMENT_FROM_STAFF]
                              ,[COMMENTS_FROM_STAFF]
                              ,[transaction_fees]
                              ,[ASSESSMENT_FILES]
                              ,[ASSESSMENT_FILES_LIST]
                          FROM [dbo].[TRANSACTION_MASTER_1942] t where t.ACTIVITY = '{serviceId}' and t.SLOT = @SlotId;
                    end";

                    var result2 = await sqlFunction.ExecuteSqlCommandQuery(query);
                }
                catch (Exception ex)
                {

                }


            }

            return Json(result);
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
                        data.filter.value = " F.COMPANY_CODE=N'" + data.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + data.CALENDAR_CODE + "' and " + data.filter.value;
                    }

                }
            }
            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);
            await commonService.ModifyEventsData(data, result,UserIdentity.UserEmail);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> getReferralFormFieldsListView(Form_DataTable data)
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

                if (data.IsListView)
                {
                    // filter out available slots

                    var resourceData = await masterService.GetLocationMasterList(new GenerateDynamicFormData() { action = 1, size = 50, filters = new List<FilterDTO> { new FilterDTO() { type = "=", field = "CALENDAR_CODE", value = data.CALENDAR_CODE } } }, data.COMPANY_CODE, data.CALENDAR_CODE);

                    var resourceList = resourceData.Data as List<IDictionary<string, object>>;

                    if (data.resourceId > 0)
                    {
                        resourceList = resourceList.Where(x => x["Id"]?.ToString() == data.resourceId.ToString()).ToList();
                    }

                    List<IDictionary<string, object>> Temp = new List<IDictionary<string, object>>();

                    foreach (var resource in resourceList)
                    {
                        DateTime startDate = (Convert.ToDateTime(data.startDate).Year > DateTimeUtility.Now().Year) ? Convert.ToDateTime(data.startDate) : DateTimeUtility.Now();
                        DateTime endDate = Convert.ToDateTime(data.endDate).AddDays(-1);

                        var events = result.events.Where(x => x["resources"]?.ToString() == resource["Id"]?.ToString()).ToList();

                        if (events.Count > 0)
                        {
                            events = events.OrderBy(x => Convert.ToDateTime(x["start"])).ToList();

                            List<(DateTime, DateTime)> ps = new List<(DateTime, DateTime)>();

                            events.ForEach(x =>
                            {
                                ps.Add((Convert.ToDateTime(x["start"]), Convert.ToDateTime(x["end"])));
                            });

                        }

                        DateTime rangeStart = startDate;
                        foreach (var ev in events)
                        {
                            DateTime start = Convert.ToDateTime(ev["start"]);
                            DateTime end = Convert.ToDateTime(ev["end"]);
                            if (rangeStart < start)
                            {
                                BarrwayCalendarFormFields model = new BarrwayCalendarFormFields();
                                model.resources = resource["Id"]?.ToString();
                                model.resourceId = resource["Id"]?.ToString();
                                model.start = rangeStart.ToString("yyyy-MM-ddT00:00:00");
                                model.end = start.AddDays(-2).ToString("yyyy-MM-ddT21:00:00");
                                model.title = resource["LOCATION_ADDRESS"]?.ToString();
                                model.CALENDAR_CODE = data.CALENDAR_CODE;
                                model.COMPANY_CODE = data.COMPANY_CODE;
                                Temp.Add(JsonConvert.DeserializeObject<IDictionary<string, object>>(JsonConvert.SerializeObject(model)));
                            }
                            rangeStart = end.AddDays(1);
                        }

                        if (rangeStart <= endDate)
                        {
                            BarrwayCalendarFormFields model = new BarrwayCalendarFormFields();
                            model.resources = resource["Id"]?.ToString();
                            model.resourceId = resource["Id"]?.ToString();
                            model.start = rangeStart.ToString("yyyy-MM-ddT00:00:00");
                            model.end = endDate.AddDays(-1).ToString("yyyy-MM-ddT21:00:00");
                            model.title = resource["LOCATION_ADDRESS"]?.ToString();
                            model.CALENDAR_CODE = data.CALENDAR_CODE;
                            model.COMPANY_CODE = data.COMPANY_CODE;
                            model.IsLastEvent = true;
                            Temp.Add(JsonConvert.DeserializeObject<IDictionary<string, object>>(JsonConvert.SerializeObject(model)));
                        }

                    }

                    result.events = Temp;
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
                if (data.resourceId != 0)
                {

                    List<IDictionary<string, object>> _events = new List<IDictionary<string, object>>();
                    result.events.ForEach(x =>
                    {
                        string resourceFormId = data.resourceFormId.ToString();
                        if (x.ContainsKey("customForms") && x.ContainsKey("customFormIds") && !string.IsNullOrEmpty(x["customFormIds"]?.ToString()) && !string.IsNullOrEmpty(x["customForms"]?.ToString())
                        && x["customForms"].ToString().Split(',').Contains(resourceFormId) && x["customFormIds"].ToString().Split(',').Length > 0)
                        {
                            var customFormsSplit = x["customForms"].ToString().Split(',').ToList();
                            var cucustomFormIdsSplit = x["customFormIds"].ToString().Split(',').ToList();
                            int index = customFormsSplit.FindIndex(y => y == resourceFormId);
                            if (index > -1 && cucustomFormIdsSplit.Count() > index)
                            {
                                if (cucustomFormIdsSplit[index] == data.resourceId.ToString())
                                {
                                    _events.Add(x);
                                }
                            }
                        }
                    });

                    result.events = _events;
                    //result.events=result.events.Where(x=>x.ContainsKey("resourceId") && x["resourceId"]!=null && x["resourceId"].ToString()== data.resourceId.ToString()).ToList();
                }
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
            var result = await formAPIRepository.getReferralFormFieldsAndData(data);

            if (result.formDataListNew != null && result.formDataListNew.Count() > 0)
            {

                var allTransaction = await calendarService.GetTransactionAll(data.Id.ToString());
                result.formDataListNew.ForEach(x =>
                {
                    var tran = allTransaction.FirstOrDefault(y => y["Id"].ToString() == x["Id"].ToString());
                    if (x.ContainsKey("STUDENT") && tran != null)
                    {
                        x["STUDENT"] = tran["FIRST_NAME"] + " " + tran["LAST_NAME"] + " <span class='ev-user-id'> (" + tran["USER_ID"] + ")</span>";
                    }
                });
            }

            return Json(result);
        }

        [HttpGet]
        public async Task<ActionResult> getJSONjsTree(int root, string title, string formId, string resourceActivityForm, string previousSelection, string selectedRoot, string query, string id, string companyCode, string calendarCode)
        {
            return Json((await formAPIRepository.getJSONjsTree(root, title, formId, resourceActivityForm, previousSelection, selectedRoot, query, id, companyCode, calendarCode)), JsonRequestBehavior.AllowGet);
        }





        [HttpGet]
        public async Task<ActionResult> DownloadExcel(int formId, string iscustom, string fields, string fieldValues)
        {
            try
            {
                string apiUrl = System.Configuration.ConfigurationManager.AppSettings["webapibaseurl"].ToString() + $"api/FormAPI/downloadFiles/{formId}/4/{iscustom}/{fields}/{fieldValues}"; // Replace with your API URL
                string fileName = formId+$"_downloaded_{DateTime.Now.ToString("ddMMyyyyHHmmssfff")}.xlsx"; // The name for the downloaded file

                // Create a RestClient with the base URL
                var client = new RestClient(apiUrl);

                // Create a RestRequest
                var request = new RestRequest();
                request.Method = Method.Get;
                try
                {
                    // Execute the request and get the response
                    var response = await client.ExecuteAsync(request);

                    // Check if the response is successful and contains data
                    if (response.IsSuccessful && response.RawBytes != null)
                    {
                        // Load the Excel file into a ClosedXML workbook
                        return File(response.RawBytes.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                    }
                    else
                    {
                        // Handle error appropriately (e.g., log the error, return an error view, etc.)
                        return new HttpStatusCodeResult(response.StatusCode, response.ErrorMessage);
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex);
                    // Handle exception (e.g., log the error, return an error view, etc.)
                    return new HttpStatusCodeResult(500, "Internal server error: " + ex.Message);
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex);
                return new HttpStatusCodeResult(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpPost]
        public ActionResult UploadFile(
 string reqType,
 string uid,
 string appId,
 string appTitle,
 string formId,
 string formTitle,
 bool isImportData,
 int userId,
 string actionType,
 List<HttpPostedFileBase> file1)
        {
            if (file1 != null && file1.Count() > 0)
            {
                try
                {

                    foreach (var file in file1)
                    {
                        string fileExtension = Path.GetExtension(file.FileName).ToLower();
                        if (!IsAllowedFileExtension(fileExtension))
                        {
                            return Json(new FileUploadResponse() { success = false, message = "invalid file!" });
                        }
                        if (!IsFileValid(file, out string errorMessage))
                        {
                            return Json(new FileUploadResponse() { success = false, message = errorMessage });
                        }
                    }

                    List<string> filepaths = new List<string>();
                    // Save the file temporarily
                    foreach (var item in file1)
                    {
                        string timestamp = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                        string extension = System.IO.Path.GetExtension(item.FileName);
                        string newFileName = $"{System.IO.Path.GetFileNameWithoutExtension(item.FileName)}_{timestamp}{extension}";
                        var filePath = Path.Combine(Server.MapPath("~/App_Data/TempFileUploads"), newFileName);
                        item.SaveAs(filePath);
                        filepaths.Add(filePath);
                    }


                    // Call the external API using RestSharp
                    var response = ForwardToExternalApi(filepaths, reqType, uid, appId, appTitle, formId, formTitle, isImportData, userId, actionType);

                    // Check the response status and return the appropriate response
                    if (response.success)
                    {
                        return Json(response);
                    }
                    else
                    {
                        return Json(response);
                    }
                }
                catch (Exception ex)
                {
                    return Json(new FileUploadResponse() { success = false, message = ex.Message });
                }
            }
            else
            {
                return Json(new FileUploadResponse() { success = false, message = "No file selected" });
            }
        }

        [HttpPost]
        public ActionResult UploadFileCustom(
string reqType,
string uid,
string appId,
string appTitle,
string formId,
string formTitle,
bool isImportData,
int userId,
string actionType,
List<HttpPostedFileBase> file1)
        {
            if (file1 != null && file1.Count() > 0)
            {
                try
                {

                    foreach (var file in file1)
                    {
                        string fileExtension = Path.GetExtension(file.FileName).ToLower();
                        if (!IsAllowedImageFileExtension(fileExtension))
                        {
                            return Json(new FileUploadResponse() { success = false, message = "file format invalid" });
                        }
                        if (!IsImageFileValid(file, out string errorMessage))
                        {
                            return Json(new FileUploadResponse() { success = false, message = errorMessage });
                        }
                    }

                    List<string> filepaths = new List<string>();
                    // Save the file temporarily
                    foreach (var item in file1)
                    {
                        string timestamp = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                        string extension = System.IO.Path.GetExtension(item.FileName);
                        string newFileName = $"{System.IO.Path.GetFileNameWithoutExtension(item.FileName)}_{timestamp}{extension}";
                        var filePath = Path.Combine(Server.MapPath("~/App_Data/TempFileUploads"), newFileName);
                        item.SaveAs(filePath);
                        filepaths.Add(filePath);
                    }


                    // Call the external API using RestSharp
                    var response = ForwardToExternalApi(filepaths, reqType, uid, appId, appTitle, formId, formTitle, isImportData, userId, actionType);

                    // Check the response status and return the appropriate response
                    if (response.success)
                    {
                        return Json(response);
                    }
                    else
                    {
                        return Json(response);
                    }
                }
                catch (Exception ex)
                {
                    return Json(new FileUploadResponse() { success = false, message = ex.Message });
                }
            }
            else
            {
                return Json(new FileUploadResponse() { success = false, message = "No file selected" });
            }
        }

        private bool IsAllowedFileExtension(string fileExtension)
        {
            // Define the list of allowed file extensions
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
            return allowedExtensions.Contains(fileExtension);
        }
        private bool IsAllowedImageFileExtension(string fileExtension)
        {
            // Define the list of allowed file extensions
            string[] allowedExtensions = { ".jpg", ".jpeg" };
            return allowedExtensions.Contains(fileExtension);
        }
        private bool IsFileValid(HttpPostedFileBase file, out string errorMessage)
        {
            int MaxFileSize = 3 * 1024 * 1024;
            errorMessage = string.Empty;

            if (file == null)
            {
                errorMessage = "No file uploaded.";
                return false;
            }

           
            if (file.ContentLength > MaxFileSize)
            {
                errorMessage = "File size must be less than 3 MB.";
                return false;
            }

            return true;
        }

        private bool IsImageFileValid(HttpPostedFileBase file, out string errorMessage)
        {
            int MaxFileSize = 3 * 1024 * 1024;
            int MinFileSize = 500 * 1024;
            errorMessage = string.Empty;

            if (file == null)
            {
                errorMessage = "No file uploaded.";
                return false;
            }

            if (file.ContentLength < MinFileSize)
            {
                errorMessage = "File size must be greater than 500Kb.";
                return false;
            }
            if (file.ContentLength > MaxFileSize)
            {
                errorMessage = "File size must be less than 3 MB.";
                return false;
            }

            return true;
        }



        static string GetFileExtension(string url)
        {
            // Use Uri class to get the absolute path of the URL
            Uri uri = new Uri(url);
            string path = uri.AbsolutePath;

            // Get the file extension
            return Path.GetExtension(path).ToLower();
        }

        static bool IsImageFile(string extension)
        {
            // List of common image file extensions
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp" };

            // Check if the extension is in the list of image extensions
            foreach (string imgExt in imageExtensions)
            {
                if (extension == imgExt)
                {
                    return true;
                }
            }
            return false;
        }


        private FileUploadResponse ForwardToExternalApi(
       List<string> filePath,
       string reqType,
       string uid,
       string appId,
       string appTitle,
       string formId,
       string formTitle,
       bool isImportData,
       int userId,
       string actionType)
        {
            // Define the API endpoint
            var baseapi = System.Web.Configuration.WebConfigurationManager.AppSettings["webapibaseurl"].ToString();
            var apiUrl = $"{baseapi}api/FormAPI/UploadFile?reqType={reqType}&uid={uid}&appId={appId}&appTitle={appTitle}&formId={formId}&formTitle={formTitle}&isImportData={isImportData.ToString().ToLower()}&userId={userId}&actionType={actionType}";

            // Create a RestSharp client
            var client = new RestClient(apiUrl);

            // Create a request
            var request = new RestRequest();
            request.Method = Method.Post;

            int counter = 1;
            // Add the file to be uploaded
            foreach (var item in filePath)
            {
                request.AddFile("file" + counter, item);
                counter++;
            }


            // Execute the request and return the response
            var response = client.Execute(request);
            if (response.IsSuccessful)
            {
                var result = JsonConvert.DeserializeObject<FileUploadResponse>(response.Content);
                return result;
            }
            return new FileUploadResponse() { success = false, message = "Error occurred during file upload: " + response.ErrorMessage };
        }





        private async Task<byte[]> DownloadImageAsync(string imageUrl)
        {
            using (var httpClient = new HttpClient())
            {
                try
                {
                    return await httpClient.GetByteArrayAsync(imageUrl);
                }
                catch
                {
                    // Handle errors (e.g., log the error, return null, etc.)
                    return null;
                }
            }
        }

        [HttpGet]
        public async Task<ActionResult> DownloadCustomExcel(int formId, string iscustom, string fields, string fieldValues)
        {
            try
            {
                string apiUrl = System.Configuration.ConfigurationManager.AppSettings["webapibaseurl"].ToString() + $"api/FormAPI/downloadFiles/{formId}/4/{iscustom}/{fields}/{fieldValues}"; // Replace with your API URL
                string fileName = formId + $"_downloaded_{DateTime.Now.ToString("ddMMyyyyHHmmssfff")}.xlsx";

                // Create a RestClient with the base URL
                var client = new RestClient(apiUrl);

                // Create a RestRequest
                var request = new RestRequest();
                request.Method = Method.Get;
                try
                {
                    // Execute the request and get the response
                    var response = await client.ExecuteAsync(request);

                    // Check if the response is successful and contains data
                    if (response.IsSuccessful && response.RawBytes != null)
                    {
                        // Load the Excel file into a ClosedXML workbook
                        using (var workbook = new XLWorkbook(new MemoryStream(response.RawBytes)))
                        {
                            var worksheet = workbook.Worksheet(1); // Assumes data is in the first worksheet
                            int photoColumnIndex = -1;

                            // Find the "Photo" column
                            var firstRow = worksheet.FirstRowUsed();
                            foreach (var cell in firstRow.Cells())
                            {
                                if (cell.GetValue<string>().ToLower().Contains("photo") || cell.GetValue<string>().ToLower().Contains("file"))
                                {
                                    photoColumnIndex = cell.Address.ColumnNumber;
                                    break;
                                }
                            }

                            if (photoColumnIndex > 0)
                            {
                                // Iterate through the rows and attach photos from URLs
                                foreach (var row in worksheet.RowsUsed().Skip(1))
                                {
                                    var cellValue = row.Cell(photoColumnIndex).GetValue<string>();
                                    if (!string.IsNullOrEmpty(cellValue) && Uri.IsWellFormedUriString(cellValue, UriKind.Absolute))
                                    {
                                        string extension = GetFileExtension(cellValue);
                                        if (IsImageFile(extension))
                                        {
                                            //Download the image from the URL
                                            var imageBytes = await DownloadImageAsync(cellValue);
                                            if (imageBytes != null)
                                            {
                                                using (var stream = new MemoryStream(imageBytes))
                                                {
                                                    try
                                                    {
                                                        var image = worksheet.AddPicture(stream);
                                                        var cell = row.Cell(photoColumnIndex);
                                                        cell.Value = string.Empty;
                                                        // Move image to the cell and fit within the cell
                                                        image.MoveTo(cell);

                                                        image.Width = 100;
                                                        image.Height = 100;

                                                        // Alternatively, if you need to scale the image to fit within 100x100 pixels, use the following:
                                                        using (var img = Image.FromStream(stream))
                                                        {
                                                            double imgWidth = img.Width;
                                                            double imgHeight = img.Height;

                                                            double scaleWidth = 100 / imgWidth;
                                                            double scaleHeight = 100 / imgHeight;

                                                            // Use the smaller scale factor to fit the image within 100x100 pixels
                                                            double scaleFactor = Math.Min(scaleWidth, scaleHeight);
                                                            image.Scale(scaleFactor);

                                                            // Adjust image dimensions if needed
                                                            image.Width = (int)(imgWidth * scaleFactor);
                                                            image.Height = (int)(imgHeight * scaleFactor);
                                                            row.Height = image.Height;
                                                        }
                                                    }
                                                    catch (Exception ex) { 
                                                    
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                var cell = row.Cell(photoColumnIndex);
                                                cell.Value = string.Empty;
                                            }
                                        }
                                    }
                                }
                            }

                            // Save the modified workbook to a memory stream
                            var modifiedStream = new MemoryStream();
                            workbook.SaveAs(modifiedStream);
                            modifiedStream.Position = 0;

                            // Return the modified file as a download
                            return File(modifiedStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                        }
                    }
                    else
                    {
                        // Handle error appropriately (e.g., log the error, return an error view, etc.)
                        return new HttpStatusCodeResult(response.StatusCode, response.ErrorMessage);
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex);
                    // Handle exception (e.g., log the error, return an error view, etc.)
                    return new HttpStatusCodeResult(500, "Internal server error: " + ex.Message);
                }

            }
            catch (Exception ex) {
                logger.Error(ex);
                return new HttpStatusCodeResult(500, "Internal server error: " + ex.Message);
            }
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
    public class FileUploadResponse
    {
        public string banner { get; set; }
        public string fileUrl { get; set; }
        public List<object> images { get; set; }
        public string fileName { get; set; }
        public int code { get; set; }
        public string message { get; set; }
        public bool success { get; set; }
    }
}