using System.IO;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Communicator.DAL.Tests
{
    public class MyWriter : TextWriter
    {
        public override Encoding Encoding
        {
            get { return System.Text.Encoding.Default; }
        }


        public override void Write(object value)
        {
            Logger.Debug(value.ToString());
            base.Write(value);
        }

        public override void Write(string value)
        {
            Logger.Debug(value);
            base.Write(value);
        }

        public override void WriteLine(string value)
        {
            Logger.Debug(value);
            base.WriteLine(value);
        }
    }
}