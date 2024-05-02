using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class FavouriteCalendar
    {
        public int total_records { get; set; }
        public int size { get; set; }
        public int page { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public int CompanyId { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public string CALENDAR_CATEGORY_ID { get; set; }
        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
        public string TAGS { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
        public double COIN_BALANCE { get; set; }
        public string PURCHASED { get; set; }
    }

    public class FavouriteClanderData
    {
        public Filter filter { get; set; }
        public List<Sort> sorters { get; set; }
        public int page { get; set; }
        public int size { get; set; }
        public int total_records { get; set; }
        public int last_page { get; set; }
        public int page_records { get; set; }      
        public string CalendarCode { get; set; }
    }

    public class Filter
    {
        public string field { get; set; }
        public string type { get; set; }
        public string value { get; set; }
    }
    public class Sort
    {
        public string field { get; set; }
        public string dir { get; set; }
    }
}
