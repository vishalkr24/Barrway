using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{

    public enum FormSetting
    {
        CreatedUser = 30314,
        USER_MASTER = 2287,
        ROLE_MASTER = 2288,
        BUSINESS_ACCOUNT_WEBSITE = 2289,
        SUBSCRIPTION_PLAN_MASTER = 2290,
        COMPANY_CATEGORY_MASTER = 2291,
        COMPANY_SUB_CATEGORY = 2292,
        BUSINESS_PHOTO_ALBUM = 2293,
        USER_TOKEN = 2294,
        BUSINESS_COMPANY_MASTER = 2295
    }

    public enum FormAction
    {
        Record = 32,
        Save = 1,
        Update = 2,
        ManageForm = 6,
        DeleteForm = 3
    }

    public enum FormRole
    {
        BUSINESS_USER = 1,
        PUBLIC_USER = 2
    }
}
