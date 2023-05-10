using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class CalendarController : Controller
    {
        private readonly IMasterService masterService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ISqlFunction sqlFunction;

        // GET: Calendar
        public CalendarController(IMasterService masterService,IFormAPIRepository formAPIRepository,ISqlFunction sqlFunction)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetLocationMasterList(data,companyCode,calendarCode);
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
            var result= (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res==1)
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

    }
}