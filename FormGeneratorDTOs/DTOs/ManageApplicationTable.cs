using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class ManageApplicationTable : CommonClass
    {
        public string applicationTitle { get; set; }
        public string applicationTag { get; set; }

        public int topicId { get; set; }

        public int newTopicId { get; set; }

        public int applicationId { get; set; }

        public int newApplicationId { get; set; }

        public int formId { get; set; }
        public string fieldValidationRule { get; set; }
        public int newFormId { get; set; }
        public int form_fieldsID { get; set; }

        public int otherformid { get; set; }
        public int scheduler_referrence_formId { get; set; }

        public string FormTableName { get; set; }
        public int currentFormType { get; set; }
        public int currentFormTypeFormId { get; set; }

        public string fieldName { get; set; }
        public string fieldType { get; set; }
        public string fieldLabel { get; set; }

        public string fieldTypes { get; set; }
        public string Use_As_Kanban { get; set; }
        public string fields { get; set; }
        public string html { get; set; }

        public string applicationGridColor { get; set; }

        public List<ManageApplicationTable> oldTopicList { get; set; }

        public List<ManageApplicationTable> newTopicList { get; set; }

        public List<ManageApplicationTable> oldFormList { get; set; }

        public List<ManageApplicationTable> newFormList { get; set; }

        public List<ManageApplicationTable> formTableList { get; set; }

        public string formIds { get; set; }
        public string DeleteTopic { get; set; }
    }
}
