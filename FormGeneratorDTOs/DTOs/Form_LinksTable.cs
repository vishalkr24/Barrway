namespace FormGeneratorDTOs.DTOs
{
    public class Form_LinksTable : CommonClass
    {
        public int applicationId { get; set; }
        public int formId { get; set; }
        public int type { get; set; }
        public string editLink { get; set; }
        public string recordsLink { get; set; }
        public int formType { get; set; }
    }
}
