using AutoMapper;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using Barrway.DTO.AuthViewModel;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using System.Net.Http.Headers;
using AutoMapper.Configuration.Annotations;
using System.Web.Mvc;
using Barrway.DTO.Common;
using Barrway.Service.IRepository;

namespace Barrway.Service.Repository
{
    public class AuthService : IAuthService
    {
        private readonly IMapper mapper;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
       
        private readonly RestClient _client;
        private readonly string _url = ConfigurationManager.AppSettings["webapibaseurl"];

        public AuthService(IMapper mapper, ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository)
        {
            this.mapper = mapper;
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
            //this.userIdentity = userIdentity;
            //this.zoomService = zoomService;
            //_client = new RestClient("www.google.com");
        }


        public async Task<AddUpdateDelete<IDictionary<string, object>>> GetUser(string email, string password, bool isToken = false)
        {
            try
            {

                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_EMAIL]='{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || user["USER_PASSWORD"].ToString() != password)
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Password" };
                    }

                    if (!(user["IS_EMAIL_VERIFIED"]?.ToString() == "Y"))
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Email not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "Y")
                    {
                        if (string.IsNullOrEmpty(user["ROLE_NAME"]?.ToString()))
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Access denied!!" };
                        }
                        if (isToken)
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };
                        }
                        if (user["ROLE_NAME"].ToString().ToUpper() == "BUSINESS_USER")
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };
                        }
                        else
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Access denied!!" };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Account is deactive, please contact support team." };
                    }

                }
                else
                {
                    return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Email" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = ex.Message };
            }

        }

        public async Task<AddUpdateDelete<IDictionary<string, object>>> GetUser(string email, string password, int RoleId, bool isToken = false)
        {
            try
            {

                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_EMAIL]='{email}' and user_m.ROLE_ID = '{RoleId.ToString()}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || user["USER_PASSWORD"].ToString() != password)
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Password" };
                    }

                    if (!(user["IS_EMAIL_VERIFIED"]?.ToString() == "Y"))
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Email not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "Y")
                    {
                        if (string.IsNullOrEmpty(user["ROLE_NAME"]?.ToString()))
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Access denied!!" };
                        }
                        if (isToken)
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };
                        }

                        if (RoleId == 1)
                        {
                            if (user["ROLE_NAME"].ToString().ToUpper() == "BUSINESS_USER")
                            {
                                return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };
                            }
                            else
                            {
                                return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Access denied!!" };
                            }
                        }
                        else if(RoleId == 2)
                        {
                            if (user["ROLE_NAME"].ToString().ToUpper() == "PUBLIC_USER")
                            {
                                return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };
                            }
                            else
                            {
                                return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Access denied!!" };
                            }
                        }
                        else
                        {
                            return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Something went wrong!!" };
                        }

                        
                    }
                    else
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Account is deactive, please contact support team." };
                    }

                }
                else
                {
                    return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Email" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = ex.Message };
            }

        }

        public async Task<AddUpdateDelete> userEmaillogin(string email, string password)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_NAME],                [USER_EMAIL],[USER_PHONE],[USER_UID],[USER_SOURCE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],[USER_PASSWORD],
                                [IS_PHONE_VERIFIED],[USER_ROLE],user_role.[ROLE_NAME],[PROFILE_STATUS]
                                from USER_MASTER_1921 user_m 
                                left join [dbo].[USER_ROLE_1924] user_role on user_role.Id=user_m.[USER_ROLE]
                                where [USER_EMAIL]='{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString()) != password)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Invalid Email or Password" };
                    }


                    if (!(user["IS_EMAIL_VERIFIED"]?.ToString() == "YES"))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Email not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "YES")
                    {
                        if (string.IsNullOrEmpty(user["ROLE_NAME"]?.ToString()))
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Access denied!!" };
                        }
                        string role = user["ROLE_NAME"].ToString();
                        string username = user["USER_NAME"].ToString();

                        return await GetUserByRole(username, role);
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Account is deactive, please contact support team." };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invalid Email or Password" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }


        public async Task<AddUpdateDelete> userPhonelogin(string phone, string password)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_NAME],                [USER_EMAIL],[USER_PHONE],[USER_UID],[USER_SOURCE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],[USER_PASSWORD],
                                [IS_PHONE_VERIFIED],[USER_ROLE],user_role.[ROLE_NAME],[PROFILE_STATUS]
                                from USER_MASTER_1921 user_m 
                                left join [dbo].[USER_ROLE_1924] user_role on user_role.Id=user_m.[USER_ROLE]
                                where [USER_PHONE]='{phone}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();

                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString()) != password)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Invalid Phone or Password" };
                    }

                    if (!(user["IS_PHONE_VERIFIED"]?.ToString() == "YES"))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "PHONE not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "YES")
                    {
                        if (string.IsNullOrEmpty(user["ROLE_NAME"]?.ToString()))
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Access denied!!" };
                        }
                        string role = user["ROLE_NAME"].ToString();
                        string username = user["USER_NAME"].ToString();

                        return await GetUserByRole(username, role);
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Account is deactive, please contact support team." };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invalid Phone or Password" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }


        public async Task<AddUpdateDelete> LoginWithExternalEmail(string email)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_NAME],                [USER_EMAIL],[USER_PHONE],[USER_UID],[USER_SOURCE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[USER_ROLE],user_role.[ROLE_NAME],[PROFILE_STATUS]
                                from USER_MASTER_1921 user_m 
                                left join [dbo].[USER_ROLE_1924] user_role on user_role.Id=user_m.[USER_ROLE]
                                where [USER_EMAIL]='{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (user["IS_ACTIVE"]?.ToString() == "YES")
                    {
                        if (string.IsNullOrEmpty(user["ROLE_NAME"]?.ToString()))
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Access denied!!" };
                        }
                        string role = user["ROLE_NAME"].ToString();
                        string username = user["USER_NAME"].ToString();
                        return await GetUserByRole(username, role);
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Account is deactive, please contact support team." };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invalid Email or Password" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }


        public async Task<AddUpdateDelete> GetUser(string userID)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_ID]='{userID}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    string role = user["ROLE_NAME"].ToString();
                    string username = user["USER_ID"].ToString();
                    var userResult = await GetUserByRole(username, role);
                    if (!userResult.Status)
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    else
                        return userResult;
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetUser(string userID,FormRole formRole)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_ID]='{userID}' and user_m.[ROLE_ID]='{(int)formRole}'";
                

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    string role = user["ROLE_NAME"].ToString();
                    string username = user["USER_ID"].ToString();
                    var userResult = await GetUserByRole(username, role);
                    if (!userResult.Status)
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    else
                        return userResult;
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetUserByEmail(string email)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_EMAIL]='{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();


                    string role = user["ROLE_NAME"].ToString();
                    string username = user["USER_ID"].ToString();

                    var userResult = await GetUserByRole(username, role);
                    if (!userResult.Status)
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    else
                        return userResult;
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetUserByEmail(string email, int Role_Id)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD]
                                from USER_MASTER_1915 user_m 
                                left join [dbo].[ROLE_MASTER_1917] user_role on user_role.Id=user_m.[ROLE_ID]
                                where [USER_EMAIL]='{email}' and user_m.ROLE_ID = '{Role_Id.ToString()}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();


                    string role = user["ROLE_NAME"].ToString();
                    string username = user["USER_ID"].ToString();

                    var userResult = await GetUserByRole(username, role);
                    if (!userResult.Status)
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    else
                        return userResult;
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetUserByPhone(string phone)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_NAME],                [USER_EMAIL],[USER_PHONE],[USER_UID],[USER_SOURCE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                [IS_PHONE_VERIFIED],[USER_ROLE],user_role.[ROLE_NAME],[PROFILE_STATUS]
                                from USER_MASTER_1921 user_m 
                                left join [dbo].[USER_ROLE_1924] user_role on user_role.Id=user_m.[USER_ROLE]
                                where [USER_PHONE]=N'{phone}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();


                    string role = user["ROLE_NAME"].ToString();
                    string username = user["USER_NAME"].ToString();
                    var userResult = await GetUserByRole(username, role);
                    if (!userResult.Status)
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    else
                        return userResult;


                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> BarrwayBusinessEmailSignup(EmailSignUpViewModel model)
        {
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

        public async Task<AddUpdateDelete> UserVerification(string token, string userID)
        {
            try
            {
                string sqlString = $@" update [USER_TOKEN_1923] set VERIFICATION_TIME='{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}',[IS_ACTIVE]='N',updated_at=getdate()  where [TOKEN]='{token}' and [USER_ID]='{userID}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {
                    sqlString = $@" update USER_MASTER_1915 set IS_ACTIVE='Y',IS_EMAIL_VERIFIED='Y' where [USER_ID]='{userID}'";
                    result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                    if (result > 0)
                    {

                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }

        }

        public async Task<AddUpdateDelete> ResetPassword(string token, string userName, string newPassword)
        {
            try
            {
                string sqlString = $@" update [USER_TOKEN_1950] set VERIFICATION_TIME='{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}',[IS_ACTIVE]='NO',updated_at=getdate()  where [TOKEN]='{token}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {
                    sqlString = $@" update USER_MASTER_1921 set USER_PASSWORD='{newPassword}' where [USER_NAME]=N'{userName}'";
                    result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                    if (result > 0)
                    {

                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }

        }

        public async Task<AddUpdateDelete> GetToken(string token, string userID)
        {

            string sqlString = $@" select * from [dbo].[USER_TOKEN_1923] where [TOKEN]='{token}' and [USER_ID]='{userID}' order by created_at desc";
            var result = await sqlFunction.ExecuteSqlQuery(sqlString);

            if (result.Count() > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }
        public async Task<AddUpdateDelete> GetToken(string token)
        {

            string sqlString = $@" select * from [dbo].[USER_TOKEN_1923] where [TOKEN]='{token}' order by created_at desc";
            var result = await sqlFunction.ExecuteSqlQuery(sqlString);

            if (result.Count() > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> forgotPassword(string email)
        {

            var userResult = await GetUserByEmail(email);
            if (userResult.Status)
            {
                var user = userResult.Data as IDictionary<string, object>;
                var result = await resetpasswordLink(user["USER_NAME"].ToString(), email);
                return result;
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }


        private async Task<AddUpdateDelete> GetUserByRole(string userID, string role)
        {
            if (role == "BUSINESS_USER")
            {
                string sqlQuery = "SELECT business_user.*,user_m.[USER_ID],user_m.[USER_EMAIL],user_m.[USER_PHONE],user_m.[SIGNUP_TYPE],user_m.[IS_ACTIVE],user_m.[IS_EMAIL_VERIFIED], user_m.[IS_PHONE_VERIFIED],user_m.[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS]                             FROM[dbo].[BUSINESS_ACCOUNT_WEBSITE_1918] business_user join USER_MASTER_1915 user_m  on user_m.[USER_ID]= business_user.[USER_ID]                              join[dbo].[ROLE_MASTER_1917] user_role on user_role.Id = user_m.[ROLE_ID]                             where business_user.[USER_ID]= '" + userID + "' and user_m.ROLE_ID = '1'";
                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                if (result.Count() > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invalid Email or Password" };
                }
            }

            if (role == "PUBLIC_USER")
            {
                string sqlQuery = $@"SELECT public_user.*,user_m.[USER_ID],user_m.[USER_EMAIL],user_m.[USER_PHONE],user_m.[SIGNUP_TYPE],user_m.[IS_ACTIVE],user_m.[IS_EMAIL_VERIFIED], user_m.[IS_PHONE_VERIFIED],user_m.[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS]                             FROM[dbo].[PUBLIC_USER_ACCOUNT_1943] public_user join USER_MASTER_1915 user_m  on user_m.[USER_ID]= public_user.[USER_ID]                              join[dbo].[ROLE_MASTER_1917] user_role on user_role.Id = user_m.[ROLE_ID]                             where public_user.[USER_ID]= '" + userID + "' and user_m.ROLE_ID = '2'";
                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                if (result.Count() > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invalid Email or Password" };
                }
            }
           

            return new AddUpdateDelete() { Status = false, Message = "Access denied!!" };
        }
        public async Task<AddUpdateDelete> sendActivationLink(string userID, string Email, FormRole Role)
        {
            var userToken = new UserToken()
            {
                EMAIL = Email,
                USER_ID = userID,
                TOKEN = Guid.NewGuid().ToString(),
                TOKEN_TIME = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                IS_ACTIVE = "Y"
            };
            var userTokeDic = userToken.ToDictionary();

            Form_DataTable request = new Form_DataTable();
            request.formId = (int)FormSetting.USER_TOKEN;
            request.action = (int)FormAction.Save;
            request.formGroupKey = Guid.NewGuid().ToString();
            request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(userTokeDic);

            var result = (await formAPIRepository.GeneratedFormData(request)).Data;

            if (result.res == 1)
            {
                var result2 = SendActivationLink.sendlink(userToken, Role);
                if (result2.Status)
                {
                    return new AddUpdateDelete() { Status = true, Message = "User Activation Link send!" };
                }
                return new AddUpdateDelete() { Status = false, Message = result2.Message };
            }
            return new AddUpdateDelete() { Status = false, Message = "User Activation Link not generate!" };
        }

        private async Task<AddUpdateDelete> resetpasswordLink(string UserName, string Email)
        {
            var userToken = new UserToken()
            {
                EMAIL = Email,
                USER_ID = UserName,
                TOKEN = Guid.NewGuid().ToString(),
                TOKEN_TIME = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                IS_ACTIVE = "YES"
            };
            var userTokeDic = userToken.ToDictionary();

            Form_DataTable request = new Form_DataTable();
            //request.formId = (int)FormSetting.USER_TOKEN_FORM;
            request.action = (int)FormAction.Save;
            request.formGroupKey = Guid.NewGuid().ToString();
            request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(userTokeDic);

            //var result = (await formAPIRepository.GeneratedFormData(request)).Data;

            //if (result.res == 1)
            //{
            //    var result2 = SendActivationLink.sendlinkForResetPassword(userToken);
            //    if (result2.Status)
            //    {
            //        return new AddUpdateDelete() { Status = true, Message = "Password reset Link send!" };
            //    }
            //    return new AddUpdateDelete() { Status = false, Message = result2.Message };
            //}
            return new AddUpdateDelete() { Status = false, Message = "Password Link not generate!" };
        }




    }
}
