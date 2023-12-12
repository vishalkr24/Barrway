using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class UserAssignedCompanyModel
    {
        public string Id { get; set; }
        public string ASSIGN_ID { get; set; }
        public string COMPANY_ID { get; set; }
        public string STATUS { get; set; } = "ACTIVE";
    }


}
