using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class ApplicationTable : CommonClass
    {

        public int applicationId { get; set; }
        public int userId { get; set; }
        public string uid { get; set; }
        public int formId { get; set; }
        public int currentFormType { get; set; }
        public int currentFormTypeFormId { get; set; }
        public string applicationTitle { get; set; }

        public string applicationTag { get; set; }

        public string publicTemplate { get; set; }
        public string protectedApplication { get; set; }

        public int status { get; set; }
        public string statusname { get; set; }

        public int cycle { get; set; }

        public int rowOrder { get; set; }

        public string xlsFile { get; set; }

        public string StatusName { get; set; }

        public string publicTemplateText { get; set; }

        public string fullName { get; set; }

        public string recordIDs { get; set; }

        public int topicId { get; set; }

        public string textToSearh { get; set; }

        public List<pdfFiles> urlList { get; set; }
        public bool isPdfSearch { get; set; }
        public string baseUrl { get; set; }
        public string searchType { get; set; }
        public string fileType { get; set; }
        public bool isGeneralApplication { get; set; }
        public string dyQuery { get; set; }
        public TabulatorConfigurationsDTO tabulatorHeaderDetails { get; set; }
        public int totalforms { get; set; }
        public int applicationRole { get; set; }
        public string applicationGridColor { get; set; }

    }

    public class pdfFiles
    {
        public string fileUrl { get; set; }

    }

}
