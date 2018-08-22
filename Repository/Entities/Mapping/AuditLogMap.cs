using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace Taskmanager.Repository.Entities.Mapping
{
    public class AuditLogMap : EntityTypeConfiguration<AuditLogEntityModel>
    {
        public AuditLogMap()
        {
            ToTable("Core.AuditLog");
            HasKey(x => x.LogId);

            Property(x => x.LogId).HasColumnName("LogId").IsRequired().HasColumnType("int").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            
            Property(x => x.EventType).HasColumnName("EventType").IsRequired().HasColumnType("char");
            Property(x => x.TableName).HasColumnName("TableName").IsRequired().HasColumnType("nvarchar").HasMaxLength(40);
            Property(x => x.ColumnName).HasColumnName("ColumnName").IsRequired().HasColumnType("nvarchar").HasMaxLength(40);
            Property(x => x.OriginalValue).HasColumnName("OriginalValue").IsOptional().HasColumnType("nvarchar(max)");
            Property(x => x.NewValue).HasColumnName("NewValue").IsRequired().HasColumnType("nvarchar(max)");

            Property(x => x.CreatedDate).HasColumnName("CreatedDate").IsRequired().HasColumnType("datetime");
            Property(x => x.Row_Guid).HasColumnName("Row_Guid").IsRequired().HasColumnType("uniqueidentifier");
        }
    }
}