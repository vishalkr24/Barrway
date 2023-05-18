(function () {
    'use strict';
    FormGeneratorApp.controller('GenerarlUserController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams) {
        var clientId = $stateParams.id;
        $rootScope.$emit("ShowLoading");
        adminService.postAsync('Admin/GetClient/' + clientId, {}).then(function (res) {
            var result = res.data;
            if (result.Status) {
                $scope.clientUser = result.Data;
                $scope.clientUser.M_SEX = $scope.clientUser.M_SEX?.toLowerCase();
                $scope.clientUser.M_PAST_DIAGNOSIS = $scope.clientUser.M_PAST_DIAGNOSIS?.toLowerCase();
                $scope.clientUser.M_PAST_COUNSELLING = $scope.clientUser.M_PAST_COUNSELLING?.toLowerCase();
            } else {
                $scope.NoDataFound = true;
            }
            $rootScope.$emit("HideLoading");
        }, function (err) {
            $rootScope.$emit("HideLoading");
        });
    });

    FormGeneratorApp.controller('CounsellorController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams) {
        var clientId = $stateParams.id;
        var formId = $stateParams.formId;
        $scope.userDetail = mainService.loginDetails();
        $rootScope.$emit("ShowLoading");
        adminService.postAsync('Admin/GetCounsellor/' + clientId, {}).then(function (res) {
            var result = res.data;
            if (result.Status) {
                $scope.counsellor = result.Data;
                $scope.counsellor.CLLR_GENDER = $scope.counsellor.CLLR_GENDER?.toLowerCase();
                $('#CLLR_AGE_RANGE').val($scope.counsellor.CLLR_AGE_RANGE);
                $scope.counsellor.CLLR_IS_TEXT = $scope.counsellor.CLLR_IS_TEXT?.toLowerCase();
                $scope.counsellor.CLLR_IS_AUDIO = $scope.counsellor.CLLR_IS_AUDIO?.toLowerCase();
                $scope.counsellor.CLLR_IS_VIDEO = $scope.counsellor.CLLR_IS_VIDEO?.toLowerCase();
                $scope.counsellor.IS_ADMIN_APPROVED = $scope.counsellor.IS_ADMIN_APPROVED?.toLowerCase();
                //HSCore.components.HSTomSelect.init('.js-select');
                var optionLayout = '<option value=""></option>';
                $scope.counsellor.specilities.forEach(function (item) {
                    optionLayout +=`<option selected value="${item.CLLR_SPECIALITY}">${item.SPECIALITY_ENG}</option>`
                });
                var uid = uuidv4();
                var speciliies_select = `<select disabled class="js-select-${uid} form-select" autocomplete="off" multiple data-hs-tom-select-options='{ "placeholder": ""}'>
                                                           ${optionLayout}
                                                       </select>`

                $('#counsellor-specilities').html(speciliies_select);

                HSCore.components.HSTomSelect.init(`.js-select-${uid}`);

                if (!($scope.counsellor.CLLR_PROFILE_PIC && $scope.counsellor.CLLR_PROFILE_PIC != '' && $scope.counsellor.CLLR_PROFILE_PIC != 'null')) {
                    $scope.counsellor.CLLR_PROFILE_PIC = "/Content/assets/img/400x400/img2.jpg";
                }


                $('#avatarUploader').addClass(`js-file-attach-${uid}`);
                var hsfileattach = new HSFileAttach(`.js-file-attach-${uid}`);
                $('#avatarUploader').change(function () {

                    try {
                        $rootScope.$emit("ShowLoading");
                        var data = new FormData();
                        jQuery.each(jQuery('#avatarUploader')[0].files, function (i, file) {
                            data.append('file', file);
                        });

                        var uid = create_UUID();
                        var userId = $scope.userDetail.Id;
                        jQuery.ajax({
                            url: API_URL + `api/FormAPI/UploadFile?reqType=form&uid=${uid}&appId=353&appTitle=&formId=${formId}&formTitle=&isImportData=false&userId=${userId}&actionType=undefined`,
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            method: 'POST',
                            type: 'POST', // For jQuery < 1.9
                            success: function (data) {
                                if (data.success == true) {
                                    data.userName = $scope.counsellor.CLLR_USER_NAME;
                                    adminService.postAsync('Admin/UploadProfilePicCounsellor', data).then(function (res) {
                                        if (res.data.Status) {
                                            notifierService.notifyMessage('success', 'Profile Pic Upload', "Success");
                                        }
                                        else {
                                            notifierService.notifyMessage('error', 'Profile Pic Upload Error', res.data.Message);
                                        }
                                        $rootScope.$emit("HideLoading");
                                    }, function (err) {
                                        $rootScope.$emit("HideLoading");
                                    });
                                }
                            },
                            error: function (err) {
                                $rootScope.$emit("HideLoading");
                            }
                        });

                    } catch (ex) {
                        $rootScope.$emit("HideLoading");
                    }
                });

            } else {
                $scope.NoDataFound = true;
            }
            $rootScope.$emit("HideLoading");
        }, function (err) {
            $rootScope.$emit("HideLoading");
        });


        $scope.ChangeMarkup = function (type) {
            if (type == 'text') {
                var text_charge = ConverToDecimal($scope.counsellor.CLLR_TEXT_CHARGE);
                var markup = ConverToDecimal($scope.counsellor.CLLR_TEXT_MARKUP);
                var platform_charge = (text_charge + ((text_charge * markup) / 100)).toFixed("2").toString();
                $scope.counsellor.CLLR_TEXT_MARKUP_CAL = platform_charge;
            }
            if (type == 'audio') {
                var audio_charge = ConverToDecimal($scope.counsellor.CLLR_AUDIO_CHARGE);
                var markup = ConverToDecimal($scope.counsellor.CLLR_AUDIO_MARKUP);
                var platform_charge = (audio_charge + ((audio_charge * markup) / 100)).toFixed("2").toString();
                $scope.counsellor.CLLR_AUDIO_MARKUP_CAL = platform_charge;
            }
            if (type == 'video') {
                var video_charge = ConverToDecimal($scope.counsellor.CLLR_VIDEO_CHARGE);
                var markup = ConverToDecimal($scope.counsellor.CLLR_VIDEO_MARKUP);
                var platform_charge = (video_charge + ((video_charge * markup) / 100)).toFixed("2").toString();
                $scope.counsellor.CLLR_VIDEO_MARKUP_CAL = platform_charge;
            }
        }

        function ConverToDecimal(value) {
            try {
                if (value == "") return 0;
                return parseFloat(value);
            } catch (ex) {
                return 0;
            }
        }


        $scope.UpdateProfile = function () {

            if (!confirm('Are you sure update this profile?')) {
                return;
            }
            $rootScope.$emit("ShowLoading");
            var data = {
                IS_ADMIN_APPROVED: $('input[name="IS_ADMIN_APPROVED"]:checked').val(),
                CLLR_IS_TEXT: $('input[name="CLLR_IS_TEXT"]:checked').val(),
                CLLR_IS_AUDIO: $('input[name="CLLR_IS_AUDIO"]:checked').val(),
                CLLR_IS_VIDEO: $('input[name="CLLR_IS_VIDEO"]:checked').val(),
                CLLR_RECOMMENDED: $('input[name="CLLR_RECOMMENDED"]').is(":checked")?"1":"0",
                CLLR_TEXT_MARKUP: $scope.counsellor.CLLR_TEXT_MARKUP,
                CLLR_VIDEO_MARKUP: $scope.counsellor.CLLR_VIDEO_MARKUP,
                CLLR_AUDIO_MARKUP: $scope.counsellor.CLLR_AUDIO_MARKUP,
                CLLR_USER_NAME: $scope.counsellor.CLLR_USER_NAME,
                Id: $scope.counsellor.Id
            };


            adminService.postAsync('Admin/UpdateAdminCounsellorProfile', data).then(function (res) {
                if (res.data.Status) {
                    notifierService.notifyMessage('success', 'Profile Update', "Success");
                }
                else {
                    notifierService.notifyMessage('error', 'Profile Update Error', res.data.Message);
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
            });


            console.log(data);
        };

    });

    FormGeneratorApp.controller('ScheduleController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams) {

        function assignEvents(eventsData) {
            window["CalendarEventList"] = angular.copy(eventsData);
        }
        var eventDetailPopup = $("#eventDetailPopup");
        var bsOffcanvas;

        var calenderSettingsFormDetailsDataList, yaxisFormList = [], xaxisFormList = [];


        $scope.selectEventDetails = {};
        var defaultOptions = {
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            theme: true,
            themeSystem: 'jquery-ui',
            //  themeSystem:'bootstrap4',
            nowIndicator: true,
            slotDuration: '00:15:00',
            // defaultTimedEventDuration: defaultDuration,
            //aspectRatio: 1.5,
            defaultDate: new Date(),
            eventMouseover: function (event, jsEvent, view) {
                if (view.name !== 'agendaDay') {
                    ////console.log(event);
                    $(jsEvent.target).attr('title', event.title);
                }
            },
            //lazyFetching: true,
            now: new Date(),
            navLinks: true, // can click day/week names to navigate views
            editable: false,
            eventLimit: 4, // allow "more" link when too many events            
            loading: function (bool) {
                //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
                if (bool) {
                    showLoader("#agenda-view div.calendar .fc-view-container");
                }
                else {
                    hideLoader();
                    $("#agenda-view div.calendar .fc-view-container").unblock();
                }
            },
            eventRender: function (event, element) {
                
                var view = $('#agenda-view div.calendar').fullCalendar('getView');

                var current_tab = "agenda-view";
                var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                if (current_tab == "agenda-view") {
                    // $scope.$parent.$parent.IND_loading = true;
                    //if ($scope.counterLoader == undefined)
                    //showLoader();
                    $scope.counterLoader = 1;
                }
                var rowTooltipDisplay = "";
                var rowTooltipTitleDisplay = "";
                var rowRecord = "";
                var _associatedTitles = event.customTitle;
                var _associatedFormIDs = event.customForms;
                //var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
                var _ySelected = $scope.ySelection; // get y selected option.
                var _xSelected = $scope.xSelection;
                var _lablesToShow = []; var _colorToShow = [];
                var _tempTitle = "";
                var _tempTitleSecond = "";
                var _mainTempHtml = "";
                var eventData = {
                    Id: event.Id,
                    Images: event.files,
                    title: "Text",
                    start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                    end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                    allDay: event.allDay,
                    service: event.service,
                    description: event.description,
                    resources: event.resources,
                    activities: event.activities,
                    activityName: event.activityName,
                    formGroupKey: event.formGroupKey
                };
                eventData.title = _tempTitle;
                eventData.Images = event.files;
                if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                    var _arrTitles = _associatedTitles.split(',');
                    var _arrColor = [];
                    var _arrFormIDs = _associatedFormIDs.split(",");

                    if (!eventData.allDay) {
                        eventData.start = eventData.start != null && eventData.start != undefined && eventData.start != '' ? eventData.start : '';
                        if (eventData.end != "" && eventData.end != null) {
                            eventData.end = eventData.end != null && eventData.end != undefined && eventData.end != '' ? eventData.end : '';
                            rowTooltipDisplay += DateWithDayName(eventData, true) + " <br/> "
                            rowTooltipDisplay += TimeFormatCalender(eventData, true) + " "
                        } else {
                            rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                        }
                    }
                    else {
                        rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                    }
                    //element.find('.fc-content').remove();
                    //if (eventData.description != "" && eventData.description != null) {
                    //    _tempTitle += "<label class='pr-2'>" + eventData.description + "</label>";
                    //}
                    var tempHtml = "";

                    if (eventData.title != null && eventData.title.length > 0)
                        rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
                    if (!eventData.allDay) {
                        if (eventData.start != null && eventData.start.length > 0)
                            rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                        rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                        if (current_tab == "list-view") {
                            var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                            var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                                return item.trim();
                            });
                            var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                            var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                            var lblColor = undefined;
                            var customLocationTitle = "";
                            if (exists >= 0) {
                                customLocationTitle = _associatedTitlestemp[exists];
                                var tempColor = "";
                                var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                                var currentId = _associatedCustomFormIdsTemp[exists].toString();
                                if (colorExists != undefined) {
                                    var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                    if (colorRow != undefined) {
                                        tempColor = colorRow[colorExists.colorField];
                                    }
                                }
                                lblColor = tempColor;
                            }
                            if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                                var tempHtml = "<div class='fc-content' id='customLocationTitle' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div> ";
                                if (current_tab != "agenda-view") {
                                    _mainTempHtml += tempHtml;
                                }
                            }
                            //var tempHtml = "";
                            tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''>" + TimeFormatCalender(eventData, true) + "</small></div>" + _mainTempHtml;
                            // element.prepend(tempHtml);
                            if (current_tab != "agenda-view") {
                                _mainTempHtml = tempHtml;
                            }

                        } else {
                            if (current_subtab != undefined) {
                                if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                                    var tempHtml = "";
                                    tempHtml = "<div class='fc-content'><span class='text-dark small' title=''>" + TimeFormatCalender(eventData, true) + "</span></div>" + tempHtml;
                                    if (current_tab != "agenda-view") {
                                        _mainTempHtml += tempHtml;
                                    }
                                }
                            }

                        }
                    }
                    else {
                        if (current_tab == "list-view") {
                            var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                            var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                                return item.trim();
                            });
                            var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                            var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                            var lblColor = undefined;
                            var customLocationTitle = "";
                            if (exists >= 0) {
                                customLocationTitle = _associatedTitlestemp[exists];
                                var tempColor = "";
                                var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                                var currentId = _associatedCustomFormIdsTemp[exists].toString();
                                if (colorExists != undefined) {
                                    var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                    if (colorRow != undefined) {
                                        tempColor = colorRow[colorExists.colorField];
                                    }
                                }
                                lblColor = tempColor;
                            }
                            if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                                var tempHtml = "<div class='fc-content' id='dd' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div > ";
                                if (current_tab != "agenda-view") {
                                    _mainTempHtml += tempHtml;
                                }
                            }
                        }
                        rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                    }
                    //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                    var listids = event.customFormIds.split(',');
                    var currentId = 0;
                    tempHtml = "";
                    var isScreeningEvent = false;
                    var agendaTempHtml = "";
                    if (_arrFormIDs.length == 2 && current_tab == "agenda-view") {
                        agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #fff;color: #000;position:initial" data-original-title="" title="">';
                    } else if (_arrFormIDs.length == 3 && current_tab == "agenda-view") {
                        agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background:  #ddd;color: #000;position:initial" data-original-title="" title="">';
                    }
                    else {
                        agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #ddd;color: #000;position:initial" data-original-title="" title="">';
                    }
                    var agendaTempHtmlSub = '';
                    var titleCounter = 0;
                    var packgesessiontemplate = "";
                    var studenttemp = {};
                    var teacherTemp = "";
                    var iswaitingTemp = false;
                    _.each(_arrFormIDs, function (dataRow, position) {
                        if (dataRow !== _ySelected.toString()) {
                            var lblColor = "";
                            _lablesToShow.push(dataRow.toString());
                            var _arrRowData = _arrTitles[position];
                            currentId = listids[position].toString().trim();
                            var tempColor = "";
                            var colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: parseInt(dataRow.toString().trim()) });
                            if (colorExists != undefined) {
                                let colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                                lblColor = tempColor;
                            }
                            _arrRowData = _arrRowData.split('-');
                            var slipTitle = "";
                            if (_arrRowData.length == 1)
                                slipTitle = _arrRowData[0];
                            else if (_arrRowData.length > 1)
                                slipTitle = _arrRowData[0] + " - " + _arrRowData[1];

                            if (colorExists != undefined) {
                                if (colorExists.isVisible)
                                    rowTooltipTitleDisplay += slipTitle + " <br/> ";
                                else {
                                    if (!colorExists.isVisible && listids.length == 2)
                                        rowTooltipTitleDisplay += slipTitle + "  <br/> ";
                                }
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                                if (dataRow == "2240") {
                                    studenttemp['student'] = `<span style="font-size:14px;">${colorRow.M_USER_NAME}</span>`;
                                }
                                
                                if (dataRow == "2242") {
                                    var teacherNames = colorRow.CLLR_USER_NAME;
                                    if (event.customTitle.split(',').length > position) {
                                        
                                        teacherNames = event.customTitle.split(',')[position];
                                        teacherNames = teacherNames.replace("|", ",");
                                    }

                                    studenttemp['teacher'] = `<span style="font-size:14px;font-weight:600">${teacherNames}</span>`;
                                }
                              
                            }
                        }

                    });


                    
                    if (event.SESSION_STATUS == 'CONFIRMED' || event.SESSION_STATUS == 'COMPLETE') {
                        var service = `<spen style="text-transform:capitalize">${event.service?.toLowerCase()} Counselling</span>`;
                        packgesessiontemplate = `<span style="font-size:16px;font-weight:bold">${TimeFormatCalender(eventData, true).split('-')[0].trim()} ${service} </span><br>`;
                        } else {
                        iswaitingTemp = true;
                        var service = `<spen style="text-transform:capitalize">${event.service?.toLowerCase() } Counselling</span>`;
                        packgesessiontemplate = `<span style="font-size:16px;font-weight:bold">${TimeFormatCalender(eventData, true).split('-')[0].trim()} ${service} </span><br>`;
                            studenttemp['waiting'] = `<br/><span style="font-size:14px;font-weight:600">wait for counsellor confirm</span>`;
                        }
                    


                    if (iswaitingTemp) {
                        let studenttempLyaout = `<span style='color:#6A6A6A'>${studenttemp['student']}</span>,
                                            <span style='color:#6A6A6A'>${studenttemp['teacher']}</span>
                                            <span style='color:#3B5885'>${studenttemp['waiting']}</span>`;
                        agendaTempHtml += "<span class='fc-title' style='borderRadius: 3;color:#6A6A6A!important;'>" + packgesessiontemplate + "<br/>" + studenttempLyaout + "</span>";
                    } else {
                        let studenttempLyaout = `<span style='color:#000'>${studenttemp['student']}</span>,
                                            <span style='color:#3B5885'>${studenttemp['teacher']}</span>`;
                        agendaTempHtml += "<span class='fc-title' style='borderRadius: 3;'>" + packgesessiontemplate + "<br/>" + studenttempLyaout + "</span>";
                    }


                    agendaTempHtml += '</div>';

                    if (current_tab != "agenda-view") {
                        _mainTempHtml += tempHtml;
                    }
                    else {
                        _mainTempHtml += agendaTempHtml;
                    }

                }
                rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';

                rowRecord += '</div>';
                $scope.counterLoader = undefined;
                var tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div></div>";
                var basicDetails = window["EventBasicDetail"];
                var actionRow = "";
                actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId='" + $scope.currentFormId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>" + "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId='" + $scope.currentFormId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>" + "<div id='eventDelete' data-formId='" + $scope.currentFormId + "'    data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>" + "<a class='btn close-event cursor-pointer' title='close'  data-dismiss='modal' aria-label='Close'> <i class='fa fa-times'></i></a>";
                tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div></div>";
                var tempHtmlTable = "";
                if ($scope.listTabulator != undefined && $scope.listTabulator.length > 0) {
                    tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`;
                }
                else {
                    tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`

                }
                event.newdata = [];
                
                element.find('.fc-content').remove();
                element.append(_mainTempHtml)
                tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
                let $fcContent = element.find(".fc-content").detach(),
                    $resize = element.find(".fc-resizer").detach();
                element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
                element.attr('data-html', 'true');
                if (view.type == "agendaDay") {
                    element.css({
                        background: "#ddd",
                        borderColor: "#aaa",
                        padding: 2,
                        borderRadius: 5,

                        "z-index": 1
                    })
                        .droppable({
                            drop: function (event, ui) {
                            },
                        }).empty().append($fcContent.css({
                            borderRadius: 3,
                        }), $resize);
                } else {
                    element.css({
                        background: "rgb(255, 255, 255)",
                        borderColor: "#aaa",
                        padding: 2,
                        borderRadius: 5,

                        "z-index": 1
                    })
                        .droppable({
                            drop: function (event, ui) {
                            },
                        }).empty().append($fcContent.css({
                            borderRadius: 3,
                        }), $resize);
                }



            },
            eventClick: function (calEvent, jsEvent, view) {

                if ($(jsEvent.currentTarget).hasClass("disabled-event")) {
                    return;
                }



                var todayDate = moment(new Date()).local().format("YYYY-MM-DD HH:mm:ss");
                var eventDate = moment(calEvent.start.format());
                var Diffhours = moment(eventDate).diff(todayDate, 'hours');

                var btnShow = false;
                if (Diffhours >= 24) {
                    btnShow = true;
                }
               
                var myOffcanvas = document.getElementById('offcanvasRight')
                bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
                bsOffcanvas.show();
                eventDetailPopup.css({ "z-index": "9999" });
                $scope.selectEventDetails = calEvent;
                if (calEvent.formID == undefined) {
                    $scope.selectEventDetails.formID = $scope.currentFormId;
                }
                $scope.selectEventDetails.resourceFormId = $scope.ySelection;
                $scope.selectEventDetails.ActivityFormId = $scope.xSelection;
                $scope.selectEventDetails.start = $scope.selectEventDetails.start != null && $scope.selectEventDetails.start != undefined && $scope.selectEventDetails.start != '' ? customDate($scope.selectEventDetails.start.format()) : ''
                $scope.selectEventDetails.end = $scope.selectEventDetails.end != null && $scope.selectEventDetails.end != undefined && $scope.selectEventDetails.end != '' ? customDate($scope.selectEventDetails.end.format()) : ''
                $scope.selectEventDetails.customDate = DateWithDayName($scope.selectEventDetails, true);
                if (!$scope.selectEventDetails.allDay) {
                    $scope.selectEventDetails.customTime = TimeFormatCalender($scope.selectEventDetails, true);
                }
                else {
                    $scope.selectEventDetails.customDate = moment($scope.selectEventDetails.start).format("YYYY-MM-DD");
                }
                //$scope.selectEventDetails.customFormIdsSplit
                //$scope.selectEventDetails.customFormsSplit
                $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');
                $scope.selectEventDetails.customFormsSplit = $scope.selectEventDetails.customForms.split(',');
                $scope.selectEventDetails.customFormIdsSplit = $scope.selectEventDetails.customFormIds.split(',');
                var listFormDropdown = _.filter($scope.selectEventDetails.customFormsSplit, function (item) { return item != $scope.ySelection.toString(); });
                eventHtml = "";
                if (listFormDropdown.length > 0) {
                    var listActivities = _.filter(xaxisFormList, function (item) { return item.activitiesForm != $scope.ySelection; });
                    $scope.selectEventDetails.dropdownList = [];
                    _.each(listActivities, function (item, key) {
                        var tempDrop = {};
                        var indexForm = _.findIndex($scope.selectEventDetails.customFormsSplit, function (itemForm) { return itemForm.trim() == item.activitiesForm.toString() });
                        if (indexForm != -1) {
                            tempDrop.formId = item.activitiesForm.toString();
                            tempDrop.Id = $scope.selectEventDetails.customFormIdsSplit[indexForm];
                            tempDrop.formTitle = $scope.selectEventDetails.customTitleSplit[indexForm];
                            tempDrop.dropdownListData = item;
                            tempDrop.customClass = "false";
                            eventHtml += tempDrop.formTitle + "<br/>";
                        } else {
                            tempDrop.formId = item.activitiesForm.toString();
                            tempDrop.Id = "0";
                            tempDrop.formTitle = item.title;
                            tempDrop.dropdownListData = item;
                            tempDrop.customClass = "true";
                            //eventHtml += tempDrop.formTitle;
                        }
                        $scope.selectEventDetails.dropdownList.push(tempDrop);
                    });


                    //console.log($scope.selectEventDetails);

                }
                var cancelHours = 24;
                var a = moment(new Date());
                var b = moment(calEvent.start);
                var hours = b.diff(a, 'hours');
                if (hours <= cancelHours) {
                    $('#btn-cancel').hide();
                    $('#btn-cancel').removeAttr('data-status');
                    $('#btn-cancel').removeAttr('data-id');
                    $('#btn-cancel').attr('data-status', 'false');

                } else {
                    $('#btn-cancel').attr('data-status', 'true');
                    $('#btn-cancel').attr('data-id', calEvent.SESSION_ID);
                    $('#btn-cancel').show();
                }
               
                var customTime = TimeFormatCalender(calEvent, true);
                var eventHtml = `<h4><span style="text-transform:capitalize">${calEvent.service?.toLowerCase()}</span> Counselling</h4>
                        <p>Time: ${customTime}</p>
                        <h4>Attendee</h4>
                        <p>${$scope.selectEventDetails.customTitleSplit.length > 1 ? $scope.selectEventDetails.customTitleSplit[2]:""}</p>`;
                $('#event-detail').html(eventHtml);




                //console.log($scope.selectEventDetails);

                $('.close-event').on('click', function () {
                    $("body .popover").addClass('isPopoverLoaded');
                    $("body .popover").popover('hide');
                    $("#tabuListUl").empty();
                    //var $scope = angular.element($("#calendar")).scope();
                    $('.temp').find('.titleContainer').removeClass('d-none');
                    $('.popoverSelect').addClass('d-none');

                });

            },
            eventAfterAllRender: function (event, element, view) {
                
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

                if (current_tab == "agenda-view") {
                    //var $scope = angular.element($("#calendar")).scope();
                    $scope.$parent.$parent.IND_loading = false;
                    setTimeout(function () {
                        $.unblockUI();
                    }, 1000);
                } else {
                    $.unblockUI();
                }
                setTimeout(function () {
                    jQuery.curCSS = function (element, prop, val) {
                        return jQuery(element).css(prop, val);
                    };
                    $('.fc-content').bstooltip({ html: true });
                    $('.fc-timeline-event').bstooltip({ html: true });
                    $('.fc-list-item').bstooltip({ html: true });
                    $('.fc-day-grid-event').bstooltip({ html: true });
                    $('.fc-time-grid-event').bstooltip({ html: true });

                    setTimeout(function () {
                        $('#agenda-view div.calendar').fullCalendar('render');
                    }, 150);
                }, 150);
            }
        };

        var agendaSelectDate = '';
        var myOptions = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaDay,month,agendaWeek'
            },
            defaultView: 'month',
            views: {
                timelineThreeDays: {
                    type: 'timeline',
                    duration: { days: 3 }
                },
                month: { buttonText: 'month' },
                agendaWeek: { buttonText: 'week' },
                agendaDay: { buttonText: 'day' },
            },
            //events: [],  
            events: function (start, end, timezone, callback) {
                //var $scopeVar = angular.element($("#calendar")).scope();
                var param = {};
                param.action = 1;
                param.formId = $scope.currentFormId;

                param.isCalender = 1;
                param.isEvent = 1;

                param.resourceFormId = $scope.ySelection;
                param.ActivityFormId = $scope.xSelection;
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#agenda-view div.calendar').fullCalendar('getView');
                param.filter = {};
                start = $('#agenda-view div.calendar').fullCalendar('getDate');
                param.filter = changeStateOfCalender(view, start, end);
                param.filter.field = "start";
                param.startDate = moment(start.format()).format("YYYY-MM-DD HH:mm:ss");
                param.endDate = moment(end.format()).format("YYYY-MM-DD HH:mm:ss");


                adminService.postAsync('Admin/GetAllSchedule', param).then(function (response) {
                    $rootScope.$emit("HideLoading");
                    var calenderData = changeResourceIDByYSelection((response.data != undefined) ? response.data : response.data);


                    if (calenderData != undefined) {
                        calenderData.forEach(cal => {

                            cal.start = moment(cal.start).format("YYYY-MM-DDTHH:mm:ss");
                            cal.end = moment(cal.end).format("YYYY-MM-DDTHH:mm:ss");
                        });
                        assignEvents(angular.copy(calenderData));
                        callback(calenderData);
                        window["eventListTemp"] = calenderData;
                    }
                    else
                        callback([]);


                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                });
            },
            scrollTime: '00:00',

            allDaySlot: true,
            selectable: false,

            //selectAllow: function (select) {
            //    return moment().diff(select.start, 'days') <= 0
            //},
            selectHelper: true,
            select: function (start, end) {

                if ($scope.IsScreeningBooked) {
                    return;
                }

                if ($scope.IsScreeningBooking) {

                    myModal.show();
                    agendaSelectDate = moment(start.format()).format('YYYY-MM-DD');
                    defaultOptions2.defaultDate = agendaSelectDate;
                    $("#agenda-view div.calendar").fullCalendar('unselect');

                } else {
                    $scope.ChangeChild();
                    myModal.show();
                    agendaSelectDate = moment(start.format()).format('YYYY-MM-DD');
                    defaultOptions2.defaultDate = agendaSelectDate;

                    $("#agenda-view div.calendar").fullCalendar('unselect');
                }
            },
        };


        $scope.init = function () {
            $scope.currentFormId = 2267;
            $scope.ySelection = 2268;
            $scope.xSelection = 2268;

            $scope.IsScreeningBooking = false;
            $scope.IsScreeningBooked = false;


            $rootScope.$emit("ShowLoading");

            var params = { action: 4, formId: 2267 };

            var promiseList = [];
            promiseList.push(adminService.postAsync("admin/getCalenderSettingsFormData/", params));

            Promise.all(promiseList).then(function (response) {


                if (response[0].data != null && response[0].data != undefined) {
                    calenderSettingsFormDetailsDataList = response[0].data;
                    loadLeftSideMenu();
                    var calendarOptions = $.extend({}, defaultOptions, myOptions);
                    $('#agenda-view div.calendar').fullCalendar(calendarOptions);
                }

            });

            //getApplicationDetails();
        };

        function loadLeftSideMenu() {
            yaxisFormList = calenderSettingsFormDetailsDataList;
            yaxisFormList = _.filter(yaxisFormList, function (item) { return item.resourceForm != 0 });
            $.each(calenderSettingsFormDetailsDataList, function (position, dataRow) {
                //console.log(dataRow);
                if (dataRow.activitiesForm !== 0)
                    xaxisFormList.push(dataRow);
            });

        }
        $scope.init();

        $scope.CancelBooking = function () {

            if (!confirm('Are you sure cancel this event?')) {
                return;
            }
            var id = $('#btn-cancel').data("id");

            bsOffcanvas.hide();
            $rootScope.$emit("ShowLoading");
            adminService.postAsync('Admin/CancelCounselling/' + id, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {

                    //refetchEvents
                    $('#agenda-view div.calendar').fullCalendar('refetchEvents');
                } else {

                }
                alert(result.Message);
                $rootScope.$emit("HideLoading");

            }, function (err) {

                $rootScope.$emit("HideLoading");
            });



        }

    });

    FormGeneratorApp.controller('TransactionTableController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams, $timeout, $ngBootbox) {

        var tabulator;
        $scope.TransactionHistory = function () {
            var columns = [
                {title: 'USER NAME', field: 'USER_NAME', headerFilter: "input"},
                {title: 'USER NICK NAME', field: 'USER_NICK_NAME', headerFilter: "input"},
                {title: 'COUNSELLOR FIRST NAME', field: 'CLLR_FIRST_NAME', headerFilter: "input"},
                {title: 'COUNSELLOR LAST NAME', field: 'CLLR_LAST_NAME', headerFilter: "input", formatter: "html"},
                {title: 'COUNSELLING TYPE', field: 'SERVICE_TYPE', headerFilter: "input"},
                {
                    title: 'START TIME', field: 'start', formatter: function (cell, formatter) {
                        return moment(cell.getData().PAYMENT_DATE).format("DD-MM-YYYY HH:mm:ss")
                    }
                },
                {
                    title: 'END TIME', field: 'end', formatter: function (cell, formatter) {
                        return moment(cell.getData().PAYMENT_DATE).format("DD-MM-YYYY HH:mm:ss")
                    }
                },
                {title: 'STATUS', field: 'SESSION_STATUS', headerFilter: "input"},
                { title: 'ATTENDANCE', field: 'ATTENDANCE', headerFilter: "input"},
                { title: 'HOW DO YOU FEEL?', field: 'M_USER_FEEDBACK', headerFilter: "input"},
                {
                    title: 'COUNSELLING RATTING', formatter: function(cell, formatterParams, onRendered) {
                        var value = cell.getValue();
                        var stars = "";
                        for (var i = 0; i < 5; i++) {
                            if (value != null && value == i + 0.5) {
                                stars += "<i class='fa fa-star-half-o'></i>";
                            } else if (value!=null && value > i) {
                                stars += "<i class='fa fa-star'></i>";
                            } else {
                                stars += "<i class='fa fa-star-o'></i>";
                            }
                        }
                        return stars;
                    }, hozAlign: "center", field: 'RATTING_POINT'},
                { title: 'COUNSELLOR FEEDBACK', field: 'CLLR_FEEDBCAK', headerFilter: "input"},
                {
                    title: 'CREATE DATE', field: 'created_at', formatter: function (cell, formatter) {
                        return moment(cell.getData().created_at).format("DD-MM-YYYY HH:mm:ss")
                    }
                },
            ];

            $timeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    // layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                        var data = localStorage.getItem(id + "-" + type);
                        var dataParse = JSON.parse(data);
                        if (!DataService.isEmpty(data) && type == "columns") {
                            _.each(headers, function (item) {
                                var exists = _.findWhere(dataParse, {
                                    field: item.field
                                });
                                if (!DataService.isEmpty(exists)) {
                                    exists.visible = item.visible;
                                }
                            })
                        }
                        else if (type == "page") {
                            if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                dataParse.paginationSize = $scope.paginationSizeFormRecords;
                        }
                        return data ? dataParse : false;
                    },
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: BASE_URL + "admin/TransactionHistory",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {}, //ajax parameters
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                        if (called)
                            $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        $('#form-records').unblock();
                        $.unblockUI();
                        if (!DataService.isEmpty(response.data)) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: $scope.paginationSizeFormRecords,

                };
                tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };
        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons 
            });
        };
        $scope.exportAll = function (type) {
            var data = "";

            var fileNameDownload = angular.copy('Transaction Table');
            fileNameDownload = fileNameDownload.split(" ").join("");
            var dataformatFile = moment(new Date());
            fileNameDownload = fileNameDownload + "_" + dataformatFile.format("DD_MM_YYYY") + "_" + dataformatFile.format("HH:MM:SS");
            switch (type) {
                case 1:
                    tabulator.download("json", fileNameDownload + ".json");
                    break;
                case 2:
                    tabulator.download("xlsx", fileNameDownload + ".xlsx", { sheetName: "sheet1" });
                    break;
                case 3:
                    //tabulator.download(fileFormatter, "test.txt");
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: ",", bom: true });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "landscape", //set page orientation to portrait
                        title: 'Transaction Table' //add title to report
                        , bom: true
                        //autoTable: { //advanced table styling
                        //    styles: {
                        //        fillColor: [100, 255, 255]
                        //    },
                        //    columnStyles: {
                        //        id: { fillColor: 255 }
                        //    },
                        //    margin: { top: 60 },
                        //},
                        //documentProcessing: function (doc) {
                        //    //carry out an action on the doc object
                        //}
                    });
                    break;
                case 6:
                    window.location.href = BASE_URL + "Admin/ExportTransactionHistory";
                    break;
                default:
                    data = "";
                    break;
            }
        };
        $scope.TransactionHistory();
    });

    FormGeneratorApp.controller('ForumDetailController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams) {
        $scope.BindForum = function () {

            $rootScope.$emit("ShowLoading");
            adminService.getAsync('admin/GetForum/' + $stateParams.forumId, {}).then(function (res) {
                var result = res.data;
                if (!result.Status) {
                    notifierService.notifyMessage('error', 'Forum Detail', result.Message);
                }
                $scope.ForumData = result.Data[0];
                $scope.ForumData.created_at = moment($scope.ForumData.created_at).format("YYYY-MM-DD HH:mm");
                $scope.ForumData.comments = $scope.ForumData.comments != null ? $scope.ForumData.comments : [];
                $scope.ForumData.comments.forEach(x => x.created_at = moment(x.created_at).format("YYYY-MM-DD HH:mm"));    

                var layout = '<div class="paginate">';


                $scope.ForumData.comments.forEach((item) => {

                    var likeclass = item.IS_LIKED == 0 ? "bi-hand-thumbs-up" : "bi-hand-thumbs-up-fill";
                    var reportclass = item.IS_REPORTED == 0 ? "bi-flag" : "bi-flag-fill";

                    layout += ` <div class="card items" ng-repeat="item in ForumData.comments">
                <div class="card-body">
                    <h6 class="card-title">${item.FORUM_USER_NAME} &nbsp;&nbsp;&nbsp;&nbsp; Posted on ${item.created_at}</h6>
                    <!--<h6 class="card-title">#1</h6>-->
                    <p class="card-text">${item.FRM_COMMENT}</p>
                    <div class="row card-text">
                        <div class="col-md-3">
                            <div class="row col-divider">
                                <div class="col">
                                    <span class="h4"><span id="frmc_liked_count_${item.Id}">${item.FRM_COMMNETS_LIKE_COUNT}</span> <i onclick="angular.element(this).scope().LikedForumComment(this)" 
                                    data-id="${item.Id}" data-count="${item.FRM_COMMNETS_LIKE_COUNT}" data-liked="${item.IS_LIKED}" class="${likeclass}" style="cursor:pointer"></i> LIKE</span>
                                </div>
                                <!-- End Col -->

                                <div class="col">
                                    <span class="h4"><i class="${reportclass}"></i> REPORT</span>
                                </div>
                                <!-- End Col -->
                            </div>
                        </div>
                        <div class="col-md-9">
                            <button class="btn btn-danger float-end" onclick="angular.element(this).scope().DeleteForumComment(${item.Id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`;

                });

                layout += `<div id="pager" class="pager float-end">
                <div class="firstPage">&laquo;</div>
                <div class="previousPage">&lsaquo;</div>
                <div class="pageNumbers"></div>
                <div class="nextPage">&rsaquo;</div>
                <div class="lastPage">&raquo;</div>
            </div></div>`;


                $('#paginate').empty();
                $('#paginate').html(layout);

                setTimeout(function () {
                    $(".paginate").paginga({
                        itemsPerPage: 2
                        // use default options
                    });
                }, 500);

                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        }

        $scope.BindForum();

        $scope.MarkHotTopic = function () {
            var url = "";

            if ($('#IS_RECOMMENDED').is(":checked")) {
                url = "admin/ForumMarkHotTopic/" + $stateParams.forumId;
            } else {
                url = "admin/RemoveForumMarkHotTopic/" + $stateParams.forumId;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Forum', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };


        $scope.ApprovedRejectForum = function () {
            var status = $('input[name="IS_APPROVED"]:checked').val();
            var url = "";
            if (status=="YES") {
                url = "admin/ForumApproved/" + $stateParams.forumId;
            } else {
                url = "admin/ForumReject/" + $stateParams.forumId;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Forum', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };


        $scope.LikedForum = function (IS_LIKED) {
            var url = "";
            var data = {};
            if (IS_LIKED == 0) {
                url = "admin/SaveForumLikes";
                data.FRM_ID = $stateParams.forumId;
            }
            else {
                url = "admin/DislikeForum/" + $stateParams.forumId;
            }

            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, data).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    $scope.ForumData.IS_LIKED = IS_LIKED == 0 ? 1 : 0;
                    $scope.ForumData.FRM_LIKE_COUNT = IS_LIKED == 0 ? $scope.ForumData.FRM_LIKE_COUNT + 1 : $scope.ForumData.FRM_LIKE_COUNT-1;
                    notifierService.notifyMessage('success', 'Forum', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });
        }


        $scope.LikedForumComment = function (element) {
            var frmcid = $(element).data('id');
            var IS_LIKED = $(element).data('liked');
            var liked_count = $(element).data('count');
            var likeclass = IS_LIKED == 0 ? "bi-hand-thumbs-up" : "bi-hand-thumbs-up-fill";
            var url = "";
            var data = {};
            if (IS_LIKED == 0) {
                url = "admin/SaveForumCommentsLike";
                data.FRMC_ID = frmcid;
            }
            else {
                url = "admin/DislikeForumComments/" + frmcid;
            }

            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, data).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    IS_LIKED = IS_LIKED == 0 ? 1 : 0;
                    $(element).removeClass(likeclass);
                    likeclass = IS_LIKED == 0 ? "bi-hand-thumbs-up" : "bi-hand-thumbs-up-fill";
                    $(element).addClass(likeclass);
                    liked_count = IS_LIKED == 0 ? liked_count - 1 : liked_count + 1;
                    $('#frmc_liked_count_' + frmcid).text(liked_count);
                    $(element).data('liked', IS_LIKED);
                    $(element).data('count', liked_count);

                    notifierService.notifyMessage('success', 'Forum', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });
        }


        $scope.ReplySumbit = function () {

            var reply_text = $('#reply-text').val();
            if (reply_text == "" || !reply_text) {
                notifierService.notifyMessage('warning', 'Forum Reply', "Please input some comment text!");
                return;
            }

            var data = {
                FRM_ID: $stateParams.forumId,
                FRM_COMMENT: reply_text
            };

            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/PostReply", data).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Forum', result.Message);
                    $scope.BindForum();
                    $scope.isReply = false;
                    $('#reply-text').val('');
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };


        $scope.DeleteForumComment = function (id) {
            if (!confirm('Are you sure delete this comment?')) {
                return;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/DeleteComment/"+id, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Forum', result.Message);
                    $scope.BindForum();
                } else {
                    notifierService.notifyMessage('error', 'Forum', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };

    });

    FormGeneratorApp.controller('ArticleDetailController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams) {

        $rootScope.$emit("ShowLoading");

        function getEmbedUrl(youtubeUrl) {
            if (youtubeUrl.includes("embed")) {
                return youtubeUrl;
            }
            let videoId = youtubeUrl.split('v=')[1];
            let ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition != -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            let embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return embedUrl;
        }

        function getVideoId(youtubeUrl) {
            if (youtubeUrl.includes("embed")) {
                if (youtubeUrl.split('/').length > 1) {
                    var lastIndex = youtubeUrl.split('/').length - 1;
                    let videoId = youtubeUrl.split('/')[lastIndex];
                    return videoId;
                }
                return '';
            } else {
                if (youtubeUrl.split('v=').length > 1) {
                    let videoId = youtubeUrl.split('v=')[1];
                    return videoId;
                }
                return '';
            }
            
        }


        adminService.getAsync('admin/GetArticle/' + $stateParams.articleId, {}).then(function (res) {
            var result = res.data;
            if (!result.Status) {
                notifierService.notifyMessage('error', 'Forum Detail', result.Message);
            }
            $scope.ArticleData = result.Data[0];
            $scope.isComment = ($scope.ArticleData.AR_ADMIN_COMMENT && $scope.ArticleData.AR_ADMIN_COMMENT != '' && $scope.ArticleData.AR_ADMIN_COMMENT != 'null');
            $scope.ArticleData.created_at = moment($scope.ArticleData.created_at).format("YYYY-MM-DD HH:mm");
            var AR_YOUTUBE_LINKS = $scope.ArticleData.AR_YOUTUBE_LINKS;
            var AR_IMAGES = $scope.ArticleData.AR_IMAGES;
            if (AR_YOUTUBE_LINKS && AR_YOUTUBE_LINKS != '' && AR_YOUTUBE_LINKS != 'null' && (!AR_IMAGES || AR_IMAGES == 'null' || AR_IMAGES == '')) {
                var embed_url = getEmbedUrl(AR_YOUTUBE_LINKS);
                var html_youtube = ` <iframe width="100%" height="400" src="${embed_url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                setTimeout(function () {
                    $('#iframe_youtube').html(html_youtube);
                }, 500);
            } else if (AR_IMAGES && AR_IMAGES != 'null' && AR_IMAGES != '' && (AR_YOUTUBE_LINKS != '' && AR_YOUTUBE_LINKS && AR_YOUTUBE_LINKS != 'null')) {
                var embed_url = getEmbedUrl(AR_YOUTUBE_LINKS);
                var videoId = getVideoId(AR_YOUTUBE_LINKS);
                var html_youtube = `<div class="youtube-container">
                                    <div class="youtube-player" data-id="${videoId}" data-thumbnail="${AR_IMAGES}"></div>
                                    </div>`;
                setTimeout(function () {
                    $('#iframe_youtube').html(html_youtube);

                    (function () {
                        getVideos();
                    })();

                }, 500);



            }

            $rootScope.$emit("HideLoading");
        }).catch(function (err) {
            console.log("some error occured." + err);
            $rootScope.$emit("HideLoading");
        });




        /**
 * Get videos on load
 */
        //(function () {
        //    getVideos();
        //})();

        /**
         * For each video player, create custom thumbnail or
         * use Youtube max resolution default thumbnail and create
         * iframe video.
         */
        function getVideos() {
            var v = document.getElementsByClassName("youtube-player");
            for (var n = 0; n < v.length; n++) {
                var p = document.createElement("div");
                var id = v[n].getAttribute("data-id");

                var placeholder = v[n].hasAttribute("data-thumbnail")
                    ? v[n].getAttribute("data-thumbnail")
                    : "";

                if (placeholder.length) p.innerHTML = createCustomThumbail(placeholder);
                else p.innerHTML = createThumbail(id);

                v[n].appendChild(p);
                p.addEventListener("click", function () {
                    var parent = this.parentNode;
                    createIframe(parent, parent.getAttribute("data-id"));
                });
            }
        }

        /**
         * Create custom thumbnail from data-attribute provided url
         * @param {string} url
         * @return {string} The HTML containing the <img> tag
         */
        function createCustomThumbail(url) {
            return (
                '<img class="youtube-thumbnail" src="' +
                url +
                '" alt="Youtube Preview" /><div class="youtube-play-btn"></div>'
            );
        }

        /**
         * Get Youtube default max resolution thumbnail
         * @param {string} id The Youtube video id
         * @return {string} The HTML containing the <img> tag
         */
        function createThumbail(id) {
            return (
                '<img class="youtube-thumbnail" src="//i.ytimg.com/vi_webp/' +
                id +
                '/maxresdefault.webp" alt="Youtube Preview"><div class="youtube-play-btn"></div>'
            );
        }

        /**
         * Create and load iframe in Youtube container
         **/
        function createIframe(v, id) {
            var iframe = document.createElement("iframe");
            console.log(v);
            iframe.setAttribute(
                "src",
                "//www.youtube.com/embed/" +
                id +
                "?autoplay=1&color=white&autohide=2&modestbranding=1&border=0&wmode=opaque&enablejsapi=1&showinfo=0&rel=0"
            );
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("class", "youtube-iframe");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "400");
            v.firstChild.replaceWith(iframe);
        }

        /** Pause video on modal close **/
        $("#video-modal").on("hidden.bs.modal", function (e) {
            $(this).find("iframe").remove();
        });

        /** Pause video on modal close **/
        $("#video-modal").on("show.bs.modal", function (e) {
            getVideos();
        });





        $scope.MarkHotTopic = function () {
            var url = "";

            if ($('#IS_RECOMMENDED').is(":checked")) {
                url = "admin/ArticleMarkHotTopic/" + $stateParams.articleId;
            } else {
                url = "admin/RemoveArticleMarkHotTopic/" + $stateParams.articleId;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Article', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Article', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };


        $scope.ApprovedRejectArticle = function () {
            var status = $('input[name="IS_ADMIN_APPROVED"]:checked').val();
            var url = "";
            if (status == "YES") {
                url = "admin/ArticleApproved/" + $stateParams.articleId;
            } else {
                url = "admin/ArticleReject/" + $stateParams.articleId;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync(url, {}).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Article', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Article', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };


        $scope.CommentSumbit = function () {

            var reply_text = $('#reply-text').val();
            if (reply_text == "" || !reply_text) {
                notifierService.notifyMessage('warning', 'Article Comment', "Please input some comment text!");
                return;
            }

            var data = {
                id: $stateParams.articleId,
                comment: reply_text
            };

            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/SubmitAdminComment", data).then(function (res) {
                var result = res.data;
                if (result.Status) {
                    notifierService.notifyMessage('success', 'Article', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'Article', result.Message);
                }
                $rootScope.$emit("HideLoading");
            }).catch(function (err) {
                console.log("some error occured." + err);
                $rootScope.$emit("HideLoading");
            });

        };
    });
    FormGeneratorApp.controller('ForumMasterController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams, $timeout, $ngBootbox) {

        var tabulator;
        $scope.BindForumMasterList = function () {
            var columns = [
                {
                    title: 'Action', field: 'ACTION', formatter: function (cell, formatter) {
                        return `<a href='#/admin/forum/${cell.getRow().getData().Id}' class="btn btn-primary text-light"><i class="bi-info-circle"></i></a>`;
                    }, headerSort: false },
                { title: 'Topic Title', field: 'FRM_TITLE', headerFilter: "input" },
                { title: 'Category', field: 'FRM_CAT_NAME', headerFilter: "input" },
                { title: 'Replies', field: 'FRM_COMMENTS_COUNT' },
                { title: 'Views', field: 'FRM_VIEW_COUNT' },
                { title: 'Hot topic', field: 'IS_RECOMMENDED', headerFilter: "input" },
                {
                    title: 'Created by', field: 'FORUM_USER_NAME', headerFilter: "input" 
                },
                {
                    title: 'Last updates', field: 'updated_at', formatter: function (cell, formatter) {
                        return moment(cell.getData().updated_at).format("DD-MM-YYYY HH:mm:ss")
                    }
                },
            ];

            $timeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    selectable: true,
                    // layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "updated_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                        var data = localStorage.getItem(id + "-" + type);
                        var dataParse = JSON.parse(data);
                        if (!DataService.isEmpty(data) && type == "columns") {
                            _.each(headers, function (item) {
                                var exists = _.findWhere(dataParse, {
                                    field: item.field
                                });
                                if (!DataService.isEmpty(exists)) {
                                    exists.visible = item.visible;
                                }
                            })
                        }
                        else if (type == "page") {
                            if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                dataParse.paginationSize = $scope.paginationSizeFormRecords;
                        }
                        return data ? dataParse : false;
                    },
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: BASE_URL + "admin/GetForumMaster",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {}, //ajax parameters
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                            if ($('.badge-active').length > 0) {
                                params.catId = $('.badge-active').data("id");
                            }

                        if (called)
                            $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        $('#form-records').unblock();
                        $.unblockUI();
                        if (!DataService.isEmpty(response.data)) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: $scope.paginationSizeFormRecords,
                    rowSelectionChanged: function (data, rows) {


                        var formGroupKeyList = [];
                        $scope.selectedDeletedRecordList = [];
                        data.forEach(function (item, key) {
                            formGroupKeyList.push(item.Id);
                            $scope.selectedDeletedRecordList.push(item);
                        });
                        window["formGroupKeyList"] = formGroupKeyList;

                        $rootScope.safeApply();
                    },

                };
                tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };
        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons 
            });
        };
        $scope.exportAll = function (type) {
            var data = "";

            var fileNameDownload = angular.copy('Transaction Table');
            fileNameDownload = fileNameDownload.split(" ").join("");
            var dataformatFile = moment(new Date());
            fileNameDownload = fileNameDownload + "_" + dataformatFile.format("DD_MM_YYYY") + "_" + dataformatFile.format("HH:MM:SS");
            switch (type) {
                case 1:
                    tabulator.download("json", fileNameDownload + ".json");
                    break;
                case 2:
                    tabulator.download("xlsx", fileNameDownload + ".xlsx", { sheetName: "sheet1" });
                    break;
                case 3:
                    //tabulator.download(fileFormatter, "test.txt");
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: ",", bom: true });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "landscape", //set page orientation to portrait
                        title: 'Transaction Table' //add title to report
                        , bom: true
                        //autoTable: { //advanced table styling
                        //    styles: {
                        //        fillColor: [100, 255, 255]
                        //    },
                        //    columnStyles: {
                        //        id: { fillColor: 255 }
                        //    },
                        //    margin: { top: 60 },
                        //},
                        //documentProcessing: function (doc) {
                        //    //carry out an action on the doc object
                        //}
                    });
                    break;
                case 6:
                    window.location.href = BASE_URL + "Admin/ExportTransactionHistory";
                    break;
                default:
                    data = "";
                    break;
            }
        };

        $scope.getAllHotTopic = function () {

            adminService.postAsync("admin/GetForumHotTopic", {}).then(function (res) {
                var result = res.data;
                $scope.allHotTopic = result.Data ? result.Data : [];
                $scope.allHotTopic.forEach(x => { x.created_at = moment(x.created_at).format("YYYY-MM-DD HH:mm"); x.updated_at = moment(x.updated_at).format("YYYY-MM-DD HH:mm") });    

                $timeout(function () {
                    $('.slider').slick({
                        slidesToShow: 3,
                        slidesToScroll: 1
                    });
                }, 500);

            });
        }

        $scope.getAllCategory = function () {

            adminService.postAsync("admin/GetForumCategory", {}).then(function (res) {
                var result = res.data;
                $scope.allCategory = result.Data ? result.Data : [];

                $timeout(function () {
                    $('.slider2').slick({
                        slidesToShow: 5,
                        slidesToScroll: 1
                    });
                }, 500);

            });
        }

        $scope.BindForumMasterList();
        $scope.getAllHotTopic();
        $scope.getAllCategory();
        $scope.userDetail = mainService.loginDetails();

        $scope.filterCategory = function (event) {
            var element = event.target;
            $(element).addClass("badge-active");
            $('div.badge-active').not(element).removeClass("badge-active");
            $scope.BindForumMasterList();


        }

        $scope.deleteRecords = function () {
            if (window["formGroupKeyList"].length > 0) {
                var deletedList = window["formGroupKeyList"];
                var param = {};
                param.action = 3;
                param.formId = "2246";
                param.name = $scope.userDetail.name;
                param.userId = $scope.userDetail.Id;
                var newDeletedList = [];
                var newformGroupKeyDeletedList = [];

                angular.forEach($scope.selectedDeletedRecordList, function (item) {
                    newDeletedList.push(item.Id);
                    newformGroupKeyDeletedList.push(item.formGroupKey);
                });

             

                if (newDeletedList.length > 0) {
                    param.formGroupKeyList = newDeletedList.join();
                    window["formGroupKeyList"] = newDeletedList;
                    param.formfieldDataListTemp = newformGroupKeyDeletedList.join();
                    if (confirm('Are you sure to delete selected Record?')) {
                        GeneratedFormDataDelete(param);
                    }
                } else if (isDelete == true && newDeletedList.length == 0) {
                    $timeout(function () {
                        notifierService.notifyMessage('error', 'Delete Time', 'Delete Time is exceed');
                    }, 200);
                }

            }
            else {
                //  alert('Please select atleast one record.')
                notifierService.notifyMessage('error', 'Forum Records', 'Please select atleast one record.');
            }
        };


        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            dataParam.name = $scope.userDetail.name;
            dataParam.userId = $scope.userDetail.Id;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {
                                notifierService.notifyMessage('success', 'FormRecord', exists.Message);

                                $timeout(function () {
                                    BindForumMasterList();
                                }, 150);

                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

    });

    FormGeneratorApp.controller('CllrActivityController', function ($scope, $http, $timeout, $stateParams, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, CookiesPersistenceService, notifierService, $filter) {

        $scope.months = [
            {
                "abbreviation": "Jan",
                "name": "January",
                "value": 1
            },
            {
                "abbreviation": "Feb",
                "name": "February",
                "value": 2
            },
            {
                "abbreviation": "Mar",
                "name": "March",
                "value": 3
            },
            {
                "abbreviation": "Apr",
                "name": "April",
                "value": 4
            },
            {
                "abbreviation": "May",
                "name": "May",
                "value": 5
            },
            {
                "abbreviation": "Jun",
                "name": "June",
                "value": 6
            },
            {
                "abbreviation": "Jul",
                "name": "July",
                "value": 7
            },
            {
                "abbreviation": "Aug",
                "name": "August",
                "value": 8
            },
            {
                "abbreviation": "Sep",
                "name": "September",
                "value": 9
            },
            {
                "abbreviation": "Oct",
                "name": "October",
                "value": 10
            },
            {
                "abbreviation": "Nov",
                "name": "November",
                "value": 11
            },
            {
                "abbreviation": "Dec",
                "name": "December",
                "value": 12
            }
        ];

        $scope.years = [];
        var date = new Date();
        var currentYear = date.getFullYear();
        var previousFiveYears = currentYear - 5;
        for (var i = previousFiveYears; i <= currentYear; i++) {
            $scope.years.push(i);
        }
        var myModal = new bootstrap.Modal(document.getElementById('OpenOrderDetailsPopup'), {
            keyboard: false
        });

        $scope.init = function () {
            $scope.CounsellorActivity();
            $scope.paginationSizeFormRecords = 20;
            $scope.fromdate = "";
            $scope.todate = "";
        };
        var tabulator = undefined;
        var tabulator2 = undefined;
        $scope.CounsellorActivity = function (fromdate = "", todate = "") {
            var columns = [
                {
                    title: 'USER NAME', field: 'USER_NAME', headerFilter: "input"
                },
                {
                    title: 'USER NICK NAME', field: 'USER_NICK_NAME', headerFilter: "input"
                },
                {
                    title: 'COUNSELLOR FIRST NAME', field: 'CLLR_FIRST_NAME', headerFilter: "input"
                },
                {
                    title: 'COUNSELLOR LAST NAME', field: 'CLLR_LAST_NAME', headerFilter: "input"
                },
                {
                    title: 'COUNSELLING TYPE', field: 'COUNSELLING_TYPE', headerFilter: "input"
                },
                {
                    title: 'START TIME', field: 'START_TIME', headerFilter: "input"
                },
                {
                    title: 'END TIME', field: 'END_TIME', headerFilter: "input"
                },
                { title: 'STATUS', field: 'STATUS', headerFilter: "input" },
                { title: 'ATTENDANCE', field: 'ATTENDANCE', headerFilter: "input" },
                /*{ title: 'ATTENDANCE', field: 'ATTENDANCE', headerFilter: "input" },*/
                {
                    title: 'PAY RATE/HR', field: 'PAY_RATE', headerFilter: "input"
                },
                {
                    title: 'PLATFORM RATE/HR', field: 'PLATFORM_RATE', headerFilter: "input"
                }
            ];
            //columns.forEach((x) => {
            //    x.title = $scope.translation[x.title];
            //});

            $timeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    // layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "START_TIME", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                        var data = localStorage.getItem(id + "-" + type);
                        var dataParse = JSON.parse(data);
                        if (!DataService.isEmpty(data) && type == "columns") {
                            _.each(headers, function (item) {
                                var exists = _.findWhere(dataParse, {
                                    field: item.field
                                });
                                if (!DataService.isEmpty(exists)) {
                                    exists.visible = item.visible;
                                }
                            })
                        }
                        else if (type == "page") {
                            if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                dataParse.paginationSize = $scope.paginationSizeFormRecords;
                        }
                        return data ? dataParse : false;
                    },
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: BASE_URL + "admin/GetCounsellorActivity",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {}, //ajax parameters
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "START_TIME", dir: "desc" });
                        }

                        params.fromdate = fromdate;
                        params.todate = todate;

                        if (called)
                            $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        $('#form-records').unblock();
                        $.unblockUI();
                        if (!DataService.isEmpty(response.data)) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: $scope.paginationSizeFormRecords,

                };
                tabulator = initTabulator('form-records', options);
            }, 150);
            $('.form-builder-loader').hide();
        };


        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Upload/Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
            });


        };
        $scope.exportAll = function (type) {
            if (type == 6) {
                window.location.href = BASE_URL + "admin/ExportCounsellorActivity";
            }
        };



        $scope.filterDate = function (form) {

            if (form.$valid) {
                $scope.invalid = false;
                var fromdate = moment($scope.fromdate, "DD/MM/YYYY").format("YYYY-MM-DD");
                var todate = $scope.todate != "" ? moment($scope.todate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59") : "";
                $scope.CounsellorActivity(fromdate, todate);
            } else {
                $scope.CounsellorActivity();
            }
        }

        $scope.generatePaySlip = function (form) {
            if (form.$valid) {
                $scope.invalid2 = true;
                window.open(BASE_URL + 'admin/GeneratePaySlip?year=' + $scope.year + "&month=" + $scope.month);
            } else {
                $scope.invalid2 = true;
            }

        };

        //end tabulator
        $scope.init();
    });

    FormGeneratorApp.controller('notfoundController', function ($scope) {


    });

    FormGeneratorApp.controller('PaymentHistoryController', function ($scope, $http, $timeout, $stateParams, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, $filter) {

        $scope.init = function () {
            $scope.PaymentHistory();
            $scope.fromdate = "";
            $scope.todate = "";
            $scope.paginationSizeFormRecords = 20;
            $scope.isScreening = false;

            if ($stateParams.orderno && $stateParams.pay_type == "screening") {
                $scope.getScreeningOrderDetails($stateParams.orderno);
                $scope.isScreening = true;
            }
            if ($stateParams.orderno && $stateParams.pay_type == "package") {
                $scope.getPackageOrderDetails($stateParams.orderno);
            }

        };


        var myModal = new bootstrap.Modal(document.getElementById('OpenOrderDetailsPopup'), {
            keyboard: false
        });


        $('#OpenOrderDetailsPopup').on('hidden.bs.modal', function () {
            $scope.PaymentHistory();
        });



        $scope.getPackageOrderDetails = function (id) {
            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/GetOrderDetails/" + id, {})
                .then(function (response) {
                    if (response.data.Status) {
                        $scope.isScreening = false;
                        $scope.applicationFullDetails = response.data.Data;
                        $scope.userData = $scope.applicationFullDetails.userDetails;
                        $scope.packageMaster = $scope.applicationFullDetails.packageMaster;
                        $scope.orderMaster = $scope.applicationFullDetails.orderData;
                        $scope.orderDate = moment($scope.applicationFullDetails.orderData.PAYMENT_DATETIME).format("DD-MM-YYYY");
                        if ($scope.orderMaster.PAYMENT_STATUS == "SUCCESS") {
                            $scope.PackagePaid = true;
                        }
                        $scope.totalAmount = $scope.applicationFullDetails.orderData.ORDER_PRICE;

                        myModal.show();
                    } else {
                        notifierService.notifyMessage('error', 'failed', response.data.Message);
                        $state.go("Home");
                    }

                    $rootScope.$emit("HideLoading");
                }, function (err) {

                    $rootScope.$emit("HideLoading");
                    console.log(err);

                });
        }

     
        var tabulator = undefined;
        $scope.PaymentHistory = function (fromdate = "", todate = "") {
            var columns = [
                {
                    title: 'Action', field: 'Action', headerFilter: "input", download: false, formatter: function (cell, formatter) {

                        return `<a href="admin/printinvoice?orderno=${cell.getData().ORDER_NO}" target="_blank" class="btn btn-default">RECEIPT</a>`
                    }
                },
                {
                    title: 'Id', field: 'Id', visible: false
                },
                {
                    title: 'ORDER ID', field: 'ORDER_NO', headerFilter: "input"
                },
                {
                    title: 'USER NAME', field: 'USER_NAME', headerFilter: "input"
                },
                {
                    title: 'USER NICK NAME', field: 'USER_NICK_NAME', headerFilter: "input"
                },
                {
                    title: '$M PURCHASE', field: 'ORDER_COIN', headerFilter: "input", formatter: "html"
                },
                {
                    title: 'PACKAGE', field: 'PACKAGE_NAME', headerFilter: "input"
                },
                {
                    title: 'HK$ PAID', field: 'ORDER_PRICE', headerFilter: "input"
                },
                { title: 'PAYMENT METHOD', field: 'PAYMENT_TYPE', headerFilter: "input" },
                {
                    title: 'PAID DATE', field: 'PAYMENT_DATETIME', headerFilter: "input", formatter: function (cell, formatter) {

                        return moment(cell.getData().PAYMENT_DATETIME).format("DD-MM-YYYY HH:mm:ss")
                    }
                },
                {
                    title: 'STATUS', field: 'PAYMENT_STATUS', formatter: function (cell, formatter) {


                        var status = cell.getData().PAYMENT_STATUS;
                        var orderno = cell.getData().ORDER_NO;
                        var orderId = cell.getData().Id;
                        if (status == "SUCCESS") {
                            return `<button type="button" onclick="angular.element(this).scope().getPackageOrderDetails('${orderId}')" class="btn btn-success">${status}</button>`;
                        }

                        if (status == "OPEN") {
                            return `<button type="button" onclick="angular.element(this).scope().getPackageOrderDetails('${orderId}')" class="btn btn-info">${status}</button>`;
                        }
                        if (status == "REJECTED") {
                            return `<button type="button" class="btn btn-danger">${status}</button>`;
                        }


                    }
                }
            ];
            //columns.forEach((x) => {
            //    x.title = $scope.translation[x.title];
            //});

            $timeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    // layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "PAYMENT_DATETIME", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                        var data = localStorage.getItem(id + "-" + type);
                        var dataParse = JSON.parse(data);
                        if (!DataService.isEmpty(data) && type == "columns") {
                            _.each(headers, function (item) {
                                var exists = _.findWhere(dataParse, {
                                    field: item.field
                                });
                                if (!DataService.isEmpty(exists)) {
                                    exists.visible = item.visible;
                                }
                            })
                        }
                        else if (type == "page") {
                            if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                dataParse.paginationSize = $scope.paginationSizeFormRecords;
                        }
                        return data ? dataParse : false;
                    },
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: BASE_URL + "admin/GetPaymentHistory",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {}, //ajax parameters
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "PAYMENT_DATETIME", dir: "desc" });
                        }

                        params.fromdate = fromdate;
                        params.todate = todate;

                        if (called)
                            $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        $('#form-records').unblock();
                        $.unblockUI();
                        if (!DataService.isEmpty(response.data)) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: $scope.paginationSizeFormRecords,

                };
                tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };

        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Upload/Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
            });


        };
        $scope.exportAll = function (type) {
            if (type == 6) {
                window.location.href = BASE_URL + "admin/ExportPaymentHistory";
            }
        };


        $scope.filterDate = function (form) {

            if (form.$valid) {
                $scope.invalid = false;
                var fromdate = moment($scope.fromdate, "DD/MM/YYYY").format("YYYY-MM-DD");
                var todate = $scope.todate != "" ? moment($scope.todate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59") : "";
                $scope.PaymentHistory(fromdate, todate);

            } else {
                $scope.invalid = true;
                $scope.PaymentHistory();
            }

        }


        $scope.AcceptPayment = function (orderno) {
            if (!confirm('Are you confirm Accept this payment?')) {
                return;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/AcceptPayment", { ORDER_NO: orderno }).then(function (response) {

                var result = response.data;

                if (result.Status) {
                    notifierService.notifyMessage('success', 'Payment Approved!', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'failed', result.Message);
                }
                $rootScope.$emit("HideLoading");
                myModal.hide();
            }, function (err) {
                console.log(err);
                $rootScope.$emit("HideLoading");
                myModal.hide();
            });
        }
        $scope.RejectPayment = function (orderno) {
            if (!confirm('Are you confirm Reject this paymnet?')) {
                return;
            }
            $rootScope.$emit("ShowLoading");
            adminService.postAsync("admin/RejectPayment", { ORDER_NO: orderno }).then(function (response) {

                var result = response.data;

                if (result.Status) {
                    notifierService.notifyMessage('success', 'Payment Rejected!', result.Message);
                } else {
                    notifierService.notifyMessage('error', 'failed', result.Message);
                }
                $rootScope.$emit("HideLoading");
                myModal.hide();
            }, function (err) {
                console.log(err);
                $rootScope.$emit("HideLoading");
                myModal.hide();
            });
        }

        //end tabulator
        $scope.init();
    });


    FormGeneratorApp.controller('AdminUsersController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams, $timeout, $ngBootbox) {

        var tabulator;
        $scope.AdminUsersList = function () {
            var columns = [
                {
                    title: "Action", formatter: function (cell, formatter) {
                        var id = cell.getRow().getData().Id;
                        var formgroupKey = cell.getRow().getData().formGroupKey;
                        return `<a href='#/form/editEntry/2238/${formgroupKey}/${id}' class="btn btn-primary text-light"><i class="bi-info-circle"></i></a>`
                    }, download: false, width: 100, field: "ACTION", headerSort: false
                },
                { title: 'formGroupKey', field: 'formGroupKey', download: false, headerSort: false, visible: false },
                { title: 'Id', field: 'Id', download: false, headerSort: false, visible: false },
                { title: 'USER NAME', field: 'USER_NAME', headerFilter: "input" },
                { title: 'USER EMAIL', field: 'USER_EMAIL', headerFilter: "input" },
                { title: 'USER PHONE', field: 'USER_PHONE', headerFilter: "input" },
                { title: 'USER ROLE', field: 'ROLE_NAME', headerFilter: "input"},
                { title: 'IS ACTIVE', field: 'IS_ACTIVE', headerFilter: "input"},
                {
                    title: 'CREATE DATE', field: 'created_at', formatter: function (cell, formatter) {
                        return moment(cell.getData().created_at).format("DD-MM-YYYY HH:mm:ss")
                    }
                }
            ];

            $timeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    // layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                        var data = localStorage.getItem(id + "-" + type);
                        var dataParse = JSON.parse(data);
                        if (!DataService.isEmpty(data) && type == "columns") {
                            _.each(headers, function (item) {
                                var exists = _.findWhere(dataParse, {
                                    field: item.field
                                });
                                if (!DataService.isEmpty(exists)) {
                                    exists.visible = item.visible;
                                }
                            })
                        }
                        else if (type == "page") {
                            if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                dataParse.paginationSize = $scope.paginationSizeFormRecords;
                        }
                        return data ? dataParse : false;
                    },
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: BASE_URL + "admin/GetAdminUsers",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {}, //ajax parameters
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                        if (called)
                            $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        $('#form-records').unblock();
                        $.unblockUI();
                        if (!DataService.isEmpty(response.data)) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: $scope.paginationSizeFormRecords,
                    selectable: true,

                    rowSelectionChanged: function (data, rows) {


                        var formGroupKeyList = [];
                        $scope.selectedDeletedRecordList = [];
                        data.forEach(function (item, key) {
                            formGroupKeyList.push(item.Id);
                            $scope.selectedDeletedRecordList.push(item);
                        });
                        window["formGroupKeyList"] = formGroupKeyList;

                        $rootScope.safeApply();
                    }


                };
                tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };
        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons 
            });
        };
        $scope.exportAll = function (type) {
            var data = "";

            var fileNameDownload = angular.copy('Transaction Table');
            fileNameDownload = fileNameDownload.split(" ").join("");
            var dataformatFile = moment(new Date());
            fileNameDownload = fileNameDownload + "_" + dataformatFile.format("DD_MM_YYYY") + "_" + dataformatFile.format("HH:MM:SS");
            switch (type) {
                case 1:
                    tabulator.download("json", fileNameDownload + ".json");
                    break;
                case 2:
                    tabulator.download("xlsx", fileNameDownload + ".xlsx", { sheetName: "sheet1" });
                    break;
                case 3:
                    //tabulator.download(fileFormatter, "test.txt");
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: ",", bom: true });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "landscape", //set page orientation to portrait
                        title: 'Transaction Table' //add title to report
                        , bom: true
                        //autoTable: { //advanced table styling
                        //    styles: {
                        //        fillColor: [100, 255, 255]
                        //    },
                        //    columnStyles: {
                        //        id: { fillColor: 255 }
                        //    },
                        //    margin: { top: 60 },
                        //},
                        //documentProcessing: function (doc) {
                        //    //carry out an action on the doc object
                        //}
                    });
                    break;
                case 6:
                    window.location.href = BASE_URL + "Admin/ExportAllAdminUsers";
                    break;
                default:
                    data = "";
                    break;
            }
        };

        $scope.deleteRecords = function () {
            if (window["formGroupKeyList"].length > 0) {
                var deletedList = window["formGroupKeyList"];
                var param = {};
                param.action = 3;
                param.formId = "2238";
                param.name = $scope.userDetail.name;
                param.userId = $scope.userDetail.Id;
                var newDeletedList = [];
                var newformGroupKeyDeletedList = [];

                angular.forEach($scope.selectedDeletedRecordList, function (item) {
                    newDeletedList.push(item.Id);
                    newformGroupKeyDeletedList.push(item.formGroupKey);
                });



                if (newDeletedList.length > 0) {
                    param.formGroupKeyList = newDeletedList.join();
                    window["formGroupKeyList"] = newDeletedList;
                    param.formfieldDataListTemp = newformGroupKeyDeletedList.join();
                    if (confirm('Are you sure to delete selected Record?')) {
                        GeneratedFormDataDelete(param);
                    }
                } else if (isDelete == true && newDeletedList.length == 0) {
                    $timeout(function () {
                        notifierService.notifyMessage('error', 'Delete Time', 'Delete Time is exceed');
                    }, 200);
                }

            }
            else {
                //  alert('Please select atleast one record.')
                notifierService.notifyMessage('error', 'Forum Records', 'Please select atleast one record.');
            }
        };
        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            dataParam.name = $scope.userDetail.name;
            dataParam.userId = $scope.userDetail.Id;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {
                                notifierService.notifyMessage('success', 'FormRecord', exists.Message);

                                $timeout(function () {
                                    $scope.AdminUsersList();
                                }, 150);

                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };


        $scope.AdminUsersList();
    });




    FormGeneratorApp.controller('SchedularFormController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, adminService, DataService, notifierService, $state, $stateParams, $timeout, $ngBootbox) {

        HSCore.components.HSFlatpickr.init('.js-flatpickr');

        adminService.postAsync('/Calendar/GetLocationMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), calendarCode: localStorage.getItem("CALENDAR_CODE") }).then(function (res) {
            
            $scope.locationList = res.data.data;

        }, function (err) {

        });

        adminService.postAsync('/Calendar/GetServiceMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), calendarCode: localStorage.getItem("CALENDAR_CODE") }).then(function (res) {

            $scope.serviceList = res.data.data;

        }, function (err) {

        });

        adminService.postAsync('/Calendar/GetServiceProviderMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), calendarCode: localStorage.getItem("CALENDAR_CODE") }).then(function (res) {
            
            $scope.serviceProviderList = res.data.data;
        }, function (err) {

        });

        $scope.saveSchedularForm = function () {

            var scheduleTableData = {
                "Monday": {
                    "Start": $("#Monday_Start_Time").val(),
                    "End": $("#Monday_End_Time").val()
                },
                "Tuesday": {
                    "Start": $("#Tuesday_Start_Time").val(),
                    "End": $("#Tuesday_End_Time").val(),
                },
                "Wednesday": {
                    "Start": $("#Wednesday_Start_Time").val(),
                    "End": $("#Wednesday_End_Time").val(),
                },
                "Thursday": {
                    "Start": $("#Thursday_Start_Time").val(),
                    "End": $("#Thursday_End_Time").val(),
                },
                "Friday": {
                    "Start": $("#Friday_Start_Time").val(),
                    "End": $("#Friday_End_Time").val()
                },
                "Saturday": {
                    "Start": $("#Saturday_Start_Time").val(),
                    "End": $("#Saturday_End_Time").val()
                },
                "Sunday": {
                    "Start": $("#Sunday_Start_Time").val(),
                    "End": $("#Saturday_End_Time").val()
                }
            };

            var data = {
                COMPANY_CODE: localStorage.getItem("COMPANY_CODE"),
                CALENDAR_CODE: localStorage.getItem("CALENDAR_CODE"),
                SCH__NAME: "",
                SCH_LOCATION: $("#SCH_LOCATION option:selected").val(),
                SCH_ACTIVITY: $("#SCH_ACTIVITY option:selected").val(),
                SCH_RESOURCE: $("#SCH_RESOURCE option:selected").val(),
                SCH_MEDIUM: "ZOOM",
                SCH_DESCRIPTION: "",
                SCH_FROM_DATE: $("#SCH_FROM_DATE").val(),
                SCH_TO_DATE: $("#SCH_TO_DATE").val(),
                SCH_ALTERNATIVE_WEEK: $("input[name='alternate-week']:checked").val(),
                IF_SLOT_EXIST: "SKIP",
                IF_SLOT_DOES_NOT_EXIST: "INSERT",
                table: scheduleTableData
            }

            //data = JSON.stringify(data);

            adminService.postAsync('/Calendar/AddSchedule/', { data: data }).then(function (res) {
                window.location.reload();                
            }, function (err) {
                alert("No");
            });

        }

        $scope.hideSchedularFormModal = function () {
            $(".schedular-form input").val("")
            $("#schedularFormNew").modal("hide");
        }
        
        $scope.showSchedularFormModal = function () {
            $("#schedularFormNew").modal("show");
        }


    });




}(FormGeneratorApp));