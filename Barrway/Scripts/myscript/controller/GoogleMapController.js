(function () {
    'use strict';

    FormGeneratorApp.controller('GoogleMapController', function ($scope, $rootScope, $http, $state, $timeout, $location, $window, DataService, notifierService, mainService, $ngBootbox, $stateParams) {
         
        $scope.init = function () {
            $ngBootbox.hideAll();            
            $scope.userDetail = mainService.loginDetails();
            $scope.currentFormId = $stateParams.formId;
            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            $scope.loadGoogleMap();
            $scope.langId = "1";
            if (localStorage.getItem("globalLang") != null) {
                $scope.langId = localStorage.getItem("globalLang");
            }

        };

        $scope.loadGoogleMap = function () {
           
            $rootScope.$emit("ShowLoading");
            var param = {};           
            param.UserId = $scope.userDetail.Id;
            param.formId = $scope.currentFormId;
            //var data = MapService.get();
            //console.log(data, "data");

           
            initMap();
            setTimeout(initMap(), 300);
        };

        var map;
        function initMap() {
            var gpsdata = localStorage.getItem("GooglemapLatlongMapData");
            var gpsdataarr = JSON.parse(gpsdata);
            //console.log(gpsdataarr[0].Latitude, "gpsdataarr");

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                //center: { lat: 22.3193, lng: 114.1694 }, 
                center: { lat: parseFloat(gpsdataarr[0].Latitude), lng: parseFloat(gpsdataarr[0].Longitude) },
                mapTypeId: google.maps.MapTypeId.roadmap
            });   
            $.each(gpsdataarr, function (i, v) {
                 
                let data = {
                    lat: v.Latitude,
                    long: v.Longitude,
                    Desc: v.Desc,
                    
                };

                SetPlaceMarker(data);
            });
        }



        function SetPlaceMarker(data) {
             
            const myLatLng = { lat: parseFloat(data.lat), lng: parseFloat(data.long) };
            //const contentString = data.Desc;

            const contentString =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
               /* '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +*/
                '<div id="bodyContent">' +
                "<p><b>" + data.Desc+"</b>" +
                "</p>" +
                "</div>" +
                "</div>";



            const infowindow = new google.maps.InfoWindow({
                content: contentString,
            });


            const marker = new google.maps.Marker({
                position: myLatLng,
                map,
                title: "Place",
                //icon: '/images/Caricon.png',
            });
            


            marker.addListener("click", (event) => {
                infowindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: true,
                });
            });

        }


        

       
        $scope.getFormSummaryConfigList = function () {
            var param = {};
            param.action = 4;
            $scope.manageFormSummaryConfig(param);
        };

        $scope.init();
        

    });

}(FormGeneratorApp));