using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Barrway.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage ="Please Enter Email!!")]
        [EmailAddress(ErrorMessage = "Please Enter Valid Email!!")]
        public string USER_EMAIL  { get; set; }


        [Required(ErrorMessage = "Please Enter Password!!")]
        public string USER_PASSWORD { get; set; }
        public bool REMEMBER_ME { get; set; }

        public string ERROR_MESSAGE { get; set; }

        public string ReturnUrl { get; set; }


    }

}