using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyPhotoAlbumViewModel
    {
        public string Id { get; set; }
        [Required(ErrorMessage = "Photo name is required")]
        public string ALBUM_PHOTO_NAME { get; set; }
        [Required(ErrorMessage = "Please select an image")]
        public HttpPostedFileBase ALBUM_PHOTO_PATH { get; set; }
        public string IS_VISIBLE { get; set; }
        public string COMPANY_ID { get; set; }

    }

}
