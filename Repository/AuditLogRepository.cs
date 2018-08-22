using System;
using System.Collections.Generic;
using System.Linq;
using Taskmanager.Repository.DataContext;
using Taskmanager.Repository.Entities;

namespace Taskmanager.Repository
{
    public class AuditLogRepository : BaseRepository<SystemDataContext>, IDisposable
    {
        /// <summary>
        /// Default constructor is private to prevent instantion without DbContext
        /// </summary>
        private AuditLogRepository() : base(null)
        {
        }

        /// <summary>
        /// public constructor
        /// </summary>
        /// <param name="context"></param>
        public AuditLogRepository(SystemDataContext context) : base(context)
        {
            this.Context = context;
        }

        /// <summary>
        /// Retrieve a product its unique id
        /// </summary>
        /// <returns>Entities.AuditLogEntityModel</returns>
        public IEnumerable<AuditLogEntityModel> Get(string rowGuid)
        {
            return Context.AuditLogs.Where(al => al.Row_Guid == new Guid(rowGuid)).ToList();
        }
    }
}