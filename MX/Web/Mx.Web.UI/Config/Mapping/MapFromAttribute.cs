using System;

namespace Mx.Web.UI.Config.Mapping
{
    public class MapFrom : Attribute
    {
        private readonly Type _mapFrom;

        public Type MapFromType
        {
            get { return _mapFrom; }
        }

        public MapFrom(Type type)
        {
            _mapFrom = type;
        }
    }
}