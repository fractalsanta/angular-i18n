using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Practices.TransientFaultHandling;

namespace Communicator.DAL.Helpers
{
    internal class RetryQueryable : IOrderedQueryable
    {
        private readonly IQueryable _queryable;
        private readonly IQueryProvider _queryProvider;
        private readonly RetryPolicy _retryPolicy;

        public RetryQueryable(IQueryProvider queryProvider, IQueryable queryable, RetryPolicy retryPolicy)
        {
            _queryable = queryable;
            _queryProvider = queryProvider;
            _retryPolicy = retryPolicy;
        }

        public Expression Expression
        {
            get { return _queryable.Expression; }
        }

        public Type ElementType
        {
            get { return _queryable.ElementType; }
        }

        public IQueryProvider Provider
        {
            get { return _queryProvider; }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _retryPolicy.ExecuteAction(() => _queryable.GetEnumerator());
        }

        public override string ToString()
        {
            return _queryable.ToString();
        }

        protected RetryPolicy RetryPolicy
        {
            get { return _retryPolicy; }
        }
    }
    internal class RetryQueryable<T> : RetryQueryable, IOrderedQueryable<T>
    {
        private readonly IQueryable<T> _queryable;

        public RetryQueryable(IQueryProvider queryProvider, IQueryable<T> queryable, RetryPolicy retryPolicy)
            : base(queryProvider, queryable, retryPolicy)
        {
            _queryable = queryable;
        }

        public IEnumerator<T> GetEnumerator()
        {
            return RetryPolicy.ExecuteAction(() => _queryable.GetEnumerator());
        }
    }
}