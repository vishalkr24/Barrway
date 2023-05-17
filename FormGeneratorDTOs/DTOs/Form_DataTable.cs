using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Form_DataTable : CommonClass
    {
        public int Id { get; set; }
        public int formDataId { get; set; }
        public int formId { get; set; }
        public bool isDyEvent { get; set; }
        public bool isInternalDrop { get; set; }
        public string seperatedIds { get; set; }
        public string seperatedTitles { get; set; }
        public string seperatedFormIDs { get; set; }

        public string seperatedResFormIDs { get; set; }
        public string seperatedResEntryIDs { get; set; }
        public string seperatedResColValues { get; set; }
        public string seperatedColorValues { get; set; }


        public bool isEventUpdatable { get; set; }
        public int currentFormType { get; set; }
        public int topicId { get; set; }
        public int applicationId { get; set; }
        public int formFieldId { get; set; }
        public int userId { get; set; }
        public string current_status { get; set; }

        public int cycle { get; set; }

        public string fieldName { get; set; }

        public string fieldDataText { get; set; }
        public string fieldDataMultimedia { get; set; }
        public string formGroupKey { get; set; }
        public string newFormGroupKey { get; set; }
        public int MasterFormId { get; set; }
        public string MasterFormRow { get; set; }

        public int formRecordOrder { get; set; }

        public int formRecordStatus { get; set; }

        public string created_ip { get; set; }

        public string updated_ip { get; set; }

        public string formfieldDataListTemp { get; set; }
        public string[] formfieldDataListTempList { get; set; }
        public string[] formGroupKeyListTemp { get; set; }

        public string formReferrenceFieldsList { get; set; }

        public string formGroupKeyList { get; set; }
        public int isResizedEvent { get; set; }

        public int isCalender { get; set; }
        public int isEvent { get; set; }
        public int isCalenderResource { get; set; }
        public int isActivityDraggable { get; set; }
        public int isActivityCategory { get; set; }
        public int isCalenderActivity { get; set; }

        public int resourceFormId { get; set; }
        public int resourceId { get; set; }
        public int ActivityFormId { get; set; }
        public int parentID { get; set; }
        public int ActivityId { get; set; }
        public string ResourceFields { get; set; }
        public string ActivityFields { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public bool eventOverlap { get; set; }
        public bool activitiesOverlap { get; set; }
        public bool isResourceSelectable { get; set; }
        public bool isResourceExternalDrop { get; set; }
        public int entryId { get; set; }
        public string resEntryColumn { get; set; }
        public string activityEntryColumn { get; set; }
        public string compareColumn { get; set; }
        public string compareValue { get; set; }

        public bool IsMaxOneRecordPerUser { get; set; }=false;

        public bool isPrimaryForm { get; set; }

        public int primaryFormId { get; set; }

        public string name { get; set; }

        public string formTableName { get; set; }
        public string transactionId { get; set; }

        public string PaymentStatus { get; set; }

        public string payment_date { get; set; }

        /*form record filter*/
        public FilterDTO filter { get; set; }
        public string tabularId { get; set; }

        public string resourceSearchTextData { get; set; }
        public string resourceSearchTextJoin { get; set; }
        public string resourceSearchTextWhereClouse { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public bool IsCustomFilter { get; set; }
        public List<CustomFilter> CustomFilters { get; set; }
        //public string Query { get; set; }

    }

    public class FormFieldList
    {
        public string name { get; set; }
        public string value { get; set; }
    }
    public class calenderOverlap
    {
        public int Id { get; set; }
        public int formId { get; set; }
        public string formGroupKey { get; set; }
        public int userID { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string resources { get; set; }
        public string activities { get; set; }

        //  [Id],[formGroupKey],[formId],[userID],[start],[end],[resources],[activities]
    }
    public class calenderToggle
    {
        public int Id { get; set; }
        public int formId { get; set; }
        public string formGroupKey { get; set; }
        public int userID { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string color { get; set; }
        public string allDay { get; set; }
        public string resources { get; set; }
        public string resourceId { get; set; }
        public string activities { get; set; }
        public string activityId { get; set; }
        public string service { get; set; }
        public string description { get; set; }


        //  [Id],[formGroupKey],[formId],[userID],[start],[end],[resources],[activities]
    }
    public class formTableColumnNRows
    {
        public string columns { get; set; }
        public string rows { get; set; }
        public string columnHeadings { get; set; }

        public string columnInputs { get; set; }

        public string name { get; set; }

        public string subtype { get; set; }
        public string types { get; set; }

        public string type { get; set; }

        public string value { get; set; }
        public string lower_range { get; set; }

        public string upper_range { get; set; }
    }


    public class formSummaryDTO
    {
        public int action { get; set; }

        public int UserId { get; set; }

        public int formId { get; set; }

        public int topicId { get; set; }


        public FormTable formDetails { get; set; }
        public List<IDictionary<string, object>> formDataListNew { get; set; }
        public List<IDictionary<string, object>> formSummeryDataList { get; set; }
        public IEnumerable<Form_FieldsTable> formFieldsList { get; set; }
    }



}
