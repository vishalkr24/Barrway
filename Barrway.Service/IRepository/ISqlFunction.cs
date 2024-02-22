using Dapper;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface ISqlFunction
    {
        Task<int> ExecuteSqlCommandQuery(string sqlQuery);
        Task<int> ExecuteSqlCommandQuery(string sqlQuery, DynamicParameters param, CommandType commandType);
        Task<List<IDictionary<string, object>>> ExecuteSqlQuery(string sqlQuery);
        Task<List<IDictionary<string, object>>> ExecuteSqlQuery(string sqlQuery, DynamicParameters param, CommandType commandType);
        Task<string> GetDateFilter(FilterDTO filtr, string prefix = "f");
        List<IDictionary<string, object>> ExecuteSqlQueryNonAsync(string sqlQuery);
    }
}
