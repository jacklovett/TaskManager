using System;
using System.ComponentModel.DataAnnotations;
using Taskmanager.Repository.Entities;

namespace Taskmanager.System.Api.ViewModels
{
    public abstract class AccountViewModelBase
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        public string EmailAddress { get; set; }

        [Required]
        [MinLength(8)]
        [MaxLength(50)]
        public string Password { get; set; }
    }

    /// <summary>
    /// Model definition for creating an account
    /// </summary>
    public class CreateAccountModel : AccountViewModelBase
    {
        public AccountEntityModel Map()
        {
            return new AccountEntityModel()
            {
                FirstName = this.FirstName,
                LastName = this.LastName,
                EmailAddress = this.EmailAddress,
                Password = this.Password
            };
        }
    }

    /// <summary>
    /// Model definition for updating an account
    /// </summary>
    public class UpdateAccountModel : AccountViewModelBase
    {
        [Required]
        public int AccountId { get; set; }
        
        public DateTime ModifiedDate => DateTime.Now;

        public AccountEntityModel Map()
        {
            return new AccountEntityModel()
            {
                AccountId = this.AccountId,
                FirstName = this.FirstName,
                LastName = this.LastName,
                EmailAddress = this.EmailAddress,
                Password = this.Password
            };
        }

        public class DeleteAccount : AccountViewModelBase
        {
            [Required]
            public int AccountId { get; set; }

            public bool IsDeleted => true;

            public DateTime ModifiedDateTime => DateTime.Now;
        }

    }

}