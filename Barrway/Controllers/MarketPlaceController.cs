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
using System.IO;
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
        private readonly ICalendarService calendarService;

        public MarketPlaceController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService, IMasterService masterService, IPublicUserService publicUserService, IAuthService authService, IFormAPIRepository formAPIRepository, ICalendarService calendarService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
            this.masterService = masterService;
            this.publicUserService = publicUserService;
            this.authService = authService;
            this.formAPIRepository = formAPIRepository;
            this.calendarService = calendarService;
        }

        // GET: MarketPlace
        [HttpPost]
        public async Task<ActionResult> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetLocationMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetServiceMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetServiceProviderMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceProviderMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        public async Task<ActionResult> Index()
        {

            FeaturedCompanyList featuredCompany = new FeaturedCompanyList();
            var transactionData = await masterService.GetAllFeaturedCompany();
            var FCompanys = JsonConvert.SerializeObject(transactionData.Data);
            featuredCompany.FeaturedCompanys = JsonConvert.DeserializeObject<List<FeaturedCompany>>(FCompanys);
            featuredCompany.FeaturedCompanys.ForEach(company =>
            {
                var JsonTags = company.TAGS;
                if (JsonTags != null)
                {
                    List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                    company.TAGs = Tagobjects;
                }
            });
            return View(featuredCompany);
        }

        public async Task<ActionResult> ComingSoon()
        {
            return View();
        }

        public async Task<ActionResult> Error404()
        {
            return View();
        }

        public async Task<ActionResult> BusinessSite()
        {
            return View();
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

        public async Task<ActionResult> AllCalanders()
        {
            return View();
        }


        public async Task<ActionResult> GetAllCalenderByCategory(CalandersPagination data)
        {
            try
            {
                var Heading = await masterService.GetHeaderDetails(data);
                var transactionData = await masterService.AllCalandersByCategory(data);
                var transactionList = transactionData.Data;
                double last_page = 0;
                double Pagination = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    Pagination = Math.Ceiling(paging);///Math.Floor(paging);

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }
                return Json(new { data = transactionList, last_page, Pagination, Heading }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }




        public async Task<ActionResult> Subcategory()
        {
            return View();
        }



        public async Task<ActionResult> GetAllSubcategory()
        {
            try
            {
                var transactionData = await masterService.GetAllSubcategory();
                return Json(new { data = transactionData }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public async Task<ActionResult> GetAllCompany_SubCategoryWise(Pagination data)
        {
            try
            {
                var transactionData = await masterService.GetAllCompany_SubCategoryWise(data);
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




        public async Task<ActionResult> Blogs()
        {
            BlogViewModel blogs = new BlogViewModel();
            List<Tag> FinalTagList = new List<Tag>();
            var featuredResult = await businessUserService.GetFeaturedBlogs();
            blogs.FeaturedBlogs = JsonConvert.DeserializeObject<List<Blog>>(JsonConvert.SerializeObject(featuredResult.Data));
            if (blogs.FeaturedBlogs.Count() > 0)
            {
                blogs.FeaturedBlogs.ForEach(blog =>
                {
                    var JsonTags = blog.TAG;
                    if (JsonTags != null)
                    {
                        List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                        blog.TAGs = Tagobjects;
                    }
                });
            }
            //var blogResult = await businessUserService.GetBlogs();
            //blogs.BlogList = JsonConvert.DeserializeObject<List<Blog>>(JsonConvert.SerializeObject(blogResult.Data));
            //if (blogs.BlogList.Count > 0)
            //{
            //    blogs.BlogList.ForEach(blog =>
            //    {
            //        var JsonTags = blog.TAG;
            //        if (JsonTags != null)
            //        {
            //            List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
            //            blog.TAGs = Tagobjects;
            //        }
            //    });
            //}

            var Tagresult = await businessUserService.GetAllBlogsTags();
            var TagList = Tagresult.Data;
            if (Tagresult.Data.Count() > 0)
            {
                TagList.ForEach(tagItem =>
                {
                    var JsonTags = tagItem.TAG;
                    if (JsonTags != null)
                    {
                        List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                        Tagobjects.ForEach(tagObject =>
                        {
                            var stringTag = tagObject.value;
                            bool stringExists = FinalTagList.Any(tag => tag.TAG == stringTag);

                            if (!stringExists)
                            {
                                FinalTagList.Add(new Tag { TAG = stringTag });
                            }
                        });
                    }
                });
            }
            blogs.TagList = FinalTagList;
            return View(blogs);
        }



        public async Task<ActionResult> BlogDetails(string id = null)
        {
            BlogDetailsViewModel model = new BlogDetailsViewModel();

            if (!string.IsNullOrEmpty(id))
            {

                var blogResult = await businessUserService.GetBlogbyId(id);
                if (blogResult.Status)
                {
                    model.Blog = JsonConvert.DeserializeObject<Blog>(JsonConvert.SerializeObject(blogResult.Data));


                    if (!string.IsNullOrEmpty(model.Blog.TAG))
                    {
                        model.Blog.TAGs = JsonConvert.DeserializeObject<List<TagsObject>>(model.Blog.TAG);
                    }
                }


                var featuredBlogsResult = await businessUserService.GetFeaturedBlogs();
                if (featuredBlogsResult.Status)
                {
                    model.FeaturedBlogs = JsonConvert.DeserializeObject<List<Blog>>(JsonConvert.SerializeObject(featuredBlogsResult.Data));


                    foreach (var featuredBlog in model.FeaturedBlogs)
                    {
                        if (!string.IsNullOrEmpty(featuredBlog.TAG))
                        {
                            featuredBlog.TAGs = JsonConvert.DeserializeObject<List<TagsObject>>(featuredBlog.TAG);
                        }
                    }
                }
            }

            return View(model);
        }



        public async Task<ActionResult> BusinessPost()
        {
            return View();
        }

        [Route("company/{id}/{Cid?}")]
        public async Task<ActionResult> Company(string id, string Cid = null)
        {
            try
            {

                string CompanyCode = id;
                string CalendarCode = Cid;
                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
                if (companyData.Data == null)
                {
                    return RedirectToAction("Index", "Marketplace");
                }
                var data = JsonConvert.SerializeObject(companyData.Data);
                
                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                companyModel.PAGE_URL = id;

                var ClanderSubCategory = await businessUserService.GetCalanderSubCategoryNameList(CompanyCode);  
                if(ClanderSubCategory.Data != null)
                {
                    
                    companyModel.CALENDAR_SUB_CATEGORY_NAME_List = JsonConvert.DeserializeObject<List<CALENDAR_SUB_CATEGORY>>(JsonConvert.SerializeObject(ClanderSubCategory.Data));
                }
                

                var ClanderCategory = await businessUserService.GetCalanderCategoryNameList(CompanyCode);
                if(ClanderCategory.Data != null)
                {
                    companyModel.CALENDAR_CATEGORY_NAME_List = JsonConvert.DeserializeObject<List<CALENDAR_CATEGORY>>(JsonConvert.SerializeObject(ClanderCategory.Data));
                }
                


                if (!string.IsNullOrEmpty(companyModel.TAGS))
                {
                    companyModel.TAGs = JsonConvert.DeserializeObject<List<TagsObject>>(companyModel.TAGS);
                }
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

        [Route("company/service/{id}/{Cid?}")]
        public async Task<ActionResult> Service(string id, string Cid = null)
        {
            try
            {
                string CompanyCode = id;
                string CalendarCode = Cid;

                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }



                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                companyModel.PAGE_URL = id;

                var servilces = await businessUserService.GetServiceList(CalendarCode, CompanyCode);
                var servilcesEncrypted = JsonConvert.SerializeObject(servilces.Data);
                companyModel.ServicesList = JsonConvert.DeserializeObject<List<ServicesList>>(servilcesEncrypted);

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

        [Route("company/package/{id}/{Cid?}")]
        public async Task<ActionResult> Package(string id, string Cid = null)
        {
            try
            {

                string CompanyCode = id;
                string CalendarCode = Cid;
                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }

                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                companyModel.PAGE_URL = id;

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

        public async Task<ActionResult> CheckSingleFavoriteCalendar(string CalendarCode)
        {
            if (User.Identity.IsAuthenticated)
            {
                var calendarFavCheck = await publicUserService.CheckSingleMyFavoriteCalendar(User.Identity.Name, CalendarCode);
                return Json(calendarFavCheck, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Kindly login to see favorite calendar." }, JsonRequestBehavior.AllowGet);
            }

        }

        [Route("company/calander/{id}/{Cid?}")]
        public async Task<ActionResult> Calander(string id = null, string Cid = null)
        {
            try
            {

                string PageUrl = id;
                string CompanyCode = id;
                string CalendarCode = Cid;

                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }




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
                    companyModel.PAGE_URL = PageUrl;

                    if (!companyModel.calendars.Any(x => x.CALENDAR_CODE == CalendarCode && x.STATUS == "PUBLISH"))
                    {
                        return RedirectToAction("Index", "Marketplace");
                    }


                    if (CalendarCode == null)
                    {
                        CalendarCode = companyModel.calendars[0].CALENDAR_CODE;
                    }

                    if (!string.IsNullOrEmpty(CalendarCode))
                    {
                        if (companyModel.calendars.Any(x => x.CALENDAR_FUNCTION_TYPE == "QUEUE" && x.CALENDAR_CODE == CalendarCode))
                        {
                            //company/Queue/{id}/{Cid
                            //return RedirectToAction("CompanyQueueSchedule", new { CompanyCode = CompanyCode, CalendarCode = CalendarCode });
                            return Redirect("/company/Queue/" + CompanyCode + "/" + CalendarCode);
                            // return Redirect("/ControllerName/ActionName");
                        }
                    }

                    var servilces = await businessUserService.GetServiceList(CalendarCode, CompanyCode);
                    var servilcesEncrypted = JsonConvert.SerializeObject(servilces.Data);
                    companyModel.ServicesList = JsonConvert.DeserializeObject<List<ServicesList>>(servilcesEncrypted);
                    //companyModel.services = JsonConvert.DeserializeObject<List<BusinessCompanyCategoryModel>>(serviceEncrypted);

                    ViewBag.IsUserFavorite = false;

                    if (User.Identity.IsAuthenticated)
                    {
                        if (UserIdentity.Role == "PUBLIC_USER" || UserIdentity.Role == "GENERAL_USER")
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
                    ViewBag.PageURl = PageUrl;
                    ViewBag.CalendarCode = CalendarCode;
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

        [Route("company/calanderyearview/{id}/{Cid?}")]
        public async Task<ActionResult> CalanderYearView(string id = null, string Cid = null)
        {
            try
            {

                string PageUrl = id;
                string CompanyCode = id;
                string CalendarCode = Cid;

                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }




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
                    companyModel.PAGE_URL = PageUrl;




                    if (CalendarCode == null)
                    {
                        CalendarCode = companyModel.calendars[0].CALENDAR_CODE;
                    }

                    if (!string.IsNullOrEmpty(CalendarCode))
                    {
                        if (companyModel.calendars.Any(x => x.CALENDAR_FUNCTION_TYPE == "QUEUE" && x.CALENDAR_CODE == CalendarCode))
                        {
                            //company/Queue/{id}/{Cid
                            //return RedirectToAction("CompanyQueueSchedule", new { CompanyCode = CompanyCode, CalendarCode = CalendarCode });
                            return Redirect("/company/Queue/" + CompanyCode + "/" + CalendarCode);
                            // return Redirect("/ControllerName/ActionName");
                        }
                    }

                    var servilces = await businessUserService.GetServiceList(CalendarCode, CompanyCode);
                    var servilcesEncrypted = JsonConvert.SerializeObject(servilces.Data);
                    companyModel.ServicesList = JsonConvert.DeserializeObject<List<ServicesList>>(servilcesEncrypted);
                    //companyModel.services = JsonConvert.DeserializeObject<List<BusinessCompanyCategoryModel>>(serviceEncrypted);

                    ViewBag.IsUserFavorite = false;

                    if (User.Identity.IsAuthenticated)
                    {
                        if (UserIdentity.Role == "PUBLIC_USER" || UserIdentity.Role == "GENERAL_USER")
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
                    ViewBag.PageURl = PageUrl;
                    ViewBag.CalendarCode = CalendarCode;
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


        [Route("company/Queue/{id}/{Cid?}")]
        public async Task<ActionResult> CompanyQueueSchedule(string id, string Cid)
        {

            string CompanyCode = id;
            string CalendarCode = Cid;



            var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
            if (Compay.Status == true)
            {
                CompanyCode = Compay.Data["COMPANY_CODE"];
            }
            else
            {
                return RedirectToAction("Error404", "Marketplace");
            }

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
                companyModel.PAGE_URL = id;
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
        [Route("company/gallery/{id}/{Cid?}")]
        public async Task<ActionResult> Photogallery(string id, string Cid = null)
        {
            try
            {
                string CompanyCode = id;
                string CalendarCode = Cid;


                var Compay = await businessUserService.GetCompanyCodeByPageUrl(id);
                if (Compay.Status == true)
                {
                    CompanyCode = Compay.Data["COMPANY_CODE"];
                }
                else
                {
                    return RedirectToAction("Error404", "Marketplace");
                }



                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
                var photoAlbumData = await businessUserService.GetCompanyPhotoAlbumByCompanyId(companyData.Data["Id"].ToString());

                var photoAlbumEncrypt = JsonConvert.SerializeObject(photoAlbumData.Data);

                MarketplaceCompanyGalleryModel albumModel = new MarketplaceCompanyGalleryModel();

                albumModel.photoAlbumList = JsonConvert.DeserializeObject<List<CompanyPhotoAlbumModel>>(photoAlbumEncrypt);
                albumModel.Id = companyData.Data["Id"].ToString();
                albumModel.COMPANY_CODE = CompanyCode;
                albumModel.COMPANY_LOGO_PATH = companyData.Data["COMPANY_LOGO_PATH"].ToString();
                albumModel.DEFAULT_CALENDAR_ID = CalendarCode;
                albumModel.PAGE_URL = id;

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
            var calendarDetails = await businessUserService.GetCalendarDetails(id);
            if (calendarDetails.Status)
            {
                var calendarDetails_data = calendarDetails.Data as IDictionary<string, object>;
                using (StreamReader sr = new StreamReader(Server.MapPath("~/CalendarSetupMatrix/CalendarSetupMatrix.json")))
                {
                    var json = sr.ReadToEnd();
                    dynamic jsonData = JsonConvert.DeserializeObject(json);
                    //CALENDAR_CATEGORY_ID
                    string clr_categoryId = calendarDetails_data["CALENDAR_CATEGORY_ID"].ToString();
                    calendarDetails_data.Add("setup_matrix", jsonData["Type" + clr_categoryId].ToString());
                    calendarDetails.Data = calendarDetails_data;
                }
            }
            return Json(calendarDetails);
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


        //GetAllBlog

        public async Task<ActionResult> GetAllBlog(Pagination data)
        {
            try
            {
                dynamic transactionData ;
                if (data.Hot > 0)
                {
                    transactionData = await masterService.GetallHotblogs(data); //GetAllBlog
                }
                else
                {
                    transactionData = await masterService.GetAllBlog(data);
                }
                
                var transactionList = transactionData.Data;
                double last_page = 0;
                double Pagination = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    Pagination = Math.Ceiling(paging);
                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }

                    //last_page = Math.Floor(paging) + 1;
                }

                return Json(new { data = transactionList, last_page, Pagination }, JsonRequestBehavior.AllowGet);
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
                double Pagination = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    Pagination = Math.Ceiling(paging);///Math.Floor(paging);

                    if (total_records == size)
                    {
                        last_page = Math.Floor(paging);
                    }
                    else
                    {
                        last_page = Math.Floor(paging) + 1;
                    }
                }

                return Json(new { data = transactionList, last_page, Pagination }, JsonRequestBehavior.AllowGet);
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

                languageCookie.Expires = DateTimeUtility.Now().AddDays(10);

                Response.SetCookie(languageCookie);

                Response.Redirect(ReturnUrl);
            }
            catch (Exception)
            {

            }
        }


        [HttpPost]
        public async Task<ActionResult> GetFeaturedBlogs()
        {
            return Json(await businessUserService.GetFeaturedBlogs());
        }

        [HttpPost]
        public async Task<ActionResult> GetBlogs()
        {
            return Json(await businessUserService.GetBlogs());
        }


        [HttpPost]
        public async Task<ActionResult> GetBlogsTags()
        {
            return Json(await businessUserService.GetAllBlogsTags());
        }

        public async Task<ActionResult> Search(string keyword)
        {
            SearchResultsModel finalResult = new SearchResultsModel();

            try
            {
                if (keyword != "")
                {
                    var Service = await masterService.GetServiceList(keyword);
                    //var company = (await masterService.GetCompanyListt(keyword)).Data as List<IDictionary<string,object>>;
                    var company = await masterService.GetCompanyListt(keyword);
                    var Blog = await masterService.GetBloagListt(keyword);

                    finalResult.ServiceList = JsonConvert.DeserializeObject<List<CompanyService>>(JsonConvert.SerializeObject(Service.Data));
                    finalResult.CompanyLIst = JsonConvert.DeserializeObject<List<Company>>(JsonConvert.SerializeObject(company.Data));
                    finalResult.BlogLIst = JsonConvert.DeserializeObject<List<blog>>(JsonConvert.SerializeObject(Blog.Data));

                    if (finalResult.ServiceList.Count > 0)
                    {
                        finalResult.ServiceList.ForEach(service =>
                        {
                            var JsonTags = service.TAGS;
                            if (JsonTags != null)
                            {
                                List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                                service.TAGs = Tagobjects;
                            }
                        });
                    }


                    if (finalResult.CompanyLIst.Count > 0)
                    {
                        finalResult.CompanyLIst.ForEach(comp =>
                        {
                            var JsonTags = comp.TAGS;
                            if (JsonTags != null)
                            {
                                List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                                comp.TAGs = Tagobjects;
                            }
                        });
                    }



                    if (finalResult.BlogLIst.Count > 0)
                    {
                        finalResult.BlogLIst.ForEach(blog =>
                        {
                            var JsonTags = blog.TAG;
                            if (JsonTags != null)
                            {
                                List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
                                blog.TAGs = Tagobjects;
                            }
                        });
                    }




                }
            }
            catch (Exception ex)
            {

            }
            finalResult.keyword = keyword;

            return View(finalResult);

        }


        //[AllowAnonymous]
        //[HttpPost]
        //public async Task<ActionResult> GetCalendarMasterConfig(string code) {

        // var calendarMaster=   await calendarService.GetCalendarMaster(code);
        // if (calendarMaster == null) return Json(new AddUpdateDelete() { Status=false,Message=AppMessage.NotFound});

        //    using (StreamReader r = new StreamReader(Server))
        //    {
        //        string json = r.ReadToEnd();
        //    }

        //    return Json(new );
        //}
    }
}