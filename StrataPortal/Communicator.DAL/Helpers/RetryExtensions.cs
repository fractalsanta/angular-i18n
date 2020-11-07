using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading;
using Agile.Diagnostics.Logging;
using Communicator.DAL.Entities;
using CommunicatorDto;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.WindowsAzure.TransientFaultHandling;
using Microsoft.Practices.EnterpriseLibrary.WindowsAzure.TransientFaultHandling.SqlAzure;
using Microsoft.Practices.TransientFaultHandling;

namespace Communicator.DAL.Helpers
{
    /// <summary>
    /// This Class Implements a try strategy for Linq To Sql
    /// its based on the code on http://daveaglick.com/posts/automatic-retry-for-linq-to-sql
    /// but it uses Micrsosfts enterprise library to implement the actual retry logic
    /// </summary>
    public static class RetryExtensions
    {
        private static RetryPolicy GetRetryPolicy()
        {
            var retryManager = EnterpriseLibraryContainer.Current.GetInstance<RetryManager>();
            var strategy= retryManager.GetRetryStrategy("Incremental Retry Strategy");
            return new RetryPolicy<SqlAzureTransientErrorDetectionStrategy>(strategy);
        }

        public static IQueryable<T> Retry<T>(this IQueryable<T> queryable)
        {
            IQueryProvider provider = new RetryQueryProvider(queryable.Provider,GetRetryPolicy());
            return provider.CreateQuery<T>(queryable.Expression);
        }

        public static void SubmitChangesRetry(this DataContext dataContext)
        {
            Retry(dataContext.SubmitChanges);
        }

        public static void SubmitChangesRetry(this DataContext dataContext, ConflictMode failureMode)
        {
            Retry(()=>dataContext.SubmitChanges(failureMode));
        }

        public static T Retry<T>(Func<T> func)
        {
            var retry = GetRetryPolicy();
            return retry.ExecuteAction(func);
        }

        public static void Retry(Action ac)
        {

            var retry = GetRetryPolicy();
            retry.ExecuteAction(ac);
        }
    }

    
}
