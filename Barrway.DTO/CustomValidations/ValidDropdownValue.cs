using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.CustomValidations
{
    public class ValidDropdownValue: ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            try
            {
                string checkValue = value?.ToString();
                if (string.IsNullOrEmpty(checkValue))
                {
                    return false;
                }
                else
                {
                    if (checkValue == "-1")
                    {
                        return false;
                    }else 
                    {
                        if (Convert.ToInt32(checkValue) > 0)
                            return true;
                        else
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
