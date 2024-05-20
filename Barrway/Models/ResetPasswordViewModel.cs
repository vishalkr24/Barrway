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

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("newpassword", ErrorMessage = "Confirm Password did to matched !")]
        public string confirmpassword { get; set; }
       
        [Required(ErrorMessage = "Password is required")]
        //[MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        //[RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\"\\|,.<>\\/?]).+$", ErrorMessage = "Create a strong password.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@_\-!]{8,}$", ErrorMessage = "Password must be at least 8 characters long, contain both letters and numbers, and can include special characters (@, _, -, !).")]
        public string newpassword { get; set; }
    }


    public class PhoneResetPasswordViewModel
    {
       

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("newpassword", ErrorMessage = "Confirm Password did to matched !")]
        public string confirmpassword { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password length should be greater than 8 characters")]
        [MaxLength(16, ErrorMessage = "Password length should be less than 16 characters")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\"\\|,.<>\\/?]).+$", ErrorMessage = "Create a strong password.")]
        public string newpassword { get; set; }
    }
}