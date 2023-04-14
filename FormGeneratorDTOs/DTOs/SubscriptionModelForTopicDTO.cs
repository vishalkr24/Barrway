using System;

namespace FormGeneratorDTOs.DTOs
{
    public class SubscriptionModelForTopicDTO : CommonClass
    {
        public int Id { get; set; }
        public int MaxNoRecords { get; set; }
        public int TotalRecords { get; set; }
        public int BonusRecords { get; set; }
        public int TotalRecordsCreated { get; set; }
        public int TotalAvailableRecords { get; set; }
        public decimal TotalAmountPaid { get; set; }
        public DateTime? LastPaidDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? RetentionExpiryDate { get; set; }
        public string CompanyCode { get; set; }
        public string PaidPlan { get; set; }
        public int MaxSizeOfAttachment { get; set; }
        public bool RecurringCheck { get; set; }
        public decimal RecurringAmount { get; set; }
        public int RecurringNumberOfRecords { get; set; }
        public DateTime? NextPaymentDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public int SubscriptionId { get; set; }
        public int RoleId { get; set; }
        public int TopicId { get; set; }
    }
}
