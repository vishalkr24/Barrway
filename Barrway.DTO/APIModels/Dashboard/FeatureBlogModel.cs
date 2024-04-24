using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Dashboard
{
    public class FeatureBlogModel
    {
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public string BLOG_TITLE { get; set; }
        public string IMAGE { get; set; }
        public string YOUTUBE_LINK { get; set; }
        public string TAG { get; set; }
        public string BLOG_CATEGORY { get; set; }
        public string BLOG_CATEGORY_ID { get; set; }
    }
}
