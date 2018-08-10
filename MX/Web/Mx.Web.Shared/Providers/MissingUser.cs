namespace Mx.Web.Shared.Providers
{
    public class MissingUser : BusinessUser
    {
        public override long Id
        {
            get { return 0; }
            set { }
        }

        public override bool HasPermission(Task task)
        {
            return false;
        }

        public override bool HasPermission(int task)
        {
            return false;
        }
    }
}