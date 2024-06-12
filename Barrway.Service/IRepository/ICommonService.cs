using Barrway.DTO.FormAPI;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface ICommonService
    {
        Task ModifyEventsData(Form_DataTable data, ReferalFormDataResponseModel result,string userEmail);
    }
}
