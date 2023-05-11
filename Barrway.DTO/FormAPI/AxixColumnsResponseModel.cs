using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.FormAPI
{
    public class AxixColumnsResponseModel
    {
        public IEnumerable<Form_FieldsTable> formFieldsData { get; set; }
        public List<DynamicDropdownNew> resourceDetails { get; set; }
        public IEnumerable<Form_FieldsTable> resfields { get; set; }
        public IEnumerable<Form_FieldsTable> activityFields { get; set; }
        public IEnumerable<FormTable> resColGrouping { get; set; }
    }
}
