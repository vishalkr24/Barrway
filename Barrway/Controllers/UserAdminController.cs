using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    [Authorize(Roles = "PUBLIC_USER")]
    public class UserAdminController : Controller
    {
        // GET: UserAdmin
        //public ActionResult Dashboard()
        //{
        //    return View();
        //}
    }
}