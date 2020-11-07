namespace Rockend.Common.Helpers
{
    public interface IRestEnvironmentService : IEnvironmentService
    {
        string GetRestDir();
        string GetDictionaryServiceAddress();
    }
}