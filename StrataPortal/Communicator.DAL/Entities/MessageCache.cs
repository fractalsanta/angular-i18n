using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Communicator.DAL.Entities
{
    [Table(Name="rmh.MessageCache")]
    public class MessageCache
    {
        [Column(IsPrimaryKey = true, IsDbGenerated = false)]
        public Guid RequestId { get; set; }

        [Column]
        public string Data { get; set; }
    }
}
