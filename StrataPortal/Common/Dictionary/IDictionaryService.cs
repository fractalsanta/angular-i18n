﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using Rockend.REST.DataView.DictionaryStore.DTO;

namespace Rockend.REST.DataView.DictionaryStore
{
    [ServiceContract]
    public interface IDictionaryService
    {
        [OperationContract]
        DictionaryDTO GetDictionary(int version, byte[] tStamp);

        [OperationContract]
        DictionaryDTO GetDataDictionary(int version, byte[] tStamp);

        [OperationContract]
        int StoreDataDictionary(DictionaryDTO dictionary);

        [OperationContract]
        DateTime GetServerDateTime();
    }
}
