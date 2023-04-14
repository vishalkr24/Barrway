using System;

namespace FormGeneratorDTOs.DTOs
{
    public class FormDataToOne
    {
        public string fieldDataText { get; set; }
        public string fieldDataMultimedia { get; set; }
        public string formGroupKey { get; set; }
        public string fieldType { get; set; }
        public int formId { get; set; }

        public int action { get; set; }
        public int res { get; set; }
        public string Message { get; set; }

        public string fieldName { get; set; }

        public int created_by { get; set; }

        public DateTime? created_at { get; set; }


        public string formGroupKeyList { get; set; }

        public string referenceForm { get; set; }

    }
}
