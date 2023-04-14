using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Form_Data_OnetomanyTempDTO : CommonClass
    {
        public int AutoId { get; set; }
        public string created_byname { get; set; }
        public string fieldName { get; set; }
        public int Id { get; set; }
        public string formGroupKey { get; set; }

        public string formfieldDataListTemp { get; set; }

        public string formReferrenceFieldsList { get; set; }

        public int MasterFormId { get; set; }

        public int MasterFormRow { get; set; }

        public int formId { get; set; }

        public int topicId { get; set; }

        public int userId { get; set; }

        public string parentColumnName { get; set; }
        public string parentColumnNameData { get; set; }
        public string parentColumnFormId { get; set; }
        public string columnName { get; set; }
        public string columnValue { get; set; }

        public string formGroupKeyList { get; set; }

        public List<int> AutoIdList { get; set; }

    }
}
