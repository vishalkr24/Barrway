using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
   
    public class SearchResponseModel<T> where T : class
    {
        public string searchType { get; set; }
        public double last_page { get; set; }
        public T data { get; set; }
    }
    
}
