using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Oid
    {
        [Column(Name="sOIDType", IsPrimaryKey = true)]
        public string OidType { get; set; }

        [Column(Name = "lMaxOID")]
        public int MaxOid { get; set; }

        public static int GetNextId(string idTypeName)
        {
            int result = 0;

            using (DataContext db = StrataDBHelper.GetStrataDataContext())
            {
                Table<Oid> idTable = db.GetTable<Oid>();

                Oid id = idTable.FirstOrDefault(i => i.OidType == idTypeName);
                if (id == null)
                {
                    id = new Oid()
                        {
                            MaxOid = 0,
                            OidType = idTypeName
                        };
                    idTable.InsertOnSubmit(id);
                }

                id.MaxOid++;
                db.SubmitChanges();

                result = id.MaxOid;
            }

            return result;
        }
    }
}
