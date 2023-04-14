using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.AuthViewModel
{
    class BarrwayViewModel
    {
    }

    public class BarrwayUpdateBusinessProfileViewModel
    {
        //[Required]
        public string M_FIRST_NAME { get; set; }
        //[Required]
        public string M_LAST_NAME { get; set; }
        public string M_NICK_NAME { get; set; }
        public string M_PROFILE_PIC { get; set; }
        //[Required]
        public string M_EMAIL { get; set; }
        //[Required]
        public string M_PHONE { get; set; }
        //[Required]
        public string M_SEX { get; set; }
        //[Required]
        public string M_AGE_RANGE { get; set; }
        public string M_EDU { get; set; }
        public string M_ABOUT { get; set; }
        public string M_EMERG_NAME { get; set; }
        public string M_EMERG_PHONE { get; set; }
        public string M_EMERG_ADDRESS { get; set; }
        public string M_PAST_COUNSELLING { get; set; }
        public string M_PAST_DIAGNOSIS { get; set; }
    }
}
