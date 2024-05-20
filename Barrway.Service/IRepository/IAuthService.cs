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
        Task<AddUpdateDelete<IDictionary<string, object>>> GetUser(string email, string password, int RoleId, bool isToken = false);
        //Task<AddUpdateDelete<IDictionary<string, object>>> ValidateSuperAdminUser(string email, string password, bool isToken = false);
        Task<AddUpdateDelete> userEmaillogin(string email, string password);
        Task<AddUpdateDelete> userPhonelogin(string phone, string password);
        Task<AddUpdateDelete> LoginWithExternalEmail(string email);
        Task<AddUpdateDelete> GetUser(string userName);
        Task<AddUpdateDelete> GetUserByEmail(string email);
        Task<AddUpdateDelete> GetUserByEmail(string email, int RoleId);
        Task<AddUpdateDelete> GetUserByPhone(string phone);
        Task<AddUpdateDelete> BarrwayBusinessEmailSignup(EmailSignUpViewModel model);
        
        Task<AddUpdateDelete> GetToken(string token, string userName);
        Task<AddUpdateDelete> GetToken(string token);
        Task<AddUpdateDelete> UserVerification(string token, string userID);
        Task<AddUpdateDelete> forgotPassword(string email);
        Task<AddUpdateDelete> ResetPassword(string token, string userName, string newPassword);
        Task<AddUpdateDelete> GetUser(string userName, FormRole formRole);
        Task<AddUpdateDelete> sendActivationLink(string userID, string Email, FormRole Role);
       
        Task<AddUpdateDelete> ChangePhoneVarificationStatus(string userID);
        Task<AddUpdateDelete> SendresetpasswordLink(string UserName, string Email);
            

        Task<AddUpdateDelete<IDictionary<string, object>>> GetUserbyPhone(string Phone, string countrycode, string password, int RoleId, bool isToken = false);
        //Task<AddUpdateDelete> GuestUserSignUp();
        //Task<AddUpdateDelete> CounsellorSignup(CounsellorSignupViewModel model);
        //Task<AddUpdateDelete> UpdateMoodiesProfile(MoodiesUpdateProfileViewModel model);
        //Task<AddUpdateDelete> UpdateAdminCounsellorProfile(AdminUpdateCLLRAccountViewModel model);

        Task<AddUpdateDelete> UpdateUserEmailAddress(string Email, string userID);

        Task<AddUpdateDelete> sendEmailVarificationLink(string userID, string Email);

        Task<AddUpdateDelete> CheckEmailAddressExists(string Email, string USER_ID);

        Task<AddUpdateDelete> GetUserByPhone(string phone, string CountryCode, int Role_Id);

        Task<AddUpdateDelete> GetUserByPhone(string phone, string CountryCode);

        Task<AddUpdateDelete> ResetPasswordPhone(string userName, string newPassword);

    }
}
