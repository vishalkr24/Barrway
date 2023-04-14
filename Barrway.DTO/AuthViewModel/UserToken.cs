using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.AuthViewModel
{
    public class UserToken
    {
        public string USER_NAME { get; set; }
        public string USER_EMAIL { get; set; }
        public string TOKEN { get; set; }
        public string IS_ACTIVE { get; set; }
        public string TOKEN_TIME { get; set; }
    }
}
