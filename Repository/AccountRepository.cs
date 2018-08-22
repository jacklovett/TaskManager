using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;

namespace Taskmanager.Repository
{
    public class AccountRepository : BaseRepository<SystemDataContext>, IDisposable
    {
        /// <summary>
        /// Default constructor is private to prevent instantion without DbContext
        /// </summary>
        private AccountRepository() : base(null)
        {
        }

        /// <summary>
        /// public constructor
        /// </summary>
        /// <param name="context"></param>
        public AccountRepository(SystemDataContext context) : base(context)
        {
            this.Context = context;
        }

        public IEnumerable<AccountEntityModel> Get()
        {
            return Context.Accounts.ToList();
        }

        public AccountEntityModel Get(int accountId)
        {
            return Context.Accounts.FirstOrDefault(x => x.AccountId == accountId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public AccountEntityModel Create(AccountEntityModel model)
        {
            Context.Accounts.Add(model);
            Context.SaveChanges();

            return model;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public AccountEntityModel Update(AccountEntityModel model)
        {
            Context.Configuration.AutoDetectChangesEnabled = true;

            var account = Get(model.AccountId);

            account.FirstName = model.FirstName;
            account.LastName = model.LastName;
            account.EmailAddress = model.EmailAddress;
            account.Password = model.Password;
            
            account.ModifiedDate = DateTime.Now;

            Context.Entry(account).State = EntityState.Modified;
            Context.SaveChanges();

            return account;
        }
    }
}