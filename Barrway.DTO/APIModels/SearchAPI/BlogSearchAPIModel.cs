using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class BlogSearchAPIModel
    {
        public List<string> tags { get; set; }
        public string keyword { get; set; }
        public int size { get; set; }
        public int page { get; set; }
    }
}
