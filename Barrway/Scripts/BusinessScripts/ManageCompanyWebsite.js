$(document).ready(function () {
    showNavbarNavigation('manage-website');

    renderPage($("#pageCheckId").val());

    var companyId = localStorage.getItem("COMPANY_ID");

    setTimeout(function () {
        tinymce.init({
            selector: 'textarea#COMPANY_SERVICE',
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            editimage_cors_hosts: ['picsum.photos'],
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,

            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            link_list: [
                { title: 'My page 1', value: 'https://www.tiny.cloud' },
                { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_list: [
                { title: 'My page 1', value: 'https://www.tiny.cloud' },
                { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_class_list: [
                { title: 'None', value: '' },
                { title: 'Some class', value: 'class-name' }
            ],
            importcss_append: true,
            file_picker_callback: (callback, value, meta) => {
                /* Provide file and text for the link dialog */
                if (meta.filetype === 'file') {
                    callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === 'image') {
                    callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === 'media') {
                    callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                }
            },
            templates: [
                { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
            ],
            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',

        });
    }, 500);
    setCountryData();
    setCompanyCategory();
    BindCompanySubCategory();

    SetCompanyDetails(companyId);

    SetColorPalettes();
});

function submitTemplate() {
    debugger;
    let PaletteId = String($("input[name=color-palette]:checked").val());
    let TemplateId = String($("input[name=site-template]:checked").val());
    TemplateId = TemplateId.substring(1, TemplateId.length);
    PaletteId = PaletteId.substring(1, PaletteId.length);
    if (PaletteId != null && PaletteId != "" && TemplateId != null && TemplateId != "") {
        $.ajax({
            url: "/BusinessAdmin/UpdateTemplatePalette",
            method: "POST",
            data: {
                model: {
                    Id: localStorage.getItem("COMPANY_ID"),
                    TEMPLATE_ID: TemplateId,
                    PALETTE_ID: PaletteId
                }
            },
            success: function (response) {
                if (response != null) {
                    swal({
                        icon: (response.Status) ? "success" : "error",
                        title: (response.Status) ? "Success" : "Error",
                        text: (response.Status) ? "Template Updated Successfully" : "Something went wong",
                    }).then(function (check) {
                        if (response.Status == true) {
                            showComapanyWebsiteDetails(1);
                        }
                    });
                }
                
            }
        })
    } else {
        alert("Please choose and template and color palette.");
    }
}

$(document).on("change", "input[name=color-palette]", function () {
    
    var colorId = $(this).attr("id");
    $("#color-palettes .palette").removeClass("active")
    $("#color-palettes input[name=color-palette]").prop("checked", false);

    $("label[data-color-id = " + colorId + "] .palette").addClass("active");
    $("label[data-color-id = " + colorId + "] input[name=color-palette]").prop("checked", true);
});

$(document).on("change", "input[name=site-template]", function () {
    
    var colorId = $(this).attr("id");
    $("#site-templates .palette").removeClass("active")
    $("#site-templates input[name=site-template]").prop("checked", false);

    $("label[data-template-id = " + colorId + "] .palette").addClass("active");
    $("label[data-template-id = " + colorId + "] input[name=site-template]").prop("checked", true);
});

function SetColorPalettes() {
    var data = getCompanyWebsitePalette().Data;

    $("#color-palettes").empty();

    if (data != null && data != undefined) {
        let counter = 1;
        data.forEach(x => {
            if ($("#hiddenInputPaletteId").val() == null || $("#hiddenInputPaletteId").val() == "") {
                $("#color-palettes").append(`<label for="c${x.Id}" data-color-id="c${x.Id}">
                                                <input type="radio" name="color-palette" ${(counter == 1) ? "checked" : ""} style="display:none;" id="c${x.Id}" value="c${x.Id}" />
                                                <div class="palette p-6p ${(counter == 1) ? "active" : ""}">
                                                    <div class="palette-item" style="background: ${x.PRIMARY_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.SECONDARY_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.TEXT_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.BACKGROUND_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.SPECIAL_AREA_COLOR}"></div>
                                                </div>
                                            </label>`);
            } else {
                $("#color-palettes").append(`<label for="c${x.Id}" data-color-id="c${x.Id}">
                                                <input type="radio" name="color-palette" ${($("#hiddenInputPaletteId").val() == x.Id) ? "checked" : ""} style="display:none;" id="c${x.Id}" value="c${x.Id}" />
                                                <div class="palette p-6p ${($("#hiddenInputPaletteId").val() == x.Id) ? "active" : ""}">
                                                    <div class="palette-item" style="background: ${x.PRIMARY_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.SECONDARY_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.TEXT_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.BACKGROUND_COLOR}"></div>
                                                    <div class="palette-item" style="background: ${x.SPECIAL_AREA_COLOR}"></div>
                                                </div>
                                            </label>`);
            }
           
            counter++;
        })
    }

    var colorId = $("#hiddenInputTemplateId").val();
    if (colorId != null && colorId != "") {
        $("#site-templates .palette").removeClass("active")
        $("#site-templates input[name=site-template]").prop("checked", false);

        $("label[data-template-id=t" + colorId + "] .palette").addClass("active");
        $("label[data-template-id=t" + colorId + "] input[name=site-template]").prop("checked", true);
    }
    
}

$(document).on("change", "#COUNTRY_ID", function () {
    bindCityData($("#COUNTRY_ID option:selected").val());
})

$(document).on("change", "#CITY_ID", function () {
    bindDistrictData($("#CITY_ID option:selected").val());
})


function setCompanyCategory() {
    var response = getCalendarCategory();

    $("#COMPANY_CATEGORY_ID").empty();

    $("#COMPANY_CATEGORY_ID").append(`<option disabled value="-1">Select Company Category</option>`);

    for (var i = 0; i < response.Data.length; i++) {
        $("#COMPANY_CATEGORY_ID").append(`<option value="${response.Data[i].Id}">${response.Data[i].CALENDAR_CATEGORY_NAME}</option>`);
    }
}

function setCountryData() {
    var data = getCountryMaster();

    console.log(data);

    $("#COUNTRY_ID").empty();
    $("#COUNTRY_ID").append(`<option value="-1" disabled>Select a Country</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {

            $("#COUNTRY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].COUNTRY_NAME}</option>`);
        }
    }
}

function bindCityData(countryId) {
    var data = getCityMaster(countryId);

    console.log(data);

    $("#CITY_ID").empty();
    $("#CITY_ID").append(`<option value="-1" disabled>Select a City</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#CITY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].CITY_NAME}</option>`);
        }
    }
}

function bindDistrictData(cityId) {
    var data = getDistrictMaster(cityId);

    console.log(data);

    $("#DISTRICT_ID").empty();
    $("#DISTRICT_ID").append(`<option value="-1" disabled>Select a District</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#DISTRICT_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].DISTRICT_NAME}</option>`);
        }
    }
}

