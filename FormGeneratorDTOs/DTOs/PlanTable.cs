using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class PlanTable : CommonClass
    {
        public int userId { get; set; }
        public int Id { get; set; }
        public string domaintype { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public decimal subscription_fees { get; set; }
        public string servicetype { get; set; }
        public string storage_space { get; set; }
        public string max_size_document { get; set; }
        public string max_no_document { get; set; }

        public string time_period { get; set; }
        public string header_color { get; set; }
        public bool defaultPlan { get; set; }
        public int status { get; set; }
        public string statusText { get; set; }

        public DateTime? created_date { get; set; }
        public DateTime? modify_date { get; set; }

        public bool getCurrentPlan { get; set; }

        public List<Users> currPlan { get; set; }
    }
}
