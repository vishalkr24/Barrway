using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class BlogViewModel
    {
        public List<Blog> FeaturedBlogs { get; set; }       
        public List<Blog> BlogList { get; set; }
        public List<Tag> TagList { get; set; }
    }


    


}
