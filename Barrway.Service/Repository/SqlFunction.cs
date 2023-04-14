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
    }
}
