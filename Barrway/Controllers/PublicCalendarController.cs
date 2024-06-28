using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class PublicCalendarController : Controller
    {
        // GET: PublicCalendarS
        public ActionResult Index()
        {
            return View();
        }




        public ActionResult SchortCodetoembade()
        {
            ViewBag.url = ConfigurationManager.AppSettings["baseurl"];
            return View();
        }
    }
}