using System;

namespace FormGeneratorDTOs.DTOs
{
    public class assignFormListView : CommonClass
    {

        public int userId { get; set; }

        public string creatorName { get; set; }
        public string applicationTitle { get; set; }
        public string applicationTag { get; set; }
        public string topicTitle { get; set; }
        public string title { get; set; }
        public string formTag { get; set; }
        public int formType { get; set; }

        public string formTypeText { get; set; }

        public DateTime? lastActivityDate { get; set; }
        public int applicationID { get; set; }
        public int topicID { get; set; }
        public int formId { get; set; }
        public string slug { get; set; }

        public int groupId { get; set; }


        public int[] formIds { get; set; }
        public int totalRecords { get; set; }
        public string FormTableName { get; set; }

    }
}
