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
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.PublicModels;
using Barrway.DTO.UserAdminModels;
using Barrway.DTO.MarketplaceModels;
using Barrway.Utility.Common;

namespace Barrway.Service.IRepository
{
    public interface ISuperAdminUserService
    {
        Task<AddUpdateDelete> GetDashboardData();
        Task<AddUpdateDelete> GetAllUsers(GenerateDynamicFormData data, string role);
        Task<AddUpdateDelete> ActiveInactiveUser(string UserId, string Status);
        Task<AddUpdateDelete> GetCompanyMasterWithCalendars(GenerateDynamicFormData data, string UserId);
    }
}
