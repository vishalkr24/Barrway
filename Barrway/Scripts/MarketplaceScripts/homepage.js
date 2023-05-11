$(document).ready(function () {
    $("#nv-home").addClass("active");
    setDistrictMaster();
    setCompanySubCategory();
    setCompanySubCategoryWise();
});

function setDistrictMaster() {
    var data = getDistrictMaster();

    if (data.Status) {

        var districts = data.Data;

        $("#filter-district-master").empty();
        $("#filter-district-master").append(`<option value="-1" selected disabled>select your district</option>`);

        for (var i = 0; i < districts.length; i++) {
            $("#filter-district-master").append(`<option value="${districts[i].Id}">${districts[i].DISTRICT_NAME}</option>`);
        }

    }

}

function setCompanySubCategory() {
    var data = GetAllCompanySubCategory();

    if (data.Status) {

        var districts = data.Data;

        $("#filter-sub-category-master").empty();
        $("#filter-sub-category-master").append(`<option value="-1" selected disabled>select a sub-category</option>`);

        for (var i = 0; i < districts.length; i++) {
            $("#filter-sub-category-master").append(`<option value="${districts[i].Id}">${districts[i].COMPANY_SUB_CATEGORY_NAME}</option>`);
        }

    }

}

function setCompanySubCategoryWise(showFilterQuery = false, requestFromButton = false) {

    var fltr_subCategoryId = $("#filter-sub-category-master option:selected").val();
    var fltr_districtId = $("#filter-district-master option:selected").val();

    var queryString = window.location.href.split("?")[1];

    if (queryString == null) {

    } else {
        queryString = queryString.split("=")[1];
        try {
            var object = queryString;
            if (requestFromButton) {

            } else {
                fltr_subCategoryId = object[0].split("=")[1];
                fltr_districtId = object[1].split("=")[1];
                $("#filter-sub-category-master").val(fltr_subCategoryId);
                $("#filter-district-master").val(fltr_districtId);
            }
            
            showFilterQuery = true;
        } catch (ex) {
            
        }
    }

    if (showFilterQuery) {

        var title = "Barrway | Marketplace";
        var url = "/Marketplace/index?CategoryId=" + fltr_subCategoryId + "&DistrictId=" + fltr_districtId + "";

        window.history.replaceState('index', title, url);

        $("#lblFilterLabel").show();
        if (fltr_subCategoryId == "-1") {
            $("#lblSelectedSubCategory").text("All Sub Categories");
        } else {
            $("#lblSelectedSubCategory").text($("#filter-sub-category-master option:selected").text());
        }

        if (fltr_districtId == "-1") {
            $("#lblSelectedDistrict").text("All Districts");
        } else {
            $("#lblSelectedDistrict").text($("#filter-district-master option:selected").text() + " District");
        }

    } else {
        $("#lblFilterLabel").hide();
        $("#lblSelectedSubCategory").text("");
        $("#lblSelectedDistrict").text("");
    } 

    if (fltr_subCategoryId == "-1") {
        fltr_subCategoryId = "";
    }

    if (fltr_districtId == "-1") {
        fltr_districtId = "";
    }

    var data = GetFilterCompanyData(fltr_subCategoryId, fltr_districtId);

    if (data.Status) {
        var corouselClassMaster = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
        var corouselCounter = 0;

        var categories = data.Data;
        console.log(categories);
        $("#company-category-wise-area").empty();
        for (var i = 0; i < categories.length; i++) {

            var companies = data.Data[i];

            if (companies.length > 0) {
             
                corouselCounter++;

                $("#company-category-wise-area").append(`<div class="my-slide ${corouselClassMaster[corouselCounter]}">
                                                            <div class="heading-cata">
                                                                <h3>${companies[0].COMPANY_SUB_CATEGORY_NAME}</h3>
                                                            </div>
                                                            <div id="owl-demo${corouselCounter}" class="owl-carousel owl-theme"></div>

                                                        </div>`);

                for (var j = 0; j < companies.length; j++) {

                    var tags = companies[j].TAGS.split("#");

                    var tagString = "";
                    for (var k = 0; k < tags.length; k++) {
                        tagString += "<a href=''>"+tags[k]+"</a>, ";
                    }
                    
                    $("#owl-demo" + corouselCounter).append(` <div class="item">
                                                    <div class="item-inner">
                                                        <div class="pro-im">
                                                            <img src="${(companies[j].COMPANY_BANNER_PATH == "") ? "../assets/marketplace/image/pro.png" : companies[j].COMPANY_BANNER_PATH.replaceAll("~", "..") }" onerror="this.src='../assets/marketplace/image/pro.png'">
                                                        </div>
                                                        <div class="pro-text">
                                                            <p class="p1"><b>${companies[j].COMPANY_NAME_ENGLISH}</b></p>
                                                            <p class="p2">${companies[j].COMPANY_CATEGORY_NAME}</p>
                                                            <p class="p3">${companies[j].DISTRICT_NAME}</p>
                                                            <p class="p4">${tagString}</p>
                                                        </div>
                                                    </div>
                                                </div>`);

                    $("#owl-demo" + corouselCounter).owlCarousel({
                        loop: true,
                        margin: 10,
                        dots: false,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 1,
                                nav: false
                            },
                            600: {
                                items: 3,
                                nav: false
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                margin: 20
                            }
                        }
                    });

                }
            }
            

        }

        

    }

}