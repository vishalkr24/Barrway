using Barrway.DTO.Common;
using Barrway.DTO.BusinessModels;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barrway.DTO.AuthViewModel;

namespace Barrway.Service.IRepository
{
    public interface IGlobalMasterService
    {
        Task<AddUpdateDelete> GetCompanyCategoryMaster();
        Task<AddUpdateDelete> GetCompanySubCategoryMaster();
        Task<AddUpdateDelete> GetFilterCompanyData(string SubCategoryId, string DistrictId);
        Task<AddUpdateDelete> GetCompanySubCategoryMaster(string CategoryId);
        Task<AddUpdateDelete> GetCountryMaster();
        Task<AddUpdateDelete> GetCityMaster(string CountryId);
        Task<AddUpdateDelete> GetDistrictMaster();
        Task<AddUpdateDelete> GetDistrictMaster(string DisctrictId);
        
        Task<AddUpdateDelete> GetCalendarCategoryMaster();
        Task<AddUpdateDelete> GetCalendarSubCategoryMaster(string CalendarCategoryId);
        

    }
}
