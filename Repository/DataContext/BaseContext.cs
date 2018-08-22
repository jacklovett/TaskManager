using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.Entities.Mapping;

namespace Taskmanager.Repository.DataContext
{
    public abstract class BaseContext : DbContext
    {
        public DbSet<AuditLogEntityModel> AuditLogs { get; set; }

        protected BaseContext(string contextName) : base(contextName)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = true;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AuditLogMap());
        }

        public override int SaveChanges()
        {
            throw new NotImplementedException("Cannot save changes with out specifying an agent name");
        }

        /// <summary>
        /// Overrides the base dbContext save changes method to incorporate custom audit trail logging.
        /// </summary>
        /// <param name="modifiedBy"></param>
        /// <returns></returns>
        public int SaveChanges(string modifiedBy)
        {
            ChangeTracker.DetectChanges();

            foreach (var log in this.ChangeTracker.Entries().Where(p => p.State == EntityState.Modified).SelectMany(ChangedRecords))
            {
                this.AuditLogs.Add(log);
            }

            return base.SaveChanges();
        }

        /// <summary>
        /// Recieves a dbEntry object, scans properties for changes and creates a new audit log entry.
        /// </summary>
        /// <param name="dbEntry">DataContext entry that has been marked as changed</param>
        /// <returns>IEnumerable of AuditLogEntityModel</returns>
        private static IEnumerable<AuditLogEntityModel> ChangedRecords(DbEntityEntry dbEntry)
        {
            var logs = new List<AuditLogEntityModel>();

            var tableAttr = dbEntry.Entity.GetType().GetCustomAttributes(typeof(TableAttribute), true).SingleOrDefault() as TableAttribute;

            // Get table name (if it has a Table attribute, use that, otherwise get the pluralized name)
            var tableName = tableAttr != null ? tableAttr.Name : dbEntry.Entity.GetType().Name;

            if (dbEntry.State != EntityState.Modified) return logs;

            logs.AddRange(from propertyName in dbEntry.OriginalValues.PropertyNames
                          where propertyName != "ModifiedBy" && propertyName != "ModifiedDate"
                          where !object.Equals(dbEntry.OriginalValues.GetValue<object>(propertyName), dbEntry.CurrentValues.GetValue<object>(propertyName))
                          select new AuditLogEntityModel()
                          {
                              Row_Guid = new Guid(dbEntry.CurrentValues.GetValue<object>("Row_Guid").ToString()),
                              CreatedDate = (DateTime)dbEntry.CurrentValues.GetValue<object>("ModifiedDate"),
                              EventType = "M", 
                              TableName = tableName,
                              ColumnName = propertyName,
                              OriginalValue = dbEntry.OriginalValues.GetValue<object>(propertyName) == null ? null : dbEntry.OriginalValues.GetValue<object>(propertyName).ToString(),
                              NewValue = dbEntry.CurrentValues.GetValue<object>(propertyName) == null ? null : dbEntry.CurrentValues.GetValue<object>(propertyName).ToString()
                          });

            return logs;
        }
    }
}