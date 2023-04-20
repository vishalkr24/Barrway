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
    }
}
