using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public static class DateTimeUtility
    {
        public static DateTime Now()
        {
            try
            {
                DateTime hkTime = TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById("China Standard Time"));
                return hkTime;
            }
            catch (Exception)
            {
                return DateTime.Now;
            }
            
        }
    }
}
