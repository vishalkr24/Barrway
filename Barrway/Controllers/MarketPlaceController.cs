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
                var data = globalMasterService.GetSingleTagData(tag);
                return View();


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

        public async Task<ActionResult> CompanyDetail(string CompanyId)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyById(CompanyId);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);


                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }
            
            
        }

        public async Task<ActionResult> CompanyService(string CompanyId)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyById(CompanyId);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }
            
        }

        public async Task<ActionResult> CompanyPackage(string CompanyId)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyById(CompanyId);

                var data = JsonConvert.SerializeObject(companyData.Data);

                MarketplaceCompanyModel companyModel = JsonConvert.DeserializeObject<MarketplaceCompanyModel>(data);

                ViewBag.Title = companyModel.COMPANY_NAME_ENGLISH;

                return View(companyModel);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }

        public async Task<ActionResult> CompanySchedule()
        {
            return View();
        }

        public async Task<ActionResult> CompanyPhotoAlbum(string CompanyId)
        {
            try
            {
                var companyData = await businessUserService.GetSingleCompanyById(CompanyId);
                var photoAlbumData = await businessUserService.GetCompanyPhotoAlbumByCompanyId(CompanyId);

                var photoAlbumEncrypt = JsonConvert.SerializeObject(photoAlbumData.Data);

                MarketplaceCompanyGalleryModel albumModel = new MarketplaceCompanyGalleryModel();

                albumModel.photoAlbumList = JsonConvert.DeserializeObject<List<CompanyPhotoAlbumModel>>(photoAlbumEncrypt);
                albumModel.Id = CompanyId;
                albumModel.COMPANY_LOGO_PATH = companyData.Data["COMPANY_LOGO_PATH"].ToString();

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