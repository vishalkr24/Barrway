//var _firechat;
//var registration_ids;
//firebase.auth().onAuthStateChanged(function (user) {
//    // Once authenticated, instantiate Firechat with the logged in user
//    if (user) {
//        console.log("Firebase: Chat connected!!");
//        var chatRef = firebase.database().ref(_chat_ref);
//        // Create a Firechat instance
//        _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
//        _firechat.maxLengthMessage = 10000;
//        _firechat._chat.setUser(user.uid, user.displayName, function (user) {
//            console.log("Firebase: User Authenticated!!");
//        });
//        updatetoken(user);
//    } else {
//        console.log("Firebase: Chat disconnected!!");
//    }
//});

$(document).ready(function (e) {    
    $('[data-toggle="tooltip"]').tooltip();
    $(".chat-closed").on("click",function(e){
        $(".chat-header,.chat-content").removeClass("hide");
        $(this).addClass("hide");
        if($('#firechat-tab-content .chat').length)
            $('#firechat-tab-content .chat').scrollTop($('#firechat-tab-content .chat')[0].scrollHeight);
    });

    $(".chat-header").on("click",function(e){
        $(".chat-header,.chat-content").addClass("hide");
        $(".chat-closed").removeClass("hide");
    });
});
function addFormNew(appId) {
    alert(appId);
};
function getHeaderFilterName(){
    var pathArray = window.location.hash.split('/');
    var tabulatorFilter = '';
    if(pathArray.length){
        var lastValue = pathArray[pathArray.length - 1];
        if(isNaN(lastValue)){
            tabulatorFilter = 'tabulator-header-filter-';
            tabulatorFilter += (lastValue === 'edit') ? pathArray[pathArray.length - 3] + '-' + pathArray[pathArray.length - 2] + '-' + lastValue : lastValue;
        }
        else{
            tabulatorFilter = 'tabulator-header-filter-' + pathArray[pathArray.length - 2] + '-' + lastValue;
        }
    }
    return tabulatorFilter;
}

function setDropdownHeaderFilter(fieldName, fieldValue) {    
    var tabulatorFilter = getHeaderFilterName();
    if(tabulatorFilter !== ''){                                
        var filterArr = JSON.parse(localStorage.getItem(tabulatorFilter));
        if (filterArr != null) {
            filterArr['name'] = $('.panel-heading #menuName').text();
            //var value = parseInt(fieldOptions.indexOf(fieldValue));
            filterArr['filters'][fieldName] = fieldValue;
            localStorage.setItem(tabulatorFilter, JSON.stringify(filterArr));
        }
        
    }
}

function setTabulatorHeaderFilter(tabulator){
    var tabulatorFilter = getHeaderFilterName();
    if(tabulatorFilter !== ''){
        var filterArr = JSON.parse(localStorage.getItem(tabulatorFilter));
        //console.log(filterArr);
        if(Object.keys(filterArr['filters']).length > 0){
            $.each(filterArr['filters'], function(field, value){
                //console.log("setHeaderFilterValue", field, value);
                //tabulator.tabulator("setHeaderFilterValue", field, value);
                tabulator.setHeaderFilterValue(field, value);
            });
        }            
        //$tabulator.tabulator("setHeaderFilterFocus", 'text-1505264103699');
    }
}

function updatetoken(user) {
    if (typeof navigator.serviceWorker === 'undefined') {
        return;
    }
    var messaging = firebase.messaging();
    navigator.serviceWorker.register(ASSET_URL + '/fg-assets/firechat/firebase-messaging-sw.js')
    .then(function(registration) {
        messaging.useServiceWorker(registration);
        // Request permission and get token.....
        messaging.requestPermission()
        .then(function () {
            console.log('Notification permission granted.');
            
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            return messaging.getToken()
                    .then(function (currentToken) {
                        if (currentToken) {
                            $.ajax({
                                type: "POST",
                                data: {'userID': user.uid, 'token': currentToken},
                                url: BASE_URL + '/users/updatNotificatonToken',
                                dataType: 'json',
                                success: function (data) {
                                    registration_ids = data;
                                }
                            });
                            // Handle incoming messages. Called when:
                            // - a message is received while the app has focus
                            // - the user clicks on an app notification created by a service worker
                            messaging.onMessage(function (payload) {
                                //console.log('Message received. ', payload);
                                if(typeof payload.data !== 'undefined'){
                                    if(payload.data.queue === 'summary-update')
                                        $('body #form-records-page .refresh-summary').click();
                                }
                                if(typeof payload.notification !== 'undefined') {
                                    const notificationTitle = payload.notification.title;
                                    const notificationOptions = {
                                        body: payload.notification.body,
                                        icon: payload.notification.icon
                                    };

                                    if (!("Notification" in window)) {
                                        alert("This browser does not support system notifications");
                                        console.log("This browser does not support system notifications");
                                    }
                                    // Let's check whether notification permissions have already been granted
                                    else if (Notification.permission === "granted") {
                                        // If it's okay let's create a notification
                                        var notification = new Notification(notificationTitle, notificationOptions);
                                        notification.onclick = function (event) {
                                            event.preventDefault(); // prevent the browser from focusing the Notification's tab
                                            window.open(payload.notification.click_action, '_blank');
                                            notification.close();
                                        };
                                    }
                                }
                            });
                        } else {
                            // Show permission request.
                            console.log('No Instance ID token available. Request permission to generate one.');
                        }
                    })
                    .catch(function (err) {
                        console.log('An error occurred while retrieving token. ', err);

                    });

        })
        .catch(function (err) {
            console.log('Unable to get permission to notify.', err);
        });
    });
}

