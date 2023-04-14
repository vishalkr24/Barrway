namespace FormGeneratorDTOs.DTOs
{
    public class SubscriptionModelDetailsDTO : CommonClass
    {
        public int Id { get; set; }
        public string SubscriptionTitle { get; set; }
        public string IsDefault { get; set; }
        public int NoOfRecords { get; set; }
        public int NoOfRecordsPerYear { get; set; }
        public decimal PerMonthPrice { get; set; }
        public decimal PerYearPrice { get; set; }
        public int RetentionCount { get; set; }
        public string RetentionType { get; set; }
        public int UserId { get; set; }
    }
}

