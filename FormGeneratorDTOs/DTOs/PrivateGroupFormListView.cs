namespace FormGeneratorDTOs.DTOs
{
    public class PrivateGroupFormListView : CommonClass
    {

        //public int action { get; set; }

        public int Id { get; set; }

        public int formType { get; set; }
        public string applicationTitle { get; set; }

        public string applicationTag { get; set; }
        public string groupName2 { get; set; }
        public string formName { get; set; }
        public string formTag { get; set; }
        public int status { get; set; }
        public string statusText { get; set; }

        public string groupName { get; set; }
        public string lastActivityDate { get; set; }
        public int totalRecords { get; set; }
        public string userName { get; set; }
        public int applicationId { get; set; }

        public int topicId { get; set; }

        public string slug { get; set; }
        //public int created_by { get; set; }
        public string creatorName { get; set; }

        public int formId { get; set; }

        public string topicTitle { get; set; }

        public string FormTableName { get; set; }


    }
}