function BindCompanySubCategory() {
    $("#COMPANY_SUB_CATEGORY_ID").attr("disabled", false);

    var response = getAllCalendarSubCategory();

    $("#COMPANY_SUB_CATEGORY_ID").empty();

    $("#COMPANY_SUB_CATEGORY_ID").append(`<option disabled value="-1">Select Company Sub Category</option>`);

    for (var i = 0; i < response.Data.length; i++) {
        $("#COMPANY_SUB_CATEGORY_ID").append(`<option value="${response.Data[i].Id}">${response.Data[i].CALENDAR_SUB_CATEGORY_NAME}</option>`);
    }
}

function renderPage(pageName) {

    pageName = parseInt(pageName);

    switch (pageName) {
        case 1:
            $("#div1").show();
            $("#div2").hide();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").addClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
        case 2:
            $("#div1").hide();
            $("#div2").show();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").removeClass('active');
            $("#btn2 .nav-link").addClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
        case 3:
            $("#div1").hide();
            $("#div2").hide();
            $("#div3").show();
            $("#div4").hide();

            $("#btn1 .nav-link").removeClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").addClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
        case 4:
            $("#div1").hide();
            $("#div2").hide();
            $("#div3").hide();
            $("#div4").show();

            $("#btn1 .nav-link").removeClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").addClass('active');

            break;
        case 5:
            $("#main-forms").hide();
            $("#div5").show();
            break;
        default:
            $("#div1").show();
            $("#div2").hide();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").addClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
    }
    $("#div" + pageName).show();
}

