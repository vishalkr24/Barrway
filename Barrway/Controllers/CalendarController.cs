using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using QRCoder;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Mvc;
using static QRCoder.PayloadGenerator;

namespace Barrway.Controllers
{
    [BusinessAuthorize(Roles = "BUSINESS_USER,GENERAL_USER,SUPERADMIN_USER")]
    public class CalendarController : BaseController
    {
        private readonly IMasterService masterService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ISqlFunction sqlFunction;
        private readonly IBusinessUserService businessUserService;
        private readonly IAuthService authService;
        private readonly IQueueService queueService;

        // GET: Calendar
        public CalendarController(IMasterService masterService, IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IBusinessUserService businessUserService, IAuthService authService, IQueueService queueService)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.businessUserService = businessUserService;
            this.authService = authService;
            this.queueService = queueService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EditIndex()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetLocationMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetServiceMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetStaffServiceMappingData(string CalendarCode)
        {
            try
            {
                var data = await businessUserService.GetStaffServiceMappingData(CalendarCode);

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateStaffServiceMapping(List<StaffServiceMappingModel> model)
        {
            try
            {
                var data = await businessUserService.UpdateStaffServiceMapping(model);

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetServiceProviderMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetServiceProviderMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetParticipantMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetParticipantMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetSchedularFormList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetSchedularFormList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetTransactionMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetTransactionMasterList(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        public async Task<ActionResult> PaymentReceipt(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                var paymentReceiptData = await masterService.GetPaymentReceiptData(Id.ToString());

                PaymentReceiptViewModel data = new PaymentReceiptViewModel();

                data = paymentReceiptData.Data;

                return new ViewAsPdf("PaymentReceipt", data);
            }
            else
            {
                return RedirectToAction("Dashboard", "BusinessAdmin");
            }

        }

        [HttpPost]
        public async Task<ActionResult> GetClientPaymentHistory(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            var locationListData = await masterService.GetClientPaymentHistory(data, companyCode, calendarCode);
            var locationList = locationListData.Data;
            double last_page = 0;
            if (locationList != null && locationList.Count() > 0)
            {
                var singData = locationList.FirstOrDefault();
                var total_records = Convert.ToInt32(singData.Where(x => x.Key == "total_records").FirstOrDefault().Value);
                var size = Convert.ToInt32(singData.Where(x => x.Key == "size").FirstOrDefault().Value);
                double paging = (double)total_records / size;
                last_page = Math.Floor(paging) + 1;
            }

            return Json(new { data = locationList, last_page });
        }

        [HttpPost]
        public async Task<ActionResult> GetSingleTransactionMaster(string TransactionId)
        {
            var locationListData = await masterService.GetSingleTransactionMaster(TransactionId);
            var locationList = locationListData.Data;

            return Json(new { data = locationList });
        }

        [HttpPost]
        public async Task<ActionResult> GetSingleQueueDetails(string QueueId)
        {
            var queueData = await queueService.getSingleQueueDetails(QueueId);

            return Json(new { data = queueData.Data });
        }

        [HttpPost]
        public async Task<ActionResult> UpdateTransactionAttendance(string TransactionId, bool IsPresent = false)
        {
            var locationListData = await masterService.GetSingleTransactionMaster(TransactionId);
            var transactionData = locationListData.Data;

            var companies = await businessUserService.GetAllCompaniesByUserId(UserIdentity.UserID.ToString());

            var validCompanyCheck = false;

            for (int i = 0; i < companies.Data.Count; i++)
            {
                if (companies.Data[i]["COMPANY_CODE"].ToString() == transactionData[0]["COMPANY_CODE"].ToString())
                {
                    validCompanyCheck = true;
                    break;
                }
            }

            if (validCompanyCheck)
            {
                var result = await businessUserService.UpdateTransactionAttendance(TransactionId, IsPresent);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Not Found" }, JsonRequestBehavior.AllowGet);
            }



        }

        [HttpPost]
        public async Task<ActionResult> UpdateBulkTransactionAttendance(string AttendanceJsonString)
        {
            List<BulkAttendanceModel> AttendanceData = JsonConvert.DeserializeObject<List<BulkAttendanceModel>>(AttendanceJsonString);

            var result = await businessUserService.UpdateTransactionAttendance(AttendanceData, UserIdentity.UserID.ToString());

            return Json(result, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// It will generate a QR of attendee booking for company to scan it
        /// </summary>
        /// <param name="TransactionId"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult> GenerateEventQR(string EventId)
        {
            QRCodeModel model = new QRCodeModel();
            string Url = ConfigurationManager.AppSettings["baseurl"] + "Public/MarkPresent?EventId=" + EventId;
            Payload payload = new Url(Url);

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeAsBitmap = qrCode.GetGraphic(20);

            string base64String = Convert.ToBase64String(BitmapToByteArray(qrCodeAsBitmap));
            
            
            string path = "";
            string fileName = "";

            string folderPath = Server.MapPath("~/QRCodes/Events/" + EventId);
            fileName = "EventQR.png";
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            else
            {
                Directory.Delete(folderPath, true);
                Directory.CreateDirectory(folderPath);
            }

            path = "~/QRCodes/Events/" + EventId + "/" + fileName;
            model.QRImageURL = path;

            byte[] bytes = Convert.FromBase64String(base64String);

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }

            image.Save(Server.MapPath(path));

            return Json(new AddUpdateDelete() { Status = true, Data = model }, JsonRequestBehavior.AllowGet);
        }

        private byte[] BitmapToByteArray(Bitmap bitmap)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                bitmap.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddLocationMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string LocationCode = "LC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[LOCATION_MASTER_1936]
                                   SET [LOCATION_CODE] = '{LocationCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddMasterData(List<IDictionary<string, string>> data, string ModelId = null)
        {
            if (!string.IsNullOrEmpty(ModelId))
            {
                if (Convert.ToInt32(ModelId) == 1)
                {
                    try
                    {
                        var dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "true").ToList();

                        if (dataSerialized.Count > 0)
                        {
                            List<string> requestList = new List<string>();
                            List<string> formGroupKeyListTemp = new List<string>();

                            dataSerialized.ForEach(assign =>
                            {
                                Dictionary<string, object> sd = new Dictionary<string, object>();
                                foreach (KeyValuePair<string, string> keyValuePair in assign)
                                {
                                    if (keyValuePair.Key != "Is_New" && keyValuePair.Key != "Id")
                                    {
                                        sd.Add(keyValuePair.Key, keyValuePair.Value.ToString());
                                    }

                                }

                                requestList.Add(CustomMethods.ConvertDicToNameValuePair(sd));
                                formGroupKeyListTemp.Add(Guid.NewGuid().ToString());
                            });

                            Form_DataTable request = new Form_DataTable();
                            request.action = (int)FormAction.Save;
                            request.formId = (int)FormSetting.LOCATION_MASTER;
                            request.IsMaxOneRecordPerUser = false;
                            request.formfieldDataListTempList = requestList.ToArray();
                            request.formGroupKeyListTemp = formGroupKeyListTemp.ToArray();
                            var formResult = (await formAPIRepository.BulkGeneratedFormData(request)).Data;

                            string query = $@"update LOCATION_MASTER_1936 set LOCATION_CODE = (SELECT FORMAT(CONVERT(INT,Id), 'LC00000')) where LOCATION_CODE is null";
                            var sqlResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (data.Where(x => x["Is_New"]?.ToString() == "false").Count() > 0)
                        {
                            string query = "";

                            dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "false").ToList();

                            //locMasMod = JsonConvert.DeserializeObject<List<CalendarLocationMasterModel>>(dataSerialized);

                            dataSerialized.ForEach(x =>
                            {

                                List<string> columns = new List<string>();

                                foreach (var key in x.Keys.Where(y => y != "Is_New" && y != "Id" && y != "COMPANY_CODE" && y != "CALENDAR_CODE"))
                                {
                                    columns.Add($@"{key?.ToString()} = '{x[key]}'");
                                }

                                string combine = string.Join(",", columns);

                                query += $@"update LOCATION_MASTER_1936 set {combine} where Id = '{x["Id"]}';
                                            ";
                            });

                            var result = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }
                        return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {

                    }
                    return Json(new AddUpdateDelete() { Status = false, Message = "Something went wrong" }, JsonRequestBehavior.AllowGet);
                }
                else if (Convert.ToInt32(ModelId) == 2)
                {
                    try
                    {
                        var dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "true").ToList();

                        //List<CalendarServiceProviderMasterModel> locMasMod = JsonConvert.DeserializeObject<List<CalendarServiceProviderMasterModel>>(dataSerialized);
                        if (dataSerialized.Count > 0)
                        {
                            List<string> requestList = new List<string>();
                            List<string> formGroupKeyListTemp = new List<string>();

                            dataSerialized.ForEach(assign =>
                            {
                                Dictionary<string, object> sd = new Dictionary<string, object>();
                                foreach (KeyValuePair<string, string> keyValuePair in assign)
                                {
                                    if (keyValuePair.Key != "Is_New" && keyValuePair.Key != "Id")
                                    {
                                        sd.Add(keyValuePair.Key, keyValuePair.Value.ToString());
                                    }

                                }

                                requestList.Add(CustomMethods.ConvertDicToNameValuePair(sd));
                                formGroupKeyListTemp.Add(Guid.NewGuid().ToString());
                            });

                            Form_DataTable request = new Form_DataTable();
                            request.action = (int)FormAction.Save;
                            request.formId = (int)FormSetting.SERVICE_PROVIDER_MASTER;
                            request.IsMaxOneRecordPerUser = false;
                            request.formfieldDataListTempList = requestList.ToArray();
                            request.formGroupKeyListTemp = formGroupKeyListTemp.ToArray();
                            var formResult = (await formAPIRepository.BulkGeneratedFormData(request)).Data;

                            string query = $@"update SERVICE_PROVIDER_MASTER_1934 set RESOURCE_CODE = (SELECT FORMAT(CONVERT(INT,Id), 'RC00000')) where RESOURCE_CODE is null";
                            var sqlResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (data.Where(x => x["Is_New"]?.ToString() == "false").Count() > 0)
                        {
                            string query = "";

                            dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "false").ToList();

                            //locMasMod = JsonConvert.DeserializeObject<List<CalendarServiceProviderMasterModel>>(dataSerialized);

                            dataSerialized.ForEach(x =>
                            {

                                List<string> columns = new List<string>();

                                foreach (var key in x.Keys.Where(y => y != "Is_New" && y != "Id" && y != "COMPANY_CODE" && y != "CALENDAR_CODE"))
                                {
                                    columns.Add($@"{key?.ToString()} = '{x[key]}'");
                                }

                                string combine = string.Join(",", columns);

                                query += $@"update SERVICE_PROVIDER_MASTER_1934 set {combine} where Id = '{x["Id"]}';
                                            ";
                            });

                            //locMasMod.ForEach(x =>
                            //{
                            //    query += $@"update SERVICE_PROVIDER_MASTER_1934 set FIRST_NAME = '{x.FIRST_NAME.Replace("'", "''")}', LAST_NAME = '{x.LAST_NAME.Replace("'", "''")}' where Id = '{x.Id}';
                            //                ";
                            //});

                            var result = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }
                        return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {

                    }
                    return Json(new AddUpdateDelete() { Status = false, Message = "Something went wrong" }, JsonRequestBehavior.AllowGet);
                }
                else if (Convert.ToInt32(ModelId) == 3)
                {
                    try
                    {

                        var dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "true").ToList();

                        //List<CalendarServiceProviderMasterModel> locMasMod = JsonConvert.DeserializeObject<List<CalendarServiceProviderMasterModel>>(dataSerialized);
                        if (dataSerialized.Count > 0)
                        {
                            List<string> requestList = new List<string>();
                            List<string> formGroupKeyListTemp = new List<string>();

                            dataSerialized.ForEach(assign =>
                            {
                                Dictionary<string, object> sd = new Dictionary<string, object>();
                                foreach (KeyValuePair<string, string> keyValuePair in assign)
                                {
                                    if (keyValuePair.Key != "Is_New" && keyValuePair.Key != "Id")
                                    {
                                        sd.Add(keyValuePair.Key, keyValuePair.Value.ToString());
                                    }

                                }

                                requestList.Add(CustomMethods.ConvertDicToNameValuePair(sd));
                                formGroupKeyListTemp.Add(Guid.NewGuid().ToString());
                            });

                            Form_DataTable request = new Form_DataTable();
                            request.action = (int)FormAction.Save;
                            request.formId = (int)FormSetting.SERVICE_MASTER;
                            request.IsMaxOneRecordPerUser = false;
                            request.formfieldDataListTempList = requestList.ToArray();
                            request.formGroupKeyListTemp = formGroupKeyListTemp.ToArray();
                            var formResult = (await formAPIRepository.BulkGeneratedFormData(request)).Data;

                            string query = $@"update SERVICE_MASTER_1933 set ACTIVITY_CODE = (SELECT FORMAT(CONVERT(INT,Id), 'AC00000')) where ACTIVITY_CODE is null";
                            var sqlResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (data.Where(x => x["Is_New"]?.ToString() == "false").Count() > 0)
                        {
                            string query = "";

                            dataSerialized = data.Where(x => x["Is_New"]?.ToString() == "false").ToList();

                            //locMasMod = JsonConvert.DeserializeObject<List<CalendarServiceProviderMasterModel>>(dataSerialized);

                            dataSerialized.ForEach(x =>
                            {

                                List<string> columns = new List<string>();

                                foreach (var key in x.Keys.Where(y => y != "Is_New" && y != "Id" && y != "COMPANY_CODE" && y != "CALENDAR_CODE"))
                                {
                                    columns.Add($@"{key?.ToString()} = '{x[key]}'");
                                }

                                string combine = string.Join(",", columns);

                                query += $@"update SERVICE_MASTER_1933 set {combine} where Id = '{x["Id"]}';
                                            ";
                            });

                            var result = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }
                        return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {

                    }
                    return Json(new AddUpdateDelete() { Status = false, Message = "Something went wrong" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Something went wrong" }, JsonRequestBehavior.AllowGet);
                }

            }
            else
            {
                return Json(new AddUpdateDelete() { Status = false, Message = "Model Id not Found." }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddServiceMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ActivityCode = "AC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[SERVICE_MASTER_1933]
                                   SET [ACTIVITY_CODE] = '{ActivityCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddServiceProviderMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ResourceCode = "RC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[SERVICE_PROVIDER_MASTER_1934]
                                   SET [RESOURCE_CODE] = '{ResourceCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddParticipantMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (data.action == (int)FormAction.Save && result.res == 1)
            {
                string ResourceCode = "PC" + result.Id.ToString().PadLeft(5, '0');

                string query = $@"UPDATE [dbo].[PARTICIPANT_MASTER_1940]
                                   SET [PARTICIPANT_CODE] = '{ResourceCode}'
                                 WHERE Id = '{result.Id.ToString()}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddSchedularForm(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> AddTransactionMaster(Form_DataTable data)
        {
            var result = (await formAPIRepository.GeneratedFormData(data)).Data;

            return Json(result);
        }

        [HttpPost]
        public async Task<ActionResult> GetSchedule(string ScheduleId)
        {
            var schedularData = await businessUserService.GetSchedule(ScheduleId, User.Identity.Name);

            return Json(new { data = schedularData.Data });
        }

        [HttpPost]
        public async Task<ActionResult> GetScheduleByCalendar(string CompanyCode, string CalendarCode)
        {
            var schedularData = await businessUserService.GetSchedule(CompanyCode, CalendarCode, User.Identity.Name);

            return Json(schedularData);
        }

        [HttpPost]
        public async Task<ActionResult> AddQueueSession(Dictionary<string, List<Dictionary<string, string>>> data, string ScheduleId)
        {
            try
            {
                List<QueueMasterModel> queues = new List<QueueMasterModel>();
                List<SessionMasterModel> sessions = new List<SessionMasterModel>();

                if (data.ContainsKey("QueueList"))
                {
                    queues = JsonConvert.DeserializeObject<List<QueueMasterModel>>(JsonConvert.SerializeObject(data["QueueList"]));
                }

                if (data.ContainsKey("SessionList"))
                {
                    sessions = JsonConvert.DeserializeObject<List<SessionMasterModel>>(JsonConvert.SerializeObject(data["SessionList"]));

                    sessions.ForEach(session =>
                    {
                        if (queues.FirstOrDefault().QUEUE_TYPE == "RESTAURANT")
                        {
                            session.SESSION_START_TIME = DateTime.Now.ToString("dd-MM-yyyy") + " " + session.SESSION_START_TIME;
                            session.SESSION_END_TIME = DateTime.Now.ToString("dd-MM-yyyy") + " " + session.SESSION_END_TIME;
                        }
                        
                    });

                }

                if (queues.Count > 0 || sessions.Where(x => string.IsNullOrEmpty(x.Id)).ToList().Count > 0)
                {
                    var result = await businessUserService.AddQueueSession(queues, sessions.Where(x => string.IsNullOrEmpty(x.Id)).ToList(), ScheduleId);
                }

                if (queues.Where(x => !string.IsNullOrEmpty(x.Id)).ToList().Count > 0)
                {
                    var result = await businessUserService.UpdateQueueDetails(queues.Where(x => !string.IsNullOrEmpty(x.Id)).ToList());
                }

                if (sessions.Where(x => !string.IsNullOrEmpty(x.Id)).ToList().Count > 0)
                {
                    var result = await businessUserService.UpdateSessionDetails(sessions.Where(x => !string.IsNullOrEmpty(x.Id)).ToList());
                }

                return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.ToString(), JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetQueueAndSession(string CompanyCode, string CalendarCode)
        {
            try
            {
                var result = await businessUserService.GetQueueAndSession(CompanyCode, CalendarCode);

                return Json(result, JsonRequestBehavior.DenyGet);
            }
            catch (Exception ex)
            {
                return Json(ex.ToString(), JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddSchedule(List<SchedularFormModel> dataList)
        {
            try
            {
                for (int i = 0; i < dataList.Count; i++)
                {
                    SchedularFormModel data = dataList[i];

                    if (data.SCH_FROM_DATE.Contains("/"))
                    {
                        var startObject = data.SCH_FROM_DATE.ToString().Split('/');
                        data.SCH_FROM_DATE = Convert.ToDateTime(startObject[2] + "-" + startObject[1] + "-" + startObject[0]).ToString("yyyy-MM-dd");
                    }

                    if (data.SCH_TO_DATE.Contains("/"))
                    {
                        var endObject = data.SCH_TO_DATE.ToString().Split('/');
                        data.SCH_TO_DATE = Convert.ToDateTime(endObject[2] + "-" + endObject[1] + "-" + endObject[0]).ToString("yyyy-MM-dd");
                    }

                    // If the schedular is of queue type
                    if (data.SCHEDULAR_TYPE == "QUEUE_1" || data.SCHEDULAR_TYPE == "QUEUE_2")
                    {
                        // add or edit schedule
                        string formGroupKey = CustomMethods.CreateUUID();

                        var response = await businessUserService.AddSchedularForm(data, formGroupKey);

                        var executeResponse = await ExecuteSchedularForm((string.IsNullOrEmpty(data.Id)) ? response.Data.Id.ToString() : data.Id);

                        return executeResponse;
                    }
                    else
                    {
                        // add or edit schedule
                        var slotCheck = await businessUserService.CheckOverlapingSlots(data);

                        if (slotCheck.Status)
                        {
                            return Json(new AddUpdateDelete() { Status = false, Data = slotCheck, Message = "Slots Overlaping!" });
                        }

                        data.SCH_SCHEDULE_TABLE = JsonConvert.SerializeObject(data.table).ToString();
                        bool createNewSchedule = false;

                        if (!string.IsNullOrEmpty(data.Id))
                        {
                            // Edit Existing Schedule
                            if (Convert.ToInt32(data.Id) > 0)
                            {
                                string formGroupKey = CustomMethods.CreateUUID();
                                var response = await businessUserService.AddSchedularForm(data, formGroupKey);

                                return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                createNewSchedule = true;
                            }
                        }
                        else
                        {
                            // Create a new Schedule
                            createNewSchedule = true;
                        }

                        if (createNewSchedule)
                        {
                            var calendarCountCheckData = await businessUserService.GetSessionsForThisMonth(data.COMPANY_CODE, data.CALENDAR_CODE);
                            var package = await businessUserService.GetCompanyActiveSubscriptionDetails(data.COMPANY_CODE, true);

                            if (!calendarCountCheckData.Status)
                            {
                                return Json(calendarCountCheckData);
                            }
                            else
                            {
                                DateTime PackageValidity = Convert.ToDateTime(calendarCountCheckData.Data["VALID_TILL"]?.ToString());

                                if (PackageValidity < Convert.ToDateTime(data.SCH_TO_DATE))
                                {
                                    data.SCH_TO_DATE = PackageValidity.ToString("yyyy-MM-dd");
                                }

                                if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) == 0)
                                {
                                    return Json(new AddUpdateDelete() { Status = false, Message = "You have reached maximum limit of creating sessions for this month. Upgrade you plan to create more sessions." });
                                }
                            }

                            string formGroupKey = CustomMethods.CreateUUID();

                            var response = await businessUserService.AddSchedularForm(data, formGroupKey);

                            var executeResponse = await ExecuteSchedularForm(response.Data.Id.ToString(), response.Data.formGroupKey.ToString());

                            return executeResponse;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(ex.ToString(), JsonRequestBehavior.DenyGet);
            }

            return Json("Failed", JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public async Task<ActionResult> ExecuteSchedularForm(string Id, string formGroupKey = null)
        {
            try
            {
                var schedule = await businessUserService.GetSchedule(Id, User.Identity.Name);

                if (schedule.Status)
                {
                    if (schedule.Data != null)
                    {
                        var rawData = (schedule.Data as List<IDictionary<string, object>>).FirstOrDefault();

                        SchedularFormModel data = JsonConvert.DeserializeObject<SchedularFormModel>(JsonConvert.SerializeObject(rawData));

                        if (data.SCHEDULAR_TYPE == "QUEUE_1")
                        {
                            var queueData = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, string>>>>(data.SCH_SCHEDULE_TABLE?.ToString());

                            Dictionary<string, List<Dictionary<string, string>>> finalData = new Dictionary<string, List<Dictionary<string, string>>>();

                            finalData.Add("QueueList", queueData["QueueList"]);
                            finalData.Add("SessionList", queueData["SessionList"]);
                            var QueueSessionResult = await AddQueueSession(finalData, Id);

                            return QueueSessionResult;
                        }
                        else if (data.SCHEDULAR_TYPE == "QUEUE_2")
                        {
                            var queueDataRaw = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(data.SCH_SCHEDULE_TABLE?.ToString());

                            List<QueueMasterModel> queueDataTemp = new List<QueueMasterModel>();

                            queueDataTemp = JsonConvert.DeserializeObject<List<QueueMasterModel>>(JsonConvert.SerializeObject(queueDataRaw["QueueList"]));

                            var sessionRaw = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, string>>>>(JsonConvert.SerializeObject(queueDataRaw["SessionList"]));

                            List<Dictionary<string, string>> sessionList = new List<Dictionary<string, string>>();
                            List<SessionMasterModel> sessionListModel = new List<SessionMasterModel>();

                            string script = "";
                            int eventCounter = 0;
                            bool caseBreak = false;

                            var start = Convert.ToDateTime(data.SCH_FROM_DATE);

                            var end = Convert.ToDateTime(data.SCH_TO_DATE);

                            DateTime dateTracker = start;
                            int slotCounter = 1;

                            while (dateTracker <= end)
                            {
                                

                                string SchedularFormId = Id;
                                DateTime SlotStartTime = DateTime.Now;
                                DateTime SlotEndTime = DateTime.Now;
                                
                                List<CommonTimeObject> dictionaryDataList = JsonConvert.DeserializeObject<List<CommonTimeObject>>(JsonConvert.SerializeObject(sessionRaw[dateTracker.DayOfWeek.ToString().Substring(0, 3)]));

                                foreach (var x in dictionaryDataList)
                                {
                                    if (string.IsNullOrEmpty(x.start) || string.IsNullOrEmpty(x.end))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + x.start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + x.end.ToString());
                                    }

                                    try
                                    {
                                        eventCounter++;
                                        sessionListModel.Add(new SessionMasterModel()
                                        {
                                            CALENDAR_CODE = data.CALENDAR_CODE,
                                            COMPANY_CODE = data.COMPANY_CODE,
                                            SESSION_NAME = "",
                                            SESSION_START_TIME = SlotStartTime.ToString("dd-MM-yyyy HH:mm"),
                                            SESSION_END_TIME = SlotEndTime.ToString("dd-MM-yyyy HH:mm"),
                                            QUEUE_OPEN_TIME = SlotStartTime.AddMinutes(-5).ToString("HH:mm"),
                                            SESSION_TYPE = "COUNTER",
                                            TICKETING_TYPE = "Auto"
                                        });
                                    }
                                    catch (Exception ex)
                                    {

                                    }


                                }

                                if (data.SCH_ALTERNATIVE_WEEK == "ALTERNATE-WEEK")
                                {
                                    var weekNum = ((int)dateTracker.DayOfWeek);

                                    if (weekNum % 2 == 0)
                                    {
                                        dateTracker = dateTracker.AddDays(7);
                                        continue;
                                    }
                                }
                                else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-3-WEEK")
                                {
                                    var weekNum = GetWeekNumberOfMonth(start);
                                    if (weekNum > 3)
                                    {
                                        dateTracker = dateTracker.AddDays((7 * 3));
                                        continue;
                                    }
                                }
                                else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-4-WEEK")
                                {
                                    var weekNum = GetWeekNumberOfMonth(start.AddDays(1));
                                    if (weekNum > 4)
                                    {
                                        dateTracker = dateTracker.AddDays((7 * 4));
                                        continue;
                                    }
                                }

                                dateTracker = dateTracker.AddDays(1);
                            }


                            if (sessionListModel.Count > 0)
                            {
                                Dictionary<string, List<Dictionary<string, string>>> finalData = new Dictionary<string, List<Dictionary<string, string>>>();

                                finalData.Add("QueueList", JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(JsonConvert.SerializeObject(queueDataTemp)));
                                finalData.Add("SessionList", JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(JsonConvert.SerializeObject(sessionListModel)));

                                var QueueSessionResult = await AddQueueSession(finalData, Id);

                                return QueueSessionResult;
                            }
                            else
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "No Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                            }

                        }
                        else
                        {
                            var calendarCountCheckData = await businessUserService.GetSessionsForThisMonth(data.COMPANY_CODE, data.CALENDAR_CODE);
                            var package = await businessUserService.GetCompanyActiveSubscriptionDetails(data.COMPANY_CODE, true);

                            string script = "";
                            int eventCounter = 0;
                            bool caseBreak = false;

                            var start = Convert.ToDateTime(data.SCH_FROM_DATE);

                            var end = Convert.ToDateTime(data.SCH_TO_DATE);

                            DateTime dateTracker = start;
                            int slotCounter = 1;

                            while (dateTracker <= end)
                            {
                                
                                if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) < eventCounter)
                                {
                                    caseBreak = true;
                                    break;
                                }

                                string SchedularFormId = Id;
                                DateTime SlotStartTime = DateTime.Now;
                                DateTime SlotEndTime = DateTime.Now;

                                var dictionaryDataList = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, string>>>>(data.SCH_SCHEDULE_TABLE);

                                foreach (var x in JsonConvert.DeserializeObject<List<CommonTimeObject>>(JsonConvert.SerializeObject(dictionaryDataList[dateTracker.DayOfWeek.ToString().Substring(0, 3)])))
                                {
                                    if (string.IsNullOrEmpty(x.start) || string.IsNullOrEmpty(x.end))
                                    {
                                        // if time is not mentioned then skip that day
                                        dateTracker = dateTracker.AddDays(1);
                                        continue;
                                    }
                                    else
                                    {
                                        SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + x.start.ToString());
                                        SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + x.end.ToString());
                                    }

                                    CalendarFormModel eventData = new CalendarFormModel()
                                    {
                                        end = SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                        resources = data.SCH_RESOURCE,
                                        activities = data.SCH_ACTIVITY,
                                        start = SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                        title = "Slot " + slotCounter++
                                    };
                                    formGroupKey = Guid.NewGuid().ToString();
                                    string referenceResourceEntry = "";

                                    if (!string.IsNullOrEmpty(data.SCH_RESOURCE))
                                    {
                                        referenceResourceEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{data.SCH_RESOURCE}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_RESOURCE}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                    }

                                    string referenceActivityEntry = "";

                                    if (!string.IsNullOrEmpty(data.SCH_ACTIVITY) && data.SCH_ACTIVITY != "-1")
                                    {
                                        referenceActivityEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{data.SCH_ACTIVITY}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_ACTIVITY}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                    }



                                    eventCounter++;
                                    script += $@"insert into CALENDAR_FORM_1935(
                                                               [SCHEDULAR_FORM_ID]
                                                              ,[formGroupKey]
                                                              ,[formID]
                                                              ,[userID]
                                                              ,[Current_Status]
                                                              ,[cycle]
                                                              ,[MasterFormID]
                                                              ,[MasterFormRow]
                                                              ,[formRecordOrder]
                                                              ,[formRecordStatus]
                                                              ,[COMPANY_CODE]
                                                              ,[CALENDAR_CODE]
                                                              ,[title]
                                                              ,[start]
                                                              ,[end]
                                                              ,[allDay]
                                                              ,[resources]
                                                              ,[activities]
                                                              ,[COMPANY_SUBSCRIPTION_ID]
                                                              ,[description]
                                                              ,[created_at], [updated_at],[EVENT_TYPE])
	                                                          values('{SchedularFormId}', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{data.COMPANY_CODE}', '{data.CALENDAR_CODE}', 'Slot {slotCounter}', '{SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{data.SCH_RESOURCE}', '{data.SCH_ACTIVITY}', '{package.Data["SUBS_ID"]?.ToString()}', '{data.SCH_DESCRIPTION}', getDate(), getDate(),'SCHEDULE');

                                                            {referenceResourceEntry}                                                                    

                                                            {referenceActivityEntry}
                                                            
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{data.SCH_LOCATION}', 'LOCATION_MASTER_1936', 'LOCATION_ADDRESS', {(int)FormSetting.CALENDAR_FORM}, '{data.SCH_LOCATION}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";

                                }

                                if (data.SCH_ALTERNATIVE_WEEK == "ALTERNATE-WEEK")
                                {
                                    var weekNum = ((int)dateTracker.DayOfWeek);

                                    if (weekNum % 2 == 0)
                                    {
                                        dateTracker = dateTracker.AddDays(7);
                                        continue;
                                    }
                                }
                                else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-3-WEEK")
                                {
                                    var weekNum = GetWeekNumberOfMonth(start);
                                    if (weekNum > 3)
                                    {
                                        dateTracker = dateTracker.AddDays((7 * 3));
                                        continue;
                                    }
                                }
                                else if (data.SCH_ALTERNATIVE_WEEK == "EVERY-4-WEEK")
                                {
                                    var weekNum = GetWeekNumberOfMonth(start.AddDays(1));
                                    if (weekNum > 4)
                                    {
                                        dateTracker = dateTracker.AddDays((7 * 4));
                                        continue;
                                    }
                                }

                                dateTracker = dateTracker.AddDays(1);
                            }


                            if (!string.IsNullOrEmpty(script))
                            {
                                var count = await sqlFunction.ExecuteSqlCommandQuery(script);

                                if (count > 0)
                                {
                                    if (caseBreak)
                                    {
                                        if (eventCounter == 0)
                                        {
                                            return Json(new AddUpdateDelete() { Status = false, Message = "No Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                                        }
                                        else
                                        {
                                            return Json(new AddUpdateDelete() { Status = false, Message = "Only " + eventCounter + " Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                                        }
                                    }
                                    else
                                    {
                                        return Json(new AddUpdateDelete() { Status = true, Message = "Success" }, JsonRequestBehavior.AllowGet);
                                    }
                                }
                            }
                            else
                            {
                                return Json(new AddUpdateDelete() { Status = false, Message = "No Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
                            }
                        }

                    }

                }

                return Json(new AddUpdateDelete() { Status = true, Message = "Success" });
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() });
            }

        }

        private int GetWeekNumberOfMonth(DateTime date)
        {
            date = date.Date;
            DateTime firstMonthDay = new DateTime(date.Year, date.Month, 1);
            DateTime firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
            if (firstMonthMonday > date)
            {
                firstMonthDay = firstMonthDay.AddMonths(-1);
                firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
            }
            return (date - firstMonthMonday).Days / 7 + 1;
        }

        public async Task<ActionResult> GetCalendarUpcomingBookingsData(GenerateDynamicFormData data, string CompanyCode, string CalendarCode)
        {
            try
            {
                var transactionData = await businessUserService.GetCalendarUpcomingBookings(data, CompanyCode, CalendarCode);
                var transactionList = transactionData.Data;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    last_page = Math.Floor(paging) + 1;
                }

                return Json(new { data = transactionList, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}