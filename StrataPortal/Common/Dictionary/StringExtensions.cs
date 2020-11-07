using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using System.IO.Compression;

namespace Rockend.REST.DataView.DictionaryStore.Helpers
{
    public static class StringExtensions
    {
        public static string Compress(this string s)
        { 
            byte[] buffer = Encoding.UTF8.GetBytes(s);
            MemoryStream memStream = new MemoryStream();

            using (GZipStream zip = new GZipStream(memStream, CompressionMode.Compress, true))
            {
                zip.Write(buffer, 0, buffer.Length);
            }

            memStream.Position = 0;
            byte[] compressed = new byte[memStream.Length];

            memStream.Read(compressed, 0, compressed.Length);
            byte[] gzBuffer = new byte[compressed.Length + 4];

            System.Buffer.BlockCopy(compressed, 0, gzBuffer, 4, compressed.Length);
            System.Buffer.BlockCopy(BitConverter.GetBytes(buffer.Length), 0, gzBuffer, 0, 4);

            return Convert.ToBase64String(gzBuffer);

        }

        public static string Decompress(this string s)
        {
            byte[] gzBuffer = Convert.FromBase64String(s);

            using (MemoryStream memStream = new MemoryStream())
            {
                int msgLength = BitConverter.ToInt32(gzBuffer, 0);
                memStream.Write(gzBuffer, 4, gzBuffer.Length - 4);

                byte[] buffer = new byte[msgLength];

                memStream.Position = 0;

                using (GZipStream zip = new GZipStream(memStream, CompressionMode.Decompress))
                {
                    zip.Read(buffer, 0, buffer.Length);
                }

                return Encoding.UTF8.GetString(buffer);
            }
        }
    }
    
}