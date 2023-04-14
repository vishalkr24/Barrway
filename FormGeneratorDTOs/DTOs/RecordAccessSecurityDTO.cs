namespace FormGeneratorDTOs.DTOs
{
    public class RecordAccessSecurityDTO : CommonClass
    {
        public int formId { get; set; }

        public string formTableName { get; set; }

        public int max_Records { get; set; }

        public int totalRecordsByTopic { get; set; }

        public int maxRecord { get; set; }

        public int totalRecords { get; set; }

        public bool IsMaxOneRecordPerUser { get; set; }

        public int totalRecordsByUser { get; set; }

        public bool max_one_record_per_user { get; set; }
        public rolesClass insert { get; set; }

        public ownClass own { get; set; }

        public otherClass other { get; set; }


    }


    public class rolesClass
    {
        public string[] roles { get; set; }
    }


    public class ownClass
    {
        public bool view { get; set; }
        public bool edit { get; set; }
        public bool delete { get; set; }
        public string edit_time { get; set; }
    }

    public class otherClass
    {
        public bool view { get; set; }
        public bool edit { get; set; }
        public bool delete { get; set; }
        public string edit_time { get; set; }
    }


}
