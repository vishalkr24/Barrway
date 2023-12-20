using Barrway.DTO.BusinessModels;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;
using Stripe.Infrastructure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Barrway.Controllers
{
    [PublicAuthorize(Roles = "PUBLIC_USER")]
    public class PaymentController : BaseController
    {
        private readonly IMasterService masterService;
        private readonly ISqlFunction sqlFunction;
        private readonly IBusinessUserService businessUserService;

        public PaymentController(IMasterService masterService, ISqlFunction sqlFunction, IBusinessUserService businessUserService)
        {
            this.masterService = masterService;
            this.sqlFunction = sqlFunction;
            this.businessUserService = businessUserService;
        }

        // GET: Payment
        public ActionResult Index()
        {
            return View();
        }

        #region Public User Payment
        [HttpPost]
        public async Task<ActionResult> OrderDetails(string Id)
        {
            var PackageData = await masterService.GetSingleCalendarPackage(Id);

            OrderModel order = new OrderModel()
            {
                ORDER_COIN = Convert.ToDouble(PackageData.Data["PACKAGE_COIN"]),
                CALENDAR_CODE = PackageData.Data["CALENDAR_CODE"].ToString(),
                PAYMENT_TYPE = "STRIPE",
                PACKAGE_ID = Id,
                ORDER_PRICE = Convert.ToDouble(PackageData.Data["PACKAGE_PRICE"]),
                ORDER_QTY = 1,
                ORDER_TYPE = "PACKAGE",
                USER_ID = User.Identity.Name,
                PAYMENT_ID = "",
                PAYMENT_STATUS = ""
            };

            var result = await masterService.CreateOrder(order);

            order.ORDER_NO = result.Data;

            OrderDetailsViewModel orderDetailsViewModel = new OrderDetailsViewModel()
            {
                Order = order,
                CalendarPackageModel = new CalendarPackageModel()
                {
                    CALENDAR_CODE = order.CALENDAR_CODE,
                    COMPANY_CODE = PackageData.Data["COMPANY_CODE"].ToString(),
                    PACKAGE_COIN = Convert.ToDouble(PackageData.Data["PACKAGE_COIN"]),
                    PACKAGE_DESCRIPTION = PackageData.Data["PACKAGE_DESCRIPTION"]?.ToString(),
                    PACKAGE_NAME = PackageData.Data["PACKAGE_NAME"]?.ToString(),
                    PACKAGE_PRICE = Convert.ToDouble(PackageData.Data["PACKAGE_PRICE"]),
                    PACKAGE_SEQUENCE = Convert.ToDouble(PackageData.Data["PACKAGE_SEQUENCE"])
                }
            };

            if (result.Status)
            {
                return View(orderDetailsViewModel);
                //OrderNo = result.Data;
            }
            else
            {
                return RedirectToAction("OrderFailed");
            }


        }

        [HttpPost]
        public async Task<ActionResult> CreateCheckoutSession(OrderModel model)
        {
            string UserId = User.Identity.Name;
            string OrderNo = model.ORDER_NO;

            var PackageData = await masterService.GetSingleCalendarPackage(model.PACKAGE_ID);

            PackageData.Data.Add("OrderNo", OrderNo);
            try
            {
                var temp = JsonConvert.SerializeObject(PackageData.Data);

                Dictionary<string, string> metaData = new Dictionary<string, string>();

                metaData.Add("Data", temp.ToString());

                var options = new SessionCreateOptions
                {
                    LineItems = new List<SessionLineItemOptions>
                    {
                      new SessionLineItemOptions
                      {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                               UnitAmount = Convert.ToInt32(PackageData.Data["PACKAGE_PRICE"])*100,
                               Currency = "inr",
                               ProductData = new SessionLineItemPriceDataProductDataOptions
                               {
                                   Name = PackageData.Data["PACKAGE_NAME"]?.ToString(),
                                   Description = PackageData.Data["PACKAGE_DESCRIPTION"]?.ToString()
                               }

                            },
                            Quantity = 1
                      }
                    },
                    Mode = "payment",
                    Metadata = metaData,
                    SuccessUrl = ConfigurationManager.AppSettings["baseurl"] + "Payment/success?SessionId={CHECKOUT_SESSION_ID}",
                    CancelUrl = ConfigurationManager.AppSettings["baseurl"] + "Payment/cancel?SessionId={CHECKOUT_SESSION_ID}"
                };

                var service = new SessionService();
                Session session = service.Create(options);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = OrderNo,
                    PAYMENT_REQUEST_JSON = JsonConvert.SerializeObject(options),
                    REQUEST_TIME = DateTime.Now,
                    PAYMENT_RESPONSE_JSON = ""
                };

                var resultTracker = await masterService.CreatePaymentTracker(tracker);

                Response.Headers.Add("Location", session.Url);

            }
            catch (Exception ex)
            {

            }

            return new HttpStatusCodeResult(303);
        }

        public async Task<ActionResult> OrderFailed()
        {
            return View();
        }

        public async Task<ActionResult> success(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new SessionService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1953 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.PaymentIntentId}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTime.Now,
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var result = await masterService.CreatePaymentTracker(tracker);


                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["PACKAGE_COIN"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["PACKAGE_PRICE"]),
                    PAID_DATE = DateTime.Now,
                    METHOD = "Card",
                    PAYMENT_ID = PackageData["OrderNo"].ToString(),
                    PLAN_ID = (PackageData["Id"]).ToString(),
                    STATUS = session.Status,
                    USER_ID = User.Identity.Name
                };

                var resultPaymentHistory = await masterService.CreatePaymentHistory(paymentHistoryModel);

                LedgerModel ledgerModel = new LedgerModel()
                {
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CREDIT_COIN = Convert.ToDouble(PackageData["PACKAGE_COIN"]),
                    DEBIT_COIN = 0,
                    ORDER_NO = tracker.ORDER_NO,
                    USER_ID = User.Identity.Name,
                    TRANSACTION_TYPE = "Purchase"
                };

                var resultLedger = await masterService.CreateLedgerEntry(ledgerModel);


                ViewBag.PaymentId = PackageData["OrderNo"].ToString();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Marketplace");
            }


        }

        public async Task<ActionResult> cancel(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new SessionService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1953 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.PaymentIntentId}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTime.Now,
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var data = await masterService.CreatePaymentTracker(tracker);

                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["PACKAGE_COIN"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["PACKAGE_PRICE"]),
                    PAID_DATE = DateTime.Now,
                    METHOD = "Card",
                    PAYMENT_ID = session.PaymentIntentId,
                    PLAN_ID = (PackageData["Id"]).ToString(),
                    STATUS = session.Status
                };

                var resultPaymentHistory = await masterService.CreatePaymentHistory(paymentHistoryModel);
                ViewBag.PaymentId = PackageData["OrderNo"].ToString();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }
        #endregion


        #region Business User Payment
        [HttpPost]
        public async Task<ActionResult> BusinessOrderDetails(string Id, bool isMonthly, string companyId)
        {
            var PackageData = await masterService.GetSingleCompanyPackage(Id);
            
            if (!string.IsNullOrEmpty(companyId))
            {
                BusinessOrderModel order = new BusinessOrderModel()
                {
                    PAYMENT_TYPE = "STRIPE",
                    PACKAGE_ID = Id,
                    BOOKING_SESSION_COMPANY = PackageData.Data["VALID_BOOKING_SESSION"]?.ToString(),
                    CALENDAR_AVAILABLE = PackageData.Data["NUM_OF_AVAIL_CLR"]?.ToString(),
                    COMPANY_ID = companyId,
                    IS_MONTHLY = (isMonthly) ? "Y" : "N",
                    PLAN_DESCRIPTION = PackageData.Data["PLAN_DESC"]?.ToString(),
                    PLAN_NAME = PackageData.Data["PLAN_NAME"]?.ToString(),
                    SESSION_MONTH_COMPANY = PackageData.Data["VALID_SESSIONS"]?.ToString(),
                    VALIDITY_DAYS = (isMonthly) ? 30 : 365,
                    VALID_TILL = (isMonthly) ? DateTime.Now.AddMonths(1).ToString("yyyy-MM-dd HH:mm") : DateTime.Now.AddYears(1).ToString("yyyy-MM-dd HH:mm"),
                    ORDER_PRICE = (isMonthly) ? Convert.ToDouble(PackageData.Data["PLAN_PRICE"]?.ToString()) : Convert.ToDouble(PackageData.Data["YEARA_PRICE"]?.ToString()),
                    ORDER_QTY = 1,
                    USER_ID = User.Identity.Name,
                    PAYMENT_ID = "",
                    PAYMENT_STATUS = "",
                    TRANSACTION_FEE = Convert.ToDouble(PackageData.Data["PAYMENT_TRAN_FEE"]?.ToString())
                };

                var result = await masterService.CreateBusinessOrder(order);
                if (result.Status)
                {
                    order.ORDER_NO = result.Data;

                    BusinessOrderDetailsViewModel orderDetailsViewModel = new BusinessOrderDetailsViewModel()
                    {
                        Order = order,
                    };

                    if (result.Status)
                    {
                        return View(orderDetailsViewModel);
                        //OrderNo = result.Data;
                    }
                    else
                    {
                        return RedirectToAction("BusinessOrderFailed");
                    }
                }
                else
                {
                    return RedirectToAction("BusinessOrderFailed");
                }

            }
            else
            {
                return RedirectToAction("BusinessOrderFailed");
            }

        }

        [HttpPost]
        public async Task<ActionResult> CreateBusinessCheckoutSession(BusinessOrderModel model)
        {
            string UserId = User.Identity.Name;
            string OrderNo = model.ORDER_NO;

            var PackageData = await masterService.GetSingleCompanyPackage(model.PACKAGE_ID);
            PackageData.Data.Add("OrderNo", OrderNo);
            PackageData.Data.Add("CompanyId", model.COMPANY_ID);

            try
            {
                var temp = JsonConvert.SerializeObject(PackageData.Data);

                Dictionary<string, string> metaData = new Dictionary<string, string>();

                metaData.Add("Data", temp.ToString());

                double price = 0;
                if (model.IS_MONTHLY == "Y")
                {
                    price = Convert.ToDouble(PackageData.Data["PLAN_PRICE"]?.ToString());
                }
                else
                {
                    price = Convert.ToDouble(PackageData.Data["YEARA_PRICE"]?.ToString());
                }

                var options = new SessionCreateOptions
                {
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                               UnitAmount = (long)(price + (price * Convert.ToDouble(PackageData.Data["PAYMENT_TRAN_FEE"]?.ToString())) / 100)*100,
                               Currency = "hkd",
                               ProductData = new SessionLineItemPriceDataProductDataOptions
                               {
                                   Name = PackageData.Data["PLAN_NAME"]?.ToString(),
                                   Description = PackageData.Data["PLAN_DESC"]?.ToString()
                               }

                            },
                            Quantity = 1
                        }
                    },
                    Mode = "payment",
                    Metadata = metaData,
                    SuccessUrl = ConfigurationManager.AppSettings["baseurl"] + "Payment/BzSuccess?SessionId={CHECKOUT_SESSION_ID}",
                    CancelUrl = ConfigurationManager.AppSettings["baseurl"] + "Payment/BzCancel?SessionId={CHECKOUT_SESSION_ID}"
                };

                var service = new SessionService();
                Session session = service.Create(options);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = OrderNo,
                    PAYMENT_REQUEST_JSON = JsonConvert.SerializeObject(options),
                    REQUEST_TIME = DateTime.Now,
                    PAYMENT_RESPONSE_JSON = ""
                };

                var resultTracker = await masterService.CreatePaymentTracker(tracker);

                Response.Headers.Add("Location", session.Url);

            }
            catch (Exception ex)
            {

            }

            return new HttpStatusCodeResult(303);
        }

        public async Task<ActionResult> BusinessOrderFailed()
        {
            return View();
        }

        public async Task<ActionResult> BzSuccess(string SessionId)
        {
            if (SessionId != null)
            {
                try
                {
                    var service = new SessionService();
                    var session = service.Get(SessionId);
                    var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                    string query = $@"update BUSINESS_ORDER_MASTER_1970 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.PaymentIntentId}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                    var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                    PaymentTrackerModel tracker = new PaymentTrackerModel()
                    {
                        ORDER_NO = PackageData["OrderNo"].ToString(),
                        PAYMENT_REQUEST_JSON = "",
                        RESPONSE_TIME = DateTime.Now,
                        PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                    };

                    var result = await masterService.CreatePaymentTracker(tracker);

                    CompanyPaymentHistoryModel paymentHistoryModel = new CompanyPaymentHistoryModel()
                    {
                        PAYMENT_ID = session.PaymentIntentId,
                        PLAN_ID = (PackageData["Id"]).ToString(),
                        COMPANY_ID = PackageData["CompanyId"].ToString(),
                        HKD = (long)session.AmountTotal / 100,
                        PAYMENT_STATUS = session.Status,
                        PAYMENT_METHOD = "Card",
                        PAYMENT_DESCRIPTION = PackageData["PLAN_NAME"]?.ToString() + "/" + PackageData["PLAN_DESC"]?.ToString(),
                        PAYMENT_DATE = DateTime.Now,
                        ORDER_ID = PackageData["OrderNo"].ToString()
                    };

                    var resultPaymentHistory = await masterService.CreateCompanyPaymentHistory(paymentHistoryModel);

                    CompanySubscriptionDetailsModel details = new CompanySubscriptionDetailsModel()
                    {
                        ASSIGNED_BOOKINGS = Convert.ToDouble(PackageData["VALID_BOOKING_SESSION"]?.ToString()),
                        ASSIGNED_CALENDARS = Convert.ToDouble(PackageData["NUM_OF_AVAIL_CLR"]?.ToString()),
                        ASSIGNED_SESSIONS = Convert.ToDouble(PackageData["VALID_SESSIONS"]?.ToString()),
                        COMPANY_ID = PackageData["CompanyId"]?.ToString(),
                        IS_ACTIVE = "Y",
                        IS_FREE_PLAN = "N",
                        PLAN_ID = PackageData["Id"]?.ToString(),
                        ORDER_ID = PackageData["OrderNo"]?.ToString(),
                    };

                    var result2 = await businessUserService.AddCompanySubscriptionDetails(details);
                    
                    ViewBag.PaymentId = PackageData["OrderNo"].ToString();
                }
                catch (Exception ex)
                {

                }

                return View();
            }
            else
            {
                return RedirectToAction("Index", "Marketplace");
            }


        }

        public async Task<ActionResult> BzCancel(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new SessionService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1953 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.PaymentIntentId}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTime.Now,
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var data = await masterService.CreatePaymentTracker(tracker);

                CompanyPaymentHistoryModel paymentHistoryModel = new CompanyPaymentHistoryModel()
                {
                    PAYMENT_ID = session.PaymentIntentId,
                    PLAN_ID = (PackageData["Id"]).ToString(),
                    COMPANY_ID = PackageData["COMPANY_ID"].ToString(),
                    HKD = (Convert.ToDouble(PackageData["ORDER_PRICE"]?.ToString()) + Convert.ToDouble((Convert.ToDouble(PackageData["ORDER_PRICE"]?.ToString()) * Convert.ToDouble(PackageData["TRANSACTION_FEE"]?.ToString())) / 100)),
                    PAYMENT_STATUS = session.Status,
                    PAYMENT_METHOD = "Card",
                    PAYMENT_DESCRIPTION = PackageData["PLAN_NAME"]?.ToString() + "/" + PackageData["PLAN_DESCRIPTION"]?.ToString(),
                    PAYMENT_DATE = DateTime.Now,
                    ORDER_ID = PackageData["OrderNo"].ToString()
                };

                var resultPaymentHistory = await masterService.CreateCompanyPaymentHistory(paymentHistoryModel);

                ViewBag.PaymentId = PackageData["OrderNo"].ToString();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Marketplace");
            }
        }
        #endregion

    }
}