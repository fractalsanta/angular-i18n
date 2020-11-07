using System;

namespace Rockend.Common
{
    public class EventArgs<T> : EventArgs
    {
        private T data;
        /// <summary>
        /// ctor
        /// </summary>
        public EventArgs(T data)
        {
            this.data = data;
        }
        /// <summary>
        /// Returns the data
        /// </summary>
        public T Data
        {
            get { return data; }
        }
    } 
}