/*$( document ).ajaxSend(function() {
 $.blockUI({ message: null });
 }).ajaxComplete(function() {
 //setTimeout($.unblockUI, 10);
 $.unblockUI();
 });*/
//var assetsImagePath = window.location.origin + '/form-generator/public/fg-assets/images';
var assetsImagePath = ASSET_URL + 'fg-assets/images';
// close alert messages after 3 seconds
setInterval(function () {
    $(".alert.alert-dismissible, .alert.alert-dismissable").fadeTo(2000, 500).slideUp(500, function () {
        $(".alert.alert-dismissible, .alert.alert-dismissable").alert('close');
    });
}, 3000);

//highlight current / active link
$('ul.navbar-nav li a').each(function () {
    if ($($(this))[0].href === String(window.location))
        $(this).parent().addClass('active');
});

$(document).on('change', 'input.show-more-settings', function () {
    /*if($(this).is(':checked')){
     // Show extra attributes
     $(this).parents( "div.form-group.more_setup-wrap" ).nextUntil( "div.form-group.advance_setup-wrap" ).removeClass( "hidden" );
     }else{
     // Hide extra attributes
     $(this).parents( "div.form-group.more_setup-wrap" ).nextUntil( "div.form-group.advance_setup-wrap" ).addClass( "hidden" );
     }*/
    $(this).parents("div.form-group.more_setup-wrap").nextUntil("div.form-group.advance_setup-wrap").slideToggle("fast", "swing");
});
$(document).on('change', 'input.show-advance-settings', function () {
    $(this).parents("div.form-group.advance_setup-wrap").nextAll("div.form-group").slideToggle("fast", "swing");
});

$(document).on('change', 'input.show-format-settings', function () {
    $(this).parents("div.form-group.form_setup-wrap").nextUntil("div.form-group.more_setup-wrap").slideToggle("fast", "swing");
});

$(document).on('change', 'select#application', function () {
    $(this).closest('form').find('select#topic option').not(':first').addClass('hidden');
    var app = $(this).find('option:selected').val();
    $(this).closest('form').find('select#topic option[data-id=' + app + ']').removeClass('hidden');
});

