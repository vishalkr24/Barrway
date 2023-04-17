using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MOODIES_CARE.DTO.FormAPI
{
    
    public class CounsellorUploadFileViewModel
    {
        public string banner { get; set; }
        public string fileUrl { get; set; }
        public List<object> images { get; set; }
        public string fileName { get; set; }
        public int code { get; set; }
        public string message { get; set; }
        public bool success { get; set; }
        public string userName { get; set; }
    }

}
