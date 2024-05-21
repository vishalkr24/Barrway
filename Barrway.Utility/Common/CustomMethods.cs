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
        public static string generateHeaderFilterSearchQuery(string fieldName, string fieldValue, int userid = 0, bool isFormRecord = true)
        {
            var result = "";
            var prefix = isFormRecord ? "f." : "";
            if (fieldValue != "")
            {
                var count = 0;
                #region comma seperation condition
                if (fieldValue.Contains(","))
                {
                    var spliList = fieldValue.Split(',');
                    foreach (var spVal in spliList)
                    {
                        if (spVal != "")
                        {
                            if (count == 0)
                                result += " ( ";
                            result += "  " + prefix + fieldName + " like N'%" + spVal.Trim() + "%' or ";
                            count++;
                        }

                    }
                    if (!fieldValue.Contains("+"))
                        result = result.Substring(0, result.Length - 3);

                    result += " ) ";

                }
                #endregion
                //if (fieldValue.Contains(""))
                //{


                //    if (count == 0)
                //    {

                //        result += " ( "+ fieldName +"='')";

                //    }
                //    count++;


                //}

                count = 0;
                #region plus condition
                if (fieldValue.Contains("+"))
                {
                    var spliList = fieldValue.Split('+');
                    var concatstring = "";
                    foreach (var spVal in spliList)
                    {
                        var spValue = spVal.Trim();
                        if (spValue != "")
                        {
                            if (count == 0)
                                result += " ( ";
                            concatstring = spVal.Trim();
                            result += prefix + fieldName + " like N'%" + concatstring.Trim() + "%' and ";
                            count++;
                        }

                    }
                    result = result.Substring(0, result.Length - 4);


                    result += " ) ";

                }
                #endregion
                #region logical condition based filter
                if (fieldValue.Contains("<") || fieldValue.Contains("<=") || fieldValue.Contains(">") || fieldValue.Contains(">="))
                {
                    string x = "";
                    #region lessthen and lessthen equalto based condition
                    if (fieldValue.Contains("<="))
                    {
                        var valueReplaced = fieldValue.Replace("<=", "@");
                        var spliList = valueReplaced.Split('@');
                        if (spliList.Length > 0)
                        {
                            x = spliList[1];
                            if (int.TryParse(x, out int output))
                            {
                                result += prefix + fieldName + " <= " + output + " and ";
                            }
                            else
                            {
                                if (x != "")
                                    result += prefix + fieldName + " like N'%" + x.Trim() + "%' and ";
                            }
                            if (x != "")
                                result = result.Substring(0, result.Length - 4);
                        }

                    }
                    else if (fieldValue.Contains("<"))
                    {
                        var spliList = fieldValue.Split('<');
                        if (spliList.Length > 0)
                        {
                            x = spliList[1];
                            if (int.TryParse(x, out int output))
                            {
                                result += prefix + fieldName + " < " + output + " and ";
                            }
                            else
                            {
                                if (x != "")
                                    result += prefix + fieldName + " like N'%" + x.Trim() + "%' and ";
                            }
                            if (x != "")
                                result = result.Substring(0, result.Length - 4);
                        }

                    }
                    else if (fieldValue.Contains(">="))
                    {
                        var valueReplaced = fieldValue.Replace(">=", "@");
                        var spliList = valueReplaced.Split('@');
                        if (spliList.Length > 0)
                        {
                            x = spliList[1];
                            if (int.TryParse(x, out int output))
                            {
                                result += prefix + fieldName + " >= " + output + " and ";
                            }
                            else
                            {
                                if (x != "")
                                    result += prefix + fieldName + " like N'%" + x.Trim() + "%' and ";
                            }
                            if (x != "")
                                result = result.Substring(0, result.Length - 4);
                        }

                    }
                    else if (fieldValue.Contains(">"))
                    {
                        var spliList = fieldValue.Split('>');
                        if (spliList.Length > 0)
                        {
                            x = spliList[1];
                            if (int.TryParse(x, out int output))
                            {
                                result += prefix + fieldName + " > " + output + " and ";
                            }
                            else
                            {
                                if (x != "")
                                    result += prefix + fieldName + " like N'%" + x.Trim() + "%' and ";
                            }
                            if (x != "")
                                result = result.Substring(0, result.Length - 4);
                        }

                    }


                    #endregion
                }
                #endregion
                #region simple like filter query
                if (!fieldValue.Contains(" ") && !fieldValue.Contains("+") && !(fieldValue.Contains("<") || fieldValue.Contains("<=") || fieldValue.Contains(">") || fieldValue.Contains(">=")) && !(fieldValue.Contains("(") || fieldValue.Contains(")")) && !fieldValue.Contains(","))
                {
                    if (fieldName == "status")
                    {

                        if (int.TryParse(fieldValue, out int output))
                        {
                            result += "  " + prefix + fieldName + " = " + output + "  ";
                        }

                    }
                    else if (fieldName == "groupTag")
                    {

                        result += "(select distinct ug.[groupTag] from [dbo].[user_group]" +
                                " as ug where ug.userID = " + userid + " and ug.groupID = g.groupID ) like N'%" + fieldValue.Trim() + "%' ";
                    }
                    else if (fieldName == "masterGroupName")
                    {
                        result += "(select distinct top(1) [groupName] from[dbo].[groups] where[groupID]=g.masterGroupID) like N'%" + fieldValue.Trim() + "%' ";
                    }
                    else if (!HasSpecialChars(fieldValue))
                    {
                        result += prefix + fieldName + " like N'%" + fieldValue.Trim() + "%' ";
                    }
                    else
                    {
                        result += prefix + fieldName + " like N'%" + fieldValue.Trim() + "%' ";
                    }
                }

                if (fieldValue.Contains("("))
                {
                    if (string.IsNullOrEmpty(result))
                    {
                        if (fieldName == "title")
                        {
                            string valueA = fieldValue.Split('(')[0];
                            string valueB = fieldValue.Split('(')[1].Split(')')[0];


                            result += prefix + fieldName + " like N'%" + valueA.Trim() + "%' and topicTitle like N'%" + valueB.Trim() + "%'";

                        }
                        else
                        {
                            result += prefix + fieldName + " like N'%" + fieldValue.Trim() + "%' ";
                        }
                    }
                    else
                    {
                        if (fieldName == "title")
                        {
                            string valueA = fieldValue.Split('(')[0];
                            string valueB = fieldValue.Split('(')[1].Split(')')[0];


                            result += " or " + prefix + fieldName + " like N'%" + valueA.Trim() + "%' and topicTitle like N'%" + valueB.Trim() + "%'";

                        }
                        else
                        {
                            result += " or " + prefix + fieldName + " like N'%" + fieldValue.Trim() + "%' ";
                        }
                    }

                }

                if (fieldValue.Contains(" "))
                {


                    if (!fieldValue.Contains(",") && !fieldValue.Contains("+") && !(fieldValue.Contains("<") || fieldValue.Contains("<=") || fieldValue.Contains(">") || fieldValue.Contains(">=")) && !(fieldValue.Contains("(") || fieldValue.Contains(")")))
                    {
                        result += prefix + fieldName + " like N'%" + fieldValue.Trim() + "%' ";
                    }






                }

                #endregion


            }
            return result;
        }
        public static bool HasSpecialChars(string yourString)
        {
            return yourString.Any(ch => !Char.IsLetterOrDigit(ch) && !Char.IsWhiteSpace(ch));
        }
        public static string datefilter(string field, string value)
        {
            string customWhere = "";
            if (value.Length == 7)
            {

                customWhere = " month(f.[" + field + "]) = month('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') and year(f.[" + field + "]) = year('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') ";

            }
            else if (value.Length == 4)
            {
                customWhere = " year(f.[" + field + "]) = year('" + "01-01-" + value + "') ";

            }
            else if (value.Length == 5)
            {
                //customWhere = " day([" + field + "]) = day('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') and month([" + field + "]) = month('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') ";

                var Fvalue = value.Split('-')[0];
                if (Fvalue != "0")
                {
                    customWhere = " year(f.[" + field + "]) = year('" + "01-01-" + Fvalue + "') ";
                }


            }
            else if (value.Length == 6) //changes due to 2022- changes
            {
                var Fvalue = value.Split('-')[1];
                if (Fvalue != "0")
                {
                    customWhere = " day(f.[" + field + "]) = day('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') and month(f.[" + field + "]) = month('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') ";
                }
                else
                {
                    customWhere = " year(f.[" + field + "]) = year('" + "01-01-" + value.Split('-')[0] + "') ";
                }



            }

            else if (value.Length == 8)
            {
                var Year = value.Split('-')[0];
                var month = value.Split('-')[1];
                if (Year != "" && month != "")
                {
                    var filterValue = Year + "-" + month;
                    customWhere = " month(f.[" + field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(f.[" + field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";
                }


            }


            else if (value.Length == 9)
            {
                var Year = value.Split('-')[0];
                var month = value.Split('-')[1];
                var Day = value.Split('-')[2];
                if (Year != "" && month != "" && Day != "")
                {

                    if (Day != "00" && Day.Length == 2)
                    {
                        var filterValue = Year + "-" + month + "-" + Day;
                        customWhere = " day(f.[" + field + "]) = day('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and month(f.[" + field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(f.[" + field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";

                    }
                    else
                    {
                        var filterValue = Year + "-" + month;
                        customWhere = " month(f.[" + field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(f.[" + field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";


                    }
                }


            }
            else if (value.Length == 10)
            {
                customWhere = " day(f.[" + field + "]) = day('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') and month(f.[" + field + "]) = month('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') and year(f.[" + field + "]) = year('" + Convert.ToDateTime(value).ToString("MM-dd-yyyy") + "') ";

            }

            return customWhere;

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
