using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Agile.Diagnostics.Logging;

namespace Rockend.Common.Helpers
{
    /// <summary>
    /// Helper methods for Threading
    /// </summary>
    public static class ThreadHelper
    {
        /// <summary>
        /// Set Min and Max threads. Pass in 0 to NOT set one or the other.
        /// </summary>
        public static void SetThreadPoolMaxMin(int max, int min)
        {
            int maxWorker = 0;
            int completionPortThreads = 0;
            int minWorker, minIOC;

            // Get the current settings.
            ThreadPool.GetMaxThreads(out maxWorker, out completionPortThreads);
            ThreadPool.GetMinThreads(out minWorker, out minIOC);

            Logger.Info("MaxThreads:- {0}:{1}", maxWorker, completionPortThreads);
            Logger.Info("MinThreads:- {0}:{1}", minWorker, minIOC);

            if (max == 0)
            {
                Logger.Info("Max == 0 therefore not setting Max");
            }
            else if (max == maxWorker)
            {
                Logger.Info("Max already {0} therefore not setting Max", max);
            }
            else
            {
                var maxResult = ThreadPool.SetMaxThreads(max, max);
                Logger.Info("SetMaxThreads({0}) result={1}", max, maxResult);
            }

            if (min == 0)
            {
                Logger.Info("Min == 0 therefore not setting Min");
            }
            else if (min == minWorker)
            {
                Logger.Info("Min already {0} therefore not setting Min", min);
            }
            else
            {
                var result = ThreadPool.SetMinThreads(min, min);
                Logger.Info("SetMinThreads({0}) result={1}", min, result);
            }

            // log the changes so can see it worked
            ThreadPool.GetMaxThreads(out maxWorker, out completionPortThreads);
            ThreadPool.GetMinThreads(out minWorker, out minIOC);

            Logger.Warning("MaxThreads:- {0}:{1} MinThreads:- {2}:{3}"
                , maxWorker, completionPortThreads, minWorker, minIOC);
        }
    }
}
