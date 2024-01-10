using Barrway.DTO.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessCalendarViewModel
    {
        public string Id { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public HttpPostedFileBase CALENDAR_PHOTO_PATH { get; set; }
        public string IS_VISIBLE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string UNIVERSAL_ERROR { get; set; }

        public string CALENDAR_TEMPLATE_ID { get; set; }
        public string SCHEDULAR_ID { get; set; }

        [Required(ErrorMessage = "Calendar name is required")]
        public string CALENDAR_NAME { get; set; }
        
        [Required(ErrorMessage = "Please select your country")]
        [ValidDropdownValue(ErrorMessage = "Please select your country")]
        public string COUNTRY_ID { get; set; }

        [Required(ErrorMessage = "Please select your city")]
        [ValidDropdownValue(ErrorMessage = "Please select your city")]
        public string CITY_ID { get; set;}

        [Required(ErrorMessage = "Please select your district")]
        [ValidDropdownValue(ErrorMessage = "Please select your district")]
        public string DISTRICT_ID { get; set; }

        [Required(ErrorMessage = "Please select a calendar category")]
        [ValidDropdownValue(ErrorMessage = "Please select a calendar category")]
        public string CALENDAR_CATEGORY_ID { get; set; }

        [Required(ErrorMessage = "Please select a sub category")]
        [ValidDropdownValue(ErrorMessage = "Please select a sub category")]
        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
        public List<string> TAGS { get; set; }
        
        public string SLOT_DURATION_IN_MINS { get; set; }

        public CalendarControlModel CalendarControlSheet { get; set; }

    }

    public enum CalendarCategory
    {
        Category1 = 1,
        Category2 = 2
    }

    public enum PublicPrivateOptions
    {
        PUBLIC,
        PRIVATE
    }

    public enum DropdownDefault
    {
        Select = -1
    }

    public enum UserAdminGroupNameOptions
    {

    }

    public enum CalendarFormatOptions
    {
        Simple, Advanced
    }
}
