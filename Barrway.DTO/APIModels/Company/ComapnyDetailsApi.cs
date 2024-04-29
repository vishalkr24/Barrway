using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Company
{
    public class ComapnyInformationApi<T> where T : class
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object  Data { get; set; }
    }


   
}
