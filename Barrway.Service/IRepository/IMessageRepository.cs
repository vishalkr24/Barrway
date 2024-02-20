using Barrway.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IMessageRepository
    {
        bool SendOtpSmS(string MobileNo);

        AddUpdateDelete VarifyOtp(string MoblileNo, string Otp);
    }
}
