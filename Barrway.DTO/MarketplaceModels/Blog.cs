using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class Blog
    {
        public int Id { get; set; }
        public string BLOG_CATEGORY { get; set; }
        public string BLOG_TITLE { get; set; }
        public string IMAGE { get; set; }
        public string BLOG_CONTENT { get; set; }
        public string IS_HOT { get; set; }
        public string TAG { get; set; }
        public List<TagsObject> TAGs { get; set; }
        public DateTime created_at { get; set; }

    }

    public class TagsObject
    {
        public string value { get; set; }
    }


    public class Tag
    {
        public string TAG { get; set; }
    }
}
