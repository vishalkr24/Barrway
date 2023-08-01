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
using Barrway.Security;
using FormGeneratorDTOs.DTOs;

namespace Barrway.Controllers
{
    public class PublicController : BaseController
    {

        private readonly IBusinessUserService businessUserService;
        private readonly IGlobalMasterService globalMasterService;

        public PublicController(IBusinessUserService businessUserService, IGlobalMasterService globalMasterService)
        {
            this.businessUserService = businessUserService;
            this.globalMasterService = globalMasterService;
        }

        #region Data Methods

        public async Task<string> GetRole()
        {
            if (User.Identity.IsAuthenticated)
            {
                return UserIdentity.Role.ToString();
            }
            else
            {
                return null;
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

        public async Task<ActionResult> GetAllDistrictMaster()
        {
            try
            {
                var result = await globalMasterService.GetDistrictMaster();

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

        public async Task<ActionResult> GetAllCompanySubCategory()
        {
            try
            {
                var subCategoryData = await globalMasterService.GetCompanySubCategoryMaster();

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = subCategoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public async Task<ActionResult> GetFilterCompanyData(string SubCategoryId, string DistrictId)
        {
            try
            {
                var Data = await globalMasterService.GetFilterCompanyData(SubCategoryId, DistrictId);

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = Data.Data }, JsonRequestBehavior.AllowGet);
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

        public async Task<ActionResult> GetAllCalendarSubCategory()
        {
            try
            {
                var subCategoryData = await globalMasterService.GetCalendarSubCategoryMaster();

                return Json(new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = subCategoryData.Data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        #endregion
    }
}