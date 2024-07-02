using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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


    public class UpdateUserProfileModel
    {
        public string Id { get; set; } = String.Empty;

        public string USER_ID { get; set; } = String.Empty;
        public string FIRST_NAME { get; set; } = String.Empty;
        public string LAST_NAME { get; set; } = String.Empty;
        public string CHINESE_NAME { get; set; } = String.Empty;
        public string NICK_NAME { get; set; } = String.Empty;
        public string GENDER { get; set; } = String.Empty;
        public DateTime? DATE_OF_BIRTH { get; set; }
        public string USER_EMAIL { get; set; } = String.Empty;
        public string Country_Code { get; set; } = String.Empty;
        public string USER_PHONE { get; set; } = String.Empty;

    }



    public class UpdateUserProfileViewModel
    {
        public string Id { get; set; } = String.Empty;
        public string FIRST_NAME { get; set; } = String.Empty;
        public string LAST_NAME { get; set; } = String.Empty;
        public string CHINESE_NAME { get; set; } = String.Empty;
        public string NICK_NAME { get; set; } = String.Empty;
        public string GENDER { get; set; } = String.Empty;
        public DateTime? DATE_OF_BIRTH { get; set; }
        public string USER_EMAIL { get; set; } = String.Empty;
        public string Country_Code { get; set; } = String.Empty;
        public string USER_PHONE { get; set; } = String.Empty;

    }

    public class UpdateUserProfileAPIViewModel
    {
        public string FIRST_NAME { get; set; } = String.Empty;
        public string LAST_NAME { get; set; } = String.Empty;
        public string CHINESE_NAME { get; set; } = String.Empty;
        public string NICK_NAME { get; set; } = String.Empty;
        public string GENDER { get; set; } = String.Empty;
        public DateTime? DATE_OF_BIRTH { get; set; }
    }

    public class RequestMobileNoChangeOTPViewModel
    {
        public string New_Phone { get; set; } = String.Empty;
        public int Country_Code { get; set; }
    }

    public class UpdateMobileNoViewModel
    {
        public string New_Phone { get; set; } = String.Empty;
        public int Country_Code { get; set; }
        public string OTP { get; set; } = String.Empty;
    }

    public class userPassword
    {
        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("newpassword", ErrorMessage = "Confirm Password did to matched !")]
        public string confirmpassword { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\"\\|,.<>\\/?]).+$", ErrorMessage = "Create a strong password.")]
        public string newpassword { get; set; }
    }

}
