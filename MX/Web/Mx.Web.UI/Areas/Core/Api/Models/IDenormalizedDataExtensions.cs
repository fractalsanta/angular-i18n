using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public static class IDenormalizedDataExtensions
    {
        public static void EnsureListsExist(this IDenormalizedData data)
        {
            var lists = GetListProperties(data);
            foreach (var list in lists)
            {
                GetListInstance(data, list);
            }
        }

        public static void Denormalize(this IDenormalizedData data, IEnumerable<Object> items)
        {
            if (items == null)
                return;

            foreach (var item in items)
            {
                Denormalize(data, item);
            }
        }

        public static void Denormalize(this IDenormalizedData data, Object item)
        {
            var lists = GetListProperties(data);
            foreach (var list in lists)
            {
                var itemProperty = item.GetType().GetProperty(list.Name);
                if (itemProperty == null || itemProperty.GetIndexParameters().Length > 0)
                    continue;

                var listValue = GetListInstance(data, list);
                listValue.Add(itemProperty.GetValue(item, null));
            }
        }

        private static IEnumerable<PropertyInfo> GetListProperties(IDenormalizedData data)
        {
            var lists = from p in data.GetType().GetProperties()
                        where
                            p.GetIndexParameters().Length == 0 &&
                            p.PropertyType.IsGenericType &&
                            p.PropertyType.GetGenericTypeDefinition() == typeof(IList<>)
                        select p;
            return lists;
        }

        private static IList GetListInstance(IDenormalizedData data, PropertyInfo list)
        {
            var listValue = (IList)list.GetValue(data, null);
            if (listValue != null || !list.CanWrite)
                return listValue;

            var elementType = list.PropertyType.GetGenericArguments()[0];
            listValue = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(elementType));
            list.SetValue(data, listValue, null);
            return listValue;
        }
    }
}