using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barrway.Mapping
{
    public class AutoMapperConfiguration
    {
        public static MapperConfiguration InitializeAutoMapper()
        {
            MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new ViewModelMappingProfile());//mapping between Web and Business layer objects
            });

            return config;
        }
    }
}