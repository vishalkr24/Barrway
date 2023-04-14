using System;

namespace FormGeneratorDTOs.DTOs
{
    public class ServiceType : CommonClass
    {
        public int Id { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }


    }
}
