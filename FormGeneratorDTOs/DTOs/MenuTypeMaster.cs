namespace FormGeneratorDTOs.DTOs
{
    public class MenuTypeMaster : CommonClass
    {
        public int menutypeId { get; set; }
        public int userId { get; set; }
        public string type { get; set; }
        public string created_date { get; set; }
        public string modified_date { get; set; }

    }
}