$(document).on('click','input.table_anchor',function(){
    var $this = $(this);
    var name = $this.attr('name');
//    var form = $this.closest('.col-xs-5').find('input[type="text"]').val();
    var form = $this.parent().find('input[name="'+name+'[option]"]').val();
    var field = "";
    if(form !== undefined && form.length > 0){
        var deparm = extraDeparam(form);
        if(deparm !== undefined){
            name.replace(/\[[^\]]*?\]/g, '');
            var column = name.replace(/\[[^\]]*?\]/g, '');
            if (deparm[column] != undefined) {
            var fieldType = name.match(/\[(.*?)\]/)[1];
            var options = deparm[column][fieldType]['option'];
                if (options.length > 0) {
                    $(options).each(function (i, s) {
                        field += '<li class="ui-sortable-handle"><input type="text" class="option-label form-control" value="' + s + '" name="' + name + '[option][]" placeholder="Label">' +
                            '<a class="remove btn model_remove" title="Remove Element">×</a></li>';
                    })
                }
            }
        }
    }
    else{
        field += '<li class="ui-sortable-handle"><input type="text" class="option-label form-control" value="Option 1" name="' + name + '[option][]" placeholder="Label">' +
            '<a class="remove btn model_remove" title="Remove Element">×</a></li>';
    }
    bootbox.dialog({
        title: "Option Add",
        message:'<div class="panel-blue">'+    
                '<div class="row">'+
                '<div class="col-sm-12">'+
                '<div class="form-wrap form-builder modal-form"><form class="frmb">'+
		'<div class="form-group field-options">'+
                '<label class="false-label col-sm-2">Options</label>'+
                '<div class="sortable-options-wrap">'+
                '<ol class="sortable-options ui-sortable" id="'+name+'">'+field+
                '</ol>'+
                '<div class="option-actions">'+
                '<a class="add add-opt model-addOption">Add Option +</a>'+
                '</div></div></div></div></form></div></div></div>',
        buttons: {
            cancel: {
                label: 'Cancel',
                className: 'btn-default',
                callback: function () {
                }
            },
            confirm: {
                label: 'OK',
                className: 'btn-primary',
                callback: function(){
                    var form = $('form.frmb').serialize();
                    $this.parent().find('input[name="'+name+'[option]"]').val(form);
                }
            }
        }
    });
});
$(document).on('click', 'input.table_referrence', function () {
    var $this = $(this);
    var name = $this.attr('name');
    //    var form = $this.closest('.col-xs-5').find('input[type="text"]').val();
    var form = $this.parent().find('input[name="' + name + '[data]"]').val();
    var field = "";
   
    bootbox.dialog({
        title: "Add Referrence",
        message: `<div class="panel-blue" id="table_referrence">
            <div class="row">
            <div class="col-sm-12">
            <div class="form-wrap form-builder modal-form"><form class="frmb">
              <div class="row">
            <div class= "col-md-12" >
                <div class="form-group row">
                    <input type="hidden" value="text" />
                    <label class="control-label col-sm-4" for="Forms">Select Referrence Form</label>
                    <div class="col-sm-8">
                        <select class="form-control Forms" name="Forms" >
                           
                        </select>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="control-label col-sm-4" for="Form_Fields_Value">Select Referrence Value Field</label>
                    <div class="col-sm-8">
                        <select class="form-control Form_Fields_Value" name="Form_Fields_Value">
                         
                        </select>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="control-label col-sm-4" for="Form_Fields" >Select Referrence Text Field</label>
                    <div class="col-sm-8">
                        <select class="form-control Form_Fields" name="Form_Fields">
                          
                        </select>
                    </div>
                </div>

                               
                            </div>
                        </div>
            <input type="hidden" id="controlDiv" class="form-control">
               </form></div></div></div>`,
        buttons: {
            cancel: {
                label: 'Cancel',
                className: 'btn-default',
                callback: function () {
                }
            },
            confirm: {
                label: 'OK',
                className: 'btn-primary',
                callback: function () {
                    var form = $('form.frmb').serialize();
                    $this.parent().find('input[name="' + name + '[data]"]').val(form);                
                }
            }
        }
    });
    setTimeout(function () {
        createOptions($("#table_referrence form select.Forms"), Referral_Forms);
        createOptions($("#table_referrence form select.Form_Fields, #table_referrence form select.Form_Fields_Value"), Referral_Fields);


        var $formField = $("#table_referrence form select.Forms"),
            $columnField = $("#table_referrence form select.Form_Fields"),
            $columnField1 = $("#table_referrence form select.Form_Fields_Value"); 
        var formId = $formField.val();
        $formField.change(function (e) {
            $columnField.val('0').change();
            $columnField1.val('0').change(); 
            formId = $formField.val();
            var disabled = (formId === '0') ? true : false;
            effectChildField(disabled, $columnField, formId);
            effectChildField(disabled, $columnField1, formId);          
        });
    
        if (form != "") {
            var deparm = extraDeparam(form);
            if (deparm !== undefined) {
                if (deparm.Forms != "" ) {
                    $formField.val(deparm.Forms);
                } else {
                    $formField.val(0);
                }
                $columnField.val(0);
                $columnField1.val(0);
                if (deparm.Form_Fields != "") {               
                    $columnField.val(deparm.Form_Fields);
                }
                if (deparm.Form_Fields_Value != "") {
                    $columnField1.val(deparm.Form_Fields_Value);
                }               
            }
        }
        formId = $formField.val();
        var disabled = (formId === '0') ? true : false;
        effectChildField(disabled, $columnField, formId);
        effectChildField(disabled, $columnField1, formId); 
    },150);

});



$(document).on('click','a.model-addOption',function(){
    var aa=$(this).closest('div.sortable-options-wrap');
    aa.find('ol li:last').clone().appendTo(aa.find('ol'));
});

$(document).on('click','a.model_remove',function(){
    $(this).parent().remove();
});

//$(document).on('click','a#groupCode',function(){
//    var selectedData = $("#tabulator-b").tabulator("getSelectedData");
//    if(selectedData.length >0){
//        var arr=[];
//        $(selectedData).each(function(i,v){
//            arr[i]=v.groupID;
//        })
//        if(arr.length > 0){
//            var url = window.location.href.slice(0, -6);
//            $.ajax({
//                url: url+"groupPackeryMenu",
//                type : "POST",
//                data : {"data" : arr},
//                success : function(data){
//                    alert(data);
//                    window.location.reload(true);
//                }
//            });
//        }
//    }else
//        alert('Please select any group to create template');
//});

