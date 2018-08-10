using System;
using Elmah;
using StackExchange.Redis;

namespace Mx.Web.UI.Config.SignalR
{
    public class RedisTracker
    {
        private readonly ConnectionMultiplexer _internalMultiplexer;

        public ConnectionMultiplexer Multiplexer
        {
            get { return _internalMultiplexer; }
        }

        public bool IsActive { get; private set; }


        public RedisTracker(string address) : this(address, null)
        {
        }

        public RedisTracker( string address,  string port)
        {
            IsActive = true;

            var connection = address;
            if (!string.IsNullOrWhiteSpace(port))
                connection = string.Format("{0}:{1}", address, port);
            _internalMultiplexer = ConnectionMultiplexer.Connect(connection);
            Multiplexer.ConnectionFailed += ConnectionFailed;
            Multiplexer.ConnectionRestored += ConnectionRestored;

        }

        private void ConnectionFailed(Object sender, ConnectionFailedEventArgs args)
        {
            ErrorLog.GetDefault(null).Log(new Error(new Exception("Redis server has closed down")));
            try
            {
                IsActive = false;
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        private void ConnectionRestored(Object sender, ConnectionFailedEventArgs args)
        {
            ErrorLog.GetDefault(null).Log(new Error(new Exception("Redis server has returned")));
            try
            {
                IsActive = true;
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }
    }

}