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
        [Required]
        public string USER_NAME { get; set; }
        [Required]
        [EmailAddress]
        public string USER_EMAIL { get; set; }
        [Required]
        public string USER_PASSWORD { get; set; }
       
        public bool IS_EXTERNAL_SIGNUP { get; set; }

    }
    
}
