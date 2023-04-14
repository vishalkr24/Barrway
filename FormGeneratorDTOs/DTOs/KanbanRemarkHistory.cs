namespace FormGeneratorDTOs.DTOs
{
    public class KanbanRemarkHistory
    {
        public int formId { get; set; }
        public int action { get; set; }
        public int Id { get; set; }
        public string event_Date { get; set; }
        public string fieldName { get; set; }
        public string formTitle { get; set; }
        public string creator_name { get; set; }
        public string from_status { get; set; }
        public string to_status { get; set; }
        public string description { get; set; }
        public string userId { get; set; }
        public string remarks { get; set; }
        public int created_by { get; set; }
        public int updated_by { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }
    }
}
