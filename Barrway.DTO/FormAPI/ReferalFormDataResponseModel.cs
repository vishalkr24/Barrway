using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.FormAPI
{
    public class ReferalFormDataResponseModel
    {
        public List<IDictionary<string,object>> events { get; set; }
        public List<IDictionary<string,object>> activityEvents { get; set; }
        public List<DynamicDropdownNew> resourceDetails { get; set; }
        public List<DynamicDropdownNew> activityDetails { get; set; }

    }
}
