using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Account
{
    
    public class UserProfile
    {
        public int Id { get; set; }
        public string USER_ID { get; set; }
        public string USER_EMAIL { get; set; }       
        public string Country_Code { get; set; }
        public string USER_PHONE { get; set; }
        public string IS_EXTERNAL_SIGNUP { get; set; }
        public string IS_EMAIL_VERIFIED { get; set; }
        public string IS_PHONE_VERIFIED { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
        public string IS_ACTIVE { get; set; }
        public string PROFILE_STATUS { get; set; }
        public string ROLE_ID { get; set; }
        public string SIGNUP_TYPE { get; set; }
        public string SUBSCRIPTION_PLAN_ID { get; set; }
        public string CURRENT_STEP { get; set; }
        public string FIRST_NAME { get; set; }
        public string LAST_NAME { get; set; }
        public string PROFILE_PHOTO_PATH { get; set; }
        public string PROFILE_PHOTO_NAME { get; set; }
        public string CHINESE_NAME { get; set; }
        public string NICK_NAME { get; set; }
        public string GENDER { get; set; }
        public DateTime DATE_OF_BIRTH { get; set; }
    }


}
