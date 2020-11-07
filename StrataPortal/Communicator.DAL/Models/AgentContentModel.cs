using System;
using System.Drawing;
using Communicator.ImageHelper;

namespace Communicator.DAL.Models
{
    /// <summary>
    /// Model for AgentContent
    /// </summary>
    /// <remarks>it is in the DAL instead of the mvc project because
    /// it is shared across 2 mvc projects</remarks>
    [Obsolete]
    public class AgentContentModel
    {
        public int AgentContentId { get; set; }
        public int AgencyAccessId { get; set; }
        public bool OwnerReportsOn { get; set; }
        public bool IncExpReportsOn { get; set; }
        public string LoginPageTopText { get; set; }
        public Image Banner { get; set; }

        [Obsolete]
        public static AgentContentModel Build(AgentContent content)
        {
            throw new Exception("I thought this wasn't being used any more!");
//            var model = new AgentContentModel();
//            model.AgentContentId = content.AgentContentId;
//            model.AgencyAccessId = content.AgencyAccessId;
//            model.Banner = content.Banner.ToImage();
//            model.LoginPageTopText = content.LoginPageTopText;
//            model.OwnerReportsOn = content.OwnerReportsOn;
//            model.IncExpReportsOn = content.IncExpReportsOn;
//            return model;
        }
    }
}