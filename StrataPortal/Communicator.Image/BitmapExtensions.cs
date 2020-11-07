using System;
using System.Data.Linq;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Media.Imaging;
using Agile.Diagnostics.Logging;

namespace Communicator.ImageHelper
{
    public static class BitmapExtensions
    {
        /// <summary>
        /// Convert the image to a byte array
        /// </summary>
        public static byte[] ToByteArray(this Bitmap image, ImageFormat format)
        {
            if (image != null)
            {
                try
                {
                    var stream = new MemoryStream();
                    image.Save(stream, format);

                    return stream.ToArray();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);
                }
            }

            return null;
        }
        
        /// <summary>
        /// Convert a jpeg image to a byte array
        /// </summary>
        public static byte[] ToByteArrayJpeg(this Bitmap image)
        {
            if (image != null)
                return image.ToByteArray(ImageFormat.Jpeg);

            return null;
        }

        /// <summary>
        /// Converts the byte array to an image. 
        /// Logs and returns null if error occurs creating the image.
        /// </summary>
        public static Image ToImage(this byte[] buffer)
        {
            try
            {
                var stream = new MemoryStream(buffer);
                return Image.FromStream(stream);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// Converts the binary to an image. 
        /// Logs and returns null if error occurs creating the image.
        /// </summary>
        public static Image ToImage(this Binary buffer)
        {
            try
            {
                var stream = new MemoryStream(buffer.ToArray());
                return Image.FromStream(stream);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// Converts the byte array to an image. 
        /// Logs and returns null if error occurs creating the image.
        /// </summary>
        public static BitmapImage ToBitmapImage(this byte[] buffer)
        {
            try
            {
                var bitmap = new BitmapImage();
                bitmap.BeginInit();
                bitmap.StreamSource = new MemoryStream(buffer);
                bitmap.EndInit();
                return bitmap;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// Converts the binary to an image. 
        /// Logs and returns null if error occurs creating the image.
        /// </summary>
        public static BitmapImage ToBitmapImage(this Binary buffer)
        {
            try
            {
                var bitmap = new BitmapImage();
                bitmap.BeginInit();
                bitmap.StreamSource = new MemoryStream(buffer.ToArray());
                bitmap.EndInit();
                return bitmap;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return null;
            }
        }
        /// <summary>
        /// Convert a BitmapImage to a byte[]
        /// </summary>
        /// <remarks>make sure this is called from a UI thread if the image is displayed on in the UI</remarks>
        public static Byte[] ToBufferFromBitmapImage(this BitmapImage imageSource)
        {
            if(imageSource == null) // will happen often, especially for footer images
                return null;

            try
            {
                var stream = imageSource.StreamSource as MemoryStream;
                if (stream != null && stream.Length > 0)
                    return stream.ToArray();

                return null;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return null;
            }
        }

    }
}