using AutoMapper;
using Barrway.DTO.APIModels.Calendar;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barrway.Mapping
{
    public class ViewModelMappingProfile : Profile
    {
        public ViewModelMappingProfile()
        {
            // CreateMap<ProductMaster, BankGridMasterViewModel>();   
            CreateMap<CalendarRequestModel, Form_DataTable>();

        }
    }
}