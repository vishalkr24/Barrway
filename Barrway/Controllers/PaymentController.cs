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

        public PaymentController(IMasterService masterService, ISqlFunction sqlFunction)
        {
            this.masterService = masterService;
            this.sqlFunction = sqlFunction;
        }

        // GET: Payment
        public ActionResult Index()
        {
            return View();
        }

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
        public async Task<ActionResult> BusinessOrderDetails(string Id, bool isMonthly)
        {
            var PackageData = await masterService.GetSingleCompanyPackage(Id);

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

        public async Task<ActionResult> OrderFailed()
        {
            return View();
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
    }
}