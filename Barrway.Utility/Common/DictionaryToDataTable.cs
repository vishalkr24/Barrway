using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class DictionaryToDataTable
    {
        public static DataTable ToDictionary(List<IDictionary<string, object>> list)
        {
            DataTable result = new DataTable();
            if (list.Count == 0)
                return result;

            result.Columns.AddRange(
                list.First().Select(r => new DataColumn(r.Key)).ToArray()
            );

            list.ForEach(r => result.Rows.Add(r.Select(c => c.Value).Cast<object>().ToArray()));

            return result;
        }
    }
}
