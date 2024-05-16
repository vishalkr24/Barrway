using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barrway.Models
{
    public class GroupEventDataModel
    {
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public List<Dictionary<string, object>> events { get; set; }
    }
    public class MyBookingPdfModel
    {
        public IEnumerable<calenderSettingsFormDetails> calendarSetting { get; set; }
        public string StudentName { get; set; }
    }
}