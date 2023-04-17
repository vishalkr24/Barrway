using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class UserMaserModel
    {
        public string USER_ID { get; set; }
        public string USER_PASSWORD { get; set; }
        public string USER_EMAIL { get; set; }
        public string USER_PHONE { get; set; }
        public string IS_EXTERNAL_SIGNUP { get; set; }
        public string IS_EMAIL_VERIFIED { get; set; }
        public string IS_PHONE_VERIFIED { get; set; }
        public string IS_ACTIVE { get; set; }
        public string PROFILE_STATUS { get; set; }  
        public string ROLE_ID { get; set; }
        public string SIGNUP_TYPE { get; set; }

    }
}
