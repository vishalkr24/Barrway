using System;

namespace FormGeneratorDTOs.DTOs
{
    public class fullCalender
    {
        public Guid EventID { get { return new Guid(); } }
        public string EventName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int ImageType { get; set; }
        public string Url { get; set; }


    }
}
