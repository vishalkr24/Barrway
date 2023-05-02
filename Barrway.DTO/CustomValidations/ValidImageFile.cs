using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.CustomValidations
{
    public class ValidImageFile: ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            try
            {
                HttpPostedFileBase file = (HttpPostedFileBase)value;
                if (value == null)
                {
                    return true;
                }
                else
                {
                    if (file.ContentType.Contains("image"))
                    {
                        return true;
                    }else 
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            
        }
    }
}
