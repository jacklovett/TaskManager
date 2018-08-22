using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Taskmanager.Repository.Entities.Mapping
{
    [Table("Project")]
    public class ProjectMap : EntityTypeConfiguration<ProjectEntityModel>
    {
        public ProjectMap()
        {
            ToTable("Project.Project");
            HasKey(x => x.ProjectId);
            Property(x => x.ProjectId).HasColumnName("ProjectId").IsRequired().HasColumnType("int").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName("Name").IsRequired().HasColumnType("nvarchar");
            Property(x => x.Description).HasColumnName("Description").HasColumnType("nvarchar");
            Property(x => x.IsActive).HasColumnName("IsActive").IsRequired().HasColumnType("bit");
            Property(x => x.IsDeleted).HasColumnName("IsDeleted").IsRequired().HasColumnType("bit");

            Property(x => x.CreatedDate).HasColumnName("CreatedDate").IsRequired().HasColumnType("datetime").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            Property(x => x.ModifiedDate).HasColumnName("ModifiedDate").HasColumnType("datetime");
            Property(x => x.Row_Guid).HasColumnName("Row_Guid").IsRequired().HasColumnType("uniqueidentifier").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
        }
    }
}