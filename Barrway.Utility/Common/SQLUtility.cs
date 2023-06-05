using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public static class SQLUtility
    {
        public static string TreatSingleQuoteForQuery(string data)
        {
            if (!string.IsNullOrEmpty(data))
            {
                if (data.Contains("'"))
                {
                    data = data.Replace("'", "''");
                    return data;
                }
                else
                {
                    return data;
                }
            }
            else
            {
                return "";
            }
            
        }
    }
}
