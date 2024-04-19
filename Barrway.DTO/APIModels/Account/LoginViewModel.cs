using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Account
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Please Enter Email!!")]
        [EmailAddress(ErrorMessage = "Please Enter Valid Email!!")]
        public string USER_EMAIL { get; set; }


        [Required(ErrorMessage = "Please Enter Password!!")]
        public string USER_PASSWORD { get; set; }
    }
}
