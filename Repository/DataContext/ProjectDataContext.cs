using System.Data.Entity;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.Entities.Mapping;

namespace Taskmanager.Repository.DataContext
{
    public class ProjectDataContext : BaseContext
    {
        public DbSet<ProjectEntityModel> Projects { get; set; }

        static ProjectDataContext()
        {
            Database.SetInitializer<ProjectDataContext>(null);
        }

        public ProjectDataContext(string contextName) : base(contextName)
        {
        }

        protected sealed override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ProjectMap());

            base.OnModelCreating(modelBuilder);
        }
    }
}