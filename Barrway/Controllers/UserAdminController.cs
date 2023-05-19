using Barrway.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Barrway.Service.IRepository;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;

namespace Barrway.Controllers
{
    [PublicAuthorize(Roles = "PUBLIC_USER")]
    public class UserAdminController : Controller
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        public UserAdminController(ISqlFunction sqlFunction, IPublicUserService publicUserService)
        {
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
        }

        // GET: UserAdmin
        public async Task<ActionResult> Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> GetSingleUserByUserId(string UserId)
        {
            var userData = await publicUserService.GetSinglePublicUserAccount(UserId);

            return Json(new { data = userData });
        }


    }
}