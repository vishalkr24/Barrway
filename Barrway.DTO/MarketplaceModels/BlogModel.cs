using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class BlogModel
    {

        public List<BlogList> FeturedBlogList { get; set; }
        public List<BlogList> BlogList { get; set; }
       
    }


    public class BlogList
    {
        public int Id { get; set; }
        public string BLOG_CATEGORY { get; set; }
        public string BLOG_TITLE { get; set; }
        public string IMAGE { get; set; }
        public string BLOG_CONTENT { get; set; }
        public string MARKED_AS_HOT { get; set; }
        public string TAG { get; set; }
        public DateTime created_at { get; set; }


    }
  }
