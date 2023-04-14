using System;

namespace FormGeneratorDTOs.DTOs
{
    public class PaypalSettings
    {
        public int action { get; set; }
        public int Id { get; set; }
        public bool sandbox { get; set; }
        public string apiUrl { get; set; }
        public string apiVersion { get; set; }
        public string apiUsername { get; set; }

        public string apiPassword { get; set; }

        public string apiSignature { get; set; }

        public DateTime? modified_date { get; set; }

        public int res { get; set; }
        public string Message { get; set; }
    }
}
