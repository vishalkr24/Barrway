using Barrway.DTO.APIModels.Account;
using Barrway.DTO.APIModels.Booking;
using Barrway.DTO.APIModels.Payment;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Barrway.Controllers.API.v1
{
    [JwtAuthentication]
    public class PaymentController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        public PaymentController(IMobileAPIService mobileAPIService, ISqlFunction sqlFunction, IPublicUserService publicUserService)
        {
            this.mobileAPIService = mobileAPIService;
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
        }

        #region Public User Payment

        [HttpPost]
        [Route("api/payment/CreateOrder")]
        public async Task<IHttpActionResult> CreateOrder(string Id)
        {
            var PackageData = await mobileAPIService.GetSingleCalendarPackage(Id);

            if (PackageData.Status)
            {
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

                var result = await mobileAPIService.CreateOrder(order);

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
                    return Ok(new AddUpdateDelete() { Status = true, Message = "Success", Data = orderDetailsViewModel });
                }
                else
                {
                    return InternalServerError();
                }

            }
            else
            {
                return BadRequest("Invalid Package!");
            }
        }

        [HttpPost]
        [Route("api/payment/CreateCheckoutSession")]
        public async Task<IHttpActionResult> CreateCheckoutSession(ApiOrderModel model)
        {
            string OrderNo = model.ORDER_NO;

            var PackageData = await mobileAPIService.GetSingleCalendarPackage(model.Id);

            PackageData.Data.Add("OrderNo", OrderNo);

            try
            {
                var temp = JsonConvert.SerializeObject(PackageData.Data);

                Dictionary<string, string> metaData = new Dictionary<string, string>();

                metaData.Add("Data", temp.ToString());

                var options = new PaymentIntentCreateOptions
                {
                    Metadata = metaData,
                    Amount = Convert.ToInt32(PackageData.Data["PACKAGE_PRICE"]) * 100,
                    Currency = "hkd",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                };
                var service = new PaymentIntentService();
                PaymentIntent p_intent = service.Create(options);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = OrderNo,
                    PAYMENT_REQUEST_JSON = JsonConvert.SerializeObject(options),
                    REQUEST_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = ""
                };

                var resultTracker = await mobileAPIService.CreatePaymentTracker(tracker);

                return Ok(new AddUpdateDelete() { Status = true, Data = p_intent, Message = "Success" });
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/payment/Success")]
        public async Task<IHttpActionResult> success(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new PaymentIntentService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1969 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.Id}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var result = await mobileAPIService.CreatePaymentTracker(tracker);

                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["PACKAGE_COIN"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["PACKAGE_PRICE"]),
                    PAID_DATE = DateTimeUtility.Now(),
                    METHOD = "Card",
                    PAYMENT_ID = PackageData["OrderNo"].ToString(),
                    PLAN_ID = (PackageData["Id"]).ToString(),
                    STATUS = "complete",
                    CREDIT_EXPIRE_DATE = DateTimeUtility.Now().AddMonths(Convert.ToInt32(PackageData["VALIDITY_IN_MONTHS"])).ToString("yyyy-MM-dd HH:mm"),
                    USER_ID = User.Identity.Name
                };

                var resultPaymentHistory = await mobileAPIService.CreatePaymentHistory(paymentHistoryModel);

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

                var resultLedger = await mobileAPIService.CreateLedgerEntry(ledgerModel);

                string PaymentId = PackageData["OrderNo"].ToString();

                return Ok(new AddUpdateDelete() { Status = true, Data = PaymentId, Message = "Payment successfull!" });
            }
            else
            {
                return BadRequest("Invalid Session Id");
            }

        }

        [HttpGet]
        [Route("api/payment/Cancel")]
        public async Task<IHttpActionResult> cancel(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new PaymentIntentService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1969 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.Id}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var data = await mobileAPIService.CreatePaymentTracker(tracker);

                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["PACKAGE_COIN"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["PACKAGE_PRICE"]),
                    PAID_DATE = DateTimeUtility.Now(),
                    METHOD = "Card",
                    PAYMENT_ID = session.Id,
                    PLAN_ID = (PackageData["Id"]).ToString(),
                    CREDIT_EXPIRE_DATE = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm"),
                    STATUS = session.Status
                };

                var resultPaymentHistory = await mobileAPIService.CreatePaymentHistory(paymentHistoryModel);

                string PaymentId = PackageData["OrderNo"].ToString();

                return Ok(new AddUpdateDelete() { Status = true, Data = PaymentId, Message = "Payment cancelled!" });
            }
            else
            {
                return BadRequest("Invalid Session Id");
            }
        }
        #endregion

        #region Event Payment and Enrollment
        // Id = Event Id
        [HttpPost]
        [Route("api/payment/CreateEventOrder")]
        public async Task<IHttpActionResult> EventOrderDetails(string Id)
        {
            AddUpdateDelete EventData = await publicUserService.GetSingleEventDetails(Id);

            if (EventData.Status)
            {
                OrderModel order = new OrderModel()
                {
                    ORDER_COIN = 0,
                    CALENDAR_CODE = EventData.Data["CALENDAR_CODE"].ToString(),
                    PAYMENT_TYPE = "STRIPE",
                    ORDER_PRICE = Convert.ToDouble(EventData.Data["fees_1"]),
                    ORDER_QTY = 1,
                    SLOT_ID = Id,
                    SERVICE_ID = null,
                    ORDER_TYPE = "SLOT1",
                    USER_ID = User.Identity.Name,
                    PAYMENT_ID = "",
                    PAYMENT_STATUS = ""
                };


                var result = await mobileAPIService.CreateOrder(order);

                order.ORDER_NO = result.Data;
                string start = EventData.Data["start"]?.ToString();
                string end = EventData.Data["end"]?.ToString();

                OrderDetailsViewModel orderDetailsViewModel = new OrderDetailsViewModel()
                {
                    Order = order,
                    CalendarPackageModel = new CalendarPackageModel()
                    {
                        CALENDAR_CODE = order.CALENDAR_CODE,
                        COMPANY_CODE = EventData.Data["COMPANY_CODE"].ToString(),
                        PACKAGE_COIN = 0,
                        PACKAGE_DESCRIPTION = "Single Event Purchase",
                        PACKAGE_NAME = "Event : " + Convert.ToDateTime(start).ToString("dd-MM-yyyy HH:mm") + " to " + Convert.ToDateTime(end).ToString("dd-MM-yyyy HH:mm"),
                        PACKAGE_PRICE = Convert.ToDouble(EventData.Data["fees_1"]),
                        PACKAGE_SEQUENCE = 1
                    },
                    start = start,
                    end = end
                };

                if (result.Status)
                {
                    return Ok(new AddUpdateDelete() { Status = true, Data = orderDetailsViewModel, Message = "Success" });
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest("Event not found");
            }
            
        }

        [HttpPost]
        [Route("api/payment/CreateEventCheckoutSession")]
        public async Task<IHttpActionResult> EventCheckoutSession(ApiOrderModel model)
        {
            string UserId = User.Identity.Name;
            string OrderNo = model.ORDER_NO;

            AddUpdateDelete EventData = await publicUserService.GetSingleEventDetails(model.Id);

            EventData.Data.Add("OrderNo", OrderNo);
            EventData.Data.Add("OrderType", "SLOT1");

            var EventDataFinal = new Dictionary<string, object>();

            List<string> KeyList = new List<string>()
            {
                "OrderNo", "COMPANY_CODE", "CALENDAR_CODE", "fees_1", "end", "formGroupKey", "resources", "activities", "Id", "start", "OrderType"
            };

            foreach (var key in EventData.Data.Keys)
            {
                if (KeyList.Contains(key))
                    EventDataFinal.Add(key, EventData.Data[key]);
            }

            try
            {
                var temp = JsonConvert.SerializeObject(EventDataFinal);

                Dictionary<string, string> metaData = new Dictionary<string, string>();

                metaData.Add("Data", temp.ToString());


                var options = new PaymentIntentCreateOptions
                {
                    Metadata = metaData,
                    Amount = Convert.ToInt32(EventData.Data["fees_1"]) * 100,
                    Currency = "hkd",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                };
                var service = new PaymentIntentService();
                PaymentIntent p_intent = service.Create(options);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = OrderNo,
                    PAYMENT_REQUEST_JSON = JsonConvert.SerializeObject(options),
                    REQUEST_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = ""
                };

                var resultTracker = await mobileAPIService.CreatePaymentTracker(tracker);

                return Ok(new AddUpdateDelete() { Status = true, Data = p_intent, Message = "Success" });
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/payment/EventSuccess")]
        public async Task<IHttpActionResult> EventSuccess(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new PaymentIntentService();
                var session = service.Get(SessionId);
                IDictionary<string, object> eventData;

                eventData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                var PackageData = (await publicUserService.GetSingleEventDetails(eventData["Id"]?.ToString())).Data;
                
                string query = $@"update ORDER_MASTER_1969 set PAYMENT_STATUS = '{session.Status}', PAYMENT_ID = '{session.Id}' where ORDER_NO = '{eventData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = eventData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var result = await mobileAPIService.CreatePaymentTracker(tracker);

                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["fees_1"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["fees_1"]),
                    PAID_DATE = DateTimeUtility.Now(),
                    METHOD = "Card",
                    PAYMENT_ID = eventData["OrderNo"].ToString(),
                    PLAN_ID = "0",
                    STATUS = session.Status,
                    CREDIT_EXPIRE_DATE = Convert.ToDateTime(eventData["end"]?.ToString()).ToString("yyyy-MM-dd HH:mm"),
                    USER_ID = User.Identity.Name
                };

                var resultPaymentHistory = await mobileAPIService.CreatePaymentHistory(paymentHistoryModel);

                LedgerModel ledgerModel = new LedgerModel()
                {
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CREDIT_COIN = Convert.ToDouble(PackageData["fees_1"]),
                    DEBIT_COIN = 0,
                    ORDER_NO = tracker.ORDER_NO,
                    USER_ID = User.Identity.Name,
                    TRANSACTION_TYPE = "Purchase"
                };

                var resultLedger = await mobileAPIService.CreateLedgerEntry(ledgerModel);

                var EnrollResult = await publicUserService.EnrollPublicUserForCalendar(new DTO.UserAdminModels.CalendarEnrollModel()
                {
                    ACTIVITY_NAME = "",
                    RESOURCE_NAME = "",
                    USER_EMAIL = UserIdentity.UserEmail,
                    FormGroupKey = PackageData["formGroupKey"].ToString(),
                    USER_ID = UserIdentity.UserName,
                    participant = new DTO.PublicModels.CalendarParticipantModel()
                    {
                        COMPANY_CODE = paymentHistoryModel.COMPANY_CODE,
                        CALENDAR_CODE = paymentHistoryModel.CALENDAR_CODE,
                        DESCRIPTION = ""
                    },
                    transaction = new DTO.PublicModels.TransactionMasterModel()
                    {
                        TRAN_USER_ID = UserIdentity.UserName,
                        SLOT = PackageData["Id"].ToString(),
                        RESOURCE = PackageData["resources"].ToString(),
                        ACTIVITY = PackageData["activities"].ToString(),
                        STUDENT = "",
                        REMARKS = "",
                        FEES = "",
                        ATTENDANCE = "NOT-MARKED",
                        COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                        CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString()
                    }
                }, false, tracker.ORDER_NO);

                string PaymentId = eventData["OrderNo"].ToString();

                return Ok(new AddUpdateDelete() { Status = true, Data = PaymentId, Message = "Payment successfull!" });
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("api/payment/EventCancel")]
        public async Task<IHttpActionResult> EventCancel(string SessionId)
        {
            if (SessionId != null)
            {
                var service = new PaymentIntentService();
                var session = service.Get(SessionId);
                var PackageData = JsonConvert.DeserializeObject<IDictionary<string, object>>(session.Metadata["Data"]);

                string query = $@"update ORDER_MASTER_1969 set PAYMENT_STATUS = '{session.Status}',PAYMENT_ID = '{session.Id}' where ORDER_NO = '{PackageData["OrderNo"].ToString()}' ";
                var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                PaymentTrackerModel tracker = new PaymentTrackerModel()
                {
                    ORDER_NO = PackageData["OrderNo"].ToString(),
                    PAYMENT_REQUEST_JSON = "",
                    RESPONSE_TIME = DateTimeUtility.Now(),
                    PAYMENT_RESPONSE_JSON = session.StripeResponse.Content
                };

                var data = await mobileAPIService.CreatePaymentTracker(tracker);

                PaymentHistoryModel paymentHistoryModel = new PaymentHistoryModel()
                {
                    B_COIN_PURCHASE = Convert.ToDouble(PackageData["fees_1"]),
                    CALENDAR_CODE = PackageData["CALENDAR_CODE"].ToString(),
                    COMPANY_CODE = PackageData["COMPANY_CODE"].ToString(),
                    CLIENT_PAID_HKD = Convert.ToDouble(PackageData["fees_1"]),
                    PAID_DATE = DateTimeUtility.Now(),
                    METHOD = "Card",
                    PAYMENT_ID = PackageData["OrderNo"].ToString(),
                    PLAN_ID = "0",
                    STATUS = session.Status,
                    CREDIT_EXPIRE_DATE = DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm"),
                    USER_ID = User.Identity.Name
                };

                var resultPaymentHistory = await mobileAPIService.CreatePaymentHistory(paymentHistoryModel);

                string PaymentId = PackageData["OrderNo"].ToString();

                return Ok(new AddUpdateDelete() { Status = true, Data = PaymentId, Message = "Payment cancelled!" });
            }
            else
            {
                return BadRequest();
            }
        }

        #endregion
    }
}
