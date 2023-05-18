using Barrway.DTO.BusinessModels;
using Barrway.DTO.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.PublicModels
{
    public class PublicAccountModel
    {
        public string Id { get; set; }
        public string CURRENT_STEP { get; set; }
        public string SUBSCRIPTION_PLAN_ID { get; set; }
        public string USER_ID { get; set; }

    }

}
