using System;

namespace Taskmanager.Repository.Entities
{
    public abstract class AuditableEntityModel
    {
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

       public Guid Row_Guid { get; set; }
    }
}