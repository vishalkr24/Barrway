using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Form_FieldsTable : CommonClass
    {
        public int form_fieldsId { get; set; }

        public int formId { get; set; }

        public int topicId { get; set; }

        public string fieldName { get; set; }

        public string fieldType { get; set; }

        public string fieldLabel { get; set; }

        public string fieldValidationRule { get; set; }

        public string fieldSummary { get; set; }

        public string customCSS { get; set; }

        public int applicationId { get; set; }

        public string fieldTypes { get; set; }
        public string fieldSubtype { get; set; }
        public string resEntry { get; set; }
        public string activityEntry { get; set; }
        public string Use_As_Kanban { get; set; }
    }

    public class FieldsJSONArray1
    {
        public FieldsJSONArray FieldsJSONList { get; set; }
    }

    public class FieldsJSONArray
    {
        public FieldsJSON[] FieldsJSONList { get; set; }
    }

    public class TableData
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class FieldsJSON
    {

        public string List_column1 { get; set; }
        public string Is_Kanban_Status { get; set; }
        public string Use_As_Kanban { get; set; }
        public string type { get; set; }
        public string label { get; set; }
        public string name { get; set; }
        public string className { get; set; }
        public string worksheet { get; set; }

        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
        public string attributeType { get; set; }

        public string subtype { get; set; }
        public string types { get; set; }
        public string Hide_show { get; set; }

        public string id { get; set; }

        public string columns { get; set; }
        public string rows { get; set; }

        public string columnHeadings { get; set; }

        public string columnInputs { get; set; }

        public string Referral_Forms { get; set; }
        public string Referral_Form_Fields { get; set; }
        public string Referral_Form_Fields_Value { get; set; }
        public string Referral_Form_Fields_Multiple { get; set; }
        public string otherreference_form { get; set; }
        public string reference_form { get; set; }
        public string column_calculation { get; set; }
        public string Default_Value { get; set; }
        public string Default_Value_Field { get; set; }
        public string Update_Form_Field { get; set; }
        public string update_operation { get; set; }

        public List<DynamicDropdownNew> values { get; set; }

        public bool? multiple { get; set; }
    }

}
