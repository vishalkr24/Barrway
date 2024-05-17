using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.AuthViewModel
{
    public class PhoenSignUpViewModel
    {
        [Required(ErrorMessage = "User name is required.")]
        public string USER_NAME { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        public string FIRST_NAME { get; set; }
        public string LAST_NAME { get; set; }

        [Required(ErrorMessage = "Phoen is required")]
        
        public string USER_PHONE { get; set; }
        public string Country_Code { get; set; }
        public string Country_Origin_Code { get; set; }


        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\"\\|,.<>\\/?]).+$", ErrorMessage = "Create a strong password.")]
        public string USER_PASSWORD { get; set; }



        [Required(ErrorMessage = "Confirm your password")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        [Compare("USER_PASSWORD", ErrorMessage = "Confirm password does not match")]

        public string USER_CONFIRM_PASSWORD { get; set; }

        [Required(ErrorMessage = "Please check our terms & conditions")]
        public bool TERMS_ACCEPTED { get; set; }


        public bool IS_EXTERNAL_SIGNUP { get; set; } = false;
        public string ReturnUrl { get; set; }
    }


    public class PhoneOtp
    {
        [Required(ErrorMessage = "Please enter OTP")]
       
        public string OTP { get; set; }
    }
}
