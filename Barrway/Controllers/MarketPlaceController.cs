using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class MarketPlaceController : Controller
    {
        // GET: MarketPlace
        public async Task<ActionResult> Index()
        {
            return View();
        }

        public async Task<ActionResult> BusinessSite()
        {
            return View();
        }

        public async Task<ActionResult> Tag()
        {
            return View();
        }

        public async Task<ActionResult> News()
        {
            return View();
        }

        public async Task<ActionResult> BusinessPost()
        {
            return View();
        }

        public async Task<ActionResult> CompanyDetail(string Id)
        {
            ViewBag.Title = "Company " + Id;

            return View();
        }

        public async Task<ActionResult> CompanyService()
        {
            return View();
        }

        public async Task<ActionResult> CompanyPackage()
        {
            return View();
        }

        public async Task<ActionResult> CompanySchedule()
        {
            return View();
        }

        public async Task<ActionResult> CompanyPhotoAlbum()
        {
            return View();
        }




    }
}