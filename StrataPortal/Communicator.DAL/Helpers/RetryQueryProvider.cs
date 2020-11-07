using System.Linq;
using System.Linq.Expressions;
using Microsoft.Practices.TransientFaultHandling;

namespace Communicator.DAL.Helpers
{
    internal sealed class RetryQueryProvider : IQueryProvider
    {
        private readonly IQueryProvider _queryProvider;
        private readonly RetryPolicy _retryPolicy;

        public RetryQueryProvider(IQueryProvider queryProvider, RetryPolicy retryPolicy)
        {
            _queryProvider = queryProvider;
            _retryPolicy = retryPolicy;
        }

        public IQueryable CreateQuery(Expression expression)
        {
            return new RetryQueryable(this, _queryProvider.CreateQuery(expression), _retryPolicy);
        }

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
        {
            return new RetryQueryable<TElement>(this, _queryProvider.CreateQuery<TElement>(expression), _retryPolicy);
        }

        // The Execute method executes queries that return a single value (instead of an enumerable sequence of values). 
        // Expression trees that represent queries that return enumerable results are executed when their associated IQueryable object is enumerated.
        // From http://msdn.microsoft.com/en-us/library/bb535032(v=vs.100).aspx

        public object Execute(Expression expression)
        {
            return _retryPolicy.ExecuteAction(() => _queryProvider.Execute(expression));
        }

        public TResult Execute<TResult>(Expression expression)
        {
            return _retryPolicy.ExecuteAction(() => _queryProvider.Execute<TResult>(expression));
        }
    }
}