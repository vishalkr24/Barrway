namespace FormGeneratorDTOs.DTOs
{
    public class ImportFormParam
    {
        public int action { get; set; }
        public int sourceFormId { get; set; }

        public int formId { get; set; }

        public string formTableName { get; set; }

        public int topicId { get; set; }

        public int created_by { get; set; }
    }
}
