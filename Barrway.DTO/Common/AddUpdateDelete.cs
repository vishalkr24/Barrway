using Barrway.DTO.MarketplaceModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.Common
{
    public class AddUpdateDelete
    {
        public string Message { get; set; }
        public bool Status { get; set; }
        public dynamic Data { get; set; }
    }

    public class Resultdata
    {
        public string Message { get; set; }
        public bool Status { get; set; }
        public List<Tag> Data { get; set; }
    }


    public class LoginResponse
    {
        public string Message { get; set; }
        public bool Status { get; set; }
        public dynamic Data { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; } = "bearer";
        public int expires_in { get; set; }
    }
    public class AddUpdateDelete<T> where T : class
    {
        public string Message { get; set; }
        public bool Status { get; set; }
        public T Data { get; set; }
    }
}
