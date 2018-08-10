using System.Web.Mvc;
using System.IO;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// MVC ActionResult to return binary file content.
    /// </summary>
    public class BinaryFileResult : ActionResult
    {
        /// <summary>
        /// Gets or sets the local path to the file.
        /// </summary>
        /// <value>The local path.</value>
        public string LocalPath { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this file is an attachment.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance is attachment; otherwise, <c>false</c>.
        /// </value>
        public bool IsAttachment { get; set; }

        /// <summary>
        /// Gets or sets the friendly name of the file as displayed to the user.
        /// </summary>
        /// <value>The name of the file.</value>
        public string FileName { get; set; }

        /// <summary>
        /// Gets or sets the MIME content type.
        /// </summary>
        /// <value>The content type string.</value>
        public string ContentType { get; set; }

        /// <summary>
        /// Transmit the file to the client.
        /// </summary>
        /// <param name="context">The controller context.</param>
        public override void ExecuteResult(ControllerContext context)
        {
            context.HttpContext.Response.Clear();
            context.HttpContext.Response.ContentType = ContentType;
            if (!string.IsNullOrEmpty(FileName))
            {
                context.HttpContext.Response.AddHeader("content-disposition",
                    ((IsAttachment) ? "attachment;filename=" : "inline;filename=") +
                    FileName);
            }
            context.HttpContext.Response.WriteFile(LocalPath, true);
        }
    }
}
