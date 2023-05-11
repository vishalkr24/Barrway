using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class FormModel
    {
    }

    public class CommonClass
    {
        public int action { get; set; }
        public int created_by { get; set; }= 30314;
        public int updated_by { get; set; } = 30314;
        public string created_at { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        public DateTime? newcreated_at { get; set; }
        public string updated_at { get; set; }= DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        public DateTime? newupdated_at { get; set; }
        public int res { get; set; }
        public string Message { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsUnique { get; set; }
        public int page { get; set; }
        public int size { get; set; }
        public int total_records { get; set; }
        public int last_page { get; set; }
        public int page_records { get; set; }
        public List<FilterDTO> filters { get; set; }
        public List<SortDTO> sorters { get; set; }
        public string Query { get; set; }


    }

}
