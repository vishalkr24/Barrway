using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class DateTimeHelper
    {
        public static DateTime ConvertToDateTime(string date)
        {
            CultureInfo provider = CultureInfo.InvariantCulture;
            return DateTime.ParseExact(date, AppSettings.dateformat, provider);
        }
        public static DateTime ConvertToDateTimeFormate(string date, string format)
        {
            CultureInfo provider = CultureInfo.InvariantCulture;
            return DateTime.ParseExact(date, format, provider);
        }
    }
}
