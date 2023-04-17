using Barrway.DTO.Common;
using Dapper;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface ISignupService
    {
        Task<AddUpdateDelete> RegisterUser(IDictionary<string, object> keyValuePairs);
        
    }
}
