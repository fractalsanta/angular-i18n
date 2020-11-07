using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Reflection;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Communicator.DAL
{
    public partial class RockendAction
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1} {2} {3}\r\n {4}.\r\n {5}.",
                RockendActionID, ActionName, ClassName, Version, AssemblyName, BetaAssemblyName ?? "");
        }

        public static string GetAssemblyNameForAction(DataContext context, RockendAction action, int? appKey)
        {
            // TODO: comment out this log statement (will be very noisy)
            Logger.Debug("ganfa: {0} {1}", appKey, action);
            try
            {
                if (string.IsNullOrEmpty(action.BetaAssemblyName) || ! appKey.HasValue)
                    return action.AssemblyName;

                if (action.BetaAssemblyName.Trim() == string.Empty)
                {
                    Logger.Warning("BetaAssemblyName needed tirmming?!?!");
                    return action.AssemblyName;
                }
                if (string.IsNullOrEmpty(action.AssemblyName))
                {
                    Logger.Warning("AssemblyName doesn't have a value?!?!");
                    return action.AssemblyName; // nothing else to return...this should never happen anyway, only added because of 'weird' bug
                }

                // there is a beta assembly set for the action, so if the appKey is a beta one then we need to use that
                var isBetaAppKey = context.GetTable<SpecialAppKey>()
                                       .FirstOrDefault(key => key.AppKey == appKey && key.TypeId == SpecialAppKey.Types.ProcessorBetaList) != null;
                return isBetaAppKey ? action.BetaAssemblyName : action.AssemblyName;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return action.AssemblyName;
            }
        }

        public static RockendAction GetActionFor(DataContext context, string actionName, int version)
        {
            var result = context.GetTable<RockendAction>()
                .OrderByDescending(ord => ord.Version)
                .Where(ver => ver.Version <= version)
                .FirstOrDefault(a => a.ActionName == actionName);

            return result;
        }

        public static List<RockendAction> GetDistinctActions(DataContext context)
        {
            try
            {
                var result = context.GetTable<RockendAction>()
                    .GroupBy(action => action.ActionName)
                    .Select(actions => actions.First())
                    .OrderBy(action => action.ActionName);
                return result.ToList();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "GetActions");
                return new List<RockendAction>();
            }
        }

        /// <summary>
        /// TESTING USE ONLY. Data needed to create a test message, e.g. user name and password (on an object)
        /// </summary>
        public object Data { get; set; }
    }
}
