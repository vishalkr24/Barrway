using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.AuthViewModel
{
    public class EmailSignUpViewModel
    {
        [Required(ErrorMessage = "User name is required.")]
        public string USER_NAME { get; set; }


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter a valid Email")]
        public string USER_EMAIL { get; set; }


        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        public string USER_PASSWORD { get; set; }



        [Required(ErrorMessage = "Confirm your password")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        [Compare("USER_PASSWORD", ErrorMessage = "Confirm password does not match")]

        public string USER_CONFIRM_PASSWORD { get; set; }

        [Required(ErrorMessage = "Please check our terms & conditions")]
        public bool TERMS_ACCEPTED { get; set; }


        public bool IS_EXTERNAL_SIGNUP { get; set; }

    }

    
}
