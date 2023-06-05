using Spire.Xls.Core.Spreadsheet.AutoFilter;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class CalenderSettingsConfigDTO : CommonClass
    {
        public int Id { get; set; }
        public int newformId { get; set; }
        public int formId { get; set; }
        public int resourceForm { get; set; }
        public int newresourceForm { get; set; }
        public string eventOverlap { get; set; }
        public string majorGroup { get; set; }
        public string minorGroup { get; set; }
        public int activitiesForm { get; set; }
        public int newactivitiesForm { get; set; }
        public string activitiesOverlap { get; set; }
        public string activities { get; set; }
        public string activitiesCategory { get; set; }
        public string durationField { get; set; }
        public string overlapField { get; set; }
        public string colorField { get; set; }
        public bool IsDefault { get; set; }
        public string formTitle { get; set; }

        public string minTime { get; set; }
        public string maxTime { get; set; }

        public string resourceFormTable { get; set; }
        public string activityFormTable { get; set; }


        public List<CalenderSettingsConfigDTO> calenderSettingsList { get; set; }

        public bool isVisible { get; set; }

    }

    public class calenderSettingsFormDetails
    {
        public int action { get; set; }
        public int formId { get; set; }
        public int resourceActivityForm { get; set; }
        public int resourceForm { get; set; }
        public int activitiesForm { get; set; }

        public string title { get; set; }

        public string formtag { get; set; }

        public string FormTableName { get; set; }

        public string topicID { get; set; }


        public string applicationID { get; set; }
        public string eventOverlap { get; set; }
        public string majorGroup { get; set; }
        public string minorGroup { get; set; }
        public string activitiesOverlap { get; set; }
        public string activities { get; set; }
        public string activitiesCategory { get; set; }
        public string durationField { get; set; }
        public string colorField { get; set; }
        public string overlapField { get; set; }
        public string CalendarKanbanView { get; set; }
        public string minTime { get; set; }
        public string maxTime { get; set; }
        public bool IsDefault { get; set; }

        public bool isVisible { get; set; }

        public List<IDictionary<string, object>> formDataList { get; set; }

        public List<IDictionary<string, object>> formDataListGroupBy { get; set; }
        public bool IsCustomFilter { get; set; }
        public bool IsCustomInFilter { get; set; }
        public List<CustomFilter> CustomFilters { get; set; }

    }
    public class CustomFilter
    {
        public string FieldName { get; set; }
        public string Value { get; set; }
    }
    public class JsonTreeModel
    {
        public int root { get; set; }
        public string title { get; set; }
        public string formId { get; set; }
        public string resourceActivityForm { get; set; }
        public string previousSelection { get; set; }
        public string selectedRoot { get; set; }
        public string query { get; set; }
        public string id { get; set; }
        public List<CustomFilter> CustomFilters { get; set; }
    }

}
