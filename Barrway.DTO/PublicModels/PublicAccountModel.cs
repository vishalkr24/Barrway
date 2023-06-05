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

        public string PROFILE_PHOTO_PATH { get; set; } = string.Empty;
        public string PROFILE_PHOTO_NAME { get; set; } = string.Empty;
        public string FIRST_NAME { get; set; } = string.Empty;
        public string LAST_NAME { get; set; } = string.Empty;
        public string CHINESE_NAME { get; set; } = string.Empty;
        public string NICK_NAME { get; set; } = string.Empty;
        public string GENDER { get; set; } = string.Empty;
        public string DATE_OF_BIRTH { get; set; } = DateTime.Now.ToString("yyyy-MM-dd");

    }

}
