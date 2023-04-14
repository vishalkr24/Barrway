using Barrway.DTO.AuthViewModel;
using Barrway.DTO.Common;
using Barrway.Utility.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IAuthService
    {
        Task<AddUpdateDelete<IDictionary<string, object>>> GetUser(string email, string password, bool isToken=false);
        Task<AddUpdateDelete> userEmaillogin(string email, string password);
        Task<AddUpdateDelete> userPhonelogin(string phone, string password);
        Task<AddUpdateDelete> LoginWithExternalEmail(string email);
        Task<AddUpdateDelete> GetUser(string userName);
        Task<AddUpdateDelete> GetUserByEmail(string email);
        Task<AddUpdateDelete> GetUserByPhone(string phone);
        Task<AddUpdateDelete> BarrwayBusinessEmailSignup(BusinessEmailSignUpViewModel model);
        
        Task<AddUpdateDelete> GetToken(string token, string userName);
        Task<AddUpdateDelete> GetToken(string token);
        Task<AddUpdateDelete> UserVerificatiom(string token, string userName);
        Task<AddUpdateDelete> forgotPassword(string email);
        Task<AddUpdateDelete> ResetPassword(string token, string userName, string newPassword);
        Task<AddUpdateDelete> GetUser(string userName, FormRole formRole);

        //Task<AddUpdateDelete> GuestUserSignUp();
        //Task<AddUpdateDelete> CounsellorSignup(CounsellorSignupViewModel model);
        //Task<AddUpdateDelete> UpdateMoodiesProfile(MoodiesUpdateProfileViewModel model);
        //Task<AddUpdateDelete> UpdateAdminCounsellorProfile(AdminUpdateCLLRAccountViewModel model);

    }
}
