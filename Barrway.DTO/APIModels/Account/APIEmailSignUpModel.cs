using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Account
{
    public class APIEmailSignUpModel
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
        [Required(ErrorMessage = "Phoene is required")]

        public string USER_PHONE { get; set; }
        [Required(ErrorMessage = "Country code is required")]
        public string Country_Code { get; set; }
       

        public bool IS_EXTERNAL_SIGNUP { get; set; } = false;


    }
}
