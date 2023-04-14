using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger logger;

        public HomeController(ILogger logger)
        {
            this.logger = logger;
        }
        public ActionResult Index()
        {
            logger.Info("Hello");
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}