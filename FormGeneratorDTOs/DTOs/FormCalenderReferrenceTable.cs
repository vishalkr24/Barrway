using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class FormCalenderReferrenceTable : CommonClass
    {
        public int Id { get; set; }
        public int parentID { get; set; }
        public int formId { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string customFormIds { get; set; }
        public string customForms { get; set; }
        public string formGroupKey { get; set; }
        public int currentFormType { get; set; }
        public int referrenceFormId { get; set; }
        public string referrenceId { get; set; }
        public string referrenceFormTable { get; set; }
        public string referrenceColumnName { get; set; }
        public string referrenceTitle { get; set; }
        public int resourceFormId { get; set; }
        public string resourceId { get; set; }
        public string resourceFormTable { get; set; }
        public string resourceTitle { get; set; }
        public int activityFormId { get; set; }
        public string activityId { get; set; }
        public string activityFormTable { get; set; }
        public string activityTitle { get; set; }
        public string formfieldDataListTemp { get; set; }
        public List<IDictionary<string, object>> formDataList { get; set; }
        public string title { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
    }
}
