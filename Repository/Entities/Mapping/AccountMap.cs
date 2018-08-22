using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Taskmanager.Repository.Entities.Mapping
{
    [Table("Account")]
    public class AccountMap : EntityTypeConfiguration<AccountEntityModel>
    {
        public AccountMap()
        {
            ToTable("Core.Account");
            HasKey(x => x.AccountId);
            Property(x => x.AccountId).HasColumnName("AccountId").IsRequired().HasColumnType("int").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(x => x.FirstName).HasColumnName("FirstName").IsRequired().HasColumnType("nvarchar");
            Property(x => x.LastName).HasColumnName("LastName").IsRequired().HasColumnType("nvarchar");
            Property(x => x.EmailAddress).HasColumnName("EmailAddress").IsRequired().HasColumnType("nvarchar");
            Property(x => x.Password).HasColumnName("Password").IsRequired().HasColumnType("nvarchar");
            Property(x => x.IsDeleted).HasColumnName("IsDeleted").IsRequired().HasColumnType("bit");

            Property(x => x.CreatedDate).HasColumnName("CreatedDate").IsRequired().HasColumnType("datetime").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            Property(x => x.ModifiedDate).HasColumnName("ModifiedDate").HasColumnType("datetime");
            Property(x => x.Row_Guid).HasColumnName("Row_Guid").IsRequired().HasColumnType("uniqueidentifier").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
        }
    }
}