using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    [Authorize(Roles = "BUSINESS_USER")]
    public class BusinessAdminController : Controller
    {
        // GET: Business
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult SetupBusinessProfile()
        {
            return View();
        }

        public ActionResult SetupBusinessCalendar()
        {
            return View();
        }

        public ActionResult SetupBusinessCalendarInformation()
        {
            return View();
        }
    }
}