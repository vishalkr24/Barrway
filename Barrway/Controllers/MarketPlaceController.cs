using Barrway.DTO.BusinessModels;
using Barrway.DTO.MarketplaceModels;
using Barrway.Service.IRepository;
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

        public MarketPlaceController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
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




    }
}