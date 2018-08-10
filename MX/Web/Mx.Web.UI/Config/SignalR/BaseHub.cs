using System;
using Microsoft.AspNet.SignalR;

namespace Mx.Web.UI.Config
{
    public abstract class BaseHub<T> : Hub where T : Hub
    {
        public static dynamic Group(long entityId, string connectionId = null)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<T>();

            return (string.IsNullOrWhiteSpace(connectionId))
                ? context.Clients.Group(typeof(T).Name + "-" + entityId)
                : context.Clients.Group(typeof(T).Name + "-" + entityId, new[] { connectionId });
        }


        public virtual void Subscribe(Int64 entityId)
        {
            Groups.Add(Context.ConnectionId, GetType().Name + "-" + entityId);
        }

        public virtual void Unsubscribe(Int64 entityId)
        {
            Groups.Remove(Context.ConnectionId, GetType().Name + "-" + entityId);
        }
    }
}