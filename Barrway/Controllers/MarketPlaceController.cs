using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.DTO.MarketplaceModels;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    public class MarketPlaceController : BaseController
    {
        private readonly IBusinessUserService businessUserService;
        private readonly IGlobalMasterService globalMasterService;
        private readonly IMasterService masterService;
        private readonly IPublicUserService publicUserService;
        private readonly IAuthService authService;
        private readonly IFormAPIRepository formAPIRepository;

        public MarketPlaceController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService, IMasterService masterService, IPublicUserService publicUserService, IAuthService authService, IFormAPIRepository formAPIRepository)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
            this.masterService = masterService;
            this.publicUserService = publicUserService;
            this.authService = authService;
            this.formAPIRepository = formAPIRepository;
        }

        // GET: MarketPlace
        public async Task<ActionResult> Index()
        {
            return View();
        }

        public async Task<ActionResult> BusinessSite()
        {
            return View();
        }

        public async Task<ActionResult> Search(string keyword)
        {
            List<SearchResultModel> finalResult = new List<SearchResultModel>();

            var dataRaw = await masterService.GetMasterSearchResult(keyword);

            if (dataRaw.Status)
            {
                var data = dataRaw.Data as List<List<IDictionary<string, object>>>;

                if (data.Count > 0)
                {
                    SearchResultModel temp = new SearchResultModel();

                    // for calendar
                    var calendarData = data[0];
                    for (int i = 0; i < calendarData.Count; i++)
                    {
                        temp = new SearchResultModel();
                        temp.Id = calendarData[i]["Id"]?.ToString();
                        temp.Title = calendarData[i]["CALENDAR_NAME"]?.ToString();
                        temp.Description = calendarData[i]["COMPANY_NAME_ENGLISH"]?.ToString();
                        temp.ImagePath = calendarData[i]["CALENDAR_PHOTO_PATH"]?.ToString();
                        temp.ResultType = 1;
                        temp.OtherIds = new List<IDictionary<string, string>>()
                        {
                            new Dictionary<string, string>()
                            {
                                {"CalendarCode", calendarData[i]["CALENDAR_CODE"]?.ToString() },
                                {"CompanyCode", calendarData[i]["COMPANY_CODE"]?.ToString() }
                            }
                        };
                        finalResult.Add(temp);
                    }

                    // for company
                    var companyData = data[1];
                    for (int i = 0; i < companyData.Count; i++)
                    {
                        temp = new SearchResultModel();
                        temp.Id = companyData[i]["Id"]?.ToString();
                        temp.Title = companyData[i]["COMPANY_NAME_ENGLISH"]?.ToString();
                        temp.Description = companyData[i]["COMPANY_DESCRIPTION"]?.ToString();
                        temp.ImagePath = companyData[i]["COMPANY_LOGO_PATH"]?.ToString();
                        temp.ResultType = 2;
                        temp.OtherIds = new List<IDictionary<string, string>>()
                        {
                            new Dictionary<string, string>()
                            {
                                {"CompanyCode", companyData[i]["COMPANY_CODE"]?.ToString() }
                            }
                        };
                        finalResult.Add(temp);
                    }

                    // for service
                    var serviceData = data[2];
                    for (int i = 0; i < serviceData.Count; i++)
                    {
                        temp = new SearchResultModel();
                        temp.Id = serviceData[i]["Id"]?.ToString();
                        temp.Title = serviceData[i]["ACTIVITY_NAME"]?.ToString();
                        temp.Description = "";
                        temp.ImagePath = serviceData[i]["CALENDAR_PHOTO_PATH"]?.ToString();
                        temp.ResultType = 3;
                        temp.OtherIds = new List<IDictionary<string, string>>()
                        {
                            new Dictionary<string, string>()
                            {
                                {"CompanyCode", serviceData[i]["COMPANY_CODE"]?.ToString() },
                                {"CalendarCode", serviceData[i]["CALENDAR_CODE"]?.ToString() },
                                {"CompanyName", serviceData[i]["COMPANY_NAME_ENGLISH"]?.ToString() },
                                {"CalendarName", serviceData[i]["CALENDAR_NAME"]?.ToString() }

                            }
                        };
                        finalResult.Add(temp);
                    }

                    // for category
                    var categoryData = data[3];
                    for (int i = 0; i < categoryData.Count; i++)
                    {
                        temp = new SearchResultModel();
                        temp.Id = categoryData[i]["Id"]?.ToString();
                        temp.Title = categoryData[i]["CALENDAR_SUB_CATEGORY_NAME"]?.ToString();
                        temp.Description = "";
                        temp.ImagePath = "";
                        temp.ResultType = 4;
                        temp.OtherIds = new List<IDictionary<string, string>>();
                        finalResult.Add(temp);
                    }

                }
            }

            return View(new SearchResultViewModel() { results = finalResult, keyword = keyword });
        }

        public async Task<ActionResult> PrivacyPolicy()
        {
            return View();
        }

        public async Task<ActionResult> Tag(string tag)
        {

            try
            {
                ViewBag.TagName = tag;
                var data = await globalMasterService.GetSingleTagData(tag);

                if (data.Status)
                {
                    return View(data.Data);
                }
                else
                {
                    return RedirectToAction("Index", "Marketplace");
                }

            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

        }

        public async Task<ActionResult> Pricing()
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

        public async Task<ActionResult> CompanyDetail(string CompanyCode, string CalendarCode = null)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                if (!string.IsNullOrEmpty(companyModel.IS_TEMPLATE))
                {
                    if (companyModel.IS_TEMPLATE == "Y")
                        return RedirectToAction("Index", "Marketplace");
                }

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

        }

        public async Task<ActionResult> CompanyService(string CompanyCode, string CalendarCode = null)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                if (!string.IsNullOrEmpty(companyModel.IS_TEMPLATE))
                {
                    if (companyModel.IS_TEMPLATE == "Y")
                        return RedirectToAction("Index", "Marketplace");
                }

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

        }

        public async Task<ActionResult> CompanyPackage(string CompanyCode, string CalendarCode = null)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                if (!string.IsNullOrEmpty(companyModel.IS_TEMPLATE))
                {
                    if (companyModel.IS_TEMPLATE == "Y")
                        return RedirectToAction("Index", "Marketplace");
                }

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }

        public async Task<ActionResult> CompanySchedule(string id = null)
        {
            try
            {

                string CompanyCode = id;
                string CalendarCode = null;
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
                AddUpdateDelete calendarData = await businessUserService.GetMarcketPlaceCompanyCalendarByCompanyId(companyData.Data["Id"].ToString());




                //var servilces=await businessUserService.GetServiceList(CalendarCode, CompanyCode);
                //var serviceData = await globalMasterService.GetCompanyCategoryMaster();
                if (calendarData.Status)
                {

                    var data = JsonConvert.SerializeObject(companyData.Data);
                    var calendarEncrypted = JsonConvert.SerializeObject(calendarData.Data);

                    //var serviceEncrypted = JsonConvert.SerializeObject(serviceData.Data);

                    MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                    companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                    companyModel.calendars = JsonConvert.DeserializeObject<List<BusinessCalendarModel>>(calendarEncrypted);

                    if (!string.IsNullOrEmpty(CalendarCode))
                    {
                        if (companyModel.calendars.Any(x => x.CALENDAR_FUNCTION_TYPE == "QUEUE" && x.CALENDAR_CODE == CalendarCode))
                        {
                            return RedirectToAction("CompanyQueueSchedule", new { CompanyCode = CompanyCode, CalendarCode = CalendarCode });
                        }
                    }

                    var servilces = await businessUserService.GetServiceList(companyModel.calendars[0].CALENDAR_CODE, CompanyCode);
                    var servilcesEncrypted = JsonConvert.SerializeObject(servilces.Data);
                    companyModel.ServicesList = JsonConvert.DeserializeObject<List<ServicesList>>(servilcesEncrypted);
                    //companyModel.services = JsonConvert.DeserializeObject<List<BusinessCompanyCategoryModel>>(serviceEncrypted);

                    ViewBag.IsUserFavorite = false;

                    if (User.Identity.IsAuthenticated)
                    {
                        if (UserIdentity.Role == "PUBLIC_USER")
                        {
                            // check if calendar is a favorite
                            var calendarFavCheck = await publicUserService.CheckSingleMyFavoriteCalendar(User.Identity.Name, CalendarCode);
                            if (calendarFavCheck.Status)
                            {
                                ViewBag.IsUserFavorite = true;
                            }
                        }
                    }

                    ViewBag.CompanyCode = CompanyCode;
                    ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                    if (!string.IsNullOrEmpty(companyModel.IS_TEMPLATE))
                    {
                        if (companyModel.IS_TEMPLATE == "Y")
                            return RedirectToAction("Index", "Marketplace");
                    }

                    return View(companyModel);
                }
                else
                {
                    return RedirectToAction("Index", "Marketplace");
                }

            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

        }

        public async Task<ActionResult> CompanyQueueSchedule(string CompanyCode, string CalendarCode)
        {
            var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
            AddUpdateDelete calendarData = await businessUserService.GetMarcketPlaceCompanyCalendarByCompanyId(companyData.Data["Id"].ToString());
            //var serviceData = await globalMasterService.GetCompanyCategoryMaster();
            if (calendarData.Status)
            {
                var data = JsonConvert.SerializeObject(companyData.Data);
                var calendarEncrypted = JsonConvert.SerializeObject(calendarData.Data);
                //var serviceEncrypted = JsonConvert.SerializeObject(serviceData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                companyModel.calendars = JsonConvert.DeserializeObject<List<BusinessCalendarModel>>(calendarEncrypted);
                //companyModel.services = JsonConvert.DeserializeObject<List<BusinessCompanyCategoryModel>>(serviceEncrypted);

                ViewBag.IsUserFavorite = false;

                if (User.Identity.IsAuthenticated)
                {
                    if (UserIdentity.Role == "PUBLIC_USER")
                    {
                        // check if calendar is a favorite
                        var calendarFavCheck = await publicUserService.CheckSingleMyFavoriteCalendar(User.Identity.Name, CalendarCode);
                        if (calendarFavCheck.Status)
                        {
                            ViewBag.IsUserFavorite = true;
                        }
                    }
                }

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                if (!string.IsNullOrEmpty(companyModel.IS_TEMPLATE))
                {
                    if (companyModel.IS_TEMPLATE == "Y")
                        return RedirectToAction("Index", "Marketplace");
                }

                return View(companyModel);
            }
            else
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }

        public async Task<ActionResult> CompanyPhotoAlbum(string CompanyCode, string CalendarCode = null)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
                var photoAlbumData = await businessUserService.GetCompanyPhotoAlbumByCompanyId(companyData.Data["Id"].ToString());

                var photoAlbumEncrypt = JsonConvert.SerializeObject(photoAlbumData.Data);

                MarketplaceCompanyGalleryModel albumModel = new MarketplaceCompanyGalleryModel();

                albumModel.photoAlbumList = JsonConvert.DeserializeObject<List<CompanyPhotoAlbumModel>>(photoAlbumEncrypt);
                albumModel.Id = companyData.Data["Id"].ToString();
                albumModel.COMPANY_CODE = CompanyCode;
                albumModel.COMPANY_LOGO_PATH = companyData.Data["COMPANY_LOGO_PATH"].ToString();
                albumModel.DEFAULT_CALENDAR_ID = CalendarCode;

                ViewBag.Title = companyData.Data["COMPANY_NAME_ENGLISH"].ToString();

                if (!string.IsNullOrEmpty(companyData.Data["IS_TEMPLATE"]?.ToString()))
                {
                    if (companyData.Data["IS_TEMPLATE"]?.ToString() == "Y")
                        return RedirectToAction("Index", "Marketplace");
                }

                return View(albumModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

        }
        [HttpPost]
        public async Task<ActionResult> GetCalendarDetails(string id)
        {
            return Json(await businessUserService.GetCalendarDetails(id));
        }


        [HttpPost]
        public async Task<ActionResult> GetServiceList(string CompanyCode, string CalanderCode)
        {
            return Json(await businessUserService.GetServiceList(CalanderCode, CompanyCode));
        }

        public async Task<ActionResult> GetSingleBlogPost(string NewsId)
        {
            var data = await masterService.GetSingleBlogPost(NewsId);

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> GetAllBlogPosts(GenerateDynamicFormData data)
        {
            try
            {
                var transactionData = await masterService.GetAllBlogPosts(data);
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    last_page = Math.Floor(paging) + 1;
                }

                return Json(new { data = transactionList, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetAllFeaturedCompany(GenerateDynamicFormData data)
        {
            try
            {
                var transactionData = await masterService.GetAllFeaturedCompany(data);
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

                return Json(new { data = transactionList, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> GetCompanyCalendarPackages(string CompanyCode)
        {
            try
            {
                var packageData = await masterService.GetCompanyCalendarPackages(CompanyCode);

                return Json(new { packageData }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangeLanguage(int langId, string ReturnUrl)
        {
            switch (langId)
            {
                case 1:
                    ChangeCulture("en", ReturnUrl);
                    break;
                case 2:
                    ChangeCulture("zh-Hant", ReturnUrl);
                    break;
                default:
                    ChangeCulture("en", ReturnUrl);
                    break;
            }

            return RedirectToAction("Index");
        }

        private void ChangeCulture(string lang, string ReturnUrl)
        {
            try
            {
                Response.Cookies.Remove("Language");

                HttpCookie languageCookie = System.Web.HttpContext.Current.Request.Cookies["Language"];

                if (languageCookie == null) languageCookie = new HttpCookie("Language");

                languageCookie.Value = lang;

                languageCookie.Expires = DateTime.Now.AddDays(10);

                Response.SetCookie(languageCookie);

                Response.Redirect(ReturnUrl);
            }
            catch (Exception)
            {

            }
        }
    }
}