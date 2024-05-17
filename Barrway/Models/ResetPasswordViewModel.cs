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
        //[Required(ErrorMessage = "Password is required")]
        //[MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        //[MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        //[RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\"\\|,.<>\\/?]).+$", ErrorMessage = "Create a strong password.")]
        public string newpassword { get; set; }
    }
}