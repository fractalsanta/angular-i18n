using System;
using System.Collections.Generic;
using System.Data.Linq;

namespace RwacUtility.Objects
{
    public interface IGenericRepository
    {
        T Find<T>(Func<T, bool> match) where T : class;
        T Find<T>(DataContext context, Func<T, bool> match) where T : class;
        IList<T> FindAll<T>(Func<T, bool> match) where T : class;
        int Insert<T>(T record) where T : class;
        int Insert<T>(List<T> records) where T : class;
        int InsertOneByOne<T>(List<T> records) where T : class;

        int Update<T>(T updated) where T : class;
        int Update<T>(DataContext context, T updated) where T : class;
        int Delete<T>(T delete) where T : class;
    }
}