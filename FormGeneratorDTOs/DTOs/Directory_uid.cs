using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Spire.Xls;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocToPDFConverter;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace FormGeneratorDTOs.DTOs
{


    public class Directory_uid
    {


        #region for reqType

        private string groupImage = "groups";
        public string GroupImage { get { return groupImage; } set { groupImage = value; } }

        private string profileImage = "userProfileImage";
        public string UserProfileImage { get { return profileImage; } set { profileImage = value; } }

        private string globalSearch = "globalSearch";
        public string GlobalSearch { get { return globalSearch; } set { globalSearch = value; } }

        private string appSearch = "appSearch";
        public string AppSearch { get { return appSearch; } set { appSearch = value; } }

        private string formSearch = "formSearch";
        public string FormSearch { get { return formSearch; } set { formSearch = value; } }
        private string downloadAttachments = "downloadAttachments";
        public string DownloadAttachments { get { return downloadAttachments; } set { downloadAttachments = value; } }
        #endregion


        #region for folder references

        public string groups = "groups";
        public string GroupFolderRef { get { return groups; } set { groups = value; } }

        public string users = "users";
        public string UserFolderRef { get { return users; } set { users = value; } }

        public string form = "form";
        public string FormFolderRef { get { return form; } set { form = value; } }

        public string banners = "banners";
        public string BannersFolderRef { get { return banners; } set { banners = value; } }

        public string extra = "extra";
        public string ExtraFolderRef { get { return extra; } set { extra = value; } }

        public bool isExistsParent { get; set; }
        public bool isExistsChild { get; set; }

        private string empty = string.Empty;
        public string isEmpty { get { return empty; } set { empty = value; } }

        #endregion
        public string GetPath(UidRequestParams reqObj)
        {
            string referencePath = string.Empty;
            string targetFolder = string.Empty;
            Directory_uid dtoObj = new Directory_uid();
            List<ReferencePath> refObj = reqObj.references;
            // checking for main "users" folder .
            var usersFolderPath = refObj[0].usersFolderPath.ToString(); //HttpContext.Current.Server.MapPath("uploadImages/" + dtoObj.UserFolderRef + "/");
            DirectoryInfo usersFolderInfo = new DirectoryInfo(usersFolderPath);
            if (!usersFolderInfo.Exists)
                Directory.CreateDirectory(usersFolderPath);// creating users folder .

            //checking for uid folder
            var path = refObj[0].uidFolderPath.ToString(); //HttpContext.Current.Server.MapPath("uploadImages/" + dtoObj.UserFolderRef + "/" + uid + "/");
            System.IO.DirectoryInfo uidFolderInfo = new System.IO.DirectoryInfo(path);
            if (!uidFolderInfo.Exists)
                Directory.CreateDirectory(path); // creating uid folder if not exists.


            //setting up targetFolder variable based on reqType.
            if (reqObj.reqType == dtoObj.GroupImage)
                targetFolder = dtoObj.GroupImage.ToString();

            else if (reqObj.reqType == dtoObj.UserProfileImage)
                targetFolder = dtoObj.UserProfileImage.ToString();

            else if (reqObj.reqType == dtoObj.FormFolderRef)
                targetFolder = dtoObj.FormFolderRef.ToString();

            else if (reqObj.reqType == dtoObj.BannersFolderRef)
                targetFolder = dtoObj.BannersFolderRef.ToString();

            else if (reqObj.reqType == dtoObj.ExtraFolderRef)
                targetFolder = dtoObj.ExtraFolderRef.ToString();
            else if (reqObj.reqType == dtoObj.ExtraFolderRef)
                targetFolder = dtoObj.ExtraFolderRef.ToString();

            // checking for target folder .
            var targetFolderPath = refObj[0].uidFolderPath + targetFolder.ToString(); //HttpContext.Current.Server.MapPath("uploadImages/" + dtoObj.UserFolderRef + "/" + uid + "/" + targetFolder);

            DirectoryInfo targetFolderInfo = new DirectoryInfo(targetFolderPath);
            if (targetFolderInfo.Exists)// if target folder exists.. set the referencePath varibale
                referencePath = "~/uploadImages/" + dtoObj.UserFolderRef.ToString() + "/" + reqObj.uid.ToString() + "/" + targetFolder.ToString() + "/";   // setting up referencePath variable
            else  // create target folder.  
            {
                DirectoryInfo childInfo = Directory.CreateDirectory(targetFolderPath);
                if (childInfo.Exists)
                    referencePath = "~/uploadImages/" + dtoObj.UserFolderRef.ToString() + "/" + reqObj.uid.ToString() + "/" + targetFolder.ToString() + "/"; // setting up referncePath variable after creating target folder .
                else
                    referencePath = string.Empty;
            }

            #region change reference path for form related uploads
            if (reqObj.reqType == dtoObj.FormFolderRef)
            {
                string appIdSubString = "\\" + reqObj.appId;
                targetFolderPath += appIdSubString;
                //checking for application folder (inside form folder)
                DirectoryInfo appFolderInfo = new DirectoryInfo(targetFolderPath);

                if (appFolderInfo.Exists)
                {
                    string formIdSubString = "\\" + reqObj.formId;
                    targetFolderPath += formIdSubString;
                    // cheking for formId folder
                    DirectoryInfo formFolderInfo = new DirectoryInfo(targetFolderPath);
                    if (formFolderInfo.Exists)  /// if  formId folder exists.
                    {
                        // skip
                    }
                    else
                    {
                        //creating formId folder
                        Directory.CreateDirectory(targetFolderPath);
                    }
                }
                else
                {
                    //creating appId folder
                    Directory.CreateDirectory(targetFolderPath);
                    string formFolderInfo = "\\" + reqObj.formId;
                    targetFolderPath += formFolderInfo;
                    //creating formId folder
                    Directory.CreateDirectory(targetFolderPath);
                }
                referencePath = "~/uploadImages/" + dtoObj.UserFolderRef.ToString() + "/" + reqObj.uid.ToString() + "/" + targetFolder.ToString() + "/" + reqObj.appId + "/" + reqObj.formId + "/"; // setting up referncePath variable after creating target folder .
            }

            #endregion

            return referencePath;

        }

        public List<MatchedPdfs> getMatchedPDFs(string targetUrl, string baseUrl, string textToSearch = null, string searchType = null, string applicationId = null, string frmId = null, string fileType = null)
        {
#pragma warning disable CS0219 // The variable 'pdfFiles' is assigned but its value is never used
            string[] pdfFiles;
#pragma warning restore CS0219 // The variable 'pdfFiles' is assigned but its value is never used

            List<listParam> List = new List<listParam>();

            List<MatchedPdfs> returnObj = new List<MatchedPdfs>();
            DirectoryInfo targetFolderInfo = new DirectoryInfo(targetUrl);
            //  Directory_uid uidObj = new Directory_uid();
            if (targetFolderInfo.Exists)
            {
                // search for PDFs  in  

                if (searchType == GlobalSearch)
                {
                    string[] appSubDirectories = Directory.GetDirectories(targetUrl);  // all application directories
                    foreach (string appDir in appSubDirectories)
                    {
                        string appSubPath = appDir + "\\";
                        string appId = appDir.Split('\\')[appDir.Split('\\').Length - 1].ToString();

                        string[] formSubDirectories = Directory.GetDirectories(appSubPath);
                        foreach (string formDir in formSubDirectories)
                        {
                            string formSubPath = formDir + "\\";
                            string formId = formDir.Split('\\')[formDir.Split('\\').Length - 1].ToString();

                            string[] fileList = Directory.GetFiles(formSubPath, "*." + fileType.ToString());
                            var fileList2 = Directory.GetFiles(formSubPath, "*.*", SearchOption.AllDirectories).Where(s => s.EndsWith(".docx") || s.EndsWith(".xlsx") || s.EndsWith(".pdf")).ToArray();
                            fileList = fileList2;
                            listParam paramObj = new listParam();
                            paramObj.files = fileList;
                            paramObj.updatedBaseURL = baseUrl + appId.ToString() + "/" + formId.ToString() + "/";
                            paramObj.formId = Convert.ToInt32(formId);
                            paramObj.appId = Convert.ToInt32(appId);
                            List.Add(paramObj);
                        }
                    }
                }
                else if (searchType == AppSearch || searchType == DownloadAttachments)
                {

                    string appSubPath = targetUrl;
                    string appid = applicationId;
                    string[] formSubDirectories = Directory.GetDirectories(appSubPath);
                    foreach (string formDir in formSubDirectories)
                    {
                        string formSubPath = formDir + "\\";
                        string formId = formDir.Split('\\')[formDir.Split('\\').Length - 1].ToString();

                        string[] fileList;
                        if (searchType == DownloadAttachments)
                            fileList = Directory.GetFiles(formSubPath);// all tyeps of files in application folders
                        else
                        {
                            fileList = Directory.GetFiles(formSubPath, "*." + fileType.ToString());
                            var fileList2 = Directory.GetFiles(formSubPath, "*.*", SearchOption.AllDirectories).Where(s => s.EndsWith(".docx") || s.EndsWith(".xlsx") || s.EndsWith(".pdf")).ToArray();
                            fileList = fileList2;
                        }
                        listParam paramObj = new listParam();
                        paramObj.files = fileList;
                        paramObj.updatedBaseURL = baseUrl + formId.ToString() + "/";
                        paramObj.appId = Convert.ToInt32(applicationId);
                        paramObj.formId = Convert.ToInt32(formId);
                        List.Add(paramObj);
                    }
                }
                else if (searchType == FormSearch)
                {
                    string formSubPath = targetUrl;
                    formSubPath = formSubPath + frmId.ToString() + "/";
                    string[] fileList;

                    fileList = Directory.GetFiles(formSubPath, "*." + fileType.ToString());
                    listParam paramObj = new listParam();
                    paramObj.files = fileList;
                    paramObj.updatedBaseURL = baseUrl;
                    paramObj.appId = Convert.ToInt32(applicationId);
                    paramObj.formId = Convert.ToInt32(frmId);
                    List.Add(paramObj);


                }





                foreach (listParam obj in List)
                {
                    int appId = obj.appId;
                    int frmid = obj.formId;

                    foreach (var f in obj.files)
                    {
                        MatchedPdfs p = new MatchedPdfs();


                        if (searchType == DownloadAttachments)
                        {
                            p.matchedUrl = obj.updatedBaseURL + System.IO.Path.GetFileName(f);
                            p.name = System.IO.Path.GetFileName(f);
                            p.attachmentUrl = f;
                            returnObj.Add(p);
                        }
                        else
                        {
                            string extension = System.IO.Path.GetExtension(f);
                            fileType = extension;
                            List<Dictionary<int, int>> totalFounds = new List<Dictionary<int, int>>();
                            if (fileType == ".pdf")
                                totalFounds = ReadPdfFile(f, textToSearch);
                            else if (fileType == ".docx")
                            {
                                string tempPdfpath = docReader(f, targetUrl);
                                if (tempPdfpath != string.Empty)
                                {
                                    totalFounds = ReadPdfFile(tempPdfpath, textToSearch);
                                }

                            }
                            else if (fileType == ".xlsx")
                            {
                                totalFounds = ExcelReader(f, textToSearch);
                            }

                            if (totalFounds.Count > 0)
                            {
                                p.matchedUrl = obj.updatedBaseURL + System.IO.Path.GetFileName(f);
                                p.matchedFound = totalFounds;
                                p.name = System.IO.Path.GetFileName(f);
                                p.appid = appId;
                                p.formid = frmid;
                                returnObj.Add(p);
                            }

                        }


                    }
                }
            }
            else
                pdfFiles = null;

            return returnObj;


        }
        public List<Dictionary<int, int>> ReadPdfFile(string fileName, String searthText)
        {
            List<int> pages = new List<int>();
            List<Dictionary<int, int>> returnObj = new List<Dictionary<int, int>>();// <pageNo. , TotalMatched>
            Dictionary<int, int> dictonary;
            if (File.Exists(fileName))
            {
                PdfReader pdfReader = new PdfReader(fileName);

                for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                {
                    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();

                    string currentPageText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);
                    int noOfMatchesOnPage = Regex.Matches(currentPageText, searthText).Count;
                    if (currentPageText.Contains(searthText))
                    {
                        dictonary = new Dictionary<int, int>();
                        dictonary.Add(page, noOfMatchesOnPage);
                        returnObj.Add(dictonary);
                    }
                    // dictonary.Clear();
                }
                pdfReader.Close();
            }
            return returnObj;
        }

        public string docReader(string fileName, string toSaveTemp)
        {
            string TempPath = string.Empty;
            if (File.Exists(fileName))
            {
                try
                {

                    WordDocument wordDocument = new WordDocument(fileName, FormatType.Docx);
                    //Initializes the ChartToImageConverter for converting charts during Word to pdf conversion
                    // wordDocument.ChartToImageConverter = new ChartToImageConverter();
                    //Creates an instance of the DocToPDFConverter
                    DocToPDFConverter converter = new DocToPDFConverter();
                    //Converts Word document into PDF document
                    Syncfusion.Pdf.PdfDocument pdfDocument = converter.ConvertToPDF(wordDocument);
                    //Saves the PDF file 

                    pdfDocument.Save(toSaveTemp + "temporary.pdf");
                    //Closes the instance of document objects
                    pdfDocument.Close(true);
                    wordDocument.Close();
                    TempPath = toSaveTemp + "temporary.pdf";

                    //var stream = File.Open(fileName, FileOpen.Read);
                    //var content = File.ReadAllText(fileName);

                    ////Load Document  
                    //Document document = new Document();
                    //document.LoadFromFile(@fileName);

                    ////Convert Word to PDF  
                    //document.SaveToFile("temporary.PDF", FileFormat.PDF);
                }
                catch (Exception sqe)
                {
                    var message = sqe.Message;
                }




                //PdfReader pdfReader = new PdfReader(fileName);

                //for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                //{
                //    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();

                //    string currentPageText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);
                //    int noOfMatchesOnPage = Regex.Matches(currentPageText, searthText).Count;
                //    if (currentPageText.Contains(searthText))
                //    {
                //        dictonary = new Dictionary<int, int>();
                //        dictonary.Add(page, noOfMatchesOnPage);
                //        returnObj.Add(dictonary);
                //        // pages.Add(page);




                //    }
                //    // dictonary.Clear();
                //}
                //pdfReader.Close();
            }
            return TempPath;
















        }

        public List<Dictionary<int, int>> ExcelReader(string fileName, string searchText)
        {
            List<Dictionary<int, int>> totalFounds = new List<Dictionary<int, int>>();

            try
            {
                //load an excel file from system  
                var counts = 0;
                Workbook workbook = new Workbook();
                workbook.LoadFromFile(@fileName, ExcelVersion.Version2013);

                //find and highlight excel data    
                Worksheet sheet = workbook.Worksheets[0];
                foreach (CellRange range in sheet.FindAllString(searchText, true, true))
                {
                    counts++;
                }

                if (counts > 0)
                {
                    Dictionary<int, int> entry = new Dictionary<int, int>();
                    entry.Add(1, counts);
                    totalFounds.Add(entry);
                }
                ////save and launch the project    
                //workbook.SaveToFile("NewProduct.xlsx", ExcelVersion.Version2013);
                //System.Diagnostics.Process.Start("NewProduct.xlsx");
                return totalFounds;
            }
            catch
            {
                //return null;
            }
            return totalFounds;
        }
    }

    public class UidRequestParams
    {
        public string reqType { get; set; }
        public string uid { get; set; }
        public string appId { get; set; }
        public string appTitle { get; set; }
        public string formId { get; set; }
        public string formTitle { get; set; }
        public List<ReferencePath> references { get; set; }


    }

    public class ReferencePath
    {

        public string usersFolderPath { get; set; }
        public string uidFolderPath { get; set; }
        public string targetFolderPath { get; set; }
        public string ReturnReferencePath { get; set; }
    }

    public class MatchedPdfs
    {
        public string matchedUrl { get; set; }

        public List<Dictionary<int, int>> matchedFound { get; set; }
        public string name { get; set; }
        public string attachmentUrl { get; set; }
        public int formid { get; set; }
        public int appid { get; set; }
        public List<pdfDetail> formDetail { get; set; }
    }

    public class listParam
    {
        public string[] files { get; set; }
        public string updatedBaseURL { get; set; }
        public int formId { get; set; }
        public int appId { get; set; }

    }

    public class pdfDetail
    {
        public string formTitle { get; set; }
        public string appTitle { get; set; }
        public string topicTitle { get; set; }
        public string fileFields { get; set; }
        public string entryTable { get; set; }

        public List<pdfDetail> filteredFiles { get; set; }

    }

    public class filterFiles
    {
        public string C1 { get; set; }
        public string C2 { get; set; }
        public string C3 { get; set; }
        public string C4 { get; set; }
        public string C5 { get; set; }


    }


}
