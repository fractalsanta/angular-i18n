namespace Communicator.DAL
{
    public partial class AdminSetting
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1}", AdminSettingId, RwacVersion);
        }
    }
}