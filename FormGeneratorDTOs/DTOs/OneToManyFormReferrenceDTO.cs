using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class OneToManyFormReferrenceDTO : CommonClass
    {
        public int formId { get; set; }
        public int Id { get; set; }
        public int MasterformId { get; set; }
        public string formGroupKey { get; set; }
        public string reference_formId { get; set; }
        public string referralForm { get; set; }
        public int reference_form_recId { get; set; }
        public string referenceform_column { get; set; }
        public string referrenceFormTable { get; set; }
        public List<OneToManyFormReferrenceDTO> OneToManyFormReferrenceList { get; set; }
        public bool isOneToManyType { get; set; }
        public bool isOneToManyFormType { get; set; }
    }
}
