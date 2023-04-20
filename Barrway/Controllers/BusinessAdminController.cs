using Barrway.Service.IRepository;
using Barrway.DTO.BusinessModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Barrway.DTO.Common;

namespace Barrway.Controllers
{
    [Authorize(Roles = "BUSINESS_USER")]
    public class BusinessAdminController : Controller
    {

        private readonly IBusinessUserService businessUserService;

        public BusinessAdminController(IBusinessUserService businessUserService)
        {
            this.businessUserService = businessUserService;
        }

        #region View Methods
        // GET: Business
        public async Task<ActionResult> Index()
        {
            return View();
        }

        public async Task<ActionResult> Dashboard()
        {
            try
            {
                AddUpdateDelete userWebsite = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name);

                if (userWebsite.Status)
                {
                    string currentStep = userWebsite.Data["CURRENT_STEP"].ToString();
                    //string companyProfileStatus = userWebsite.Data["COMPANY_PROFILE_STATUS"].ToString();
                    //string companyCalendarStatus = userWebsite.Data["COMPANY_CALENDAR_STATUS"].ToString();

                    if (currentStep == "REGISTRATION")
                    {
                        TempData["VERIFICATION"] = "Pending";
                        TempData["VERIFICATION_EMAIL"] = User.Identity.Name.ToString();
                        return RedirectToAction("EmailVerification", "Account");
                    }
                    else
                    {
                        //if (companyProfileStatus == "N")
                        //{
                        //    ViewBag.CurrentStep = 1;
                        //    return View();
                        //}

                        //if (companyCalendarStatus == "N")
                        //{
                        //    ViewBag.CurrentStep = 2;
                        //    return View();
                        //}

                        //if (currentStep == "COMPANY WEBSITE")
                        //{
                        //    ViewBag.CurrentStep = 3;
                        //    return View();
                        //}

                        //if (currentStep == "COMPLETED")
                        //{
                        //    ViewBag.CurrentStep = 0;
                        //}
                        return View();
                        
                    }
                }
                else
                {
                    // Business Website Entry not found
                    return RedirectToAction("Logout", "Account");
                }
                
            }
            catch(Exception ex)
            {

            }
           

            return View();
        }

        public async Task<ActionResult> SetupBusinessProfile()
        {
            return View();
        }

        public async Task<ActionResult> SetupBusinessCalendar()
        {
            return View();
        }

        public async Task<ActionResult> SetupBusinessCalendarInformation()
        {
            return View();
        }
        #endregion

        #region Data Methods

        public async Task<ActionResult> GetBusinessAccountWebsite(string UserId)
        {
            try
            {
                var userWebsite = await businessUserService.GetSingleBusinessWebsite(UserId);

                if (userWebsite.Status)
                {
                    return Json(JsonConvert.SerializeObject(userWebsite.Data), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(null, JsonRequestBehavior.AllowGet);
                }


            }
            catch (Exception ex)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        #endregion
    }
}