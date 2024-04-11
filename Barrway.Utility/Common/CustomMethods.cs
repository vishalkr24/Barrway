using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
        public static string CreateUUID()
        {
            long dt = DateTimeUtility.Now().Ticks / TimeSpan.TicksPerMillisecond;
            string uuid = "xxxxxxxxyxxx";

            Random random = new Random();

            uuid = Regex.Replace(uuid, "[xy]", match =>
            {
                long r = (dt + random.Next(12)) % 12;
                dt = (long)Math.Floor((double)dt / 12);
                return match.Value == "x" ? r.ToString("X") : ((r & 0x3) | 0x8).ToString("X");
            });

            return uuid;
        }
    }
}
