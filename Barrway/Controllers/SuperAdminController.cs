using Barrway.DTO.Common;
using Barrway.Security;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;

namespace Barrway.Controllers
{
    [SuperAdminAuthorize(Roles = "SUPERADMIN_USER")]
    public class SuperAdminController : BaseController
    {
        private readonly ISuperAdminUserService superAdminUserService;
        public SuperAdminController(ISuperAdminUserService superAdminUserService)
        {
            this.superAdminUserService = superAdminUserService;
        }

        // GET: SuperAdmin
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<ActionResult> GetDashboardData()
        {
            try
            {
                var result = await superAdminUserService.GetDashboardData();
                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(ex.Message.ToString(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetUserList(GenerateDynamicFormData data, int role)
        {
            try
            {
                var transactionData = await superAdminUserService.GetAllUsers(data, role.ToString());
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }

                return Json(new { data = transactionData.Data, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Message = "Failed", Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetCompanyMasterWithCalendars(GenerateDynamicFormData data, string UserId)
        {
            try
            {
                var transactionData = await superAdminUserService.GetCompanyMasterWithCalendars(data, UserId);
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }

                return Json(new { data = transactionData.Data, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message.ToString());
            }
        }

        [HttpPost]
        public async Task<ActionResult> ActiveInactiveUser(string UserId, string Status)
        {
            try
            {
                var result = await superAdminUserService.ActiveInactiveUser(UserId, Status);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message.ToString());
            }
        }


        


    }
}