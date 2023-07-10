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
        BUSINESS_COMPANY_MASTER = 2295,
        BUSINESS_CALENDAR_MASTER = 2296,
        COUNTRY_MASTER = 2297,
        CITY_MASTER = 2298,
        DISTRICT_MASTER = 2299,
        CALENDAR_CATEGORY_MASTER = 2300,
        CALENDAR_SUB_CATEGORY_MASTER = 2301,
        SERVICE_MASTER = 2303,
        SERVICE_PROVIDER_MASTER = 2304,
        CALENDAR_FORM = 2305,
        LOCATION_MASTER = 2306,
        COMPANY_PAYMENT_HISTORY_MASTER = 2307,
        COMPANY_SUBSCRIPTION_DETAILS = 2309,
        PARTICIPANT_MASTER = 2310,
        SCHEDULAR_FORM = 2311,
        TRANSACTION_MASTER = 2312,
        PUBLIC_USER_ACCOUNT = 2313,
        CALENDAR_CONTROL_SHEET = 2314,
        COMPANY_UPCOMING_BOOKINGS = 2315,
        NEWS_POST_MASTER = 2316,
        AUTHOR_MASTER = 2317,
        FAVORITE_CALENDAR_MASTER = 2319,
        CALENDAR_PACKAGE_MASTER = 2322,
        ORDER_MASTER = 2323,
        PAYMENT_TRACKER = 2324,
        LEDGER_MASTER = 2327,
        PAYMENT_HISTORY_MASTER = 2326
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
