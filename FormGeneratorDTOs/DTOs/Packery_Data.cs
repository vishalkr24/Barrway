using System;

namespace FormGeneratorDTOs.DTOs
{
    public class Packery_Data : CommonClass
    {
        public int packeryId { get; set; }
        public string item_name { get; set; }
        public string position { get; set; }
        public string category { get; set; }
        public string class_name { get; set; }
        public decimal weight { get; set; }
        public decimal number { get; set; }
        public string symbol { get; set; }
        public bool status { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? modified_date { get; set; }

    }
}
