using System;

namespace Mx.Web.Shared.Providers
{
    public interface IProviderCache
    {
        BusinessUser GetUser(String userName);
        void RemoveUser(String userName);

        MissingUser GetMissingUser();
    }
}