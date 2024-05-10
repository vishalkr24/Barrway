using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;
using Barrway.Resources;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IMasterService masterService;
        private readonly ISqlFunction sqlFunction;

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository, ICalendarService calendarService, IPublicUserService publicUserService, IBusinessUserService businessUserService, IMasterService masterService, ISqlFunction sqlFunction)
        {
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
            this.publicUserService = publicUserService;
            this.businessUserService = businessUserService;
            this.masterService = masterService;
            this.sqlFunction = sqlFunction;
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
                                }catch (Exception)
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
                                serviceId = deserData.Any(x => x["name"]?.ToString() == "activities")? deserData.FirstOrDefault(x => x["name"]?.ToString() == "activities")["value"]?.ToString():"";
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
                                else {
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

            if (IsCourseEvent == "COURSE" && data.action==1)
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
                        data.filter.value = " F.COMPANY_CODE=N'" + data.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + data.CALENDAR_CODE + "' and "+ data.filter.value;
                    }

                }
            }
            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

            //ReferalFormDataResponseModel result = new ReferalFormDataResponseModel();
            //result.events=await calendarService.GetEvents(data);

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
                                    result.events[j].Add("CALENDAR_NAME", enrolledData.Data[i]["CALENDAR_NAME"].ToString());
                                    result.events[j].Add("COMPANY_NAME_ENGLISH", enrolledData.Data[i]["COMPANY_NAME_ENGLISH"].ToString());
                                    if (!finalResult.events.Any(x=> x["Id"]?.ToString() == result.events[j]["Id"].ToString()))
                                    {
                                        finalResult.events.Add(result.events[j]);
                                    }
                                }
                            }

                            // filter activity events
                            for (int j = 0; j < result.activityEvents.Count; j++)
                            {
                                if (enrolledData.Data[i]["Id"].ToString() == result.activityEvents[j]["Id"].ToString())
                                {
                                    if (!finalResult.activityEvents.Any(x => x["Id"]?.ToString() == result.activityEvents[j]["Id"].ToString()))
                                    {
                                        finalResult.activityEvents.Add(result.activityEvents[j]);
                                    }
                                }
                            }

                            // filter resource details
                            for (int j = 0; j < result.resourceDetails.Count; j++)
                            {
                                if (!string.IsNullOrEmpty(result.resourceDetails[j].title))
                                {
                                    if ((enrolledData.Data[i]["customForms"]).Contains(result.resourceDetails[j].title))
                                    {
                                        if (!finalResult.resourceDetails.Any(x => x.Id?.ToString() == result.resourceDetails[j].Id.ToString()))
                                        {
                                            finalResult.resourceDetails.Add(result.resourceDetails[j]);
                                        }
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
            
            {
                var alreadyEnrolledEvents = (await publicUserService.GetAlreadyEnrolledEvents(data.COMPANY_CODE, UserIdentity.UserEmail, data.filter.value)).Data as List<IDictionary<string, object>>;
                if (alreadyEnrolledEvents!= null)
                {
                    if (alreadyEnrolledEvents.Count > 0)
                    {
                        if (result != null)
                        {
                            foreach (var item in result.events)
                            {
                                if (alreadyEnrolledEvents.Any(x => x["Id"]?.ToString() == item["Id"]?.ToString()))
                                {
                                    item.Add("IsAlreadyBooked", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsAlreadyBooked"]);
                                    item.Add("ATTEND", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["ATTEND"]);
                                    item.Add("IsReviewable", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsReviewable"]);
                                    item.Add("TransactionId", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["TransactionId"]);
                                }
                                else
                                {
                                    item.Add("IsAlreadyBooked", 'N');
                                    item.Add("IsReviewable", 'N');
                                    item.Add("ATTEND", 'N');
                                    item.Add("TransactionId", '0');
                                }
                            }
                        }
                    }
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

                    var resourceData = await masterService.GetLocationMasterList(new GenerateDynamicFormData() { action = 1,size = 50, filters = new List<FilterDTO> { new FilterDTO() { type = "=", field = "CALENDAR_CODE", value = data.CALENDAR_CODE} } }, data.COMPANY_CODE, data.CALENDAR_CODE);

                    var resourceList = resourceData.Data as List<IDictionary<string, object>>;

                    if (data.resourceId > 0)
                    {
                        resourceList = resourceList.Where(x => x["Id"]?.ToString() == data.resourceId.ToString()).ToList();
                    }

                    List<IDictionary<string, object>> Temp = new List<IDictionary<string, object>>();

                    foreach (var resource in resourceList)
                    {
                        DateTime startDate = (Convert.ToDateTime(data.startDate).Year > DateTimeUtility.Now().Year)? Convert.ToDateTime(data.startDate) : DateTimeUtility.Now();
                        DateTime endDate = Convert.ToDateTime(data.endDate).AddDays(-1);

                        var events = result.events.Where(x => x["resources"]?.ToString() == resource["Id"]?.ToString()).ToList();

                        if (events.Count > 0)
                        {
                            events = events.OrderBy(x => Convert.ToDateTime(x["start"])).ToList();

                            List<(DateTime, DateTime)> ps = new List<(DateTime, DateTime)>();

                            events.ForEach(x => {
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
                if (data.resourceId != 0) {

                    List<IDictionary<string, object>> _events = new List<IDictionary<string, object>>();
                    result.events.ForEach(x =>
                    {
                        string resourceFormId= data.resourceFormId.ToString();
                        if (x.ContainsKey("customForms") && x.ContainsKey("customFormIds") && !string.IsNullOrEmpty(x["customFormIds"]?.ToString()) && !string.IsNullOrEmpty(x["customForms"]?.ToString())
                        && x["customForms"].ToString().Split(',').Contains(resourceFormId) && x["customFormIds"].ToString().Split(',').Length>0) {
                            var customFormsSplit = x["customForms"].ToString().Split(',').ToList();
                            var cucustomFormIdsSplit = x["customFormIds"].ToString().Split(',').ToList();
                           int index= customFormsSplit.FindIndex(y=>y== resourceFormId);
                            if (index > -1 && cucustomFormIdsSplit.Count()>index) {
                                if (cucustomFormIdsSplit[index] == data.resourceId.ToString()) {
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