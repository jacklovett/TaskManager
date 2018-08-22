using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Taskmanager.Repository.Entities.Mapping
{
    [Table("Task")]
    public class TaskMap : EntityTypeConfiguration<TaskEntityModel>
    {
        public TaskMap()
        {
            ToTable("Task.Task");
            HasKey(x => x.TaskId);
            Property(x => x.TaskId).HasColumnName("TaskId").IsRequired().HasColumnType("int").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(x => x.ProjectId).HasColumnName("Project_Id").IsRequired().HasColumnType("int");
            Property(x => x.AssigneeId).HasColumnName("Assignee_Id").HasColumnType("int");
            Property(x => x.Name).HasColumnName("Name").IsRequired().HasColumnType("nvarchar");
            Property(x => x.Description).HasColumnName("Description").HasColumnType("nvarchar");
            Property(x => x.Comments).HasColumnName("Comments").HasColumnType("nvarchar");
            Property(x => x.Deadline).HasColumnName("Deadline").HasColumnType("datetime");
            Property(x => x.InProgress).HasColumnName("InProgress").IsRequired().HasColumnType("bit");
            Property(x => x.IsTesting).HasColumnName("IsTesting").IsRequired().HasColumnType("bit");
            Property(x => x.IsCompleted).HasColumnName("IsCompleted").IsRequired().HasColumnType("bit");
            Property(x => x.IsBacklog).HasColumnName("IsBacklog").IsRequired().HasColumnType("bit");
            Property(x => x.IsDeleted).HasColumnName("IsDeleted").IsRequired().HasColumnType("bit");

            Property(x => x.CreatedDate).HasColumnName("CreatedDate").IsRequired().HasColumnType("datetime").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            Property(x => x.ModifiedDate).HasColumnName("ModifiedDate").HasColumnType("datetime");
            Property(x => x.Row_Guid).HasColumnName("Row_Guid").IsRequired().HasColumnType("uniqueidentifier").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
        }
    }
}