$(document).on('click','a#groupCode',function(e){
    e.preventDefault();
    var selectedData = $(".tabulator").tabulator("getSelectedData");
    var $path = window.location.href.split('/')[window.location.href.split('/').length-1];
    if(selectedData.length > 0){
        var arr=[];
        $(selectedData).each(function(i,v){
            if($path == "application")
                arr[i]=v.applicationID;
            
            if($path == "groups")
                arr[i]=v.groupID;
            
            if($path == "users")
                arr[i]=v.user_id;
            
//            if($path == "market-place")
            if($.inArray($path, ["market-place","personal","private","subscribed","public"]) >= 0)
                arr[i]=v.formID;
        
        })
        //console.log(arr)
        if(arr.length > 0){
            $('.group_menu_ids').val(arr);
            //console.log($path);
            $('.group_menu_ids').parent().append('<input type="hidden" name="url_type" value="'+$path+'" />');
        }
        $('#menuModal').modal("show");
    }else{
        alert('Please select some ' + $path + ' to create template');
        $('#menuModal').modal("hide");
    }
});

function hide_extra_attributes(fld) {
    //console.log(fld, $("div.form-group.form_setup-wrap", fld).parent().find('.form-group.more_setup-wrap').length);
    $("div.form-group.form_setup-wrap", fld).nextUntil("div.form-group.more_setup-wrap").hide();
    $("div.form-group.more_setup-wrap", fld).nextUntil("div.form-group.advance_setup-wrap").hide();
    $("div.form-group.advance_setup-wrap", fld).nextAll("div.form-group").hide();
}

// Function for any update ajax call
function ajax_call(params) {
    $.ajax({
        url: params.url,
        type: "POST",
        data: params.data,
        //dataType: "json",
        success: function (result) {
            //alert("Updated Successfully!!");
        }
    });
}

