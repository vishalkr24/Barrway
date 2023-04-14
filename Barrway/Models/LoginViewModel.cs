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
        public string Email  { get; set; }
        [Required(ErrorMessage = "Please Enter Password!!")]
        public string Password { get; set; }
        //public bool RememberMe { get; set; }
    }

}