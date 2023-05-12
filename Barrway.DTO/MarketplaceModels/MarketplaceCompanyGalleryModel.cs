using Barrway.DTO.BusinessModels;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class MarketplaceCompanyGalleryModel
    {
        public string Id { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public List<CompanyPhotoAlbumModel> photoAlbumList { get; set; }
    }

}
