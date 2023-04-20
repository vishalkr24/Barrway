using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyProfileModel
    {
        [Required(ErrorMessage = "Company name is required")]
        public string COMPANY_NAME_ENGLISH { get; set; }

        public string COMPANY_NAME_CHINESE { get; set; }

        [Required(ErrorMessage = "Please select a company category")]
        public string COMPANY_CATEGORY_ID { get; set; }

        [Required(ErrorMessage = "Please select a company sub-category")]
        public string COMPANY_SUB_CATEGORY_ID { get; set; }

    }

    public enum CompanyCategory
    {
        Category1 = 1,
        Category2 = 2
    }

}
