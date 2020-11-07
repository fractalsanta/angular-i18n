using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.Common.Helpers
{
    public interface IEnvironmentService
    {
        string GetEnvironment();
        /// <summary>
        /// explicitly set the environment (not available on all implementations)
        /// </summary>
        /// <param name="environment">UAT, PROD etc </param>
        void SetEnvironment(string environment);
        bool IsProduction { get; }
        bool IsUat { get; }
        bool IsDev { get; }

        string GetStorageFolderName();
        string GetConnectionString(string name, bool appendEnvironment = false, string environmentOverride = null);
    }
}
