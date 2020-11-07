using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.REST.DataView.DictionaryStore.DTO
{
    [DataContract]
    public class DictionaryDTO
    {
        [DataMember]
        public int Version { get; set; }

        [DataMember]
        public string DataDictionary { get; set; }

        [DataMember]
        public bool HasDictionary { get; set; }

        [DataMember]
        public byte[] tStamp { get; set; }

        public DictionaryDTO()
        {
            Version = 0;
            DataDictionary = string.Empty;
            HasDictionary = false;
            tStamp = null;
        }
    }
}
