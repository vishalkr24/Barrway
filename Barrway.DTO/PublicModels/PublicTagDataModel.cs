using Barrway.DTO.BusinessModels;
using Barrway.DTO.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.PublicModels
{
    public class PublicTagDataModel
    {
        public List<BusinessCompanyModel> companies { get; set; }
        public List<BusinessCalendarModel> calendars { get; set; }

    }

}
