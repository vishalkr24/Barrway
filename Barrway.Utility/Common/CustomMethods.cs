using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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

        public static string GetDateQuery(DateTime start, DateTime end)
        {
            string _start = start.ToString("yyyy-MM-dd");
            string _end = end.ToString("yyyy-MM-dd");
            return $@"((cast([start] as date) <= '{_start}' and (cast([end] as date) <= '{_end}' and cast([end] as date) >= '{_start}')) or
										((cast([start] as date) >= '{_start}' and cast([start] as date) <= '{_end}') and (cast([end] as date) <= '{_end}' and cast([end] as date) >= '{_start}')) or
										((cast([start] as date) <= '{_end}' and cast([start] as date) >= '{_start}') and cast([end] as date) >= '{_end}') or
										(cast([start] as date) <= '{_start}' and cast([end] as date) >= '{_end}'))";
        }
    }
    public static class ObjectExtensions
    {
        public static T ToObject<T>(this IDictionary<string, object> source)
            where T : class, new()
        {
            var someObject = new T();
            var someObjectType = someObject.GetType();

            foreach (var item in source)
            {
                if (someObject.AsDictionary().Keys.Contains(item.Key))
                {
                    someObjectType
                         .GetProperty(item.Key)
                         .SetValue(someObject, item.Value, null);
                }

            }

            return someObject;
        }

        public static Dictionary<string, object> AsDictionary(this object source, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance)
        {
            if (source == null)
            {
                return new Dictionary<string, object>();
            }

            return source.GetType().GetProperties(bindingAttr).ToDictionary
            (
                propInfo => propInfo.Name,
                propInfo => propInfo.GetValue(source, null)
            );

        }
    }
}
