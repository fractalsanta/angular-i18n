using System;
using System.IO;
using System.Reflection;
using System.Security.Policy;
using Agile.Diagnostics.Logging;
using Agile.Translators;
using Rockend.WebAccess.Common.ClientMessage;
using Rockend.WebAccess.Common.Extensions;

namespace Rockend.WebAccess.Common.Dynamic
{
    [Serializable]
    public class Loader : MarshalByRefObject
    {
        // MEF note about Shadow dirs in new AppDomain: http://paxcel.net/blog/mef-runtime-plugin-swapping/
        // MEF for MVC: http://stackoverflow.com/questions/21017036/mef-with-mvc-4-or-5-pluggable-architecture-2014

        private string loadAssemblyFile;

        public object RunProcessor(StrongName expectedStrongName, string assemblyName, string assemblyFile
            , string className, Guid requestID, object request, int dataSourceID, EntityTranslatorService translator)
        {
            loadAssemblyFile = assemblyFile;

            AppDomain.CurrentDomain.AssemblyResolve += HostDomain_AssemblyResolve;
            try
            {
                Logger.Debug("Check for {0} = {1}", assemblyFile, File.Exists(assemblyFile));

                var assembly = AppDomain.CurrentDomain.Load(loadAssemblyFile);
                Logger.Debug("Assembly loaded {0}", loadAssemblyFile);

                if (expectedStrongName.PublicKey.Equals(assembly.GetStrongName().PublicKey))
                {
                    Logger.Debug("Finding type {0}.{1}", assemblyName, className);
                    var type = assembly.GetType(string.Format("{0}.{1}", assemblyName, className));
                    if(type == null)
                        Logger.Warning("--- type is null (failed to find {0}.{1}) ---", assembly, className); // let the ex happen
                    Logger.Debug("Type Loaded.", type.ToString());

                    var ci = type.GetConstructor(new Type[] {typeof(Guid), typeof(object), typeof(int), typeof(EntityTranslatorService)});

                    Logger.Debug("Launching {0} against datasource {1}", className, dataSourceID);
                    var result = ci.Invoke(new object[] {requestID, request, dataSourceID, translator}) as IMessageTool;

                    result.ProcessCommand();

                    return result.GetResponse();
                }

                Logger.Warning("Processor is not correctly signed and cannot be run");
                return new ApplicationException("Processor is not correctly signed and cannot be run");
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "RunProcessor");
                return ex;
            }
            finally
            {
                // Remove the event handler to avoid multiple handlers on this static object
                AppDomain.CurrentDomain.AssemblyResolve -= HostDomain_AssemblyResolve;
            }
        }

        private Assembly HostDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            Assembly result = null;

            if (File.Exists(args.Name))
                // This should only be called when trying to load the processor assembly so we can load it from the known location at this point
                result = Assembly.LoadFrom(args.Name);
            else
            {
                try
                {
                    AppDomain.CurrentDomain.AssemblyResolve -= HostDomain_AssemblyResolve;
                    AssemblyName name = new AssemblyName(args.Name);
                    result = Assembly.Load(name);
                }
                catch (FileNotFoundException)
                {
                    // Only log if the Assembly Name does not contains XmlSerializers
                    result = null;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Error Loading Assembly {0}", args.Name);
                }
                finally
                {
                    AppDomain.CurrentDomain.AssemblyResolve += HostDomain_AssemblyResolve;
                }
            }
            return result;
        }
    }
}
