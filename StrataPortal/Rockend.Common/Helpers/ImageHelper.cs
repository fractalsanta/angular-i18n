using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace Rockend.Common.Helpers
{
    public class ImageHelper
    {
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            if (image == null)
            {
                return null;                
            }

            int sourceWidth = image.Width;
            int sourceHeight = image.Height;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = ((float)width / (float)sourceWidth);
            nPercentH = ((float)height / (float)sourceHeight);

            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            // a holder for the result 
            Bitmap result = new Bitmap(destWidth, destHeight);

            //use a graphics object to draw the resized image into the bitmap 
            using (Graphics graphics = Graphics.FromImage(result))
            {
                //set the resize quality modes to high quality 
                graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                //draw the image into the target bitmap 
                graphics.DrawImage(image, 0, 0, result.Width, result.Height);
            }

            //return the resulting bitmap 
            return result;
        }

        public static Image CompressImage(Image input)
        {
            if (input == null)
            {
                return null;
            }

            // Get a bitmap.
            Bitmap bmp1 = new Bitmap(input);
            ImageCodecInfo jgpEncoder = GetEncoder(ImageFormat.Jpeg);

            System.Drawing.Imaging.Encoder myEncoder = System.Drawing.Imaging.Encoder.Quality;

            EncoderParameters myEncoderParameters = new EncoderParameters(1);

            EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 50L);
            myEncoderParameters.Param[0] = myEncoderParameter;

            MemoryStream ms = new MemoryStream();
            bmp1.Save(ms, jgpEncoder, myEncoderParameters);
            return Image.FromStream(ms);
        }

        private static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();

            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
    }
}
