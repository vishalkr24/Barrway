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
using System.IO;

namespace Barrway.Controllers
{
    [Authorize(Roles = "BUSINESS_USER")]
    public class BusinessAdminController : Controller
    {

        private readonly IBusinessUserService businessUserService;
        private readonly IGlobalMasterService globalMasterService;

        public BusinessAdminController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
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
            catch (Exception ex)
            {

            }


            return View();
        }

        public async Task<ActionResult> SetupCompanyProfile()
        {
            var company = await businessUserService.GetDefaultCompanyByUserId(User.Identity.Name.ToString());

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

        public async Task<ActionResult> SetupCompanyCalendar(string CompanyId = null)
        {
            try
            {
                BusinessCalendarViewModel calendarModel = new BusinessCalendarViewModel();
                if (string.IsNullOrEmpty(CompanyId))
                {
                    // If Company Id is not passed
                    var company = await businessUserService.GetDefaultCompanyByUserId(User.Identity.Name.ToString());

                    if (company.Status)
                    {
                        calendarModel.COMPANY_CODE = company.Data["COMPANY_CODE"].ToString();
                    }

                }
                else
                {
                    // If Company Id is passed
                    var company = await businessUserService.GetSingleCompanyById(CompanyId);

                    if (company.Status)
                    {
                        calendarModel.COMPANY_CODE = company.Data["COMPANY_CODE"].ToString();
                    }
                    else
                    {
                        // Company Id is passed but company is not found

                        // BLUNDER
                    }
                }

                return View(calendarModel);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Some Error Occured";
                return View();
            }

        }

        public async Task<ActionResult> ManageCompanyWebsite(string CompanyId, int PId = 1) // PID is page id 1 for company details, 2 for service, 3 for calendar package, 4 for photo album
        {
            AddUpdateDelete userWebsite = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name);

            if (userWebsite.Status)
            {

                if (userWebsite.Data["COMPANY_PROFILE_STATUS"].ToString() == "Y" && userWebsite.Data["COMPANY_CALENDAR_STATUS"].ToString() == "Y")
                {

                    var company = await businessUserService.GetSingleCompanyById(CompanyId);
                    var photoAlbumData = await businessUserService.GetCompanyPhotoAlbumByCompanyId(CompanyId);
                    if (company.Status)
                    {
                        BusinessCompanyViewModel businessCompanyModel = new BusinessCompanyViewModel()
                        {
                            BUSINESS_ACCOUNT_ID = company.Data["BUSINESS_ACCOUNT_ID"].ToString(),
                            COMPANY_ADDRESS = company.Data["COMPANY_ADDRESS"].ToString(),
                            COMPANY_BANNER_NAME = company.Data["COMPANY_BANNER_NAME"].ToString(),

                            CITY_ID = company.Data["CITY_ID"].ToString(),
                            COMPANY_CATEGORY_ID = company.Data["COMPANY_CATEGORY_ID"].ToString(),
                            COMPANY_CODE = company.Data["COMPANY_CODE"].ToString(),
                            COMPANY_DESCRIPTION = company.Data["COMPANY_DESCRIPTION"].ToString(),
                            COMPANY_LOGO_NAME = company.Data["COMPANY_LOGO_NAME"].ToString(),

                            COMPANY_NAME_CHINESE = company.Data["COMPANY_NAME_CHINESE"].ToString(),
                            COMPANY_NAME_ENGLISH = company.Data["COMPANY_NAME_ENGLISH"].ToString(),
                            COMPANY_PHONE = company.Data["COMPANY_PHONE"].ToString(),
                            COMPANY_SERVICE = company.Data["COMPANY_SERVICE"].ToString(),
                            COMPANY_SUB_CATEGORY_ID = company.Data["COMPANY_SUB_CATEGORY_ID"].ToString(),
                            FACEBOOK_URL = company.Data["FACEBOOK_URL"].ToString(),
                            INSTAGRAM_URL = company.Data["INSTAGRAM_URL"].ToString(),
                            IS_DEFAULT = company.Data["IS_DEFAULT"].ToString(),
                            IS_SEARCHABLE_IN_MARKETPLACE = company.Data["IS_SEARCHABLE_IN_MARKETPLACE"].ToString(),
                            PAGE_URL = company.Data["PAGE_URL"].ToString(),
                            TAGS = company.Data["TAGS"].ToString(),
                            TOTAL_WEBSITE_VISITS = (float)Convert.ToDouble(company.Data["TOTAL_WEBSITE_VISITS"].ToString()),
                            WECHAT_URL = company.Data["WECHAT_URL"].ToString(),
                            COUNTRY_ID = company.Data["COUNTRY_ID"].ToString(),
                            DISTRICT_ID = company.Data["DISTRICT_ID"].ToString(),
                            Id = company.Data["Id"].ToString(),
                            TWITTER_URL = company.Data["TWITTER_URL"].ToString(),
                            photoAlbumList = new List<CompanyPhotoAlbumModel>()

                        };

                        if (photoAlbumData.Status)
                        {
                            List<CompanyPhotoAlbumModel> photoAlbums = new List<CompanyPhotoAlbumModel>();

                            foreach (var item in photoAlbumData.Data)
                            {
                                CompanyPhotoAlbumModel photoAlbum = new CompanyPhotoAlbumModel();
                                photoAlbum.COMPANY_ID = item["COMPANY_ID"].ToString();
                                photoAlbum.IS_VISIBLE = item["IS_VISIBLE"].ToString();
                                photoAlbum.ALBUM_PHOTO_NAME = item["ALBUM_PHOTO_NAME"].ToString();
                                photoAlbum.ALBUM_PHOTO_PATH = item["ALBUM_PHOTO_PATH"].ToString();
                                photoAlbums.Add(photoAlbum);
                            }

                            businessCompanyModel.photoAlbumList = photoAlbums;
                        }

                        ViewBag.PageId = PId;
                        return View(businessCompanyModel);
                    }
                    else
                    {
                        return RedirectToAction("Dashboard");
                    }

                }
                else
                {
                    return RedirectToAction("Dashboard");
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

        public async Task<ActionResult> GetCountryMaster()
        {
            try
            {
                var result = await globalMasterService.GetCountryMaster();

                if (result.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = result.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetCityMaster(string CountryId)
        {
            try
            {
                var result = await globalMasterService.GetCityMaster(CountryId);

                if (result.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = result.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetDistrictMaster(string CityId)
        {
            try
            {
                var result = await globalMasterService.GetDistrictMaster(CityId);

                if (result.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = result.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound }, JsonRequestBehavior.AllowGet);
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

                if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "Y")
                {
                    var company = await businessUserService.GetDefaultCompanyByBusinessId(((int)website.Data["Id"]).ToString());

                    if (company.Status)
                    {
                        return Json(new AddUpdateDelete() { Status = true, Data = company.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        // change the flag to 'N' (in case entry is deleted and flag is still yes)
                        var result = businessUserService.UpdateBusinessCompanyProfileStatusByUserId(User.Identity.Name.ToString(), false);

                        return Json(new AddUpdateDelete() { Status = false, Message = "Company Not Found" }, JsonRequestBehavior.AllowGet);
                    }
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

        public async Task<ActionResult> GetAllCompanies()
        {
            try
            {
                var company = await businessUserService.GetAllCompaniesByUserId(User.Identity.Name.ToString());

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
                var categoryData = await globalMasterService.GetCompanyCategoryMaster();

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = categoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetCompanySubCategory(string CategoryId)
        {
            try
            {
                var subCategoryData = await globalMasterService.GetCompanySubCategoryMaster(CategoryId);

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = subCategoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetCalendarCategory()
        {
            try
            {
                var categoryData = await globalMasterService.GetCalendarCategoryMaster();

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = categoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetCalendarSubCategory(string CalendarCategoryId)
        {
            try
            {
                var subCategoryData = await globalMasterService.GetCalendarSubCategoryMaster(CalendarCategoryId);

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = subCategoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
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
                        website = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());

                        if (website.Data["COMPANY_CALENDAR_STATUS"].ToString() == "Y")
                        {
                            return RedirectToAction("Dashboard");
                        }
                        else
                        {
                            return RedirectToAction("SetupCompanyCalendar", saveDataResult);
                        }

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
            catch (Exception ex)
            {
                return View("SetupCompanyProfile");
            }
        }


        public async Task<ActionResult> SaveCompanyServiceDetails(BusinessCompanyViewModel model)
        {
            try
            {

                BusinessCompanyModel companyModel = new BusinessCompanyModel()
                {
                    BUSINESS_ACCOUNT_ID = model.BUSINESS_ACCOUNT_ID,
                    COMPANY_SERVICE = model.COMPANY_SERVICE,
                    Id = model.Id
                };

                var saveDataResult = await businessUserService.UpdateCompanyService(companyModel);

                if (saveDataResult.Status)
                {
                    return RedirectToAction("Dashboard");
                }
                else
                {
                    return View("ManageCompanyWebsite");
                }
            }
            catch (Exception ex)
            {
                return View("ManageCompanyWebsite");
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveCompanyWebsiteDetails(BusinessCompanyViewModel model)
        {
            try
            {

                if (!ModelState.IsValid)
                {
                    return View("ManageCompanyWebsite", model);
                }

                string folderPath = Server.MapPath("~/UploadCompany/CompanyLogos/" + model.COMPANY_CODE.ToString());
                string folderPath2 = Server.MapPath("~/UploadCompany/CompanyBanners/" + model.COMPANY_CODE.ToString());

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                else
                {
                    Directory.Delete(folderPath);
                    Directory.CreateDirectory(folderPath);
                }

                if (!Directory.Exists(folderPath2))
                {
                    Directory.CreateDirectory(folderPath2);
                }
                else
                {
                    Directory.Delete(folderPath2);
                    Directory.CreateDirectory(folderPath2);
                }

                string path = "~/UploadCompany/CompanyLogos/" + model.COMPANY_CODE.ToString() + "/" + model.COMPANY_LOGO_PATH.FileName.ToString();
                string path2 = "~/UploadCompany/CompanyBanners/" + model.COMPANY_CODE.ToString() + "/" + model.COMPANY_BANNER_PATH.FileName.ToString();

                BusinessCompanyModel companyModel = new BusinessCompanyModel()
                {
                    BUSINESS_ACCOUNT_ID = model.BUSINESS_ACCOUNT_ID,
                    CITY_ID = model.CITY_ID,
                    COMPANY_ADDRESS = model.COMPANY_ADDRESS,
                    COMPANY_BANNER_NAME = model.COMPANY_BANNER_NAME,
                    COMPANY_CATEGORY_ID = model.COMPANY_CATEGORY_ID,
                    COMPANY_DESCRIPTION = model.COMPANY_DESCRIPTION,
                    COMPANY_EMAIL = model.COMPANY_EMAIL,
                    COMPANY_LOGO_NAME = model.COMPANY_LOGO_NAME,
                    COMPANY_BANNER_PATH = path2,
                    COMPANY_LOGO_PATH = path,
                    COMPANY_NAME_CHINESE = model.COMPANY_NAME_CHINESE,
                    COMPANY_NAME_ENGLISH = model.COMPANY_NAME_ENGLISH,
                    COMPANY_PHONE = model.COMPANY_PHONE,
                    COMPANY_SUB_CATEGORY_ID = model.COMPANY_SUB_CATEGORY_ID,
                    COUNTRY_ID = model.COUNTRY_ID,
                    DISTRICT_ID = model.DISTRICT_ID,
                    FACEBOOK_URL = model.FACEBOOK_URL,
                    Id = model.Id,
                    INSTAGRAM_URL = model.INSTAGRAM_URL,
                    IS_SEARCHABLE_IN_MARKETPLACE = model.IS_SEARCHABLE_IN_MARKETPLACE,
                    PAGE_URL = model.PAGE_URL,
                    TAGS = model.TAGS,
                    TWITTER_URL = model.TWITTER_URL,
                    WECHAT_URL = model.WECHAT_URL
                };

                var saveDataResult = await businessUserService.AddCompany(companyModel, User.Identity.Name.ToString());

                if (saveDataResult.Status)
                {
                    var website = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());

                    if (model.COMPANY_LOGO_PATH != null)
                    {
                        model.COMPANY_LOGO_PATH.SaveAs(Server.MapPath("~/UploadCalendar/CalendarImages/" + model.COMPANY_CODE.ToString()) + "/" + model.COMPANY_LOGO_PATH.FileName.ToString());
                    }

                    if (model.COMPANY_BANNER_PATH != null)
                    {
                        model.COMPANY_BANNER_PATH.SaveAs(Server.MapPath("~/UploadCalendar/CalendarImages/" + model.COMPANY_CODE.ToString()) + "/" + model.COMPANY_BANNER_PATH.FileName.ToString());
                    }


                    return RedirectToAction("Dashboard");

                }
                else
                {
                    return View("ManageCompanyWebsite");
                }
            }
            catch (Exception ex)
            {
                return View("ManageCompanyWebsite");
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddCalendar(BusinessCalendarViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("SetupCompanyCalendar", model);
            }
            else
            {
                var company = await businessUserService.GetSingleCompanyByCompanyCode(model.COMPANY_CODE);

                if (company.Status)
                {
                    string folderPath = Server.MapPath("~/UploadCalendar/CalendarImages/" + model.COMPANY_CODE.ToString());

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    else
                    {
                        Directory.Delete(folderPath);
                        Directory.CreateDirectory(folderPath);
                    }

                    string path = "~/UploadCalendar/CalendarImages/" + model.COMPANY_CODE.ToString() + "/" + model.CALENDAR_PHOTO_NAME.ToString();
                    BusinessCalendarModel calendarModel = new BusinessCalendarModel()
                    {
                        CALENDAR_CATEGORY_ID = model.CALENDAR_CATEGORY_ID.ToString(),
                        CALENDAR_NAME = model.CALENDAR_NAME.ToString(),
                        CALENDAR_SUB_CATEGORY_ID = model.CALENDAR_SUB_CATEGORY_ID.ToString(),
                        CALENDAR_PHOTO_NAME = model.CALENDAR_PHOTO_NAME.ToString(),
                        CALENDAR_PHOTO_PATH = path,
                        IS_VISIBLE = "Y",
                        DISTRICT_ID = model.DISTRICT_ID.ToString(),
                        CITY_ID = model.CITY_ID.ToString(),
                        COMPANY_CODE = model.COMPANY_CODE.ToString(),
                        COUNTRY_ID = model.COUNTRY_ID.ToString()
                    };

                    var result = await businessUserService.AddCalendar(calendarModel, User.Identity.Name.ToString());

                    if (result.Status)
                    {
                        // Save image in folder
                        model.CALENDAR_PHOTO_PATH.SaveAs(Server.MapPath("~/UploadCalendar/CalendarImages/" + model.COMPANY_CODE.ToString()) + "/" + model.CALENDAR_PHOTO_NAME.ToString());
                        return RedirectToAction("Dashboard");
                    }
                    else
                    {
                        return View("SetupCompanyCalendar", model);
                    }


                }
                else
                {
                    return RedirectToAction("SetupCompanyCalendar");
                }


            }

        }

        [HttpPost]
        public async Task<ActionResult> AddCompanyPhotoAlbum()
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    // for business id
                    var business = await businessUserService.GetSingleBusinessWebsite(User.Identity.Name.ToString());
                    
                    HttpFileCollectionBase files = Request.Files;
                    HttpPostedFileBase file = files[0];
                    string fname;
                    string CompanyCode = Request.Form["CompanyCode"].ToString();
                    string CompanyId = Request.Form["CompanyId"].ToString();

                    // Checking for Internet Explorer  
                    if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                    {
                        string[] testfiles = file.FileName.Split(new char[] { '\\' });
                        fname = testfiles[testfiles.Length - 1];
                    }
                    else
                    {
                        fname = file.FileName;
                    }

                    string folderPath = Server.MapPath("~/UploadCompanyPhotoAlbum/" + business.Data["Id"].ToString() + "/" + CompanyCode);

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    else
                    {
                        var fileName = Path.GetFileName(fname);
                        var fullpath = System.Web.HttpContext.Current.Server.MapPath("~/UploadCompanyPhotoAlbum/" + business.Data["Id"].ToString() + "/" + CompanyCode);

                        //deleting code starts here
                        string[] checkfiles = System.IO.Directory.GetFiles(fullpath, $"{fname}.*");
                        foreach (string f in checkfiles)
                        {
                            System.IO.File.Delete(f);
                        }
                    }

                    string path = "~/UploadCompanyPhotoAlbum/" + business.Data["Id"].ToString() + "/" + CompanyCode + "/" + fname;
                    CompanyPhotoAlbumModel albumModel = new CompanyPhotoAlbumModel()
                    {
                       ALBUM_PHOTO_NAME = fname,
                       ALBUM_PHOTO_PATH = path,
                       COMPANY_ID = CompanyId,
                       IS_VISIBLE = "Y"
                    };

                    var result = await businessUserService.AddCompanyPhotoAlbum(albumModel);

                    if (result.Status)
                    {
                        // Save image in folder
                        file.SaveAs(Server.MapPath("~/UploadCompanyPhotoAlbum/" + business.Data["Id"].ToString() + "/" + CompanyCode + "/" + fname));
                        return Json("Success", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json("Failed to add photo", JsonRequestBehavior.AllowGet);
                    }


                }
                catch (Exception ex)
                {
                    return Json("Error occurred. Error details: " + ex.Message, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json("No files selected.", JsonRequestBehavior.AllowGet);
            }
            return null;
        }

        public async Task<ActionResult> GetCompanyPhotoAlbum(string CompanyId)
        {
            try
            {
                var album = await businessUserService.GetCompanyPhotoAlbumByCompanyId(CompanyId);

                if (album.Status)
                {
                    return Json(new AddUpdateDelete() { Status = true, Data = album.Data, Message = AppMessage.Success }, JsonRequestBehavior.AllowGet);
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

        #endregion
    }
}