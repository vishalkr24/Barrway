using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.AuthViewModel
{
    public class BusinessEmailSignUpViewModel
    {
        [Required(ErrorMessage = "User name is required.")]
        public string USER_NAME { get; set; }


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter a valid Email")]
        public string USER_EMAIL { get; set; }


        [Required(ErrorMessage = "Password is required")]
        public string USER_PASSWORD { get; set; }



        [Required(ErrorMessage = "Confirm your password")]
        
        public string USER_CONFIRM_PASSWORD { get; set; }


       
        public bool IS_EXTERNAL_SIGNUP { get; set; }

    }

    
}
