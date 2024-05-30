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
using System.ComponentModel;
using System.Web.UI.WebControls;

namespace Barrway.Service.Repository
{
    public class AuthService : IAuthService
    {
        private readonly IMapper mapper;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;

        public AuthService(IMapper mapper, ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository)
        {
            this.mapper = mapper;
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
        }

        public async Task<AddUpdateDelete<IDictionary<string, object>>> GetUser(string email, string password, bool isToken = false)
        {
            try
            {

                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                     where user_m.USER_EMAIL = '{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString()) != password)
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Password" };
                    }

                    if (!(user["IS_EMAIL_VERIFIED"]?.ToString() == "Y"))
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Email not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "Y")
                    {
                        user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = true, Message = "Success", Data = user };

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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                     where user_m.USER_EMAIL = '{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString()) != password)
                    {
                        string a = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString());
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid email or password" };
                    }

                    if (!(user["IS_EMAIL_VERIFIED"]?.ToString() == "Y"))
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Email not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "Y")
                    {

                        if (isToken)
                        {
                            user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
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
                        else if (RoleId == 2)
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
                    return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid email or password" };
                }
            }
            catch (Exception ex)
            {

                return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = ex.Message };
            }

        }



        public async Task<AddUpdateDelete<IDictionary<string, object>>> GetUserbyPhone(string Phone, string countrycode, string password, int RoleId, bool isToken = false)
        {
            try
            {
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     left join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                     where REPLACE(user_m.USER_PHONE,' ','') = REPLACE('{Phone}',' ','') and Country_Code='{countrycode}' ";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var encryptPass = Aes256CbcEncrypter.Encrypt(password);

                    var user = result.FirstOrDefault();
                    if (string.IsNullOrEmpty(user["USER_PASSWORD"]?.ToString()) || Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"].ToString()) != password)
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Phone or Password" };
                    }

                    if (!(user["IS_PHONE_VERIFIED"]?.ToString() == "Y"))
                    {
                        return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Phone not verified, please contact support team." };
                    }

                    if (user["IS_ACTIVE"]?.ToString() == "Y")
                    {

                        if (isToken)
                        {
                            user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
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
                        else if (RoleId == 2)
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

                    return new AddUpdateDelete<IDictionary<string, object>>() { Status = false, Message = "Invalid Phone or Password" };

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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                where user_m.[USER_EMAIL]='{email}'";

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
                        user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                        return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                where user_m.[USER_PHONE]='{phone}'";

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
                        user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                        return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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
                        return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };
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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                    where user_m.[USER_ID]='{userID}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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

        public async Task<AddUpdateDelete> GetUser(string userID, FormRole formRole)
        {
            try
            {
                string sqlQuery = $@"";

                if ((int)formRole == 1)
                {
                    sqlQuery = $@"select
									(select case when (count(abc.Id) = 0) then 'ADMIN' else 'SUPERUSER' end from BUSINESS_ASSIGNED_USERS_1964 abc where abc.ASSIGNED_USER = user_m.Id and abc.ROLE_TYPE = 'SUPERUSER') as 'ROLE_TYPE'
									, baw.Id as 'BUSINESS_ACCOUNT_ID',user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],user_m.[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                    [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD] 
                                    from USER_MASTER_1915 user_m
                                    join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.USER_ID = user_m.USER_ID
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = baw.Id
                                    join ROLE_MASTER_1917 user_role on user_role.Id = user_m.ROLE_ID
                                    where user_m.USER_ID = N'{userID}' and user_m.ROLE_ID = '{((int)formRole).ToString()}' and bau.ASSIGNED_USER = user_m.Id";
                }
                else
                {
                    sqlQuery = $@"select user_m.*, role_m.ROLE_NAME,p_user.FIRST_NAME from USER_MASTER_1915 user_m
join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
join PUBLIC_USER_ACCOUNT_1943 p_user on p_user.USER_ID=user_m.USER_ID
                                    where user_m.USER_ID = N'{userID}' and user_m.ROLE_ID = '{((int)formRole).ToString()}'";
                }



                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                    where user_m.USER_EMAIL = '{email}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {   
                    var user = result.FirstOrDefault(); 
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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

        public async Task<AddUpdateDelete> GetUserByPhone(string phone, string CountryCode)
        {
            try
            {
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                    where Replace(user_m.USER_PHONE,' ','')='{phone.Replace(" ","")}' and user_m.Country_Code='{CountryCode}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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
                string sqlQuery = $@"";

                if (Role_Id == 1)
                {
                    sqlQuery = $@"select
									(select case when (count(abc.Id) = 0) then 'ADMIN' else 'SUPERUSER' end from BUSINESS_ASSIGNED_USERS_1964 abc where abc.ASSIGNED_USER = user_m.Id and abc.ROLE_TYPE = 'SUPERUSER') as 'ROLE_TYPE'
									, baw.Id as 'BUSINESS_ACCOUNT_ID',user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],user_m.[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                    [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD] 
                                    from USER_MASTER_1915 user_m
                                    join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.USER_ID = user_m.USER_ID
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = baw.Id
                                    join ROLE_MASTER_1917 user_role on user_role.Id = user_m.ROLE_ID
                                    where user_m.USER_EMAIL = '{email}' and user_m.ROLE_ID = '{Role_Id.ToString()}' and bau.ASSIGNED_USER = user_m.Id";
                }
                else
                {
                    sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                    where user_m.USER_EMAIL = '{email}' and user_m.ROLE_ID = '{Role_Id.ToString()}'";
                }

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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


        public async Task<AddUpdateDelete> GetUserByPhone(string phone, string CountryCode, int Role_Id)
        {
            try
            {
                string sqlQuery = $@"";

                if (Role_Id == 1)
                {
                    sqlQuery = $@"select
									(select case when (count(abc.Id) = 0) then 'ADMIN' else 'SUPERUSER' end from BUSINESS_ASSIGNED_USERS_1964 abc where abc.ASSIGNED_USER = user_m.Id and abc.ROLE_TYPE = 'SUPERUSER') as 'ROLE_TYPE'
									, baw.Id as 'BUSINESS_ACCOUNT_ID',user_m.Id,user_m.formId,user_m.formGroupKey,user_m.[created_at],user_m.[updated_at],user_m.[created_by],user_m.[updated_by],[USER_EMAIL],[USER_PHONE],user_m.[USER_ID],[SIGNUP_TYPE],[IS_ACTIVE],[IS_EMAIL_VERIFIED],
                                    [IS_PHONE_VERIFIED],[ROLE_ID],user_role.[ROLE_NAME],[PROFILE_STATUS],[USER_PASSWORD] 
                                    from USER_MASTER_1915 user_m
                                    join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.USER_ID = user_m.USER_ID
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = baw.Id
                                    join ROLE_MASTER_1917 user_role on user_role.Id = user_m.ROLE_ID
                                    where Replace(user_m.USER_PHONE,' ','') = '{phone}' and user_m.Country_Code='{CountryCode}' and user_m.ROLE_ID = '{Role_Id.ToString()}' and bau.ASSIGNED_USER = user_m.Id";
                }
                else
                {
                    sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                    where Replace(user_m.USER_PHONE,' ','') = '{phone}' and user_m.ROLE_ID = '{Role_Id.ToString()}'";
                }

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };
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
                string sqlQuery = $@"select user_m.*, role_m.ROLE_NAME, pua.FIRST_NAME, pua.LAST_NAME from USER_MASTER_1915 user_m
                                     join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID
                                     join PUBLIC_USER_ACCOUNT_1943 pua on pua.USER_ID = user_m.USER_ID
                                                            where Replace(user_m.USER_PHONE,' ','') = '{phone}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                if (result.Count() > 0)
                {
                    var user = result.FirstOrDefault();
                    user["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(user["USER_PASSWORD"]?.ToString());
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = user };


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
                string sqlString = $@" update [USER_TOKEN_1923] set VERIFICATION_TIME='{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss")}',[IS_ACTIVE]='N',updated_at=getdate()  where [TOKEN]='{token}' and [USER_ID]='{userID}'";

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


        public async Task<AddUpdateDelete> ChangePhoneVarificationStatus(string userID)
        {
            try
            {

                string sqlString = $@" update USER_MASTER_1915 set IS_ACTIVE='Y',IS_PHONE_VERIFIED='Y' where  Replace(USER_PHONE,' ','')='{userID}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {

                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
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
                newPassword = Aes256CbcEncrypter.Encrypt(newPassword);

                string sqlString = $@" update [USER_TOKEN_1923] set VERIFICATION_TIME='{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss")}',[IS_ACTIVE]='NO',updated_at=getdate()  where [TOKEN]='{token}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {
                    sqlString = $@" update USER_MASTER_1915 set USER_PASSWORD='{newPassword}',IS_EMAIL_VERIFIED='Y' where [USER_ID]=N'{userName}'";
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


        public async Task<AddUpdateDelete> ResetPasswordPhone(string userName, string newPassword)
        {
            try
            {
                newPassword = Aes256CbcEncrypter.Encrypt(newPassword);

                string sqlString = $@" update USER_MASTER_1915 set USER_PASSWORD='{newPassword}',IS_PHONE_VERIFIED='Y' where [USER_ID]=N'{userName}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {

                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
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

        public async Task<AddUpdateDelete> sendActivationLink(string userID, string Email, FormRole Role)
        {
            var userToken = new UserToken()
            {
                EMAIL = Email,
                USER_ID = userID,
                TOKEN = Guid.NewGuid().ToString(),
                TOKEN_TIME = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss"),
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
                var userDetails = await GetSinglePublicUserAccount(userID);
                var result2 = SendActivationLink.sendlink(userToken, Role, userDetails.Data as IDictionary<string, object>);
                if (result2.Status)
                {
                    return new AddUpdateDelete() { Status = true, Message = "User Activation Link send!" };
                }
                return new AddUpdateDelete() { Status = false, Message = result2.Message };
            }
            return new AddUpdateDelete() { Status = false, Message = "User Activation Link not generate!" };
        }


        public async Task<AddUpdateDelete> sendEmailVarificationLink(string userID, string Email)
        {
            

            var userToken = new UserToken()
            {
                EMAIL = Email,
                USER_ID = userID,
                TOKEN = Guid.NewGuid().ToString(),
                TOKEN_TIME = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss"),
                IS_ACTIVE = "Y"
            };
            var userTokeDic = userToken.ToDictionary();

            Form_DataTable request = new Form_DataTable();
            request.formId = (int)FormSetting.USER_TOKEN;
            request.action = (int)FormAction.Save;
            request.formGroupKey = Guid.NewGuid().ToString();
            request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(userTokeDic);

            var result = (await formAPIRepository.GeneratedFormData(request)).Data;
            var userDetails = await GetSinglePublicUserAccount(userToken.USER_ID);

            if (result.res == 1)
            {
                var result2 = SendActivationLink.sendvarificationLink(userToken, userDetails.Data);
                if (result2.Status)
                {
                    return new AddUpdateDelete() { Status = true, Message = "User Activation Link send!" };
                }
                return new AddUpdateDelete() { Status = false, Message = result2.Message };
            }
            return new AddUpdateDelete() { Status = false, Message = "User Activation Link not generate!" };
        }

        private async Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId)
        {
            string query = $@"SELECT publicUser.[Id]
                              ,publicUser.[USER_ID]
                              ,publicUser.[USER_EMAIL]
                              ,publicUser.[USER_PASSWORD]
                              ,publicUser.[Country_Code]
                              ,publicUser.[USER_PHONE]
                              ,publicUser.[IS_EXTERNAL_SIGNUP]
                              ,publicUser.[IS_EMAIL_VERIFIED]
                              ,publicUser.[IS_PHONE_VERIFIED]
                              ,publicUser.[created_at]
                              ,publicUser.[updated_at]
                              ,publicUser.[created_by]
                              ,publicUser.[updated_by]
                              ,publicUser.[IS_ACTIVE]
                              ,publicUser.[PROFILE_STATUS]
                              ,publicUser.[ROLE_ID]
                              ,publicUser.[SIGNUP_TYPE], publicUser.[Id]      ,publicUser.[created_at]      ,publicUser.[updated_at]      ,publicUser.[created_by]      ,publicUser.[updated_by]      ,publicUser.[USER_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,publicUser.[CURRENT_STEP]     ,[FIRST_NAME]      ,[LAST_NAME]      ,[PROFILE_PHOTO_PATH]      ,[PROFILE_PHOTO_NAME]      ,[CHINESE_NAME]      ,[NICK_NAME]      ,[GENDER]      ,[DATE_OF_BIRTH]  
                        FROM[dbo].[PUBLIC_USER_ACCOUNT_1943] account 
                        join USER_MASTER_1915 publicUser on publicUser.USER_ID = account.USER_ID
                        where publicUser.USER_ID = N'" + UserId + "'";

            List<IDictionary<string, object>> businessWebsiteResult = await sqlFunction.ExecuteSqlQuery(query);

            if (businessWebsiteResult.Count > 0)
            {
                var businessWebsite = businessWebsiteResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessWebsite };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> SendresetpasswordLink(string UserName, string Email)
        {
            var userDetails = await GetSinglePublicUserAccount(UserName);

            if (userDetails.Status)
            {
                var userToken = new UserToken()
                {
                    EMAIL = Email,
                    USER_ID = UserName,
                    TOKEN = Guid.NewGuid().ToString(),
                    TOKEN_TIME = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss"),
                    IS_ACTIVE = "YES"
                };
                var userTokeDic = userToken.ToDictionary();

                Form_DataTable request = new Form_DataTable();
                request.action = (int)FormAction.Save;
                request.formId = (int)FormSetting.USER_TOKEN;
                request.formGroupKey = Guid.NewGuid().ToString();
                request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(userTokeDic);

                var result = (await formAPIRepository.GeneratedFormData(request)).Data;

                if (result.res == 1)
                {
                    var result2 = SendActivationLink.sendlinkForResetPassword(userToken, userDetails.Data as IDictionary<string, object>);
                    if (result2.Status)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "User Activation Link send!" };
                    }
                    return new AddUpdateDelete() { Status = false, Message = result2.Message };
                }
                return new AddUpdateDelete() { Status = false, Message = "User Activation Link not generate!" };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "No user found" };
            }
        }


        private async Task<AddUpdateDelete> resetpasswordLink(string UserName, string Email)
        {
            var userToken = new UserToken()
            {
                EMAIL = Email,
                USER_ID = UserName,
                TOKEN = Guid.NewGuid().ToString(),
                TOKEN_TIME = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm:ss"),
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


        public async Task<AddUpdateDelete> UpdateUserEmailAddress(string Email, string userID)
        {
            try
            {

                string sqlString = $@" update USER_MASTER_1915 set USER_EMAIL='{Email}'  where [USER_ID]='{userID}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {

                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
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


        public async Task<AddUpdateDelete> CheckEmailAddressExists(string Email, string USER_ID)
        {
            try
            {

                string sqlString = $@"select USER_EMAIL from USER_MASTER_1915 where USER_EMAIL ='{Email}' and USER_ID !='{USER_ID}'";
                var result = await sqlFunction.ExecuteSqlQuery(sqlString);
                if (result.Count() > 0)
                {

                    return new AddUpdateDelete() { Status = false, Message = "Email already exists" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = "Email not exists" };
                }

            }
            catch (Exception ex)
            {

                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }

        }


        public async Task<List<IDictionary<string, object>>> GetAllUser(string ids) {

            string sqlString = $@"select Id,[USER_NAME] from USER_MASTER_1915  where Id in ({ids})";
            var result = await sqlFunction.ExecuteSqlQuery(sqlString);
            return result;
        }


    }
}
