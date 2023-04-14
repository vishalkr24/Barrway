using System;

namespace FormGeneratorDTOs.DTOs
{
    public class SMSClass
    {
    }

    public class SMSAPIRequest
    {
        public string accountSid { get; set; }
        public string authToken { get; set; }
        public string body { get; set; }
        public string from { get; set; }
        public string to { get; set; }

        public int action { get; set; }

        public int whatsapp { get; set; }
    }

    public class SMSAPIResponse
    {
        public int action { get; set; }
        public int Id { get; set; }
        public string type { get; set; }
        public string fromNumber { get; set; }
        public string toNumber { get; set; }
        public string account_sid { get; set; }
        public string api_version { get; set; }
        public string body { get; set; }
        public DateTime? date_created { get; set; }
        public DateTime? date_sent { get; set; }
        public DateTime? date_updated { get; set; }
        public string direction { get; set; }
        public int? error_code { get; set; }

        public string error_message { get; set; }
        public string from { get; set; }
        public string messaging_service_sid { get; set; }
        public string num_media { get; set; }

        public string num_segments { get; set; }
        public string price { get; set; }

        public string price_unit { get; set; }
        public string sid { get; set; }

        public string status { get; set; }

        public string to { get; set; }

        public string uri { get; set; }

        public int res { get; set; }
        public string message { get; set; }

        public string SubresourceUris { get; set; }
        public string respMessage { get; set; }
    }

}
