using Barrway.DTO.FormAPI;
using Barrway.Service.IRepository;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.Repository
{
    public class CommonService:ICommonService
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IPublicUserService publicUserService;
        private readonly IBusinessUserService businessUserService;

        public CommonService(ISqlFunction sqlFunction,IPublicUserService publicUserService,IBusinessUserService businessUserService)
        {
            this.sqlFunction = sqlFunction;
            this.publicUserService = publicUserService;
            this.businessUserService = businessUserService;
        }

        public async Task ModifyEventsData(Form_DataTable data, ReferalFormDataResponseModel result,string userName)
        {
            if (data.IsPublicUser)
            {
                var enrolledData = await publicUserService.GetAllEnrolledCalendarsData(data.COMPANY_CODE, userName, "", data.IsCustomInFilter);

                if (enrolledData.Status)
                {

                    var enrolledEvents = enrolledData.Data as List<IDictionary<string, object>>;
                    var enrolled_Ids = enrolledEvents.Select(x => x["Id"].ToString()).ToList();
                    result.events = result.events.Where(x => enrolled_Ids.Contains(x["Id"].ToString())).ToList();
                    result.events.ForEach(x =>
                    {
                        x.Add("CALENDAR_NAME", enrolledEvents.FirstOrDefault(y => y["Id"].ToString() == x["Id"].ToString())["CALENDAR_NAME"]?.ToString());
                        x.Add("COMPANY_NAME_ENGLISH", enrolledEvents.FirstOrDefault(y => y["Id"].ToString() == x["Id"].ToString())["COMPANY_NAME_ENGLISH"]?.ToString());
                    });
                }
            }


            var alreadyEnrolledEvents = (await publicUserService.GetAlreadyEnrolledEvents(data.COMPANY_CODE, userName, data.filter.value)).Data as List<IDictionary<string, object>>;
            if (alreadyEnrolledEvents != null)
            {
                if (result != null)
                {
                    foreach (var item in result.events)
                    {
                        if (alreadyEnrolledEvents.Count > 0)
                        {
                            if (alreadyEnrolledEvents.Any(x => x["Id"]?.ToString() == item["Id"]?.ToString()))
                            {
                                item.Add("IsAlreadyBooked", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsAlreadyBooked"]);
                                item.Add("OverlapBookingFlag", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["OverlapBookingFlag"]);
                                item.Add("ATTEND", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["ATTEND"]);
                                item.Add("IsReviewable", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["IsReviewable"]);
                                item.Add("TransactionId", alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["TransactionId"]);
                            }
                            else
                            {
                                item.Add("IsAlreadyBooked", 'N');
                                item.Add("OverlapBookingFlag", 'Y');
                                item.Add("IsReviewable", 'N');
                                item.Add("ATTEND", 'N');
                                item.Add("TransactionId", '0');
                            }
                        }
                        else
                        {
                            item.Add("IsAlreadyBooked", 'N');
                            item.Add("OverlapBookingFlag", 'Y');
                            item.Add("IsReviewable", 'N');
                            item.Add("ATTEND", 'N');
                            item.Add("TransactionId", '0');
                        }
                    }
                }
            }

            if (result != null)
            {
                if (result.events != null && result.events.Count() > 0)
                {
                    result.events.ForEach(e =>
                    {
                        if (e.ContainsKey("start") && e["start"] != null)
                        {
                            e["start"] = Convert.ToDateTime(e["start"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("end") && e["end"] != null)
                        {
                            e["end"] = Convert.ToDateTime(e["end"]).ToString("yyyy-MM-ddTHH:mm:ss");
                        }
                        if (e.ContainsKey("title") && e["title"] != null)
                        {
                            e["title"] = "";
                        }
                    });
                }
            }

            if (!data.IsPublicUser)
            {
                var calendarDetailsResult = await businessUserService.GetCalendarDetails(data.CALENDAR_CODE);
                var service = await businessUserService.GetServiceList(data.CALENDAR_CODE, data.COMPANY_CODE);

                if (calendarDetailsResult.Status)
                {
                    var calendarDetails = calendarDetailsResult.Data as IDictionary<string, object>;
                    if (calendarDetails.ContainsKey("category") && calendarDetails["category"] != null)
                    {
                        var calendarCategory = calendarDetails["category"] as IDictionary<string, object>;
                        if (calendarCategory.ContainsKey("IS_SERVICE_TYPE"))
                        {
                            string is_service_type = calendarCategory["IS_SERVICE_TYPE"]?.ToString() ?? "";
                            if (is_service_type != "N")
                            {
                                if (result != null && result.events != null)
                                {
                                    result.events = result.events.Where(x => x.ContainsKey("EVENT_TYPE") && x["EVENT_TYPE"]?.ToString() != "BOOKING").ToList();
                                }
                            }
                        }
                    }

                    if (result.events != null && result.events.Count() > 0)
                    {
                        string needOnlinePaymentFlag = "N";

                        int days = 0;

                        if (service.Data != null)
                        {
                            var serviceData = service.Data as List<IDictionary<string, object>>;
                            try
                            {
                                if (serviceData.Any(x => x["Id"]?.ToString() == result.events[0]["activities"]?.ToString()))
                                {
                                    needOnlinePaymentFlag = serviceData.FirstOrDefault(x => x["Id"]?.ToString() == result.events[0]["activities"]?.ToString())["NEED_ONLINE_PAYMENT"]?.ToString();
                                }
                            }
                            catch (Exception ex)
                            {

                            }

                        }

                        if (!string.IsNullOrEmpty(calendarDetails["BOOKING_DEADLINE"]?.ToString()))
                        {
                            try
                            {
                                days = Convert.ToInt32(calendarDetails["BOOKING_DEADLINE"].ToString());
                            }
                            catch (Exception ex)
                            {

                            }
                        }


                        days = (days == 0) ? 0 : days + 1;

                        foreach (var evt in result.events)
                        {
                            DateTime deadline = Convert.ToDateTime(evt["start"].ToString());
                            if (days > 0)
                            {
                                deadline = deadline.AddDays((days * -1));
                                deadline = (new DateTime(deadline.Year, deadline.Month, deadline.Day, 23, 59, 0));
                            }

                            evt.Add("NEED_ONLINE_PAYMENT", needOnlinePaymentFlag);
                            evt.Add("BOOKING_DEADLINE", deadline.ToString("yyyy-MM-dd HH:mm"));
                        }
                    }

                }
            }
        }
    }
}
