using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.DataContext;
using Taskmanager.System.Api.ViewModels;
using Taskmanager.Common;
using Taskmanager.Common.JsonHelpers;

namespace Taskmanager.System.Api.Controllers
{
    public class UpdateController : ApiController
    {
        private readonly SystemDataContext _systemDataContext = new SystemDataContext("name=PublicDbContext");

        [HttpPost]
        public HttpResponseMessage Account(UpdateAccountModel model)
        {
            using (var repo = new AccountRepository(_systemDataContext))
            {
                var account = repo.Get(model.AccountId);

                if (account == null) return Utils.Invalid("Unable to find account to update");

                account = model.Map();

                var response = new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(repo.Update(account).ToJson(), Encoding.UTF8, "application/json")
                };
                return response;
            }
        }
    }
}