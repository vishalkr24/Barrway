using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.PublicModels
{
    public class PublicUserProfileModel
    {
        public string Id { get; set; } = String.Empty;
        public string CURRENT_STEP { get; set; } = String.Empty;
        public string SUBSCRIPTION_PLAN_ID { get; set; } = String.Empty;
        public string USER_ID { get; set; } = String.Empty;

        public string PROFILE_PHOTO_PATH { get; set; } = String.Empty;
        public string PROFILE_PHOTO_NAME { get; set; } = String.Empty;
        public string FIRST_NAME { get; set; } = String.Empty;
        public string LAST_NAME { get; set; } = String.Empty;
        public string CHINESE_NAME { get; set; } = String.Empty;
        public string NICK_NAME { get; set; } = String.Empty;
        public string GENDER { get; set; } = String.Empty;
        public DateTime? DATE_OF_BIRTH { get; set; }

        public string USER_EMAIL { get; set; } = String.Empty;

        public string USER_PASSWORD { get; set; } = String.Empty;
        public string Country_Code { get; set; } = String.Empty;
        public string USER_PHONE { get; set; } = String.Empty;

    }
}
