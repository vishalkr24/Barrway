using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class FilterCriteriaConfig : CommonClass
    {
        public int Id { get; set; }
        public int formId { get; set; }
        public int topicId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string type { get; set; }
        public string recordFilters { get; set; }

        public bool isApplied { get; set; }

        public List<FilterCriteriaConfig> listFilter { get; set; }
    }
}
