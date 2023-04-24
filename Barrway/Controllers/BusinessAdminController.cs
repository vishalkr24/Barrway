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
                    
                    if (currentStep == "REGISTRATION")
                    {
                        TempData["VERIFICATION"] = "Pending";
                        TempData["VERIFICATION_EMAIL"] = User.Identity.Name.ToString();
                        return RedirectToAction("EmailVerification", "Account");
                    }
                    else
                    {
                        return View();   
                    }
                }
                else
                {
                    // Business Website Entry not found
                    Session.Clear();
                    Session.RemoveAll();
                    Session.Abandon();
                    TempData.Clear();
                    if (HttpContext != null)
                    {
                        HttpContext.Request.Cookies.Clear();
                    }

                    HttpContext.GetOwinContext().Authentication.SignOut();
                    return RedirectToAction("BusinessLogin", "Account");
                }
                
            }
            catch(Exception ex)
            {

            }
           

            return View();
        }

        public async Task<ActionResult> SetupCompanyProfile()
        {
            var website = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());
            var company = await businessUserService.GetDefaultCompanyByBusinessId(((int)website.Data["Id"]).ToString());

            if (company.Status)
            {
                CompanyProfileViewModel model = new CompanyProfileViewModel()
                {
                    Id = ((int)company.Data["Id"]).ToString(),
                    COMPANY_NAME_CHINESE = company.Data["COMPANY_NAME_CHINESE"].ToString(),
                    COMPANY_NAME_ENGLISH = company.Data["COMPANY_NAME_ENGLISH"].ToString(),
                };

                return View(model);
            }
            else
            {
                return View();
            }
           

        }

        public async Task<ActionResult> SetupCompanyCalendar()
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
                    return Json(new AddUpdateDelete() { Status = true, Data = userWebsite.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Website Not Found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetDefaultCompany()
        {
            try
            {
                var website = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());

                var company = await businessUserService.GetDefaultCompanyByBusinessId(((int)website.Data["Id"]).ToString());

                if (company.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = company.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Company Not Found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetSingleCompanyByCompanyId(string CompanyId)
        {
            try
            {
                var company = await businessUserService.GetSingleCompanyById(CompanyId);

                if (company.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = company.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Company Not Found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetCompanyCategory()
        {
            try
            {
                var categoryData = await businessUserService.GetCompanyCategoryMaster();

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = categoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString()}, JsonRequestBehavior.AllowGet);
            }
            
        }

        public async Task<ActionResult> GetCompanySubCategory(int CategoryId)
        {
            try
            {
                var subCategoryData = await businessUserService.GetCompanySubCategoryMaster(CategoryId);

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = subCategoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> SaveCompanyProfileDetails(CompanyProfileViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View("SetupCompanyProfile");
                }

                var website = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());

                if (website.Status)
                {
                    BusinessCompanyModel businessCompanyModel = new BusinessCompanyModel()
                    {
                        BUSINESS_ACCOUNT_ID = ((int)website.Data["Id"]).ToString(),
                        COMPANY_NAME_ENGLISH = model.COMPANY_NAME_ENGLISH,
                        COMPANY_NAME_CHINESE = model.COMPANY_NAME_CHINESE,
                        Id = model.Id,
                        COMPANY_CATEGORY_ID = model.COMPANY_CATEGORY_ID,
                        COMPANY_SUB_CATEGORY_ID = model.COMPANY_SUB_CATEGORY_ID
                    };

                    var saveDataResult = await businessUserService.AddCompany(businessCompanyModel, User.Identity.Name.ToString(), true);

                    if (saveDataResult.Status)
                    {
                        return RedirectToAction("SetupCompanyCalendar");
                    }
                    else
                    {
                        return View("SetupCompanyProfile");
                    }
                }
                else
                {
                    return View("SetupCompanyProfile");
                }

                
                
            }
            catch(Exception ex)
            {
                return View("SetupCompanyProfile");
            }
        }


        #endregion
    }
}