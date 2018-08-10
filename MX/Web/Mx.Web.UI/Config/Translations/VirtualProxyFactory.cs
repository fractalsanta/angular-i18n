using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;

namespace Mx.Web.UI.Config.Translations
{
    public class VirtualProxyFactory : IVirtualProxyFactory
    {
        private readonly Dictionary<Type, Type> _wrappers = new Dictionary<Type, Type>();

        public T Create<T>() where T : new()
        {
            var baseType = typeof (T);
            if (_wrappers.ContainsKey(baseType))
            {
                var type = _wrappers[baseType];
                return (T) Activator.CreateInstance(type);
            }
            throw new ArgumentException("Type is not registered in VirtualProxyFactory: " + baseType.Name);
        }

        public Type GetProxyType(Type type)
        {
            return _wrappers[type];
        }

        public VirtualProxyFactory(Assembly assembly, Func<Type, bool> predicate)
        {
            var name = new AssemblyName(assembly.GetName().Name + "_Proxies");
            var asmBuilder = AppDomain.CurrentDomain.DefineDynamicAssembly(name, AssemblyBuilderAccess.Run);
            var modBuilder = asmBuilder.DefineDynamicModule("Module1");
            assembly.GetTypes().Where(predicate).ToList().ForEach(type => CreateWrapper(modBuilder, type));
        }

        private void CreateWrapper(ModuleBuilder builder, Type baseType)
        {
            var typeName = baseType.FullName + "_Proxy$";
            var typeBuilder = builder.DefineType(typeName, TypeAttributes.Class | TypeAttributes.Public, baseType);
            OverrideProperties(typeBuilder, baseType);
            var type = typeBuilder.CreateType();
            _wrappers[baseType] = type;
        }

        private static void OverrideProperties(TypeBuilder typeBuilder, Type baseType)
        {
            var properties = baseType
                .GetProperties()
                .Where(pi => pi.PropertyType == typeof (string) && pi.GetGetMethod().IsVirtual);

            foreach (var propertyInfo in properties)
            {
                OverrideStringProperty(typeBuilder, propertyInfo.Name);
            }
        }

        private static void OverrideStringProperty(TypeBuilder typeBuilder, string propertyName)
        {
            var stringType = typeof(string);

            // Generate a private field
            var field = typeBuilder.DefineField("_" + propertyName + "$", stringType, FieldAttributes.Private);
            var propBuilder = typeBuilder.DefineProperty(propertyName, PropertyAttributes.None, stringType, Type.EmptyTypes);
            // The property set and property get methods require a special set of attributes:

            var attr = MethodAttributes.Public |
                       MethodAttributes.HideBySig |
                       MethodAttributes.Virtual |
                       MethodAttributes.ReuseSlot;

            // Define the "get" accessor method for current private field.
            var getPropMethodBuilder = typeBuilder.DefineMethod("get_" + propertyName, attr, stringType, Type.EmptyTypes);

            // Implement Property Get IL Body
            ILGenerator getGenerator = getPropMethodBuilder.GetILGenerator();
            getGenerator.Emit(OpCodes.Ldarg_0);
            getGenerator.Emit(OpCodes.Ldfld, field);
            getGenerator.Emit(OpCodes.Ret);

            // Define the "set" accessor method for current private field.
            var setPropMethodBuilder = typeBuilder.DefineMethod("set_" + propertyName, attr, null, new[] {stringType});

            // Implement Property Set IL body
            ILGenerator setGenerator = setPropMethodBuilder.GetILGenerator();
            setGenerator.Emit(OpCodes.Ldarg_0);
            setGenerator.Emit(OpCodes.Ldarg_1);
            setGenerator.Emit(OpCodes.Stfld, field);
            setGenerator.Emit(OpCodes.Ret);

            propBuilder.SetGetMethod(getPropMethodBuilder);
            propBuilder.SetSetMethod(setPropMethodBuilder);
        }
    }
}