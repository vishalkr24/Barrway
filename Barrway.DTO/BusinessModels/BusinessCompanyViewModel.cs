using Barrway.DTO.CustomValidations;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessCompanyViewModel
    {
        public string Id { get; set; }

        [Required]
        public string BUSINESS_ACCOUNT_ID { get; set; }

        [Required(ErrorMessage = "Invalid Company Code")]
        public string COMPANY_CODE { get; set; } = String.Empty;

        public string COMPANY_LOGO_NAME { get; set; }

        [ValidImageFile(ErrorMessage = "Please select an image")]
        public HttpPostedFileBase COMPANY_LOGO_PATH { get; set; }
        public string COMPANY_BANNER_NAME { get; set; }

        [ValidImageFile(ErrorMessage = "Please select an image")]
        public HttpPostedFileBase COMPANY_BANNER_PATH { get; set; }

        [Required(ErrorMessage = "Company name is required")]
        public string COMPANY_NAME_ENGLISH { get; set; } = String.Empty;

        [Required(ErrorMessage = "Company name in chinese is required")]
        public string COMPANY_NAME_CHINESE { get; set; } = String.Empty;

        public string COMPANY_PHONE { get; set; } = String.Empty;
        public string COMPANY_EMAIL { get; set; } = String.Empty;
        public string COMPANY_ADDRESS { get; set; } = String.Empty;
        public string WECHAT_URL { get; set; } = String.Empty;
        public string IS_DEFAULT { get; set; } = String.Empty;
        public string FACEBOOK_URL { get; set; } = String.Empty;
        public string TWITTER_URL { get; set; } = String.Empty;
        public string INSTAGRAM_URL { get; set; } = String.Empty;
        public string PAGE_URL { get; set; } = String.Empty;
        public string TAGS { get; set; } = String.Empty;
        public string IS_SEARCHABLE_IN_MARKETPLACE { get; set; }

        [AllowHtml]
        public string COMPANY_SERVICE { get; set; } = String.Empty;
        public string COMPANY_DESCRIPTION { get; set; } = String.Empty;
        public float TOTAL_WEBSITE_VISITS { get; set; } = 0;

        [ValidDropdownValue(ErrorMessage = "Please select your company category")]
        public string COMPANY_CATEGORY_ID { get; set; } = String.Empty;

        [ValidDropdownValue(ErrorMessage = "Please select your sub category")]
        public string COMPANY_SUB_CATEGORY_ID { get; set; } = String.Empty;

        [ValidDropdownValue(ErrorMessage = "Please select your country")]
        public string COUNTRY_ID { get; set; } = String.Empty;

        [ValidDropdownValue(ErrorMessage = "Please select your city")]
        public string CITY_ID { get; set; } = String.Empty;

        [ValidDropdownValue(ErrorMessage = "Please select your district")]
        public string DISTRICT_ID { get; set; } = String.Empty;


        public CompanyPhotoAlbumViewModel photoAlbumForm { get; set; }

        public List<CompanyPhotoAlbumModel> photoAlbumList { get; set; }

    }

}
