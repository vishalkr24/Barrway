using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Barrway.DTO.APIModels.Calendar
{
    public class CalendarRequestModel
    {
        //public int action { get; set; }
        //public string formId { get; set; }
        //public int isCalender { get; set; }
        //public int isEvent { get; set; }
        //public int resourceFormId { get; set; }
        //public int ActivityFormId { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        [Required(ErrorMessage = "start date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime start { get; set; }
        [Required(ErrorMessage = "end date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime end { get; set; }

        public List<CalendarAPIFilterModel> calendarFilters { get; set; }
    }

    public class CalendarAPIFilterModel
    {
        public int FilterType { get; set; }
        public string FilterValue { get; set; }
    }

    public class CalendarEvents
    {

        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        [Required(ErrorMessage = "start date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime start { get; set; }
        [Required(ErrorMessage = "end date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime end { get; set; }
    }

    public class CalendarEventsViewModel
    {

        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string start { get; set; }
        public string end { get; set; }

    }



    public class FavoriteCalendarViewModel
    {

        public string COMPANY_CODE { get; set; }

        public string CALENDAR_CODE { get; set; }


    }


    public class UserEventsViewmodel
    {
        [Required(ErrorMessage = "start date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime start { get; set; }
        [Required(ErrorMessage = "end date time required")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        public DateTime end { get; set; }


    }


    public class FavoriteCalendarModel
    {

        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string USER_ID { get; set; }
        public string IS_PUBLIC_USER { get; set; }

    }
}
