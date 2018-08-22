using System.Collections.Generic;
using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;

namespace Taskmanager.System.Api.Controllers
{
    public class GetController : ApiController
    {
        private readonly SystemDataContext _systemDataContext = new SystemDataContext("name=PublicDbContext");

        [HttpGet]
        public AccountEntityModel Account(int accountId)
        {
            using (var repo = new AccountRepository(_systemDataContext))
            {
                return repo.Get(accountId);
            }
        }

        [HttpGet]
        public IEnumerable<AccountEntityModel> Accounts()
        {
            using (var repo = new AccountRepository(_systemDataContext))
            {
                return repo.Get();
            }
        }

    }
}