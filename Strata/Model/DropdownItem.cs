
using System;

namespace Rockend.iStrata.StrataWebsite.Model
{
    [Serializable]
    public class DropdownItem
    {
        public DropdownItem(int id, string name)
        {
            Id = id;
            // The name field is encoded for security purposes, but need to decode &amp; to &. Looks dodgy displaying &amp;
            Name = name.Replace("&amp;", "&");
            Name = name;
        }

        public DropdownItem(int id, string name, int planId)
        {
            Id = id;
            // The name field is encoded for security purposes, but need to decode &amp; to &. Looks dodgy displaying &amp;
            Name = name.Replace("&amp;", "&");
            PlanId = planId;
        }

        public int Id { get; private set; }
        public string Name { get; private set; }
        public int PlanId { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is DropdownItem)
            {
                return object.Equals(((DropdownItem)obj).Id, this.Id);
            }
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
