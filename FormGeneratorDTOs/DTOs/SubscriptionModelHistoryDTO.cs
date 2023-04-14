using System;

namespace FormGeneratorDTOs.DTOs
{
    public class SubscriptionModelHistoryDTO : CommonClass
    {
        public int Id { get; set; }
        public string CompanyCode { get; set; }
        public int TopicId { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime? PaidDate { get; set; }
        public int NumberOfRecordsAdded { get; set; }
        public string PaymentMethod { get; set; }
        public int PayeeUserId { get; set; }
        public int SubscriptionId { get; set; }
        public string PayerID { get; set; }

        public string token { get; set; }
        public decimal amount { get; set; }
        public string ack { get; set; }
        public string correlationId { get; set; }
        public string profileId { get; set; }
        public string profileStatus { get; set; }
        public DateTime? nextBillingDate { get; set; }
        public string otherInformation { get; set; }

        public string topicTitle { get; set; }
        public string subscriptionTitle { get; set; }
        public int max_records { get; set; }

    }
}
