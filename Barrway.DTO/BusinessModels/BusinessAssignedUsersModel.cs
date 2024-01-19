using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessAssignedUsersModel
    {
        public string ASSIGNED_USER { get; set; }
        public string COMPANY_ID { get; set; }
        public string ROLE_TYPE { get; set; } = "ADMIN";
    }
}
