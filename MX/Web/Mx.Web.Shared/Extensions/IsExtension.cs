using System;
using System.Linq;

namespace Mx.Web.Shared.Extensions
{
    public static class IsExtension
    {
        public static Boolean IsIn(this Int64 objectToCompare, params Int64[] values)
        {
            return values.Any(objectToCompare.Equals);
        }
    }
}