using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.DTO.MarketplaceModels;
using Barrway.Service.IRepository;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
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
        private readonly IBusinessUserService businessUserService;
        private readonly IGlobalMasterService globalMasterService;
        private readonly IMasterService masterService;

        public MarketPlaceController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService, IMasterService masterService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
            this.masterService = masterService;
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

            }catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }

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

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }

        public async Task<ActionResult> CompanySchedule(string CompanyCode, string CalendarCode = null)
        {

            try
            {
                var companyData = await businessUserService.GetSingleCompanyByCompanyCode(CompanyCode);
                var calendarData = await businessUserService.GetMarcketPlaceCompanyCalendarByCompanyId(companyData.Data["Id"].ToString());
                //var serviceData = await globalMasterService.GetCompanyCategoryMaster();

                var data = JsonConvert.SerializeObject(companyData.Data);
                var calendarEncrypted = JsonConvert.SerializeObject(calendarData.Data);
                //var serviceEncrypted = JsonConvert.SerializeObject(serviceData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);
                companyModel.DEFAULT_CALENDAR_ID = CalendarCode;
                companyModel.calendars = JsonConvert.DeserializeObject<List<BusinessCalendarModel>>(calendarEncrypted);
                //companyModel.services = JsonConvert.DeserializeObject<List<BusinessCompanyCategoryModel>>(serviceEncrypted);

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                return View(companyModel);
            }
            catch (Exception ex)
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



    }
}