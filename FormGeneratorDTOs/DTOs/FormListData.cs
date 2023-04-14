using System;

namespace FormGeneratorDTOs.DTOs
{
    public class FormListDataView : CommonClass
    {
        //public int action { get; set; }
        public int formId { get; set; }
        public int topicId { get; set; }
        public string userName { get; set; }

        public int applicationId { get; set; }
        public string title { get; set; }
        public string formTag { get; set; }
        public int formType { get; set; }
        public DateTime? lastActivityDate { get; set; }
        public int status { get; set; }
        public int groupid { get; set; }

        public int currentFormType { get; set; }

        public string formName { get; set; }
        public string formIcon { get; set; }
        public int totalRecords { get; set; }
        public string topicTitle { get; set; }
        public string applicationTitle { get; set; }
        public string applicationTag { get; set; }
        public string formTypeText { get; set; }
        public string statusText { get; set; }
        public int userId { get; set; }
        public string slug { get; set; }
        public string fields { get; set; }
        public string StatusName { get; set; }
        public string name { get; set; }
        public string groupName { get; set; }
        public string createdBy { get; set; }
        //public int created_by { get; set; }
        public string datefilter { get; set; }
        public string allowChat { get; set; }
        public int subscriptionFlag { get; set; }

        //  public int page { get; set; }
        // public int size { get; set; }
        // public int total_records { get; set; }

        public string FormTableName { get; set; }


        public string creatorName { get; set; }
        public string roleName { get; set; }
        public string formDescription { get; set; }

        public int maxRecord { get; set; }

        public int max_records { get; set; }

        public int isCalenderQueue { get; set; }
        public int otherformid { get; set; }

        public string otherFormFieldName { get; set; }
        public int userRole { get; set; }

    }
}
