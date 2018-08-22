using System;
using System.Web.Http;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;
using Taskmanager.System.Api.ViewModels;

namespace Taskmanager.System.Api.Controllers
{
    public class CreateController : ApiController
    {
        private readonly SystemDataContext _systemDataContext = new SystemDataContext("name=PublicDbContext");

        [HttpPost]
        public AccountEntityModel Account(CreateAccountModel model)
        {
            using (var repo = new AccountRepository(_systemDataContext))
            {
                var account = model.Map();

                // commit new account to db
                return repo.Create(account);
            }
        }

    }
}