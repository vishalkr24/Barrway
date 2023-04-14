namespace FormGeneratorDTOs.DTOs
{
    public class Form_Summary_Config : CommonClass
    {
        public int Id { get; set; }
        public int formId { get; set; }
        public int topicId { get; set; }
        public string configName { get; set; }
        public string configExpandBy { get; set; }
        public string configDescription { get; set; }
        public string configSettings { get; set; }
        public string pivotConfigSettings { get; set; }
        public int rowOrder { get; set; }
        public int fixedPlaces { get; set; }

    }
}
