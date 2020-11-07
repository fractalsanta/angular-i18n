using CommunicatorDto;

namespace Communicator.DAL
{
    public partial class AgencyAccess
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1} {2}"
                , AgencyAccessID, ClientCode, AgencyName);
        }


        public bool IsInSage {
            get { return ! string.IsNullOrEmpty(ClientCode); }
        }


        public AgencyAccessDTO ToDto()
        {
            return new AgencyAccessDTO
            {
                AgencyAccessId = AgencyAccessID,
                AgencyGuid = AgencyGUID,
                ClientCode = ClientCode,
                Name = AgencyName
            };
        }
    }
}