using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class GenerateInvoiceDTOParam : CommonClass
    {
        public int Id { get; set; }
        public string list { get; set; }

        public string paymentPeriodList { get; set; }
        public string paymentPeriod { get; set; }
        public List<GenerateInvoiceDTO> listOfRecords { get; set; }
        public List<IDictionary<string, object>> FormDataListDynamic { get; set; }

        public IEnumerable<Form_FieldsTable> formFieldsList { get; set; }

        public int formId { get; set; }
        public int otherreferrenceFormId { get; set; }
        public int primaryFormId { get; set; }
        public bool replaceExistingRecord { get; set; }

    }
    public class GenerateInvoiceDTO
    {
        public int Id { get; set; }
        public string name { get; set; }
        public decimal totalAmount { get; set; }
        public int isExistingRecords { get; set; }
        public string courseName { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string formGroupKey { get; set; }
        public string fees_1 { get; set; }
        public string fees_2 { get; set; }
        public string fees_3 { get; set; }
        public string studentId { get; set; }

    }
}
