namespace FormGeneratorDTOs.DTOs
{
    public class OtherCheckboxRadio
    {
        public int userID { get; set; }
        public string formID { get; set; }
        public string ColumnName { get; set; }
        public string ColumnValue { get; set; }
        public string configSettings { get; set; }
        public int Id { get; set; }
    }


    public class SelectFilter
    {
        public string Id { get; set; }
        public string formID { get; set; }
        public string ColumnName { get; set; }
        public string filtervalue { get; set; }
    }
}
