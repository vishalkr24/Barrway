using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Models;
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
using System.Web.WebSockets;
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
        private readonly IPublicUserService publicUserService;
        private readonly ICalendarService calendarService;

        // GET: Calendar
        public CalendarController(IMasterService masterService, IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IBusinessUserService businessUserService, IAuthService authService, IQueueService queueService, IPublicUserService publicUserService, ICalendarService calendarService)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.businessUserService = businessUserService;
            this.authService = authService;
            this.queueService = queueService;
            this.publicUserService = publicUserService;
            this.calendarService = calendarService;
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

        [HttpGet]
        public async Task<ActionResult> GetSingleEventDetails(string EventId)
        {
            try
            {
                SessionReviewViewModel model = new SessionReviewViewModel();
                var result = await publicUserService.GetSingleEventDetails(EventId);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return View(new SessionReviewViewModel());
            }

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

            var eventDetails = (await publicUserService.GetSingleEventDetails(EventId)).Data as IDictionary<string, object>;

            QRCodeModel model = new QRCodeModel();
            string Url = ConfigurationManager.AppSettings["baseurl"] + "Public/MarkPresent?EventId=" + EventId;
            Payload payload = new Url(Url);

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeAsBitmap = qrCode.GetGraphic(20);

            string description = "";

            if (eventDetails != null)
            {
                description += "" + Convert.ToDateTime(eventDetails["start"]?.ToString()).ToString("dd-MM-yyyy (hh:mm tt)") + "\n";
                var FormIdSplit = eventDetails["customForms"].ToString().Split(',');

                // check and add service provider
                if (FormIdSplit.Contains("2304"))
                {
                    if (!string.IsNullOrEmpty(eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2304")]))
                    {
                        description += "" + eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2304")] + "\n";
                    }
                }

                // check and add service
                if (FormIdSplit.Contains("2303"))
                {
                    if (!string.IsNullOrEmpty(eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2303")]))
                    {
                        description += "" + eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2303")] + "\n";
                    }
                }


                // check and add location
                if (FormIdSplit.Contains("2306"))
                {
                    if (!string.IsNullOrEmpty(eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2306")]))
                    {
                        description += "" + eventDetails["customTitle"]?.ToString().Split(',')[Array.IndexOf(FormIdSplit, "2306")] + "\n";
                    }
                }

            }

            // create a image with qr code height + size of description
            Bitmap qrCodeAsBitmapWithDescription = new Bitmap(qrCodeAsBitmap.Width, qrCodeAsBitmap.Height + 40);

            // add qr code to new image created
            using (Graphics graphics = Graphics.FromImage(qrCodeAsBitmapWithDescription))
            {
                graphics.Clear(Color.White);
                graphics.DrawImage(qrCodeAsBitmap, new Point(0, 0));
            }

            // write description on the image 
            using (Graphics graphics = Graphics.FromImage(qrCodeAsBitmapWithDescription))
            {
                using (Font font = new Font("Arial", 15))
                {
                    float x = 80;
                    float y = qrCodeAsBitmap.Height - 60;

                    // Draw description text
                    graphics.DrawString(description, font, Brushes.Black, x, y);
                }

            }

            string base64String = Convert.ToBase64String(BitmapToByteArray(qrCodeAsBitmapWithDescription));


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

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now);
            Response.Cache.SetNoServerCaching();
            Response.Cache.SetNoStore();

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
                                    columns.Add($@"{key?.ToString()} = N'{SQLUtility.TreatSingleQuoteForQuery(x[key])}'");
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
                                    columns.Add($@"{key?.ToString()} = N'{SQLUtility.TreatSingleQuoteForQuery(x[key])}'");
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

                            string query = $@"update SERVICE_MASTER_1933 
                                              set ACTIVITY_CODE = (SELECT FORMAT(CONVERT(INT,Id), 'AC00000')),
                                              SERVICE_PAY_PER = (select SERVICE_CHARGE_BY from BUSINESS_CALENDAR_MASTER_1925 bcm where bcm.CALENDAR_CODE = SERVICE_MASTER_1933.CALENDAR_CODE)
                                              where ACTIVITY_CODE is null";
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
                                    columns.Add($@"{key?.ToString()} = N'{SQLUtility.TreatSingleQuoteForQuery(x[key])}'");
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
                            session.SESSION_START_TIME = DateTimeUtility.Now().ToString("dd-MM-yyyy") + " " + session.SESSION_START_TIME;
                            session.SESSION_END_TIME = DateTimeUtility.Now().ToString("dd-MM-yyyy") + " " + session.SESSION_END_TIME;
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

                            await businessUserService.updateSchedularCalendarOtherField(response.Data.Id, data);

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
        public async Task<ActionResult> DeleteSchedule(int ScheduleId)
        {
            try
            {
                var result = await businessUserService.DeleteSchedule(ScheduleId, true);

                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> CopyToNewSchedule(List<SchedularFormModel> dataList)
        {
            try
            {
                SchedularFormModel model = dataList.FirstOrDefault();

                if (!string.IsNullOrEmpty(model.Id))
                {
                    model.Id = null;
                    var result2 = await AddSchedule(new List<SchedularFormModel>() { model });
                    return result2;
                }
                else
                {
                    return Json(new AddUpdateDelete() { Status = false, Message = "Can not copy this schedule" });
                }
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> ExecuteSchedularForm(string Id, string formGroupKey = null)
        {
            try
            {
                var schedule = await businessUserService.GetSchedule(Id, User.Identity.Name);

                bool chopIntoSessions = false;

                if (schedule.Status)
                {
                    if (schedule.Data != null)
                    {
                        var rawData = (schedule.Data as List<IDictionary<string, object>>).FirstOrDefault();

                        var calendar = await businessUserService.GetCalendarDetails(rawData["CALENDAR_CODE"]?.ToString());

                        if (calendar.Data["CALENDAR_TYPE"]?.ToString() == "1" && calendar.Data["CALENDAR_CATEGORY_ID"]?.ToString() == "2")
                        {
                            chopIntoSessions = true;
                        }

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
                                DateTime SlotStartTime = DateTimeUtility.Now();
                                DateTime SlotEndTime = DateTimeUtility.Now();

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

                            List<IDictionary<string, object>> serviceListRaw = (await businessUserService.GetServiceList(data.CALENDAR_CODE, data.COMPANY_CODE)).Data;

                            var serviceData = serviceListRaw.FirstOrDefault(x => x["Id"]?.ToString() == data.SCH_ACTIVITY);
                            string IsCourseEvent = "N";

                            if (!string.IsNullOrEmpty(data.SCH_ACTIVITY) && data.SCH_ACTIVITY != "-1")
                            {
                                IsCourseEvent = ((!string.IsNullOrEmpty(serviceData["SERVICE_PAY_PER"]?.ToString()) && serviceData["SERVICE_PAY_PER"]?.ToString() == "COURSE") ? "Y" : "N");
                            }

                            string script = "";
                            int eventCounter = 0;
                            bool caseBreak = false;

                            var start = Convert.ToDateTime(data.SCH_FROM_DATE);

                            var end = Convert.ToDateTime(data.SCH_TO_DATE);

                            DateTime dateTracker = start;
                            int slotCounter = 1;

                            while (dateTracker <= end)
                            {
                                if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) <= eventCounter)
                                {
                                    caseBreak = true;
                                    break;
                                }

                                string SchedularFormId = Id;
                                DateTime SlotStartTime = DateTimeUtility.Now();
                                DateTime SlotEndTime = DateTimeUtility.Now();

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

                                    if (chopIntoSessions)
                                    {
                                        int ChopSlotCounter = 1;
                                        int Duration = Convert.ToInt32(rawData["DURATION_FIELD"]?.ToString());
                                        int RestPeriod = Convert.ToInt32(rawData["REST_PERIOD_BETWEEN_SESSION"]?.ToString());
                                        var tempStartTime = SlotStartTime;
                                        var tempEndTime = SlotStartTime.AddMinutes(Duration);
                                        while (tempEndTime <= SlotEndTime)
                                        {
                                            if (Convert.ToInt32(calendarCountCheckData.Data["AVAILABLE_SESSIONS"]?.ToString()) <= eventCounter)
                                            {
                                                caseBreak = true;
                                                break;
                                            }

                                            // Code to insert the slot
                                            CalendarFormModel eventData = new CalendarFormModel()
                                            {
                                                end = tempStartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                                resources = data.SCH_RESOURCE,
                                                activities = data.SCH_ACTIVITY,
                                                start = tempEndTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                                title = "Slot " + slotCounter++
                                            };

                                            formGroupKey = Guid.NewGuid().ToString();
                                            string referenceResourceEntry = "";

                                            if (!string.IsNullOrEmpty(data.SCH_RESOURCE))
                                            {
                                                referenceResourceEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                            }

                                            string referenceActivityEntry = "";

                                            if (!string.IsNullOrEmpty(data.SCH_ACTIVITY) && data.SCH_ACTIVITY != "-1")
                                            {
                                                referenceActivityEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                            }

                                            string serviceId = data.SCH_ACTIVITY;
                                            string resourceId = data.SCH_RESOURCE;

                                            eventCounter++;
                                            script += $@"declare @insertedEventId{slotCounter} int;  insert into CALENDAR_FORM_1935([IS_COURSE_EVENT]
                                                              ,[SCHEDULAR_FORM_ID]
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
	                                                          values('{IsCourseEvent}', '{SchedularFormId}', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{data.COMPANY_CODE}', '{data.CALENDAR_CODE}', 'Slot {slotCounter}', '{tempStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{tempEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', '{package.Data["SUBS_ID"]?.ToString()}', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_DESCRIPTION)}', getDate(), getDate(),'SCHEDULE');

                                                            SET @insertedEventId{slotCounter} = SCOPE_IDENTITY();

                                                            {referenceResourceEntry}                                                                    

                                                            {referenceActivityEntry}
                                                            
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_LOCATION)}', 'LOCATION_MASTER_1936', 'LOCATION_ADDRESS', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_LOCATION)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            

                                                            declare @SlotId{slotCounter} int = (select top 1 cf.Id from CALENDAR_FORM_1935 cf
                                                                join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                                                where cf.IS_COURSE_EVENT = 'Y' and activities = '{serviceId}'
                                                                order by cf.created_at desc);

                                                            if (@SlotId{slotCounter} is not null and @SlotId{slotCounter} != '')
                                                            begin
                                                                INSERT INTO [dbo].[TRANSACTION_MASTER_1942]
                                                                           ([formGroupKey]
                                                                           ,[formID]
                                                                           ,[userID]
                                                                           ,[Current_Status]
                                                                           ,[cycle]
                                                                           ,[MasterFormID]
                                                                           ,[MasterFormRow]
                                                                           ,[formRecordOrder]
                                                                           ,[formRecordStatus]
                                                                           ,[ApprovalStatus]
                                                                           ,[text_1683717657815]
                                                                           ,[created_at]
                                                                           ,[updated_at]
                                                                           ,[created_by]
                                                                           ,[updated_by]
                                                                           ,[SLOT]
                                                                           ,[RESOURCE]
                                                                           ,[ACTIVITY]
                                                                           ,[STUDENT]
                                                                           ,[REMARKS]
                                                                           ,[FEES]
                                                                           ,[FEES_1]
                                                                           ,[FEES_2]
                                                                           ,[FEES_LIST]
                                                                           ,[ATTENDANCE]
                                                                           ,[hidden_1683717028956]
                                                                           ,[COMPANY_CODE]
                                                                           ,[CALENDAR_CODE]
                                                                           ,[resForm_2304]
                                                                           ,[actFormID]
                                                                           ,[parentID]
                                                                           ,[seperatedFormIDs]
                                                                           ,[seperatedTitles]
                                                                           ,[seperatedIds]
                                                                           ,[seperatedResFormIDs]
                                                                           ,[seperatedResEntryIDs]
                                                                           ,[seperatedResColValues]
                                                                           ,[seperatedColorValues]
                                                                           ,[USERTOKEN]
                                                                           ,[ATTACHMENT_FROM_PARTICIPANTS]
                                                                           ,[COMMENTS_FROM_PARTICIPANT]
                                                                           ,[ATTACHMENT_FROM_STAFF]
                                                                           ,[COMMENTS_FROM_STAFF]
                                                                           ,[transaction_fees]
                                                                           ,[ASSESSMENT_FILES]
                                                                           ,[ASSESSMENT_FILES_LIST])
                                                                     select '{formGroupKey}'
                                                                      ,[formID]
                                                                      ,[userID]
                                                                      ,[Current_Status]
                                                                      ,[cycle]
                                                                      ,[MasterFormID]
                                                                      ,[MasterFormRow]
                                                                      ,[formRecordOrder]
                                                                      ,[formRecordStatus]
                                                                      ,[ApprovalStatus]
                                                                      ,[text_1683717657815]
                                                                      ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                                      ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                                      ,[created_by]
                                                                      ,[updated_by]
                                                                      ,(select @insertedEventId{slotCounter})
                                                                      ,'{resourceId}'
                                                                      ,[ACTIVITY]
                                                                      ,[STUDENT]
                                                                      ,[REMARKS]
                                                                      ,[FEES]
                                                                      ,[FEES_1]
                                                                      ,[FEES_2]
                                                                      ,[FEES_LIST]
                                                                      ,'NOT-MARKED'
                                                                      ,[hidden_1683717028956]
                                                                      ,[COMPANY_CODE]
                                                                      ,[CALENDAR_CODE]
                                                                      ,[resForm_2304]
                                                                      ,[actFormID]
                                                                      ,[parentID]
                                                                      ,[seperatedFormIDs]
                                                                      ,[seperatedTitles]
                                                                      ,[seperatedIds]
                                                                      ,[seperatedResFormIDs]
                                                                      ,[seperatedResEntryIDs]
                                                                      ,[seperatedResColValues]
                                                                      ,[seperatedColorValues]
                                                                      ,[USERTOKEN]
                                                                      ,[ATTACHMENT_FROM_PARTICIPANTS]
                                                                      ,[COMMENTS_FROM_PARTICIPANT]
                                                                      ,[ATTACHMENT_FROM_STAFF]
                                                                      ,[COMMENTS_FROM_STAFF]
                                                                      ,[transaction_fees]
                                                                      ,[ASSESSMENT_FILES]
                                                                      ,[ASSESSMENT_FILES_LIST]
                                                                  FROM [dbo].[TRANSACTION_MASTER_1942] t where t.ACTIVITY = '{serviceId}' and t.SLOT = @SlotId{slotCounter};
                                                            end";

                                            tempStartTime = tempEndTime.AddMinutes(RestPeriod);
                                            tempEndTime = tempStartTime.AddMinutes(Duration);
                                        } // end of while

                                    }
                                    else
                                    {
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
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                        }

                                        string referenceActivityEntry = "";

                                        if (!string.IsNullOrEmpty(data.SCH_ACTIVITY) && data.SCH_ACTIVITY != "-1")
                                        {
                                            referenceActivityEntry = $@"
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                                                            ";
                                        }

                                        string serviceId = data.SCH_ACTIVITY;
                                        string resourceId = data.SCH_RESOURCE;

                                        eventCounter++;
                                        script += $@"declare @insertedEventId{slotCounter} int;  insert into CALENDAR_FORM_1935([IS_COURSE_EVENT]
                                                              ,[SCHEDULAR_FORM_ID]
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
	                                                          values('{IsCourseEvent}', '{SchedularFormId}', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{data.COMPANY_CODE}', '{data.CALENDAR_CODE}', 'Slot {slotCounter}', '{SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_RESOURCE)}', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_ACTIVITY)}', '{package.Data["SUBS_ID"]?.ToString()}', '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_DESCRIPTION)}', getDate(), getDate(),'SCHEDULE');

                                                            SET @insertedEventId{slotCounter} = SCOPE_IDENTITY();

                                                            {referenceResourceEntry}                                                                    

                                                            {referenceActivityEntry}
                                                            
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_LOCATION)}', 'LOCATION_MASTER_1936', 'LOCATION_ADDRESS', {(int)FormSetting.CALENDAR_FORM}, '{SQLUtility.TreatSingleQuoteForQuery(data.SCH_LOCATION)}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())


                                                            declare @SlotId{slotCounter} int = (select top 1 cf.Id from CALENDAR_FORM_1935 cf
                                                                join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                                                where cf.IS_COURSE_EVENT = 'Y' and activities = '{serviceId}'
                                                                order by cf.created_at desc);

                                                            if (@SlotId{slotCounter} is not null and @SlotId{slotCounter} != '')
                                                            begin
                                                                INSERT INTO [dbo].[TRANSACTION_MASTER_1942]
                                                                           ([formGroupKey]
                                                                           ,[formID]
                                                                           ,[userID]
                                                                           ,[Current_Status]
                                                                           ,[cycle]
                                                                           ,[MasterFormID]
                                                                           ,[MasterFormRow]
                                                                           ,[formRecordOrder]
                                                                           ,[formRecordStatus]
                                                                           ,[ApprovalStatus]
                                                                           ,[text_1683717657815]
                                                                           ,[created_at]
                                                                           ,[updated_at]
                                                                           ,[created_by]
                                                                           ,[updated_by]
                                                                           ,[SLOT]
                                                                           ,[RESOURCE]
                                                                           ,[ACTIVITY]
                                                                           ,[STUDENT]
                                                                           ,[REMARKS]
                                                                           ,[FEES]
                                                                           ,[FEES_1]
                                                                           ,[FEES_2]
                                                                           ,[FEES_LIST]
                                                                           ,[ATTENDANCE]
                                                                           ,[hidden_1683717028956]
                                                                           ,[COMPANY_CODE]
                                                                           ,[CALENDAR_CODE]
                                                                           ,[resForm_2304]
                                                                           ,[actFormID]
                                                                           ,[parentID]
                                                                           ,[seperatedFormIDs]
                                                                           ,[seperatedTitles]
                                                                           ,[seperatedIds]
                                                                           ,[seperatedResFormIDs]
                                                                           ,[seperatedResEntryIDs]
                                                                           ,[seperatedResColValues]
                                                                           ,[seperatedColorValues]
                                                                           ,[USERTOKEN]
                                                                           ,[ATTACHMENT_FROM_PARTICIPANTS]
                                                                           ,[COMMENTS_FROM_PARTICIPANT]
                                                                           ,[ATTACHMENT_FROM_STAFF]
                                                                           ,[COMMENTS_FROM_STAFF]
                                                                           ,[transaction_fees]
                                                                           ,[ASSESSMENT_FILES]
                                                                           ,[ASSESSMENT_FILES_LIST])
                                                                     select '{formGroupKey}'
                                                                      ,[formID]
                                                                      ,[userID]
                                                                      ,[Current_Status]
                                                                      ,[cycle]
                                                                      ,[MasterFormID]
                                                                      ,[MasterFormRow]
                                                                      ,[formRecordOrder]
                                                                      ,[formRecordStatus]
                                                                      ,[ApprovalStatus]
                                                                      ,[text_1683717657815]
                                                                      ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                                      ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                                      ,[created_by]
                                                                      ,[updated_by]
                                                                      ,(select @insertedEventId{slotCounter})
                                                                      ,'{resourceId}'
                                                                      ,[ACTIVITY]
                                                                      ,[STUDENT]
                                                                      ,[REMARKS]
                                                                      ,[FEES]
                                                                      ,[FEES_1]
                                                                      ,[FEES_2]
                                                                      ,[FEES_LIST]
                                                                      ,'NOT-MARKED'
                                                                      ,[hidden_1683717028956]
                                                                      ,[COMPANY_CODE]
                                                                      ,[CALENDAR_CODE]
                                                                      ,[resForm_2304]
                                                                      ,[actFormID]
                                                                      ,[parentID]
                                                                      ,[seperatedFormIDs]
                                                                      ,[seperatedTitles]
                                                                      ,[seperatedIds]
                                                                      ,[seperatedResFormIDs]
                                                                      ,[seperatedResEntryIDs]
                                                                      ,[seperatedResColValues]
                                                                      ,[seperatedColorValues]
                                                                      ,[USERTOKEN]
                                                                      ,[ATTACHMENT_FROM_PARTICIPANTS]
                                                                      ,[COMMENTS_FROM_PARTICIPANT]
                                                                      ,[ATTACHMENT_FROM_STAFF]
                                                                      ,[COMMENTS_FROM_STAFF]
                                                                      ,[transaction_fees]
                                                                      ,[ASSESSMENT_FILES]
                                                                      ,[ASSESSMENT_FILES_LIST]
                                                                  FROM [dbo].[TRANSACTION_MASTER_1942] t where t.ACTIVITY = '{serviceId}' and t.SLOT = @SlotId{slotCounter};
                                                            end                                                            
";
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
                                            return Json(new AddUpdateDelete() { Status = true, Message = eventCounter + " Sessions Created. Session limit reached as per your plan. Upgrade your plan to create more sessions." }, JsonRequestBehavior.AllowGet);
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
                var transactionList = transactionData.Data as List<IDictionary<string, object>>;
                double last_page = 0;
                if (transactionList != null && transactionList.Count > 0)
                {
                    var singData = transactionList[0];
                    var total_records = Convert.ToInt32(singData["total_records"].ToString());
                    var size = Convert.ToInt32(singData["size"].ToString());
                    double paging = (double)total_records / size;
                    last_page = Math.Floor(paging) + 1;
                }
                transactionList.ForEach(x =>
                {
                    x["BOOKING_DATE"] = Convert.ToDateTime(x["BOOKING_DATE"]).ToString("dd-MM-yyyy");
                    x["FROM_TIME"] = Convert.ToDateTime(x["FROM_TIME"]).ToString("HH:mm tt");
                    x["TO_TIME"] = Convert.ToDateTime(x["TO_TIME"]).ToString("HH:mm tt");

                });
                return Json(new { data = transactionList, last_page }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new AddUpdateDelete() { Status = false, Message = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> IndexPdf(string start, string end, string companyCode, string calendarCode)
        
        {
            calenderSettingsFormDetails request1 = new calenderSettingsFormDetails()
            {
                action = 4,
                formId = (int)FormSetting.CALENDAR_FORM,
                IsCustomFilter = true,
                CustomFilters = new List<CustomFilter>() {
                                                                                            new CustomFilter() { FieldName="COMPANY_CODE",Value=companyCode },
                                                                                            new CustomFilter() {FieldName="CALENDAR_CODE",Value=calendarCode }
                                                                                        }
            };
            var CalenderSettingsFormData = await formAPIRepository.getCalenderSettingsFormData(request1);

            DateTime _start, _end;
            if (!(DateTime.TryParse(start, out _start) && DateTime.TryParse(end, out _end)))
            {

                return RedirectToAction("Index");
            }
            string filterQuery = $" f.COMPANY_CODE='{companyCode}' and f.CALENDAR_CODE='{calendarCode}' and " + CustomMethods.GetDateQuery(_start, _end);
            //string filterQuery =$" f.COMPANY_CODE='{companyCode}' and " +CustomMethods.GetDateQuery(_start, _end); 

            Form_DataTable request2 = new Form_DataTable()
            {
                action = 1,
                formId = (int)FormSetting.CALENDAR_FORM,
                ActivityFormId = (int)FormSetting.SERVICE_MASTER,
                isCalender = 1,
                isEvent = 1,
                resourceFormId = (int)FormSetting.LOCATION_MASTER,
                filter = new FilterDTO() { field = "start", value = filterQuery }
            };
            var result = await formAPIRepository.getReferralFormFields(request2);
            var eventData = result;

            var mybooking = await calendarService.GetMyBooking(UserIdentity.UserEmail, companyCode, _start, _end);

            var EventIdsBooking = mybooking.Select(x => x["EventId"].ToString()).ToList();

            eventData.events = eventData.events.Where(x => EventIdsBooking.Any(y => y == x["Id"].ToString())).ToList();

            List<string> resourceIdsList = new List<string>();

            if (eventData.resourceDetails != null && eventData.resourceDetails.Count > 0)
            {
                var resourceIds = eventData.resourceDetails.Where(x => x.Id != "" && x.Id != "0").GroupBy(x => x.Id).Select(x => x.Key).ToList();
                if (eventData.events != null && eventData.events.Count > 0)
                {
                    resourceIdsList = eventData.events.Where(x => !string.IsNullOrEmpty(x["start"]?.ToString()) && !string.IsNullOrEmpty(x["end"]?.ToString()))
                        .Select(x => x["resources"]?.ToString())
                        .ToList();
                    ViewBag.resourceIdsList = resourceIdsList;
                    ViewBag.eventData = eventData.events.Select(x => new
                    {
                        start = Convert.ToDateTime(x["start"]).ToString("dd-MM-yyyy HH:mm:ss"),
                        end = Convert.ToDateTime(x["end"]).ToString("dd-MM-yyyy HH:mm:ss"),
                        resources = x["resources"]?.ToString(),
                        activities = x["activities"]?.ToString(),
                        customTitle = x["customTitle"]?.ToString(),
                        customForms = x["customForms"]?.ToString(),
                        customFormIds = x["customFormIds"]?.ToString(),
                        customFourthTitle = x["customFourthTitle"]?.ToString()
                    }).Where(x => !string.IsNullOrEmpty(x.start) && !string.IsNullOrEmpty(x.end)).GroupBy(x => new { x.start, x.end }).Select(x => new GroupEventDataModel
                    {
                        start = DateTimeHelper.ConvertToDateTimeFormate(x.Key.start, "dd-MM-yyyy HH:mm:ss"),
                        end = DateTimeHelper.ConvertToDateTimeFormate(x.Key.end, "dd-MM-yyyy HH:mm:ss"),
                        events = x.Select(y => new { resources = y.resources, activities = y.activities, customTitle = y.customTitle, customForms = y.customForms, customFormIds = y.customFormIds, customFourthTitle = y.customFourthTitle }.AsDictionary()).ToList()
                    }).ToList();
                }
            }
            MyBookingPdfModel pdfModel = new MyBookingPdfModel() { calendarSetting = CalenderSettingsFormData, StudentName = UserIdentity.UserFirstName + " " + UserIdentity.UserLastName };
            var report = new PartialViewAsPdf("~/Views/Calendar/IndexPdf.cshtml", pdfModel)
            {
                PageSize = Rotativa.Options.Size.A4,
                FileName = "DATA" + DateTime.Now.ToString("ddMMyyyy") + ".pdf",
                PageOrientation = Rotativa.Options.Orientation.Portrait,
                CustomSwitches = "--zoom 1.2 " + "--footer-right " + "  \"Page: [page]/[toPage]\"" +
                " --footer-line --footer-font-size \"9\" --footer-spacing 6 --footer-font-name \"calibri light\""
            };
            return report;

            //return View(pdfModel);
        }

    }


}