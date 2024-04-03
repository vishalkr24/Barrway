using Dapper;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;

namespace Barrway.Service.Repository
{
    public class SqlFunction: ISqlFunction
    {
        private readonly string connectionString;
        public SqlFunction()
        {
            connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
        }

        public async Task<int> ExecuteSqlCommandQuery(string sqlQuery)
        {
            int affectedRows = 0;

            using (var db = new SqlConnection(connectionString))
            {
                await db.OpenAsync();
                affectedRows = await db.ExecuteAsync(sqlQuery);
            }
            return affectedRows;
        }

        public async Task<List<IDictionary<string, object>>> ExecuteSqlQuery(string sqlQuery)
        {
            List<IDictionary<string, object>> rows = new List<IDictionary<string, object>>();
            using (var db = new SqlConnection(connectionString))
            {
                await db.OpenAsync();
                using (var reader = await db.ExecuteReaderAsync(sqlQuery))
                {
                    while (reader.Read())
                    {
                        var dict = new Dictionary<string, object>();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            dict[reader.GetName(i)] = reader.GetValue(i);
                        }
                        rows.Add(dict);
                    }
                }
            }
            return rows;
        }

        public async Task<IEnumerable<T>> ExecuteSqlQuery<T>(string sqlQuery)
        {
            using (var db = new SqlConnection(connectionString))
            {
                await db.OpenAsync();
                return await db.QueryAsync<T>(sqlQuery);
            }
        }

        public  List<IDictionary<string, object>> ExecuteSqlQueryNonAsync(string sqlQuery)
        {
            List<IDictionary<string, object>> rows = new List<IDictionary<string, object>>();
            using (var db = new SqlConnection(connectionString))
            {
                 db.OpenAsync();
                using (var reader =  db.ExecuteReader(sqlQuery))
                {
                    while (reader.Read())
                    {
                        var dict = new Dictionary<string, object>();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            dict[reader.GetName(i)] = reader.GetValue(i);
                        }
                        rows.Add(dict);
                    }
                }
            }
            return rows;
        }



        public async Task<List<IDictionary<string, object>>> ExecuteSqlQuery(string sqlQuery, DynamicParameters param,CommandType commandType)
        {
            List<IDictionary<string, object>> rows = new List<IDictionary<string, object>>();
            using (var db = new SqlConnection(connectionString))
            {
                await db.OpenAsync();
                using (var reader = await db.ExecuteReaderAsync(sqlQuery,param:param,commandType: commandType))
                {
                    while (reader.Read())
                    {
                        var dict = new Dictionary<string, object>();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            dict[reader.GetName(i)] = reader.GetValue(i);
                        }
                        rows.Add(dict);
                    }
                }
            }
            return rows;
        }

        public async Task<int> ExecuteSqlCommandQuery(string sqlQuery, DynamicParameters param, CommandType commandType)
        {
            int affectedRows = 0;
            using (var db = new SqlConnection(connectionString))
            {
                await db.OpenAsync();
                affectedRows = await db.ExecuteAsync(sqlQuery, param: param, commandType: commandType);
            }
            return affectedRows;
        }

        public async Task<string> GetDateFilter(FilterDTO filtr, string prefix = "f")
        {
            string customWhere="";
            //if (filtr.field.ToString() == "created_at" || filtr.field.ToString() == "updated_at")
            if (filtr.field.ToString() == "created_at" || filtr.field.ToString() == "updated_at" || filtr.field.ToString() == "PAYMENT_DATE" || filtr.field.ToString() == "FROM_TIME" || filtr.field.ToString() == "TO_TIME" || filtr.field.ToString() == "start" || filtr.field.ToString() == "end")
            {
                if (filtr.value.Length == 7)
                {

                    customWhere = " month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') and year(" + prefix + ".[" + filtr.field + "]) = year('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') ";

                }
                else if (filtr.value.Length == 4)
                {
                    customWhere = " year(" + prefix + ".[" + filtr.field + "]) = year('" + "01-01-" + filtr.value + "') ";

                }
                else if (filtr.value.Length == 5)
                {
                    //customWhere = " day([" + filtr.field + "]) = day('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') and month([" + filtr.field + "]) = month('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') ";

                    var Fvalue = filtr.value.Split('-')[0];
                    if (Fvalue != "0")
                    {
                        customWhere = " year(" + prefix + ".[" + filtr.field + "]) = year('" + "01-01-" + Fvalue + "') ";
                    }


                }
                else if (filtr.value.Length == 6) //changes due to 2022- changes
                {
                    var Fvalue = filtr.value.Split('-')[1];
                    if (Fvalue != "0")
                    {
                        customWhere = " day(" + prefix + ".[" + filtr.field + "]) = day('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') and month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') ";
                    }
                    else
                    {
                        customWhere = " year(" + prefix + ".[" + filtr.field + "]) = year('" + "01-01-" + filtr.value.Split('-')[0] + "') ";
                    }



                }

                else if (filtr.value.Length == 8)
                {
                    var Year = filtr.value.Split('-')[0];
                    var month = filtr.value.Split('-')[1];
                    if (Year != "" && month != "")
                    {
                        var filterValue = Year + "-" + month;
                        customWhere = " month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(" + prefix + ".[" + filtr.field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";
                    }


                }


                else if (filtr.value.Length == 9)
                {
                    var Year = filtr.value.Split('-')[0];
                    var month = filtr.value.Split('-')[1];
                    var Day = filtr.value.Split('-')[2];
                    if (Year != "" && month != "" && Day != "")
                    {

                        if (Day != "00" && Day.Length == 2)
                        {
                            var filterValue = Year + "-" + month + "-" + Day;
                            customWhere = " day(" + prefix + ".[" + filtr.field + "]) = day('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(" + prefix + ".[" + filtr.field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";

                        }
                        else
                        {
                            var filterValue = Year + "-" + month;
                            customWhere = " month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') and year(" + prefix + ".[" + filtr.field + "]) = year('" + Convert.ToDateTime(filterValue).ToString("MM-dd-yyyy") + "') ";


                        }
                    }


                }
                else if (filtr.value.Length == 10)
                {
                    customWhere = " day(" + prefix + ".[" + filtr.field + "]) = day('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') and month(" + prefix + ".[" + filtr.field + "]) = month('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') and year(" + prefix + ".[" + filtr.field + "]) = year('" + Convert.ToDateTime(filtr.value).ToString("MM-dd-yyyy") + "') ";

                }
            }

            return customWhere;
        }
    }


    //public class SqlFunction<T>
}
