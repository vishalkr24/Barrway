using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class CommonFormGenerator
    {
        public string filePath { get; set; }
        public string fileName { get; set; }

        public string formId { get; set; }

        public string uid { get; set; }

        public string reqType { get; set; }
        public xcelParam inputDataExcel { get; set; }

        public List<xcelParam> listOfInput { get; set; }
        public List<xcelParam> listOfOutput { get; set; }
        public string macroname { get; set; }

    }
    public class DynamicDropdownNew
    {

        #region for common ddls

        public string label { get; set; }
        public string selected { get; set; }
        public string value { get; set; }
        #endregion

        #region for activity draggables

        public string color { get; set; }
        public string durationField { get; set; }
        #endregion



        //for calender data
        #region for calender data

        public string Id { get; set; }
        public string formGroupKey { get; set; }

        public string formId { get; set; }
        public string userID { get; set; }
        public string Current_Status { get; set; }
        public string cycle { get; set; }
        public string MasterFormID { get; set; }
        public string MasterFormRow { get; set; }
        public string formRecordOrder { get; set; }
        public string formRecordStatus { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }


        public string title { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string allDay { get; set; }
        public string eventTagsList { get; set; }


        public string resources { get; set; }
        public string activities { get; set; }
        public string activityName { get; set; }
        public string service { get; set; }
        public string description { get; set; }
        public string files { get; set; }
        public int resFormID { get; set; }
        public int actFormID { get; set; }
        public int parentID { get; set; }
        public string seperatedFormIDs { get; set; }
        public string seperatedIDs { get; set; }
        public string seperatedTitles { get; set; }
        public string seperatedResFormIDs { get; set; }
        public string seperatedResEntryIDs { get; set; }
        public string seperatedResColValues { get; set; }
        public string seperatedColorValues { get; set; }


        #endregion


        //resource
        #region for resources
        public string groupName { get; set; }
        public string clientName { get; set; }
        public string startdate { get; set; }
        public string enddate { get; set; }

        public List<resourceColumns> resColumns { get; set; }
        public List<activityColumns> actColumns { get; set; }
        public string resourceId { get; set; }

        public static implicit operator DynamicDropdownNew(List<DynamicDropdownNew> v)
        {
            throw new NotImplementedException();
        }

        public static implicit operator List<object>(DynamicDropdownNew v)
        {
            throw new NotImplementedException();
        }

        #endregion
    }

    public class HeaderFilterDropdown
    {
        public string value { get; set; }
        public string label { get; set; }
    }

    public class resourceColumns
    {
        public string columnName { get; set; }
        public string columnValue { get; set; }


    }

    public class MapColumnValues
    {
        public string LatlongVal { get; set; }
        public int Id { get; set; }


    }
    public class activityColumns
    {
        public string columnName { get; set; }
        public string columnValue { get; set; }


    }

    public class xcelParam
    {
        public string id { get; set; }
        public string sheetName { get; set; }
        public string columnName { get; set; }
        public string rowName { get; set; }

        public string columnId { get; set; }

        public string type { get; set; }

        public bool isRead { get; set; }
        public bool isWrite { get; set; }

        public string value { get; set; }

        public string xlsCode { get; set; }
        public string formGroupKey { get; set; }

        public string fieldName { get; set; }
        public string macroname { get; set; }
    }

    public class formDataHeaderClass
    {
        public string title { get; set; }
        public string field { get; set; }
        public string columnType { get; set; }
        public string headerFilter { get; set; }
        public string formatter { get; set; }
        public bool variableHeight { get; set; }
        public bool editor { get; set; }
        public string align { get; set; }
        public bool multipleFiles { get; set; }
        public bool visible { get; set; }

        public bool Display_tab { get; set; }

        public string Referral_Form_Fields { get; set; }

        public string Referral_Form_Fields_value { get; set; }

        public string Referral_Forms { get; set; }

        public sorterParams sorterParams { get; set; }

        public string bottomCalc { get; set; }

        public int width { get; set; }

        public string Inline_Edit { get; set; }

        public string List_column1 { get; set; }
        public string column_calculation { get; set; }

        public string Hide_show { get; set; }

        public string compare_value_with_control { get; set; }
        public string compare_operation { get; set; }

        public List<DynamicDropdownNew> values { get; set; }






    }

    public class sorterParams
    {
        public string alignEmptyValues { get; set; }
    }

    public class formDataHeadersList
    {
        public string aligh { get; set; }

        public FormTable formDetails { get; set; }
        public List<formDataHeaderClass> formDataHeaders { get; set; }

        public Dictionary<string, string> groupColumns { get; set; }

        public IEnumerable<FormDataToOne> formDataList { get; set; }

        public List<IDictionary<string, object>> formDataListNew { get; set; }

        public List<DynamicDropdownNew> tablist { get; set; }
        public List<MapColumnValues> MapVal { get; set; }

        public IEnumerable<FormCalenderReferrenceTable> currentEventCalenderReferrenceList { get; set; }


    }


    public class referenceFormDTO
    {
        public IEnumerable<FormTable> formNameList { get; set; }
        public IEnumerable<Form_FieldsTable> formFieldsList { get; set; }
    }





}