function SetCompanyDetails(companyId) {
    var data = getSingleCompanyByCompanyId(companyId);

    console.log(data);

    $("#COMPANY_NAME_ENGLISH").val(data.Data.COMPANY_NAME_ENGLISH);
    $("#COMPANY_NAME_CHINESE").val(data.Data.COMPANY_NAME_CHINESE);

    $("#COMPANY_CATEGORY_ID").val(data.Data.COMPANY_CATEGORY_ID);
    $("#COMPANY_CATEGORY_ID option[value=" + data.Data.COMPANY_CATEGORY_ID + "]").attr("selected", true);
    $("#COMPANY_SUB_CATEGORY_ID").val(data.Data.COMPANY_SUB_CATEGORY_ID);
    $("#COMPANY_SUB_CATEGORY_ID option[value=" + data.Data.COMPANY_SUB_CATEGORY_ID + "]").attr("selected", true);
    $("#COUNTRY_ID").val(data.Data.COUNTRY_ID);
    $("#COUNTRY_ID option[value=" + data.Data.COUNTRY_ID + "]").attr("selected", true);
    bindCityData(data.Data.COUNTRY_ID);
    $("#CITY_ID").val(data.Data.CITY_ID);
    $("#CITY_ID option[value=" + data.Data.CITY_ID + "]").attr("selected", true);
    bindDistrictData(data.Data.DISTRICT_ID);
    $("#DISTRICT_ID").val(data.Data.DISTRICT_ID);
    $("#DISTRICT_ID option[value=" + data.Data.DISTRICT_ID + "]").attr("selected", true);

}

function openUploadPhotoModal() {
    $("#uploadPhotoModal").modal("show");
}

function closeUploadPhotoModal() {
    $("#uploadPhotoModal").modal("hide");
}

function setCompanyPhotoAlbum() {
    var data = getCompanyPhotoAlbum(localStorage.getItem("COMPANY_ID"));

    console.log(data);

    if (data.Status) {
        $("#photoAlbumRow").empty();
        for (var i = 0; i < data.Data.length; i++) {
            $("#photoAlbumRow").append(`<div class="col-md-4 mt-4 image-container">
                                        <img src="${data.Data[i].ALBUM_PHOTO_PATH.replace("~", "..")}" class="photo-album" />
                                        <span class="delete-icon" onclick="deletePhotoAlbum(${data.Data[i].Id})">&times;</span>
                                    </div>`)
        }

    }

}

function deletePhotoAlbum(Id) {

    $.ajax({
        url: '/BusinessAdmin/DeleteCompanyPhotoAlbum',
        type: "POST",
        data: {
            Id: Id
        },
        success: function (result) {
            if (result == "Success") {
                setCompanyPhotoAlbum();
            } else {
                console.log(result);
                alert();
            }
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}

function bindPageUrl(companyCode) {

    $("#PAGE_URL").val("/Marketplace/CompanyDetails?CompanyCode=" + companyCode);

    ///company/CMP00076

}

function savePhotoAlbum() {
    var fileUpload = $("#photoAlbumForm_ALBUM_PHOTO_PATH").get(0);
    var files = fileUpload.files;

    var fileData = new FormData();

    // Looping over all files and add it to FormData object  
    if (files.length <= 0) {
        $("#ALBUM_PHOTO_ERROR").show();
        return;
    } else {
        $("#ALBUM_PHOTO_ERROR").hide();
        for (var i = 0; i < files.length; i++) {
            var fileType = files[i].type.split("/")[1];
            if (fileType == "jpg" || fileType == "png" || fileType == "jpeg" || fileType == "JPG" || fileType == "PNG" || fileType == "JPEG") {

            } else {
                $("#photoAlbumForm_ALBUM_PHOTO_PATH").val("");
                $("#ALBUM_PHOTO_NAME").text("");
                $("#ALBUM_PHOTO_ERROR").show();
                return;
            }
        }


    }

    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }

    // Adding one more key to FormData object  
    fileData.append('CompanyCode', localStorage.getItem("COMPANY_CODE"));
    fileData.append('CompanyId', localStorage.getItem("COMPANY_ID"));

    $.ajax({
        url: '/BusinessAdmin/AddCompanyPhotoAlbum',
        type: "POST",
        contentType: false, // Not to set any content header  
        processData: false, // Not to process data  
        data: fileData,
        success: function (result) {
            if (result == "Success") {
                $("#photoAlbumForm_ALBUM_PHOTO_PATH").val("");
                $("#ALBUM_PHOTO_NAME").text("");
                $("#ALBUM_PHOTO_ERROR").hide();
                $("#uploadPhotoModal").modal("hide");               
                $(".upload").empty();
                setCompanyPhotoAlbum();
            } else {
                console.log(result);
                
            }
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}
