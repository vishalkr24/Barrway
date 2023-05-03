var zip = new JSZip();
var count = 0;
var zipFilename = "zipFilename.zip";
var urls = [
  'http://image-url-1',
  'http://image-url-2',
  'http://image-url-3'
];

urls.forEach(function(url){
  var filename = "filename";
  // loading a file and add it in a zip file
  JSZipUtils.getBinaryContent(url, function (err, data) {
     if(err) {
        throw err; // or handle the error
     }
     zip.file(filename, data, {binary:true});
     count++;
     if (count == urls.length) {
       var zipFile = zip.generate({type: "blob"});
       saveAs(zipFile, zipFilename);
     }
  });
});