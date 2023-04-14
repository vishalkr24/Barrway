namespace FormGeneratorDTOs.DTOs
{
    public class EditDeleteValidity : CommonClass
    {
        public int availableMinute { get; set; }
        public int formId { get; set; }
        public int recordId { get; set; }
        public int isAllowed { get; set; }

    }
}
