using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;

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

    public class PhoneLoginViewModel
    {
        [Required(ErrorMessage = "Please Enter phone number !")]
        public string USER_PHONE { get; set; }

        [Required(ErrorMessage = "please enter Country code !")]
        public string Country_Code { get; set; }


        [Required(ErrorMessage = "Please Enter Password!!")]
        public string USER_PASSWORD { get; set; }
        public bool REMEMBER_ME { get; set; }

        public string ERROR_MESSAGE { get; set; }

        public string ReturnUrl { get; set; }


    }



    public class UpdateUserEmailModel
    {
        
        [Required(ErrorMessage = "Please Enter your Email !")]
        [EmailAddress(ErrorMessage = "Please Enter Valid Email!")]
        [EmailAnnotation]
        public string Email { get; set; }

    }


    public class EmailAnnotation : RegularExpressionAttribute
    {
        static EmailAnnotation()
        {
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(EmailAnnotation), typeof(RegularExpressionAttributeAdapter));
        }

        /// <summary>
        /// from: http://stackoverflow.com/a/6893571/984463
        /// </summary>
        public EmailAnnotation()
            : base(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*"
                + "@"
                + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))$")
        { }

        public override string FormatErrorMessage(string name)
        {
            return "E-mail is not valid";
        }
    }

}