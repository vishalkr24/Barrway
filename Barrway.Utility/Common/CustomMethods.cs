using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class CustomMethods
    {
        public static string ConvertDicToNameValuePair(IDictionary<string, object> data)
        {
            List<Dictionary<string, object>> datalist = new List<Dictionary<string, object>>();
            foreach (var prop in data.Keys)
            {
                Dictionary<string, object> keyValue = new Dictionary<string, object>();
                keyValue.Add("name", prop);
                keyValue.Add("value", data[prop]);
                datalist.Add(keyValue);
            }
            return JsonConvert.SerializeObject(datalist);
        }
    }
}
