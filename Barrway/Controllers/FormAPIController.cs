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

namespace MOODIES_CARE.Controllers
{
   
    public class FormAPIController : Controller
    {
        private readonly IFormAPIRepository formAPIRepository;

        // GET: FormAPI
        public FormAPIController(IFormAPIRepository formAPIRepository)
        {
            this.formAPIRepository = formAPIRepository;
        }

        [HttpPost]
        public async Task<ActionResult> ManageLanguages(Languages data) {
            return Json( (await formAPIRepository.ManageLanguages(data)).Data);
        }

        [HttpPost]
        public async Task<ActionResult> ManageForm(FormTable data)
        {
            return Json((await formAPIRepository.ManageForm(data)).Data);
        }
        [HttpPost]
        public async Task<ActionResult> GetFormRecordList(GenerateDynamicFormData data)
        {
            return Json((await formAPIRepository.GetFormRecordList(data)).Data);
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