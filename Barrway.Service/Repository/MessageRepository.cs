using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace Barrway.Service.Repository
{
    public class MessageRepository: IMessageRepository
    {
        string accountSid = "AC5cac95d142f1a0b8f9d0b4148bb0082d";
        string authToken = "1171444b9b37d380fd6e9253e096d00f";
        public bool SendOtpSmS(string MobileNo)
        {
            
            try
            {
                TwilioClient.Init(accountSid, authToken);

                // The phone number to send OTP to
                // Send OTP via Verify API
                var verification = VerificationResource.Create(
                    to: MobileNo,
                    channel: "sms",
                    pathServiceSid: "VAcb0b2bdcdf302d534cc808f501e40f40"
                );
                return true; 
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public AddUpdateDelete VarifyOtp(string MoblileNo, string Otp)
        {
            try
            {
                var verificationCheck = VerificationCheckResource.Create(
                               to: MoblileNo,
                               code: Otp,
                               pathServiceSid: "VAcb0b2bdcdf302d534cc808f501e40f40");

                if (verificationCheck.Status == "approved")
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Message = "invalid OTP !", Status = false };
                }
            }
            catch(Exception ex)
            {
                return new AddUpdateDelete() { Message = AppMessage.Success, Status = false };
            }



           
        }
    }
}
