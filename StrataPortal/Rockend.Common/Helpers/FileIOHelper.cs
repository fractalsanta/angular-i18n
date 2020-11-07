using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.Common.Helpers
{
    public static class FileIOHelper
    {
        public static string ConvertUriToPath(string filename)
        {
            Uri uri = new Uri(filename);
            return uri.LocalPath;
        }
    }
}
