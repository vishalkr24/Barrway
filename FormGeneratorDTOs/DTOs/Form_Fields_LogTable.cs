using System;

namespace FormGeneratorDTOs.DTOs
{
    public class Form_Fields_LogTable : CommonClass
    {
        public int log_Id { get; set; }
        public int log_form_Id { get; set; }
        public string log_form_configuration { get; set; }
        public int log_user { get; set; }
        public string log_ip_address { get; set; }
        public DateTime? log_timestamp { get; set; }
    }
}
