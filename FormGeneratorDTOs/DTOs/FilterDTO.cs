namespace FormGeneratorDTOs.DTOs
{
    public class FilterDTO
    {
        public string field { get; set; }
        public string type { get; set; }
        public string value { get; set; }
    }
    public class SortDTO
    {
        public string field { get; set; }
        public string dir { get; set; }
    }

}
