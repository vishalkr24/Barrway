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
    [Authorize]
    public class FormAPIController : Controller
    {
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ICalendarService calendarService;

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository,ICalendarService calendarService)
        {
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
        }

        [HttpPost]
        public async Task<ActionResult> ManageLanguages(Languages data) {
            return Json( (await formAPIRepository.ManageLanguages(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> ManageForm(FormTable data)
        {
            var result = (await formAPIRepository.ManageForm(data)).Data;
            if (data.formId == (int)FormSetting.CALENDAR_FORM && data.action == (int)FormAction.ManageForm)
            {
                if(result!=null && result.Count() > 0)
                {
                    result.ForEach(x =>
                    {
                        if (x.FormDataToOneListDynamic != null && x.FormDataToOneListDynamic.Count()>0)
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
            return Json(await formAPIRepository.getReferralFormFieldsAndDataGET(actionid, formID, formGroupKey),JsonRequestBehavior.AllowGet);
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
            var result= (await formAPIRepository.GetFormRecordList(data)).Data;
            if (data.formId == (int)FormSetting.CALENDAR_FORM)
            {
                if (result.data!=null && result.data.Count()>0)
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
            return Json((await formAPIRepository.getCalenderSettingsFormData(data)));
        }

        [HttpPost]
        public async Task<ActionResult> getAxisColumns(calenderSettingsFormDetails data)
        {
            return Json((await formAPIRepository.getAxisColumns(data)));
        }

        [HttpPost]
        public async Task<ActionResult> getReferralFormFields(Form_DataTable data)
        {
            var result = await formAPIRepository.getReferralFormFields(data);

            if (result != null)
            {
                if(result.events!=null && result.events.Count() > 0)
                {
                    result.events.ForEach(e =>
                    {
                        if (e.ContainsKey("start") && e["start"]!=null)
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
        public async Task<ActionResult> ManageCalenderReferrenceNew(FormCalenderReferrenceTable data)
        {
            var result = await formAPIRepository.ManageCalenderReferrenceNew(data);
            if(result!=null && result.Any(x=>x.res==1))
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
        public async Task<ActionResult> getJSONjsTree(int root, string title, string formId, string resourceActivityForm, string previousSelection, string selectedRoot, string query, string id)
        {
            return Json((await formAPIRepository.getJSONjsTree(root,title,formId,resourceActivityForm,  previousSelection,  selectedRoot,  query,  id)),JsonRequestBehavior.AllowGet);
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