using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class DictionaryToClass<T> where T : class
    {
        public T GetObject(Dictionary<string, object> dict)
        {
            Type type = typeof(T);
            var obj = Activator.CreateInstance(type);

            foreach (var kv in dict)
            {
                if (type.GetProperty(kv.Key) != null)
                {
                    if (kv.Key.ToLower().Contains("date"))
                    {
                        DateTime date;

                        if (kv.Value != null && DateTime.TryParseExact(kv.Value.ToString(), "dd/MM/yyyy", CultureInfo.CurrentCulture, DateTimeStyles.None, out date))
                        {
                            type.GetProperty(kv.Key).SetValue(obj, date);
                        }
                        else
                        {
                            if (kv.Value == null || string.IsNullOrEmpty(kv.Value.ToString()))
                            {
                                type.GetProperty(kv.Key).SetValue(obj, null);
                            }
                            else
                            {
                                type.GetProperty(kv.Key).SetValue(obj, kv.Value);
                            }
                        }
                    }
                    else
                    {
                        type.GetProperty(kv.Key).SetValue(obj, kv.Value);
                    }
                }

            }
            return (T)obj;
        }
    }

}
