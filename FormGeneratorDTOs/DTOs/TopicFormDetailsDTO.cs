using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class TopicFormDetailsDTO : CommonClass
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public string topicTitle { get; set; }
        public string FormTableName { get; set; }
        public int applicationId { get; set; }
        public string fields { get; set; }
        public string topicName { get; set; }

        public string formName { get; set; }

        public int formId { get; set; }

        public int totalRecords { get; set; }

        public int maxRecord { get; set; }

        public int max_Records { get; set; }
        public bool PPControl { get; set; }

    }


    public class GenerateDynamicFormTable
    {

        public int action { get; set; }
        public string formTableName { get; set; }
        public string formTableColumnName { get; set; }
        public string Query { get; set; }

        public int applicationId { get; set; }
        public int topicId { get; set; }

        public int res { get; set; }

        public string Message { get; set; }
        public bool PPControl { get; set; }

    }

    public class GenerateDynamicFormData : CommonClass
    {
        public int currentFormType { get; set; }


        public string formtag { get; set; }
        public int Id { get; set; }

        public string formTableName { get; set; }
        public string formTableColumnName { get; set; }

        public string formTableColumnNameList { get; set; }
        public string formTableColumnData { get; set; }

        public int formId { get; set; }

        public int topicId { get; set; }
        public string start { get; set; }
        public string end { get; set; }





        public int totalRecords { get; set; }


        public int totalRecordsByTopic { get; set; }

        public int totalRecordsByUser { get; set; }
        public string formGroupKey { get; set; }
        public int isResizedEvent { get; set; }



        public string lastUpdated_at { get; set; }

        public int DiffDateTimeUpdateInSecond { get; set; }

        /*form record filter*/
        public FilterDTO filter { get; set; }

#pragma warning disable CS0108 // 'GenerateDynamicFormData.sorters' hides inherited member 'CommonClass.sorters'. Use the new keyword if hiding was intended.
        public List<SortDTO> sorters { get; set; }
#pragma warning restore CS0108 // 'GenerateDynamicFormData.sorters' hides inherited member 'CommonClass.sorters'. Use the new keyword if hiding was intended.
        public int taskid { get; set; }
        public string ApprovalStatus { get; set; }
        public string kanbanorder { get; set; }
        public string kanbanControl { get; set; }
        public string majorMinor { get; set; }
        public string calFormId { get; set; }
        public string calendarSettingForm { get; set; }
        // public string SelectedWeek { get; set; }
        public string startday { get; set; }
        public string endday { get; set; }
        public string Kstatus { get; set; }
        public string resourceSearchTextData { get; set; }
        public string resourceSearchTextJoin { get; set; }
        public string resourceSearchTextWhereClouse { get; set; }
        public string language { get; set; }
        public bool IsCustomFilter { get; set; }
        public List<CustomFilter> CustomFilters { get; set; }
    }



}
