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


    public class CompanyServiceDetails
    {
        public String ServiceDescription { get; set; }

        public List<ServiceList> ServiceList { get; set; }
    }


    public class ServiceList
    {
        public int Id { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string DESCRIPTION { get; set; }
    }

    public class ServiceString
    {
        public int Id { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string DESCRIPTION { get; set; }
    }

    



}