// Function to preview the selected file image
function PreviewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
        $("#uploadPreview").parent().removeClass("hidden");
        $("#uploadImageValue").val('true');
    };
}
//http://malsup.com/jquery/block/
function showTextLoader(target, message) {
    message = (message === '') ? 'Loading' : message;
    if (typeof target === 'undefined') {
        $.blockUI({
            message: '<h4>' + message + '...</h4>',
            css: {
                //border: 'none',
                'background-color': 'transparent',
                color: '#fff'
            }
        });
    } else {
        $('body').find(target).block({
            message: '<h4>' + message + '...</h4>',
            css: {
                //border: 'none',
                'background-color': 'transparent',
                color: '#fff'
            }
        });
    }
}
//http://malsup.com/jquery/block/
function showLoader(target) {
    if (typeof target === 'undefined') {
        $.blockUI({
            message: '<img src="' + assetsImagePath + '/loader.svg" height="120" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    } else {
        $('body').find(target).block({
            message: '<img src="' + assetsImagePath + '/loader.svg" height="120" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    }
}

function hideLoader() {
    $.unblockUI();
}

function showSmallLoader(target) {
    if (typeof target === 'undefined') {
        $.blockUI({
            message: '<img src="' + assetsImagePath + '/input-loader.svg" height="120" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    } else {
        $('body').find(target).block({
            message: '<img src="' + assetsImagePath + '/input-loader.svg" height="120" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    }
}

function addForm(url, value) {
    $.ajax({
        type: "post",
        url: url,
        data: {value: value},
        success: function (data) {
            data = JSON.parse(data);
            if (data) {
                bootbox.dialog({
                    title: "Add Form",
                    message: '<div class="panel-blue">' +
                                '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                        '<form id="submitinfo">' +
                                            '<div class="col-sm-12 form-group">' +
                                                '<label>Application</label>' +
                                                data.appOption +
                                            '</div>' + 
                                            '<div class="col-sm-12 form-group">' +
                                                '<label>Select Topic</label>' +
                                                data.topicOption +
                                            '</div>\n\
                                            <div class="col-sm-12 form-group"><a href="javascript:;" onclick="topic_link(\'submitinfo\')"><i class="fa fa-plus"></i> Add New Topic</a></div>' +
                                            '<span id="errormsg_topic"></span>' +
                                            '<div class="col-sm-12">\n\
                                                <input type="hidden" name="actionType" value="1">\n\
                                                <button class="btn btn-primary" id="save_link">Proceed</button>&nbsp;\n\
                                                <button class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                                            '</div>\n\
                                        </form>\n\
                                    </div>\n\
                                </div>\n\
                            </div>'
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function addQueue(url, value) {
    $.ajax({
        type: "post",
        url: url,
        data: {value: value},
        success: function (data) {
            data = JSON.parse(data);
            if (data) {
                bootbox.dialog({
                    title: "Add Queue",
                    message: '<div class="panel-blue">' +
                                '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                        '<form id="submitinfo">' +
                                            '<div class="col-sm-12 form-group">' +
                                                '<label>Application</label>' +
                                                data.appOption +
                                            '</div>' + 
                                            '<div class="col-sm-12 form-group">' +
                                                '<label>Select Topic</label>' +
                                                data.topicOption +
                                            '</div>\n\
                                            <div class="col-sm-12 form-group"><a href="javascript:;" onclick="topic_link(\'submitinfo\')"><i class="fa fa-plus"></i> Add New Topic</a></div>' +
                                            '<span id="errormsg_topic"></span>' +
                                            '<div class="col-sm-12">\n\
                                                <input type="hidden" name="actionType" value="2">\n\
                                                <button class="btn btn-primary" id="save_link">Proceed</button>&nbsp;\n\
                                                <button class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                                            '</div>\n\
                                        </form>\n\
                                    </div>\n\
                                </div>\n\
                            </div>'
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
$(document).on('submit', '#submitinfo', function () {
    var app_select = $('#application option:selected').val();
    var topic_select = $('#topic option:selected').val();
    var actionType = parseInt($(this).find('input[name="actionType"]').val());
    
    if (app_select === "") {
        $('#errormsg_app').val('<font color="red">Please select the application!</font>');
        return false;
    }
    if (topic_select === "") {
        $('#errormsg_app').val('<font color="red">Please select the topic!</font>');
        return false;
    }
    if (topic_select && app_select) {
        if(actionType === 1)
            window.location.href = BASE_URL + '/subforms/create/' + topic_select;
        else if(actionType === 2)
            window.location.href = BASE_URL + '/queue/create/' + topic_select;
        return false;
    }
});

// format into custom format
function dateFormatter(date, dateFormat, newFormat){
    newFormat = (newFormat === '' ? 'DD/MM/YYYY' : newFormat);
    return moment(date, dateFormat).format(newFormat);
}

// format from unix timestamp to datetime
function formatDateTime(timestamp) {
    var date = (timestamp) ? new Date(timestamp) : new Date(),
            hours = date.getHours() || 12,
            minutes = '' + date.getMinutes(),
            ampm = (date.getHours() >= 12) ? 'pm' : 'am';

    hours = (hours > 12) ? hours - 12 : hours;
    minutes = (minutes.length < 2) ? '0' + minutes : minutes;
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
}

// format from unix timestamp to time
function formatTime(timestamp) {
    var date = (timestamp) ? new Date(timestamp) : new Date(),
            hours = date.getHours() || 12,
            minutes = '' + date.getMinutes(),
            ampm = (date.getHours() >= 12) ? 'pm' : 'am';

    hours = (hours > 12) ? hours - 12 : hours;
    minutes = (minutes.length < 2) ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function trimWithEllipsis(str, length) {
    str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    return (length && str.length <= length) ? str : str.substring(0, length) + '...';
}

//define image/file formatter
function fileFormatter(cell, formatterParams) {
    var value = this.sanitizeHTML(cell.getValue()), img;

    if (value) {
        if (/\.(jpe?g|png|gif)$/i.test(value)) {
            img = $("<img class='img-responsive' src='" + value + "'/>");

            img.on("load", function () {
                cell.getRow().normalizeHeight();
            }).on("error", function () {
                //console.log("file "+img.attr('src')+" not found");
                img.remove();
            });
        } else {
            var doc = value.split("&#x2F;").pop();
            img = "<a href='" + value + "' download><b>" + doc + "</b></a>";
        }

    } else {
        img = "";
    }

    return img;
}

//define image formatter
function iconFormatter(cell, formatterParams) {
    var value = formatterParams.iconPath + '/' + this.sanitizeHTML(cell.getValue()), img;

    if (value) {
        if (/\.(jpe?g|png|gif)$/i.test(value)) {
            img = $("<img height='" + formatterParams.iconHeight + "' src='" + value + "'/>");

            img.on("load", function () {
                cell.getRow().normalizeHeight();
            }).on("error", function () {
                //console.log("file "+img.attr('src')+" not found");
                img.remove();
            });
        } else {
            img = cell.getValue();
        }

    } else {
        img = cell.getValue();
    }

    return img;
}
//*******************************************************//
//packery menu creation
function shortCutMenu(data){
    var type = data.type;
    var menuName = data.menuName;
    var menuDescription = data.menuDescription;
    
    var matches = menuName.match(/\b(\w)/g);
    var acronym = matches.join('');
    if (acronym.length === 1) {
        var short_name = menuName.substring(0, 3).toUpperCase();
    } else {
        var short_name = acronym.substring(0, 3).toUpperCase();
    }
    
    var urlpath = data.getRedirectUrl;
    var csrf_token = document.getElementById('csrf_token').innerHTML;
    
    if(type == null || type === 'records-tabulator'){
        
        if (window.location.href.indexOf('groups') > 0 || window.location.href.indexOf('user-forms') > 0) {
            var type = "Group";
            var color = "#f67a00";
        } else if (window.location.href.indexOf('chat') > 0) {
            var type = "ChatRoom";
            var color = "#00ffff";
        } else if (window.location.href.indexOf('form') > 0 || window.location.href.indexOf('user-forms') > 0 || window.location.href.indexOf('savedata') > 0 || window.location.href.indexOf('records') > 0) {
            var type = "Form";
            var color = "#008000";
            console.log(window.location.href)
        } else if (window.location.href.indexOf('users') > 0) {
            var type = "Contact";
            var color = "#a90600";
        } else if (window.location.href.indexOf('application') > 0) {
            var type = "Application";
            var color = "#ffff00";
        } else if (window.location.href.indexOf('settings') > 0) {
            var type = "Settings";
            var color = "#ffa07a";
        } else if (window.location.href.indexOf('summary') > 0) {
            var type = "Summary";
            var color = "#E5CCFF";
        } else if (window.location.href.indexOf('queue') > 0) {
            var type = "Queue";
            var color = "#E5FFCC";
        }
        var system_type = "system";
    }else{
        var type = "Popup";
        var color = "#E5FFCC";
        var system_type = "popup";
    }
    
    var menuLink, menuPath;
    var f = document.createElement("form");
    f.setAttribute('method', "post");
    f.setAttribute('id', "redirect_form");
    f.setAttribute('class', "hidden");
    f.setAttribute('action', urlpath);
    //for hidden token
    var a = document.createElement("input");
    a.setAttribute('type', "hidden");
    a.setAttribute('name', "_token");
    a.setAttribute('value', csrf_token);
    //for image link
    if ((menuLink = document.getElementById('menuRedirectLink')) && (menuPath = document.getElementById('menuRedirectPath'))) {
        var b = document.createElement("input");
        b.setAttribute('type', "text");
        b.setAttribute('name', "icon");
        b.setAttribute('value', menuLink.innerHTML);
        f.append(b);
        var c = document.createElement("input");
        c.setAttribute('type', "text");
        c.setAttribute('name', "menuRedirectPath");
        c.setAttribute('value', menuPath.innerHTML);
        f.append(c);
    }
    //for name
    var i = document.createElement("input");
    i.setAttribute('type', "text");
    i.setAttribute('name', "name");
    i.setAttribute('value', menuName);
    //for description
    var j = document.createElement("input");
    j.setAttribute('type', "textarea");
    j.setAttribute('name', "description");
    j.setAttribute('value', JSON.stringify('<p>' + menuDescription + '</p>'));
    //for short_name
    var k = document.createElement("input");
    k.setAttribute('type', "text");
    k.setAttribute('name', "short_name");
    k.setAttribute('value', short_name);
    //for type
    var l = document.createElement("input");
    l.setAttribute('type', "text");
    l.setAttribute('name', "type");
    l.setAttribute('value', type);
    //for link
    var m = document.createElement("input");
    m.setAttribute('type', "text");
    m.setAttribute('name', "link");
    m.setAttribute('value', (data.type != "" ? (data.type === "records-tabulator" ? data.menuLink : "") : window.location.href));
    //for original_size
    var n = document.createElement("input");
    n.setAttribute('type', "text");
    n.setAttribute('name', "original_size");
    n.setAttribute('value', '1x1');
    //for expanded_size
    var o = document.createElement("input");
    o.setAttribute('type', "text");
    o.setAttribute('name', "expanded_size");
    o.setAttribute('value', '3x3');
    //for color
    var p = document.createElement("input");
    p.setAttribute('type', "text");
    p.setAttribute('name', "color");
    p.setAttribute('value', color);
    // for system_type
    var q = document.createElement("input");
    q.setAttribute('type', "text");
    q.setAttribute('name', "system_type");
    q.setAttribute('value', (data.type != "" ? "popup" : "system"));

    var s = document.createElement("input");
    s.setAttribute('type', "submit");
    s.setAttribute('value', "Submit");

    f.appendChild(a);
    f.appendChild(i);
    f.appendChild(j);
    f.appendChild(k);
    f.appendChild(l);
    f.appendChild(m);
    f.appendChild(n);
    f.appendChild(o);
    f.appendChild(p);
    f.appendChild(q);
    f.appendChild(s);
    document.body.appendChild(f);
    console.log(f);
//    alert();
    f.submit();
    return false;
}
//*********************************************end//

function RemoveImage() {
    $("#uploadImage").val('');
    $("#uploadImageValue").val('false');
    $("#uploadPreview").parent().addClass("hidden");
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0)
        return (string.length + 1);

    var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.toLowerCase().indexOf(subString.toLowerCase(), pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else
            break;
    }
    return n;
}

function getSum(total, num) {
    return total + num;
}

function getShowHelp(val) {
    bootbox.dialog({
        title: "Help Screen",
        message: '<div class="panel-blue">' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                'Showing help screen content on the page ' +
                '</div></div></div>'
    });
}

function customFormFilter(headerValue, rowValue, rowData, filterParams) {
    var result = "";
    if (rowValue.length > 0) {
        var val = $(rowValue).text().trim().toLowerCase();
        result = (val.indexOf(headerValue.toLowerCase()) > -1 ? rowValue : "");
    }
    return result;
}

function removeHtmlFromString(str) {
    if (str!=null)
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function getFilenameFromPath(path, seperator) {
    return path.split(seperator)[path.split(seperator).length - 1] ? path.split(seperator)[path.split(seperator).length - 1] : path;
}

function searchPDF(keyword, pdf_file, rowIndex, index) {
    var loadingTask = PDFJS.getDocument({url: pdf_file});
    return loadingTask.promise.then(function (pdf_doc) {
        var __PDF_DOC = pdf_doc;
        var __TOTAL_PAGES = __PDF_DOC.numPages;
        var countPromises = []; // collecting all page promises
        for (var page_no = 1; page_no <= __TOTAL_PAGES; page_no++) {
            countPromises.push(pdf_doc.getPage(page_no).then(function (page) {
                var n = page.pageNumber;
                return page.getTextContent().then(function (textContent) {
                    if (null !== textContent.items) {
                        var page_text = "";
                        for (var k = 0; k < textContent.items.length; k++) {
                            var block = textContent.items[k];
                            var getText = block.str.replace(/\s+/g, ' ').trim();
                            if (getText !== '')
                                page_text += getText + ' ';
                        }
                        var matches = occurrences(page_text, keyword, true);
                        return matches;
                    }
                });
            }));
        }
        // Wait for all pages and join text
        return Promise.all(countPromises).then(function (texts) {
            var results = {};
            results['id'] = rowIndex;
            results['index'] = index;
            results['found'] = texts.reduce(getSum);
            return results;
        });

    }).catch(function (error) {
        // If error re-show the upload button
        alert(error.message);
    });
}

//turn on full screen
function launchFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
}
//toggle screen
function toggle_fullscreen () {
  var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
  if(fullscreenEnabled) {
    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      launchFullscreen(document.documentElement);
    } else{
      exitFullscreen();
    }
  }
}

//Radio or Checkbox field filter
function radioFilter(data, filterParams){
    //data - the data for the row being filtered
    //filterParams - params object passed to the filter
    var value = data[filterParams[0]], haystack = filterParams[1];

    if(typeof(value) !== 'undefined'){
        // Single selection value (radio, single select)
        var result1 = $.inArray( value, haystack );

        // Multiple selection value (checkbox, multiple select)
        var str = haystack.join(",");
        var result2 = str.indexOf(value);

        var result3 = -1;
        result3 = value.indexOf(str);

        /*var Array1 = value.split(",")
        var Array2 = haystack;
        for (var i = 0; i<Array2.length; i++) {
            var arrlen = Array1.length;
            for (var j = 0; j<arrlen; j++) {
                if (Array2[i] == Array1[j]) {
                    Array1 = Array1.slice(0, j).concat(Array1.slice(j+1, arrlen));
                }//if close
            }//for close
        }//for close
        console.log(Array1);*/
        //var result4 = Array1.length;
    }

    return (result1 >= 0 || result2 >= 0 || result3 >= 0)? true: false;
}

//Between filter
function betweenFilter(data, filterParams){
    // filterParams[0]: column name
    // filterParams[1]: first value
    // filterParams[2]: second value
    return data[filterParams[0]] >= filterParams[1] && data[filterParams[0]] <= filterParams[2];
}

//Today filter
function todayFilter(data, filterParams){
    // filterParams[0]: column name
    // filterParams[1]: filter type
    // filterParams[2]: today date
    return (filterParams[1] === 'before_today') ? data[filterParams[0]] <= filterParams[2] : data[filterParams[0]] >= filterParams[2];
}

//Between Date filter
function betweenDateFilter(data, filterParams){
    // filterParams[0]: column name
    // filterParams[1]: filter type
    // filterParams[2]: today date
    // filterParams[3]: other date
    if(filterParams[1] === 'between_today_and_date'){
        return data[filterParams[0]] >= filterParams[2] && data[filterParams[0]] <= filterParams[3];
    }else if(filterParams[1] === 'between_date_and_today'){
        return data[filterParams[0]] >= filterParams[3] && data[filterParams[0]] <= filterParams[2];
    }    
}

//$(document).ready(function(){
//    $('div#shwCustomScreen').find('input.screenX').val('100');
//    $('div#shwCustomScreen').find('input.screenY').val('100');
//    $('div#shwCustomScreen').find('input.screenWidth').val(screen.availWidth);
//    $('div#shwCustomScreen').find('input.screenHeight').val(screen.availHeight);
//})
//$(document).on('click','input[name="screen"]',function(){
//    $('div#shwCustomScreen').addClass('hidden');
//    if($(this).val() == "custom"){
//        $('div#shwCustomScreen').removeClass('hidden');
//    }
//})

function previewFiles(id) {
    var preview = document.querySelector('#shw_profile_'+id);
    var files = document.querySelector('#'+id).files;
    function readAndPreview(file) {
        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var image = new Image();
                image.height = 100;
                image.title = file.name;
                image.src = this.result;
                var htmldata = image+'<span class="img-wrapclose saveForm" id="removeXL">×</span>';
                var e = document.createElement('div');
                e.setAttribute('class', "form-group saveData");
                var f = document.createElement('span');
                f.setAttribute('class', "img-wrapclose saveForm");
                f.setAttribute('id', "removeXL");
                f.setAttribute('id', "removeXL");
                f.innerHTML = '×';
                preview.appendChild(e);
                e.appendChild(image);
                e.appendChild(f);
            }, false);
            reader.readAsDataURL(file);
        }
    }
    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}
/*$(document).on("click", "button[name=group-rows]", function(){
    var columnName = $(this).attr('data-column').toString();
    $(this).toggleClass("col-hide");
    if($(this).hasClass("col-hide")){
        $.cookie("tabulator-grouping-B", columnName);
        $("#tabulator-b").tabulator("setGroupBy", columnName);
        //$("#tabulator-b").tabulator("hideColumn","master_group");
        $("#tabulator-b").tabulator("setSort", columnName, "asc");
    }else{
        $.cookie("tabulator-grouping-B", "");
        $("#tabulator-b").tabulator("setGroupBy", false);
        //$("#tabulator-b").tabulator("showColumn","master_group");
        $("#tabulator-b").tabulator("setSort", "groupName", "asc");
    }
    //$("#tabulator-b").tabulator("redraw");
    $('#pageActionModal').modal('hide');
});*/
function getTabulatorGroupBy(tabulator, persistenceID){
    //var $tabulator = $('#' + tabulatorID);
    var cookieName = 'tabulator-grouping-' + persistenceID;
    
    if(checkCookie(cookieName)){
        var tabulatorGroup = getCookie(cookieName);
        //tabulator.tabulator("setGroupBy", tabulatorGroup);
        tabulator.setGroupBy(tabulatorGroup);
        if(tabulatorGroup !== ""){        
            $("button." + tabulatorGroup).addClass("col-hide");
            //tabulator.tabulator("setSort", tabulatorGroup, "asc");
            tabulator.setSort(tabulatorGroup, "asc");
            //$tabulator.tabulator("hideColumn", tabulatorGroup);
        }else{
            $("button." + tabulatorGroup).removeClass("col-hide");
            //tabulator.tabulator("setSort", tabulatorGroup, "asc");
            tabulator.setSort(tabulatorGroup, "asc");
            //$tabulator.tabulator("showColumn", tabulatorGroup);
        }
        //$tabulator.tabulator("redraw");
    }
}

function setTabulatorGroupBy(tabulator, persistenceID, columnName){
    $("button[name=group-rows]:not(." + columnName + ")").removeClass("col-hide active");
    
    $("." + columnName).toggleClass("col-hide active");
    //var $tabulator = $('#' + tabulatorID);
    var cookieName = 'tabulator-grouping-' + persistenceID;
    
    if($("." + columnName).hasClass("col-hide")){        
        tabulator.setGroupBy(columnName);
        tabulator.clearSort();
        tabulator.setSort(columnName, "asc");
        $.cookie(cookieName, columnName);
    }else{
        $("." + columnName).removeClass("col-hide active");
        tabulator.setGroupBy(false);
        $.cookie(cookieName, "");
    }
    $('#pageActionModal').modal('hide');
}