using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class BusinessMarketplaceController : BaseController
    {

        private readonly IBusinessUserService businessUserService;
        private readonly IGlobalMasterService globalMasterService;
        private readonly IMasterService masterService;
        private readonly IPublicUserService publicUserService;
        private readonly IAuthService authService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ICalendarService calendarService;

        public BusinessMarketplaceController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService, IMasterService masterService, IPublicUserService publicUserService, IAuthService authService, IFormAPIRepository formAPIRepository, ICalendarService calendarService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
            this.masterService = masterService;
            this.publicUserService = publicUserService;
            this.authService = authService;
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
        }


        // GET: BusinessMarketplace
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> GetAllFeaturedComapy()
        {
            try
            {
                var transactionData = await masterService.GetAllFeaturedCompany();
                return Json(new { data = transactionData }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Features()
        {
            return View();
        }

        public ActionResult Pricing()
        {
            return View();
        }

    }
}