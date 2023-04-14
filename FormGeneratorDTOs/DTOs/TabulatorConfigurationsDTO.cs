using System;

namespace FormGeneratorDTOs.DTOs
{
    public class TabulatorConfigurationsDTO
    {
        public int action { get; set; }

        public int Id { get; set; }
        public int userID { get; set; }

        public string tabulatorID { get; set; }

        public string configName { get; set; }

        public string configSettings { get; set; }
        public string groupBy { get; set; }
        public int recordsPerPage { get; set; }
        public DateTime? createdOn { get; set; }
        public DateTime? updatedOn { get; set; }
        public string groupFields { get; set; }
        public int isFrozen { get; set; }
        public int frozenColumn { get; set; }
        public int headingHeight { get; set; }
        public string columnFilters { get; set; }
        public bool isActive { get; set; }

        public int res { get; set; }
        public string message { get; set; }
    }
}
