using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Barrway.Models
{
    public class ResetPasswordViewModel
    {
        [Required]
        public string token { get; set; }
        [Required]
        [Compare("newpassword", ErrorMessage ="Confirm Password is equal to new password")]
        public string confirmpassword { get; set; }
        [Required]
        public string newpassword { get; set; }
    }
}