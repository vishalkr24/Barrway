using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Dashboard
{
    public class BlogModel
    {
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public string BLOG_TITLE { get; set; }
        public string IMAGE { get; set; }
        public string YOUTUBE_LINK { get; set; }
        public string TAG { get; set; }
        public string BLOG_CATEGORY { get; set; }
        public string BLOG_CATEGORY_ID { get; set; }
        public string IS_HOT { get; set; }
        public string IS_FEATURED { get; set; }
        public int total_records { get; set; }
        public int page { get; set; }
        public int size { get; set; }
    }


    public class BlogDetailModel
    {
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public string BLOG_TITLE { get; set; }
        public string BLOG_CONTENT { get; set; }
        public string IMAGE { get; set; }
        public string YOUTUBE_LINK { get; set; }
        public string TAG { get; set; }
        public string BLOG_CATEGORY { get; set; }
        public string BLOG_CATEGORY_ID { get; set; }
        public string IS_HOT { get; set; }
        public string IS_FEATURED { get; set; }
        
    }
}
