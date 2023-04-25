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
    public class BusinessCalendarModel
    {
        public string Id { get; set; }
        
        public string CALENDAR_PHOTO_NAME { get; set; }

        public string CALENDAR_PHOTO_PATH { get; set; }

        public string IS_VISIBLE { get; set; }

        public string COMPANY_CODE { get; set; }

        public string COMPANY_NAME_CHINESE { get; set; }

        public string CALENDAR_NAME { get; set; }
        
        public string COUNTRY_ID { get; set; }

        public string CITY_ID { get; set;}

        public string DISTRICT_ID { get; set; }

        public string CALENDAR_CATEGORY_ID { get; set; }

        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
    }

}
