using System.Security.Principal;

namespace Mx.Web.UI.Config.WebApi
{
    public class BaseIdentity: GenericIdentity
    {
        public BaseIdentity(long userId, string name) : base(name)
        {
            UserId = userId;
        }

        public long UserId { get; set; }
    }
}