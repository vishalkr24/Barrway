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
    public interface IBusinessUserService
    {
        Task<AddUpdateDelete> CreateBusinessWebsite(BusinessAccountWebsiteModel model);
        Task<AddUpdateDelete> GetSingleBusinessWebsite(string UserId);
       
        Task<AddUpdateDelete> GetSingleCompanyById(string Id);
        Task<AddUpdateDelete> GetAllCompaniesByUserId(string UserId); 
        Task<AddUpdateDelete> GetSingleCalendarById(string Id);

        Task<AddUpdateDelete> AddCompany(BusinessCompanyModel model, string UserId, bool IsDefault = false);

        Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId);

        Task<AddUpdateDelete> GetSingleCompanyByCompanyCode(string CompanyCode);
        Task<AddUpdateDelete> GetDefaultCompanyByBusinessId(string BusinessAccountId);
        Task<AddUpdateDelete> GetDefaultCompanyByUserId(string UserId);
        Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByUserId(string userId, bool isActive);
        Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByBusinessId(string businessId, bool isActive);



    }
}
