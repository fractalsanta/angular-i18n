using System;
using System.Reflection;
using AutoMapper;

namespace Mx.Web.UI.Config.Mapping
{
    public class AutoMapperConfigurator
    {
        public static void Configure()
        {
            foreach (var type in Assembly.GetExecutingAssembly().GetTypes())
            {
                var attr = Attribute.GetCustomAttribute(type, typeof (MapFrom)) as MapFrom;
                if (attr != null)
                {
                    Mapper.CreateMap(attr.MapFromType, type);
                }
            }
        }
    }
}