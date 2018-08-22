using System.Data.Entity;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.Entities.Mapping;

namespace Taskmanager.Repository.DataContext
{
    public class TaskDataContext : BaseContext
    {
        public DbSet<TaskEntityModel> Tasks { get; set; }

        static TaskDataContext()
        {
            Database.SetInitializer<TaskDataContext>(null);
        }

        public TaskDataContext(string contextName) : base(contextName)
        {
        }

        protected sealed override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new TaskMap());

            base.OnModelCreating(modelBuilder);
        }
    }
}