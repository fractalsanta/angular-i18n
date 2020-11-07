using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Helpers
{
    /// <summary>
    /// Only for use in processors for StrataMaster 7.5 and above!
    /// </summary>
    public interface IStrataMasterRepository
    {
        DataContext Context { get; }
        // has to be the new Lot75 so we can still update clients with new RWAC versions whilst they are still on older versions of SM
        Lot75 GetLot(int lotID);
        Owner75 GetOwner(int ownerID);
        Contact GetContact(int contactID);
        List<ContactDetail> GetContactDetails(int contactID);
        OwnersCorporation GetOwnersCorporation(int id);
        AssociationType GetAssociationType(int id);
        StreetAddress GetStreetAddress(int id); // nullable?
        Receipt GetLatestReceiptForOwner(int ownerId);
        ExecutiveMember GetExecutiveMember(int id);
        ExecutivePosition GetExecutivePosition(int id);
        UnitEntitlementSet GetUnitEntitlementSet(int id);

        WebAccessConfig75 GetWebAccessConfig();
        WebAccessConfig85 GetWebAccessConfig85();
    }


    /// <summary>
    /// Concrete Strata Master repository.
    /// Eventual replacement for EntityHelper (because entityHelper isn't easily unit testable)
    /// </summary>
    public class StrataMasterRepository : IStrataMasterRepository
    {
        /// <summary>
        /// ctor
        /// </summary>
        public StrataMasterRepository()
        {
        }

        private DataContext context;
        /// <summary>
        /// Repo DataContext.
        /// </summary>
        /// <remarks>public so can hit tables directly if need to</remarks>
        public DataContext Context {
            get { return context ?? (context = StrataDBHelper.GetStrataDataContext()); }
        }

        public T GetTable<T>() where T : class
        {
            return Context.GetTable<T>().FirstOrDefault();
        }

        public Lot75 GetLot(int id)
        {
            Lot75 result = (from l in Context.GetTable<Lot75>()
                          where l.LotID == id
                          select l).FirstOrDefault();

            return result;
        }

        public WebAccessConfig75 GetWebAccessConfig()
        {
            return (from x in Context.GetTable<WebAccessConfig75>()
                       select x).FirstOrDefault();
        }

        public Owner75 GetOwner(int id)
        {
            return (from o in context.GetTable<Owner75>()
                            where o.OwnerID == id
                            select o).FirstOrDefault();
        }

        public Contact GetContact(int id)
        {
            return EntityHelper.GetContact(Context, id);
        }

        public List<ContactDetail> GetContactDetails(int contactID)
        {
            return (from c in Context.GetTable<ContactDetail>()
             where c.ContactID == contactID
             select c).ToList();
        }

        public OwnersCorporation GetOwnersCorporation(int id)
        {
            return EntityHelper.GetOwnersCorporation(Context, id);
        }

        public AssociationType GetAssociationType(int id)
        {
            return EntityHelper.GetAssociationType(Context, id);
        }

        public StreetAddress GetStreetAddress(int id)
        {
            return EntityHelper.GetStreetAddress(Context, id);
        }

        public Receipt GetLatestReceiptForOwner(int ownerId)
        {
            return EntityHelper.GetReceiptForOwner(Context, ownerId);
        }

        public ExecutiveMember GetExecutiveMember(int id)
        {
            return EntityHelper.GetExecutiveMember(Context, id);
        }

        public ExecutivePosition GetExecutivePosition(int id)
        {
            return EntityHelper.GetExecutivePosition(Context, id);
        }

        public UnitEntitlementSet GetUnitEntitlementSet(int id)
        {
            return EntityHelper.GetUnitEntitlementSet(Context, id);
        }

        public WebAccessConfig85 GetWebAccessConfig85()
        {
            return (from x in Context.GetTable<WebAccessConfig85>()
                    select x).FirstOrDefault();
        }
    }
}