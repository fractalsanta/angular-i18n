namespace Mx.Web.UI.Areas.Core.PartnerRedirect.Api.Models
{
    public class LinkRequest
    {
        public string Url { get; set; }
        public long UserId { get; set; }
        public string Timestamp { get; set; }
        public string Signature { get; set; }
        public string Site { get; set; }
    }
}