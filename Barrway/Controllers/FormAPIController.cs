using Barrway.DTO.FormAPI;
using Barrway.Security;
using Barrway.Service.IRepository;
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
    public class FormAPIController : Controller
    {
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ICalendarService calendarService;
        private readonly IPublicUserService publicUserService;

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository, ICalendarService calendarService, IPublicUserService publicUserService)
        {
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
            this.publicUserService = publicUserService;
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
                var resourceData = result.FirstOrDefault(x => x.resourceForm != 0 & x.IsDefault == true).formDataList;

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

                        // filter activity Details
                        for (int j = 0; j < result.activityDetails.Count; j++)
                        {
                            if (enrolledData.Data[i]["CALENDAR_CODE"] == result.activityDetails[j].title)
                            {
                                finalResult.activityDetails.Add(result.activityDetails[j]);
                            }
                        }


                        // filter events
                        for (int j = 0; j < result.events.Count; j++)
                        {
                            if (enrolledData.Data[i]["SLOT"] == result.events[j]["Id"].ToString())
                            {
                                finalResult.events.Add(result.events[j]);
                            }
                        }

                        // filter activity events
                        for (int j = 0; j < result.activityEvents.Count; j++)
                        {
                            if (enrolledData.Data[i]["SLOT"] == result.activityEvents[j]["Id"].ToString())
                            {
                                finalResult.activityEvents.Add(result.activityEvents[j]);
                            }
                        }

                        // filter resource details
                        for (int j = 0; j < result.resourceDetails.Count; j++)
                        {
                            if (enrolledData.Data[i]["CALENDAR_CODE"] == result.resourceDetails[j].title)
                            {
                                finalResult.resourceDetails.Add(result.resourceDetails[j]);
                            }
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