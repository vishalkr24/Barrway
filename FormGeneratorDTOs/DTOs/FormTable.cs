using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class FormTable : CommonClass
    {
        public int Id { get; set; }
        public string formContentHTMLTemp { get; set; }
        public int formId { get; set; }
        public int topicId { get; set; }
        public int applicationId { get; set; }
        public string title { get; set; }
        public int PlanExpired { get; set; }
        public int IsFreePlan { get; set; }
        public int GracePeriodActive { get; set; }
        public string slug { get; set; }

        public string firebase_room_id { get; set; }
        public string roomId { get; set; }

        public string formIcon { get; set; }

        public string formBackground { get; set; }

        public int backgroundTransparency { get; set; }

        public string xlsxFileName { get; set; }

        public string xlsFile { get; set; }

        public int formType { get; set; }

        public int currentFormType { get; set; }

        public int status { get; set; }

        public string formTag { get; set; }

        public string template { get; set; }
        public string InformationOnly { get; set; }
        public int informationFormID { get; set; }
        public string informationFormName { get; set; }

        public string subscriptionForm { get; set; }

        public int subscriptionFormID { get; set; }

        public int groupID { get; set; }

        public string css { get; set; }
        public string formDescription { get; set; }
        public int maxRecord { get; set; }

        public string eventOverlap { get; set; }

        public string activitiesOverlap { get; set; }

        public int resourceForm { get; set; }

        public string resourceFormName { get; set; }

        public string majorGroup { get; set; }

        public string minorGroup { get; set; }

        public int activitiesForm { get; set; }

        public string activitiesFormName { get; set; }

        public string activities { get; set; }
        public string activitiesCategory { get; set; }

        public string durationField { get; set; }

        public string overlapField { get; set; }

        public string fields { get; set; }
        public string html { get; set; }

        public string allowViewSummary { get; set; }

        public string allowChat { get; set; }

        public string allowNotification { get; set; }

        public string allowEmailNotification { get; set; }
        public string allowWhatsappNotification { get; set; }

        public string notificationDetails { get; set; }
        public string recordFilters { get; set; }

        public bool IsFilterCriteria { get; set; }

        public string recordAccessSecurity { get; set; }

        public string formSettings { get; set; }

        public DateTime? lastActivityDate { get; set; }

        public string height { get; set; }

        public int themeID { get; set; }

        public string themeJsFile { get; set; }

        public string form_password { get; set; }

        public string language { get; set; }

        public string screenMode { get; set; }
        public string NotifyOnAction { get; set; }
        public string NotifyEmailOnAction { get; set; }


        public string topicTitle { get; set; }
        public string topicDescription { get; set; }

        public int max_records { get; set; }

        public string applicationTitle { get; set; }

        public string formGroupKey { get; set; }


        public string FormTableName { get; set; }
        public IEnumerable<FormDataToOne> FormDataToOneList { get; set; }

        public List<IDictionary<string, object>> FormDataToOneListDynamic { get; set; }

        public Dictionary<int, object> dicTabulatorList { get; set; }
        public int userId { get; set; }
        public int clearData { get; set; }
        public int isCalendar { get; set; }
        public int isActivity { get; set; }
        public int isResource { get; set; }
        public int subscribleAll { get; set; }

        public string fieldName { get; set; }
        public string fieldValidationRule { get; set; }
        public string fieldType { get; set; }
        public string fieldLabel { get; set; }
        public string colorField { get; set; }
        public int entryId { get; set; }
        public string resEntryColumn { get; set; }

        public string activityEntryColumn { get; set; }
        public string compareColumn { get; set; }
        public string compareValue { get; set; }

        public string[] fieldsList { get; set; }
        public string[] titleList { get; set; }

        public bool isPrimaryForm { get; set; }

        public int primaryFormId { get; set; }

        public string informationFormLinkMode { get; set; }
        public string columnToCheck { get; set; }

        public IEnumerable<CalenderSettingsConfigDTO> calenderSettingsList { get; set; }

        public bool isMultipleCalenderSettings { get; set; }

        public TabulatorConfigurationsDTO tabulatorHeaderDetails { get; set; }


        //public int resId { get; set; }
        //public int activityId { get; set; }
        //by sona
        public IEnumerable<ApprovalTable> ApprovalData { get; set; }
        public IEnumerable<ApprovalHistoryModel> ApprovalHistory { get; set; }
        public string selectedRecords { get; set; }
        public string currentstage { get; set; }
        public string approvalrecId { get; set; }
        public int taskid { get; set; }
        public int buttonid { get; set; }
        public string functioncode { get; set; }
        public string approvalremark { get; set; }
        public int remark_popup { get; set; }
        public string tabdatainjson { get; set; }
        //end of approval attribute
        //macrolist attr by sona
        public string macroList { get; set; }
        public string urlroute { get; set; }
        //end of macrolist attr
        public int isCalenderQueue { get; set; }
        // adding uid column of user
        public string uid { get; set; }

        public bool isUpdatedFromSettingPage { get; set; }
        public string tabName { get; set; }
        public bool istabAccess { get; set; }
        public string lastestmsg { get; set; }
        public DateTime? texttime { get; set; }
        public int otherformid { get; set; }

        public bool otherFormIsShow { get; set; }
        public string otherFormFieldName { get; set; }

        //this attribute is only for front end scope
        public bool basicCalendar_active { get; set; }
        public string fromDate_field { get; set; }
        public string toDate_field { get; set; }
        public int scheduler_referrence_formId { get; set; }
        public string groupIcon { get; set; }
        public string customForms { get; set; }
        public string customFormIds { get; set; }
        public object Ref_formsData { get; set; }

    }

    public class subscriptionData : CommonClass
    {
        public int formId { get; set; }
        public int userId { get; set; }

        public string columnToCheck { get; set; }
        public string fieldName { get; set; }




    }
}
