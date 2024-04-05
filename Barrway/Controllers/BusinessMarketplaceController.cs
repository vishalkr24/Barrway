using Barrway.DTO.Common;
using Barrway.DTO.PublicModels;
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
    public class BusinessMarketplaceController : BaseController
    {

       
        private readonly IMasterService masterService;
        

        public BusinessMarketplaceController( IMasterService masterService)
        {
          
            this.masterService = masterService;
            
        }


        // GET: BusinessMarketplace
        public async Task<ActionResult> Index()
        {
            FeaturedCompanyList featuredCompany = new FeaturedCompanyList();
            var transactionData = await masterService.GetAllFeaturedCompany();            
            var FCompanys = JsonConvert.SerializeObject(transactionData.Data);
            featuredCompany.FeaturedCompanys = JsonConvert.DeserializeObject<List<FeaturedCompany>>(FCompanys);

            //for (int i = 0; i < featuredCompany.FeaturedCompanys.Count(); i++)
            //{
            //    var JsonTags = featuredCompany.FeaturedCompanys[i].TAG;
            //    if (JsonTags != null)
            //    {
            //        List<TagsObject> Tagobjects = JsonConvert.DeserializeObject<List<TagsObject>>(JsonTags);
            //        featuredCompany.FeaturedCompanys[i].TAGs = Tagobjects;
            //    }
            //}

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

        public async Task<ActionResult> GetAllFeaturedComapy()
        {
            try
            {
                var transactionData = await masterService.GetAllFeaturedCompany();
                return Json(new { data = transactionData }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Features()
        {
            return View();
        }

        public ActionResult Pricing()
        {
            return View();
        }

    }
}