using System;
using System.Drawing;
using Rockend.WebAccess.Common.Helpers;
#if !IOS
using System.Drawing.Imaging;
#endif
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using Agile.Diagnostics.Logging;
#if !IOS
using Rockend.Common.Helpers;
#endif
using Rockend.WebAccess.Common.Transport;

namespace Rockend.WebAccess.Common.ClientMessage
{
    /// <summary>
    /// Base class for all strata/REST master tools which will handle logging and errors.
    /// </summary>
    /// <typeparam name="T">The request type to be processed.</typeparam>
    public abstract class MessageTool<TRequest, TResponse> : IMessageTool
        where TRequest : class
        where TResponse : class, new()
    {
        protected Guid RequestId { get; private set; }
        protected TRequest Request { get; private set; }
        protected TResponse Response { get; private set; }
        private ErrorResponse Error { get; set; }

        public MessageTool(Guid requestId, object request)
        {
            RequestId = requestId;
            Request = (TRequest)request;
            Response = new TResponse();
            Error = null;
        }

        #region Abstract methods

        public abstract void PopulateResponse();

        #endregion

        protected void ClearError()
        {
            Error = null;
        }

        protected void SetError(string message, Exception exception)
        {
            if(exception != null)
                Logger.Error(exception, message);
            else
                Logger.Warning(message); // now we are logging exceptions to the server, so reduced other errors to warning. mw 5.6.2015

            Error = new ErrorResponse
            {
                ErrorMessage = message,
                Exception = exception
            };
        }


        protected void SetError(ErrorResponse errorResponse)
        {
            Error = errorResponse;
        }

        #region Public methods

        /// <summary>
        /// Process the request and populates the response with data
        /// </summary>
        public void ProcessCommand()
        {
            try
            {
                Logger.Info("Message received.      RequestID: " + RequestId.ToString() + " ClassName: " + typeof(TRequest).Name);

                PopulateResponse();
                Logger.Info("Response populated for RequestID: " + RequestId.ToString());
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Exception processing RequestID: " + RequestId.ToString() + ": " + ex.Message);
                Error = new ErrorResponse
                {
                    ErrorMessage = "An error occurred processing the request",
                    Exception = ex
                };
            }
        }

        public object GetResponse()
        {
            if (Error != null)
            {
                return Error;
            }
            return Response;
        }


        #endregion

        #region Protected methods

        protected virtual XElement CreateXElement(string fieldName, string value)
        {
            if (!XMLDataHelper.IsValidXml(value))
            {
                return new XElement("Field", new XAttribute("name", fieldName), new XAttribute("value", ""));
            }

            return new XElement("Field", new XAttribute("name", fieldName), new XAttribute("value", value ?? string.Empty));
        }

        public delegate string PostExtractionAction(string input);
        #if !IOS
        protected Image LoadImage(string fullFileName)
        {
            try
            {
                return Image.FromFile(fullFileName);
            }
            catch (Exception e)
            {
                Logger.Error(e, "Error loading image filer {0}", fullFileName);
                return null;
            }
        }

        protected byte[] GetImageAsByteArray(Image image)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    image.Save(ms, ImageFormat.Jpeg);
                    byte[] imageBytes = ms.ToArray();

                    return imageBytes;
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "Error converting Image to byte array.");
                return new byte[] { };
            }
        }

        protected Image ResizeImage(Image image, int maxWidth, int maxHeight)
        {
            return ImageHelper.ResizeImage(image, maxWidth, maxHeight);
        }

        protected Image CompressImage(Image image)
        {
            return ImageHelper.CompressImage(image);
        }

        #endif

        protected string ByteArrayToBase64String(byte[] array)
        {
            try
            {
                return Convert.ToBase64String(array);
            }
            catch (Exception e)
            {
                Logger.Error(e, "ByteArrayToBase64String");
                return string.Empty;
            }
        }

        #endregion
    }
}
