using System.Data.Entity;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.Entities.Mapping;

namespace Taskmanager.Repository.DataContext
{
    public class SystemDataContext : BaseContext
    {
        public DbSet<AccountEntityModel> Accounts { get; set; }

        static SystemDataContext()
        {
            Database.SetInitializer<SystemDataContext>(null);
        }

        public SystemDataContext(string contextName) : base(contextName)
        {
        }

        protected sealed override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AccountMap());
           
            base.OnModelCreating(modelBuilder);
        }
    }
}