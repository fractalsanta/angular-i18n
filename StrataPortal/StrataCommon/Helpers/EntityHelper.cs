using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using System.Data.Linq;

namespace Rockend.iStrata.StrataCommon.Helpers
{
    public static class EntityHelper
    {
        /// <summary>
        /// Loads data from the Lot table in the Strata Master Database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="lotID">The lot id for the required lot</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.Lot"/> object, or null if not found</returns>
        public static Lot GetLot(DataContext context, int lotID)
        {
            Lot result = (from l in context.GetTable<Lot>()
                          where l.LotID == lotID
                          select l).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Loads data from the Owner table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="ownerID">The owner id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.Owner"/> object, or null if not found</returns>
        public static Owner GetOwner(DataContext context, int ownerID)
        {
            Owner result = (from o in context.GetTable<Owner>()
                            where o.OwnerID == ownerID
                            select o).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Loads data from the Contact table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="contactID">The contact id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.Contact"/> object,or null if not found</returns>
        public static Contact GetContact(DataContext context, int contactID)
        {
            Contact result = (from c in context.GetTable<Contact>()
                              where c.ContactID == contactID
                              select c).FirstOrDefault();

            return result;
        }


        /// <summary>
        /// Loads data from the OwnersCorporation table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="id">The OwnersCorporation id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.OwnersCorporation"/> object, or null if not found</returns>
        public static OwnersCorporation GetOwnersCorporation(DataContext context, int id)
        {
            OwnersCorporation result = (from o in context.GetTable<OwnersCorporation>()
                                        where o.OwnersCorporationID == id
                                        select o).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Loads data from the AssociationType table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="id">The AssociationType id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.AssociationType"/> object, or null if not found</returns>
        public static AssociationType GetAssociationType(DataContext context, int id)
        {
            AssociationType result = (from a in context.GetTable<AssociationType>()
                                      where a.AssociationTypeID == id
                                      select a).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Loads data from the StreetAddress table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="id">The StreetAddress id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.StreetAddress"/> object, or null if not found</returns>
        public static StreetAddress GetStreetAddress(DataContext context, int? id)
        {
            StreetAddress result = (from s in context.GetTable<StreetAddress>()
                                    where s.StreetAddressID == id
                                    select s).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Load data from the Receipt table in the Strata Master database for the last receipt for a given owner
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="ownerID">The owner id</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.Receipt"/> object,or null if not found</returns>
        public static Receipt GetReceiptForOwner(DataContext context, int ownerID)
        {
            //TODO:What if the owner has multiple lots?
            Receipt result = (from r in context.GetTable<Receipt>()
                              where r.OwnerID == ownerID
                              orderby r.ReceiptDate descending
                              select r).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Load data from the ExecutiveMember table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="id">The ExecutiveMemberID that identifies the required row</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.ExecutiveMember"/> object, or null if not found</returns>
        public static ExecutiveMember GetExecutiveMember(DataContext context, int id)
        {
            ExecutiveMember result = (from e in context.GetTable<ExecutiveMember>()
                                      where e.ExecutiveMemberID == id
                                      select e).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Load data from the ExecutivePosition table in the Strata Master database
        /// </summary>
        /// <param name="context">A <see cref="System.Data.Linq.DataContext"/> for the Strata Master database</param>
        /// <param name="id">The ExecutivePositionID that identifies the required row</param>
        /// <returns>The <see cref="Rockend.iStrata.StrataCommon.BusinessEntities.ExecutivePosition"/> object, or null if not found</returns>
        public static ExecutivePosition GetExecutivePosition(DataContext context, int id)
        {
            ExecutivePosition result = (from e in context.GetTable<ExecutivePosition>()
                                        where e.ExecutivePositionID == id
                                        select e).FirstOrDefault();

            return result;

        }

        public static UnitEntitlementSet GetUnitEntitlementSet(DataContext context, int id)
        {
            UnitEntitlementSet result = (from u in context.GetTable<UnitEntitlementSet>()
                                         where u.UnitEntitlementSetID == id
                                         select u).FirstOrDefault();
            return result;
        }
    }
}
