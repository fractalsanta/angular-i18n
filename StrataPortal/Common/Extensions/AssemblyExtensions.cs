using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Security.Policy;
using System.Security.Permissions;

namespace Rockend.WebAccess.Common.Extensions
{
    public static class AssemblyExtensions
    {
        public static StrongName GetStrongName(this Assembly assembly)
        {
            AssemblyName asmName = assembly.GetName();
            byte[] publicKey = asmName.GetPublicKey();
            StrongNamePublicKeyBlob blob = new StrongNamePublicKeyBlob(publicKey);

            return new StrongName(blob, asmName.Name, asmName.Version);
        }

    }
}
