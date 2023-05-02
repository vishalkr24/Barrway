using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyPhotoAlbumModel
    {
        public string Id { get; set; }
        public string ALBUM_PHOTO_NAME { get; set; }
        public string ALBUM_PHOTO_PATH { get; set; }
        public string IS_VISIBLE { get; set; }
        public string COMPANY_ID { get; set; }

    }

}
