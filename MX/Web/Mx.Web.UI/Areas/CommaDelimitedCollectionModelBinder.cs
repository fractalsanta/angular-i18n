using System;
using System.ComponentModel;
using System.Linq;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;

namespace Mx.Web.UI.Areas
{
    public class CommaDelimitedCollectionModelBinder : IModelBinder
    {
        public Boolean BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            var key = bindingContext.ModelName;
            var val = bindingContext.ValueProvider.GetValue(key);
            if (val == null)
            {
                return false;
            }

            var valString = val.AttemptedValue;
            if (valString != null)
            {
                var elementType = bindingContext.ModelType.GetGenericArguments()[0];
                var elementConverter = TypeDescriptor.GetConverter(elementType);

                var values = valString.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => elementConverter.ConvertFromString(x.Trim())).ToArray();

                var typedArray = Array.CreateInstance(elementType, values.Length);
                values.CopyTo(typedArray, 0);

                bindingContext.Model = typedArray;
            }
            else
            {
                bindingContext.Model = null;
            }

            return true;
        }
    }
}