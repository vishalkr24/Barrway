namespace FormGeneratorDTOs.DTOs
{
    public class TopicTable : CommonClass
    {
        public int topicId { get; set; }
        public int applicationId { get; set; }
        public string topicTitle { get; set; }
        public string applicationTitle { get; set; }

        public string topicDescription { get; set; }

        public string topicField { get; set; }

        public int max_records { get; set; }

        public int newApplicationId { get; set; }

        ///topic details exteranal
        public string SubscriptionTitle { get; set; }
        public long BonusRecords { get; set; }
        public string ExpiryDate { get; set; }
        public string RetentionExpiryDate { get; set; }
        public string LastPaidDate { get; set; }
        public string LastPaymentDate { get; set; }
        public long TotalAmountPaid { get; set; }


    }
}
