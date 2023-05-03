 


function createTeacherTree(jsondata) {
    $('#teacherTree').jstree({
        "core": {
            "check_callback": true,
            "themes": {
                "icons": false,
                "stripes": true,
                "responsive": true,
                "dots": false,
            },
            'data': jsondata
        },
        "checkbox": {
            "keep_selected_style": false
        },
        "plugins": ["wholerow", "checkbox", "search", "unique", "dnd"],
        "search": {
            "case_sensitive": false,
            "show_only_matches": true
        }
    });


}
function createCourseTree(jsondata) {
    $('#courseTree').jstree({
        "core": {
            "check_callback": true,
            "themes": {
                "icons": false,
                "stripes": true,
                "responsive": true,
                "dots": false,
            },
            'data': jsondata
        },
        "checkbox": {
            "keep_selected_style": false
        },
        "plugins": ["wholerow", "checkbox", "search", "unique", "dnd"],
        "search": {
            "case_sensitive": false,
            "show_only_matches": true
        }
    });


} 

$(function () {

        var jsondataTeacher =
            [
                { "id": "ajson1", "parent": "#", "text": "Fulll Time Part" },
                { "id": "ajson2", "parent": "#", "text": "Part Time" },
                { "id": "ajson3", "parent": "ajson2", "text": "Child2.1" },
                { "id": "ajson4", "parent": "ajson2", "text": "Child 2.2" },
                { "id": "ajson5", "parent": "ajson3", "text": "Child 3.1" },
                { "id": "ajson6", "parent": "ajson3", "text": "Child 3.2" },
            ];
        var jsondataCourse =
            [
                { "id": "ajson1", "parent": "#", "text": "Art " },
                { "id": "ajson2", "parent": "#", "text": "English" },
                { "id": "ajson7", "parent": "#", "text": "Mathematics" },
                { "id": "ajson8", "parent": "#", "text": "Mandarin" },
                { "id": "ajson3", "parent": "ajson2", "text": "Child2.1" },
                { "id": "ajson4", "parent": "ajson2", "text": "Child 2.2" },
                { "id": "ajson5", "parent": "ajson3", "text": "Child 3.1" },
                { "id": "ajson6", "parent": "ajson3", "text": "Child 3.2" },
                { "id": "ajson9", "parent": "ajson7", "text": "Child 3.1" },
                { "id": "ajson10", "parent": "ajson7", "text": "Child 3.2" },
                { "id": "ajson11", "parent": "ajson8", "text": "Child 3.1" },
                { "id": "ajson12", "parent": "ajson8", "text": "Child 3.2" },
                { "id": "ajson13", "parent": "ajson8", "text": "Child 3.1" },
                { "id": "ajson14", "parent": "ajson8", "text": "Child 3.2" },
            ];
        //$(".search-input").keyup(function () {
        //    var searchString = $(this).val();
        //    //$('#SimpleJSTree').jstree('search', searchString);
        //});
        createTeacherTree(jsondataTeacher);
        createCourseTree(jsondataCourse);

        $('.sidebar .panel-heading .arrow').on('click', function () {
            $(this).closest('.panel').find('.panel-body').slideToggle();
            $(this).toggleClass('bottom');
        })

        $('.sidebar-toggle').on('click', function () {
            //console.log($('.sidebar').is('.open'))
            if ($('.sidebar').is('.open')) {
                $('.sidebar').removeClass('open');
                $(this).addClass('right');
                $('.page-content').removeClass('with-sidebar');

            } else if (!$('.sidebar').is('.open')) {
                $('.sidebar').addClass('open');
                $(this).removeClass('right');
                $('.page-content').addClass('with-sidebar');

            }
        })

        $('.from-group.search-filter').eq(0).find(".search-input").on('keyup', function () {
            var searchString = $(this).val();
            $('#teacherTree').jstree('search', searchString);
        })
        $('.from-group.search-filter').eq(1).find(".search-input").on('keyup', function () {
            var searchString = $(this).val();
            $('#courseTree').jstree('search', searchString);
        })

        $('.more-button').on('click', function () {
            //console.log($(this).closest('.panel-heading').text())
            var title = $(this).closest('.panel-heading').text().trim().toLowerCase();
            $('#filterModal').modal('show');
            //if (title == "teacher") {
            //    $(".search-input").keyup(function () {
            //        var searchString = $(this).val();
            //        $('#teacherTree').jstree('search', searchString);
            //    });
            //    $('#teacherTree').jstree('search', searchString);
            //} else if (title == "course") {
            //    $(".search-input").keyup(function () {
            //        var searchString = $(this).val();
            //        $('#courseTree').jstree('search', searchString);
            //    });
            //}
        })
        $('.search-icon').on('click', function () {
            var $this = $(this);
            $(this).closest('.panel').find('.search-filter').slideToggle(function () {
                if ($(this).is(':visible')) {
                    $this.find('i').addClass('fa-times').removeClass('fa-search')
                } else {
                    $this.find('i').addClass('fa-search').removeClass('fa-times')
                }
            });
        });

        //$('.scrollbar').TrackpadScrollEmulator();
        //$('.scrollbar').mCustomScrollbar({
        //    theme: "dark",
        //    scrollButtons: { enable: true }
        //});
        //$('#one').scrollbar($('.scrollbar'));
  
});


// $(function(){
//     $('.tree-structure input[type="checkbox"]').change(function(e) {

//   var checked = $(this).prop("checked"),
//       container = $(this).parent(),
//       siblings = container.siblings();

//     container.find('input[type="checkbox"]').prop({
//     indeterminate: false,
//     checked: checked
//     });

//     function checkSiblings(el) {

//         var parent = el.parent().parent(),
//             all = true;

//         el.siblings().each(function() {
//           let returnValue = all = ($(this).children('input[type="checkbox"]').prop("checked") === checked);
//           return returnValue;
//         });
        
//         if (all && checked) {

//           parent.children('input[type="checkbox"]').prop({
//             indeterminate: false,
//             checked: checked
//           });

//           checkSiblings(parent);

//         } else if (all && !checked) {

//           parent.children('input[type="checkbox"]').prop("checked", checked);
//           parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
//           checkSiblings(parent);

//         } else {

//           el.parents("li").children('input[type="checkbox"]').prop({
//             indeterminate: true,
//             checked: false
//           });

//         }

//       }

//       checkSiblings(container);
//     });
// })
// $(document)
// .on('click','.main-parent .mainlink',function(){
//     $(this).toggleClass('active');
//     $(this).next('.mainlink-children').slideToggle();
// })
// // ---------------------------------------------------------
//  $('div.container-fluid').parent().addClass('container-fluid').removeClass('container');    
//     var formID = "3583";
//     var formTitle = $(".page-header h1").text().trim(),
//     detailNotify = "No",
//     firebase_room_id = "-LIfBjgAYuPy8ZrAAWpb";

//     var myOptions, calendarOptions;
//     var defaultDuration = "01:00:00";
//     var resourceColumn = "text-1532948551606";

//     var activitiesForm = "3582";
//     var activityField = "text_1532949452771";
//     var activitiesCategory = "checkboxGroup_1532949247070";

//     var columns = {"current_status":"Status","title":"Title","start":"Start","end":"End","color":"Color","allDay":"All Day","resources":"Resources","activities":"Activities","service":"Service","created_at":"Created At","updated_at":"Updated At"};
//     var eventOverlap = "0";

//     $(document).ready(function() {
// //        const toast = swal.mixin({
// //            toast: true,
// //            //position: 'top-end',
// //            showConfirmButton: false,
// //            timer: 2000
// //        });
// // Datetime picker in create event dialoge
// // $("#tab_start, #tab_end").datetimepicker({
// //     format: "yyyy-mm-dd hh:ii",
// //     minView: 0,
// //     maxView: 1,
// //     startView: 1,
// //     autoclose: true,
// // //todayBtn: true,
// // //todayHighlight: true,
// // minuteStep: 10,
// // //pickerPosition: "bottom-left"
// // }).on('changeDate', function(e) {

// // });
// // Color picker in create event dialoge
// $("#tab_color").colorpicker({format: "rgba"});

// // Modal dialog init: custom buttons and a "close" callback resetting the form inside
// var dialog = $( "#dialog" ).dialog({
//     autoOpen: false,
//     modal: true,
//     resizable: false,
//     draggable: false,
//     show: { effect: "clip", duration: 250 },
//     hide: { effect: "explode", duration: 500 },
//     buttons: {
//         Add: function() {
//             addEvent(form);
//             $( this ).dialog( "close" );
//         },
//         Cancel: function() {
//             $( this ).dialog( "close" );
//         }
//     },
//     close: function() {
//         form[ 0 ].reset();
//     }
// });
// // AddTab form: calls addTab function on submit and closes the dialog
// var form = dialog.find( "form" ).on( "submit", function( event ) {
// //addEvent();
// dialog.dialog( "close" );
// event.preventDefault();
// });

// // Initialize jquery ui tabs
// $( "#tabs" ).tabs({
//     create: function( event, ui ) {
// //console.info(ui.tab.data('value'))
// },
// activate: function( event, ui ) {
// //console.info($(ui.newTab).find('a').attr('href'));//ui.oldTab.data('value')
// var target = $(ui.newTab).find('a').attr('href');
// $(target + ' div.calendar').fullCalendar('render');
// $(target + ' div.calendar').fullCalendar('refetchEvents');
// $('body .popover').remove();
// // $.cookie("calendar-activeView", $('a[href="'+target+'"]').parent().index(), { expires:365,path: '/'});
// }
// });
// $( "#tabs" ).show();

// // if(checkCookie('calendar-activeView') !== ''){
// //     $( "#tabs" ).tabs( "option", "active", parseInt(checkCookie('calendar-activeView')) );
// // }
// var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');

// // Toggel view between Calendar and Tabulator
// $(document).on('click','#change_per_view',function(){            
//     $.ajax({
//         type:"post",
//         url:"https://geligulu.com/form-generator/public/index.php/update_view",
//         data: {id: formID},
//         success:function(data){
//             if(data==1){
//                 window.location.reload(true);
//             }
//         },error:function(error){
//             console.log(error);
//         }
//     });

// });

// // Delete an event
// $(document).on('click','.delete-event',function(event){
//     event.preventDefault();
//     var $button = $(this);
//     var confirm = window.confirm("Are you sure to delete?");
//     if(confirm){            
//         var formGroupKey = $button.data('formgroupkey');
//         $.ajax({
//             type: "POST",
//             url: "https://geligulu.com/form-generator/public/index.php/recordDelete/" + formGroupKey,
//             data: $button.data('deleteparams'),
//             success: function (deleted) {
//                 if (deleted == 1) {
//                     if(firebase_room_id !== ""){
//                         firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var message = user.displayName + " has deleted a record.";

//     _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
// }
// });
//                     }
// //alert("Record deleted successfully!");
// //$("#" + current_tab +" div.calendar").fullCalendar('removeEvents', formGroupKey);
// $(".calendar").fullCalendar('removeEvents', formGroupKey);
// $button.parents('.popover').remove();
// }else{
//     alert("Record could not be deleted!");
// }
// }
// });
//     }
// });

// /* initialize the external events
// -----------------------------------------------------------------*/
// $('.external-events-list .fc-event').each(function() {
// // store data so the calendar knows to render an event upon drop
// $(this).data('event', {
// title: $.trim($(this).text()), // use the element's text as the event title
// color: $.trim($(this).data('color')),
// duration: $.trim($(this).data('duration')),
// stick: false // maintain when user navigates (see docs on the renderEvent method)
// });

// // make the event draggable using jQuery UI
// $(this).draggable({
//     zIndex: 999,
// revert: true,      // will cause the event to go back to its
// revertDuration: 0,  //  original position after the drag
// stop: function() {
// //console.log($(this));
// // is the "remove after drop" checkbox checked?
// if ($('#drop-remove').is(':checked')) {
// // if so, remove the element from the "Draggable Events" list
// $(this).remove();
// }
// }
// });

// });

// var defaultOptions = {
//     schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
//     theme: true,    
//     themeSystem:'jquery-ui',
//     nowIndicator: true,
//     defaultTimedEventDuration: defaultDuration,
// //aspectRatio: 1.5,
// defaultDate: new Date(),
// //lazyFetching: true,
// now: new Date(),
// navLinks: true, // can click day/week names to navigate views
// editable: true,
// eventLimit: true, // allow "more" link when too many events            
// loading: function(bool) {
// //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
// if(bool){ 
//     // showLoader(".calendar .fc-view-container");
// }
// else{ 
//     $(".calendar .fc-view-container").unblock(); 
// }
// //$('#loading').toggle(bool);
// },
// //eventOverlap: eventOverlap === '1' ? true : false,
// eventRender: function(event, element) {
//     var table = $("<table class='event-detail'></table>"), deleteParams;

//     if(event.data){                    
// //add row data on right hand side
// var imageFound = 0, rowRecord = "", data = event.data;
// $.each(columns, function(field, text){
//     if(typeof(data[field]) !== 'undefined' && $.inArray(field, ['current_status','title','color']) === -1){
//         var value = data[field];
//         var result = value.toString().indexOf("uploads");

//         if(result < 0){
// // No image found
// if(data[field] !== ""){ rowRecord += "<div class='"+field+"'><strong>" + text + ":</strong> " + data[field] + "</div>"; }
// }else{
// // Image found
// //var result = str.toString().indexOf("#galleryModal");
// //if(result < 0){
//     imageFound++;
//     if (/\.(jpe?g|png|gif)$/i.test(value)) {
//         if(value.startsWith("uploads"))
//             img = "<img class='img-responsive' src='https://geligulu.com/form-generator/public//" + value + "'/>";
//         else
//             img = "<img class='img-responsive' src='https://geligulu.com/form-generator/public/uploads/users/3f3dbb1e96966/" + value + "'/>";
//         $(img).on("load", function(){
//     //cell.getRow().normalizeHeight();
// }).on("error", function(){
//     console.log("file " + $(this).attr('src') + " not found");
//     img = '';
// });
// }else{
// if (/\.(pdf)$/i.test(value)) // pdf files                        
//     img = "<a target='_blank' href='https://geligulu.com/form-generator/public/index.php/file-view?file=" + value + "'><b>" + value + "</b></a>";
// else{
//     if(value.startsWith("upload"))
//         img = "<a href='https://geligulu.com/form-generator/public//" + value + "'><b>" + value + "</b></a>";
//     else   
//         img = "<a href='https://geligulu.com/form-generator/public/uploads/users/3f3dbb1e96966/" + value + "'><b>" + value + "</b></a>";
// }
// }
// table.append("<tr><td class='media'>" + img + "</td></tr>");
// //}
// }
// }
// });

// deleteParams = JSON.stringify({formId: 3583, created_by: event.data.fg_created_by_id, created_at: event.data.fg_created_at_timestamp});                     

// }else{
//     var rowRecord = "";
//     var eventData = {
//         title: event.title,
//         start: event.start.format(),
//         end: event.end ? event.end.format() : ''
//     };
//     $.each(columns, function(field, value){
//         if(typeof(eventData[field]) !== 'undefined'){
//             if(eventData[field] !== ""){ rowRecord += "<div class='" + field + "'><strong>" + value + ":</strong> " + eventData[field] + "</div>"; }
//         }
//     });
//     deleteParams = JSON.stringify({formId: 3583, created_by: 1, created_at: new Date()});
// }
// table.append("<tr><td>" + rowRecord + "</td></tr>");

// var actionRow = "<a class='btn btn-primary' title='Edit' href='https://geligulu.com/form-generator/public/index.php/editdata/3583/" + event.id + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;";
// actionRow += "<a class='btn btn-danger delete-event' title='Delete' href='#' data-formgroupkey='" + event.id + "' data-deleteparams='" + deleteParams + "'><i class='fa fa-trash'></i></a>";
// table.append("<tr><td align='center'>" + actionRow +"</td></tr>");

// element.attr('title', event.title);
// element.popover({
//     container: 'body',
//     animation:true,
// //delay: 300,
// content: table,
// trigger: 'click',
// html: true,
// placement: 'top'
// });
// },            
// // add event name to title attribute on mouseover
// eventMouseover: function(event, jsEvent, view) {
//     if (view.name !== 'agendaDay') {
// //console.log(event);
// $(jsEvent.target).attr('title', event.title);
// }
// },
// // drag and drop events inside calendar dates
// eventDrop: function(event, delta, revertFunc) {
// //console.log(event);
// //console.log(event.title + " was dropped on " + event.start.format());
// var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
// if (!confirm("Are you sure about this change?")) {
//     revertFunc();
// }else{
//     var resourceValue = '', title = '';
//     if(event.resourceId){
//         var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);

//         if(resource && typeof resource[resourceColumn] != 'undefined'){
//             resourceValue = resource[resourceColumn];
//             title = event.activities + ' in ' + resourceValue;
//         }
//     }
//     $.ajax({
//         method: 'POST',
//         url: "https://geligulu.com/form-generator/public/index.php/calendar/updateEvent/3583",
//         dataType: 'json',
//         data: {
//             title: (title !== '') ? title : event.title,
//             start: event.start.format(),
//             end: (event.end) ? event.end.format() : event.end,
//             resourceId: (event.resourceId) ? event.resourceId : '',
//             resources: (resourceValue !== '') ? resourceValue : event.resources,
//             recordID: event.id,
//             activities: (event.activities) ? event.activities : '',
//         },
//         beforeSend: function() {
// // showLoader("#" + current_tab +" div.calendar");
// // showLoader();
// },
// success: function(response) {
// //$(".calendar").not( $("#" + current_tab +" div.calendar") ).fullCalendar('refetchEvents');
// $("#" + current_tab +" div.calendar").fullCalendar('refetchEvents');
// //alert(event.title + ' Updated Successfully.');
// if(response.success){
//     $.jGrowl(response.message, {position: 'center'});
// // send message in firebase
// if(firebase_room_id !== ""){
//     firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var chatRef = firebase.database().ref(_chat_ref);
//     // Create a Firechat instance
//     _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
//     _firechat.maxLengthMessage = 10000;
//     _firechat._chat.setUser(user.uid, user.displayName, function(){
//         var user = firebase.auth().currentUser;
//         var message = user.displayName + " has updated a record.";

//         if(detailNotify === 'Yes'){
//             message = notificationDetail(response.data, message);
//             message += "<a target='_blank' href='" + window.location.href + "'>View Calendar</a>";
//         }
//         //console.log(message);
//         _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
//     });
// }
// });
// }
// }else{
// //alert(response.message);
// swal({ type: 'error', title: '', text: response.message});
// }
// },
// complete: function() {
// //$("#" + current_tab +" div.calendar").unblock(); 
// $.unblockUI();
// }
// });
// }

// },
// // resize event's duration inside calendar view
// eventResize: function(event, delta, revertFunc) {
// //console.log(event);
// //alert(event.title + " end is now " + event.end.format());
// var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
// if (!confirm("Are you sure about this change?")) {
//     revertFunc();
// }else{
//     var resourceValue = '', title = '';
//     if(event.resourceId){
//         var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);

//         if(resource && typeof resource[resourceColumn] != 'undefined'){
//             resourceValue = resource[resourceColumn];
//             title = event.activities + ' in ' + resourceValue;
//         }
//     }
//     $.ajax({
//         method: 'POST',
//         url: "https://geligulu.com/form-generator/public/index.php/formUpdating/3583/" + event.id,
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// start: event.start.format(),
// end: event.end.format(),
// myviewtime: moment().unix(),
// //recordID: event.id,
// resourceId: (event.resourceId) ? event.resourceId : '',
// resources: (resourceValue !== '') ? resourceValue : event.resources,
// activities: (event.activities) ? event.activities : '',
// },
// beforeSend: function() {
// // showLoader("#" + current_tab +" div.calendar");
// // showLoader();
// },
// success: function(response) {
// //alert(event.title + ' Updated Successfully.');
// $("#" + current_tab +" div.calendar").fullCalendar('refetchEvents');
// if(response.success){
//     $.jGrowl(response.message, {position: 'center'});
// // send message in firebase
// if(firebase_room_id !== ""){
//     firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var chatRef = firebase.database().ref(_chat_ref);
//     // Create a Firechat instance
//     _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
//     _firechat.maxLengthMessage = 10000;
//     _firechat._chat.setUser(user.uid, user.displayName, function(){
//         var user = firebase.auth().currentUser;
//         var message = user.displayName + " has updated a record.";

//         if(detailNotify === 'Yes'){
//             message = notificationDetail(response.data, message);
//             message += "<a target='_blank' href='" + window.location.href + "'>View Calendar</a>";
//         }
//         //console.log(message);
//         _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
//     });
// }
// });
// }
// }else{
// //alert(response.message);
// swal({ type: 'error', title: '', text: response.message});
// }
// },
// complete: function() {
// //$("#" + current_tab +" div.calendar").unblock(); 
// $.unblockUI();
// }
// });
// }
// },
// eventClick: function(calEvent, jsEvent, view) {
// /*var r=confirm("Delete " + calEvent.title);
// if (r===true)
// {
// $('#basic-view div.calendar').fullCalendar('removeEvents', calEvent._id);
// }*/
// },
// eventDestroy: function(event, element, view) {
// //console.info(event);
// //alert("removing stuff");
// },
// };

// // Basic View
// myOptions = {
//     header: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'month,basicWeek,basicDay'
//     },            
//     events: function(start, end, timezone, callback) {
//         $.ajax({
//             url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/basic",
//             dataType: 'json',
//             data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
//     },
//     selectable: true,
//     selectHelper: true,
//     select: function(start, end) {
//         dialog.find( "form #tab_start" ).val(start.format());
//         dialog.find( "form #tab_end" ).val(start.format());
//         dialog.find( "form #allDay" ).val('true');
//         dialog.find( "form #tab_color" ).val('#8500b2').change();
//         dialog.dialog( "open" );

//         $("#basic-view div.calendar").fullCalendar('unselect');
//     },
// };
// calendarOptions = $.extend({}, defaultOptions, myOptions);
// $('#basic-view div.calendar').fullCalendar(calendarOptions);

// // List View
// myOptions = {
//     header: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'listYear,listMonth,listWeek,listDay'
//     },
// // customize the button names,
// // otherwise they'd all just say "list"
// views: {
//     listYear: { buttonText: 'year' },
//     listMonth: { buttonText: 'month' },
//     listWeek: { buttonText: 'week' },
//     listDay: { buttonText: 'day' },
// },
// defaultView: 'listYear',
// defaultDate: new Date(),           
// events: function(start, end, timezone, callback) {
//     $.ajax({
//         url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/list",
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
// },
// };
// calendarOptions = $.extend({}, defaultOptions, myOptions);
// $('#list-view div.calendar').fullCalendar(calendarOptions);

// // Agenda View
// myOptions = {
//     header: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'month,agendaWeek,agendaDay'
//     },   
//     defaultView: 'agendaWeek',  
//     events: function(start, end, timezone, callback) {
//         $.ajax({
//             url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/activities",
//             dataType: 'json',
//             data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
//     },
//     scrollTime: '00:00',
//     allDaySlot: false,
//     selectable: true,
//     selectHelper: true,
//     select: function(start, end) {
//         dialog.find( "form #tab_start" ).val(start.format());
//         dialog.find( "form #tab_end" ).val(end.format());
//         dialog.find( "form #allDay" ).val('false');
//         dialog.find( "form #tab_color" ).val('#8500b2').change();
//         dialog.dialog( "open" );

//         $("#agenda-view div.calendar").fullCalendar('unselect');
//     },
// droppable: true, // this allows things to be dropped onto the calendar
// drop: function( date, jsEvent, ui, resourceId ) {
// //console.log($(this));
// var eventExtData = $(this).data('event');
// var title = eventExtData.title ? eventExtData.title : '';
// if (title !== '') {
//     var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
//     $.ajax({
//         method: 'POST',
//         url: "https://geligulu.com/form-generator/public/index.php/formSaving/3583",
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// title: title,
// color: eventExtData.color,
// allDay: 'false',
// start: date.format(),
// //end: end.format(),
// activities: title
// },
// beforeSend: function() {
// // showLoader("#" + current_tab +" div.calendar");
// },
// success: function(response) {
//     if(firebase_room_id !== ""){
//         firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var chatRef = firebase.database().ref(_chat_ref);
// // Create a Firechat instance
// _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
// _firechat.maxLengthMessage = 10000;
// _firechat._chat.setUser(user.uid, user.displayName, function(){
//     var user = firebase.auth().currentUser;
//     var message = user.displayName + " has inserted a record.";

//     if(detailNotify === 'Yes'){
//         message = notificationDetail({
//                             // our hypothetical feed requires UNIX timestamps
//                             Title: title,
//                             Start: date.format()
//                         }, message);
//         message += "<a target='_blank' href='" + window.location.href + "'>View Calendar</a>";
//     }
//     //console.log(message);
//     _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
// });
// }
// });
//     }
//     $('#agenda-view .calendar').fullCalendar('refetchEvents');
//     $(".calendar").not($('#agenda-view .calendar')).fullCalendar('refetchEvents');
// },
// complete: function() {
// //$("#" + current_tab +" div.calendar").unblock(); 
// }
// });
// }
// }
// };
// var calendarOptions = $.extend({}, defaultOptions, myOptions);
// $('#agenda-view .calendar').fullCalendar(calendarOptions);  

// function addExternalEvent(eventData){
//     var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
//     $.ajax({
//         method: 'POST',
//         url: "https://geligulu.com/form-generator/public/index.php/formSaving/3583",
//         dataType: 'json',
//         data: eventData,
//         beforeSend: function() {
//             // showLoader();
//         },
//         success: function(response) {
//             if(response.success){
//                 $.jGrowl(response.message, {position: 'center'});
// //toast({type: 'success', title: response.message});
// if(firebase_room_id !== ""){
//     firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var chatRef = firebase.database().ref(_chat_ref);
// // Create a Firechat instance
// _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
// _firechat.maxLengthMessage = 10000;
// _firechat._chat.setUser(user.uid, user.displayName, function(){
//     var user = firebase.auth().currentUser;
//     var message = user.displayName + " has inserted a record.";

//     if(detailNotify === 'Yes'){
//         message = notificationDetail({
//             Title: title,
//             Start: date.format(),
//             End: end.format(), 
//             Resource: resourceValue,
//             Activity: activityValue
//         }, message);
//         message += "<a target='_blank' href='" + window.location.href + "'>View Calendar</a>";
//     }
//     _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
// });
// }
// });
// }
// }else{
//     swal({ type: 'error', title: '', text: response.message});
// }
// },
// complete: function() {
//     $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
//     $.unblockUI();
// }
// });
// }

// var resourceOptions = {
//     selectable: true,
//     selectHelper: true,
//     select: function(start, end, jsEvent, view, resource) {
//         var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
//         var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resource.id);

// //console.log(resource)
// dialog.find( "form #tab_start" ).val(start.format());
// dialog.find( "form #tab_end" ).val(end.format());
// if(typeof resource.eventColor != 'undefined')
//     dialog.find( "form #tab_color" ).val('#' + resource.eventColor).change();
// dialog.find( "form #allDay" ).val('false');
// dialog.find( "form #resourceId" ).val(resource.id);
// if(typeof resource[resourceColumn] != 'undefined'){
//     resourceValue = resource[resourceColumn];
//     dialog.find( "form #resources" ).val(resourceValue);
//     dialog.find( "form #tab_title" ).val(' in ' + resourceValue);
// }                
// dialog.dialog( "open" );

// $("#" + current_tab + " .calendar").fullCalendar('unselect');
// },
// droppable: true, // this allows things to be dropped onto the calendar
// drop: function( date, jsEvent, ui, resourceId ) {                    
//     var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');

//     var eventExtData = $(this).data('event');
//     var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
//     var title = eventExtData.title ? eventExtData.title : '';
//     var resourceValue = '', activityValue = title;
//     if(typeof resource[resourceColumn] != 'undefined'){
//         resourceValue = resource[resourceColumn];
//     }
//     var defaultDuration = moment.duration(eventExtData.duration);
//     var end = date.clone().add(defaultDuration);

//     var eventData = {
//         title: title, 
//         color: eventExtData.color, 
//         allDay: 'false', 
//         start: date.format(), 
//         end: end.format(), 
//         resourceId: resourceId, 
//         resources: resourceValue, 
//         activities: activityValue
//     };

// // select a category
// if(activitiesCategory !== ''){
//     async function callCategory(eventData){
// // inputOptions can be an object or Promise
// const inputOptions = new Promise((resolve) => {
//     var postData = {formID: activitiesForm, mainField: activityField, activity: activityValue, categoryField: activitiesCategory, calendarForm: formID, eventData: eventData};
//     $.post("https://geligulu.com/form-generator/public/index.php/calendar/ajaxGetCategories", postData, function(response){
//         if(typeof response.success !== 'undefined'){
//             swal({ type: 'error', title: '', text: response.message});
//             $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
//         }else{
//             if(Object.keys(response).length > 1){
//                 resolve(response);
//             }else{
//     //swal.close();
//     //console.log(response);
//     var service = '';
//     if(typeof response.length === 'undefined'){
//         // 1 service provided
//         $.each(response, function(key, value){
//             service = value;
//         });
//     }
//     swal({
//         input: 'textarea',                                            
//         inputAttributes: {id: 'swal-service-description', rows: '3'},
//         inputPlaceholder: 'Type your message here',
//         focusConfirm: false,
//         showCloseButton: true,
//         preConfirm: () => {
//             return [
//             service,
//             $('textarea#swal-service-description').val()
//             ]
//         }
//     }).then((result) => {
//         //console.log(result)
//         if (result.value) {
//             var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

//             if(service !== '')
//                 eventData.title += ' (' + service + ') ';

//             if(resourceValue !== '')
//                 eventData.title += ' in ' + resourceValue;

//             if (eventData.title !== '') {
//                 eventData['service'] = service;
//                 eventData['description'] = description;
//                 addExternalEvent(eventData);
//             }
//         } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
//             $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
//         }
//     });
// }
// }
// });
// })

// await swal({
//     title: 'Enter following details:',
//     input: 'select',
//     html: '<textarea class="form-control" id="swal-service-description" placeholder="Type your message here" rows="3"></textarea>',
//     inputOptions: inputOptions,
//     inputAttributes: {id: 'swal-service'},
//     inputPlaceholder: 'Select an option',
//     inputValidator: (value) => {
//         return !value && 'You need to select something!'
//     },
//     focusConfirm: false,
//     showCloseButton: true,
//     preConfirm: () => {
//         return [
//         $('select#swal-service').val(),
//         $('textarea#swal-service-description').val()
//         ]
//     }
// }).then((result) => {
// //console.log(result)
// if (result.value) {
//     var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

//     eventData.title += ' (' + service + ') ';
//     if(eventData.resources !== ''){
//         eventData.title += 'in ' + eventData.resources;
//     }
//     if (eventData.title !== '') {
//         eventData['service'] = service;
//         eventData['description'] = description;
//         addExternalEvent(eventData);
//     }
// } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
//     $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
// }
// });
// }
// callCategory(eventData);
// }else{
//     if(resourceValue !== ''){
//         eventData.title += ' in ' + resourceValue;
//     }
//     if (eventData.title !== '') {                    
//         addExternalEvent(eventData);
//     }
// }
// }
// };

// // Timeline Resource View
// myOptions = {
// //defaultDate: '2017-12-07',
// scrollTime: '00:00', // undo default 6am scrollTime
// header: {
//     left: 'myCustomButton prev,next today',
//     center: 'title',
//     right: 'timelineDay,timelineThreeDays,timelineWeek,timelineMonth,timelineYear'
// },
// customButtons: {
//     myCustomButton: {
//         text: "Client Name",
//         click: function() {
//             window.location.href = "https://geligulu.com/form-generator/public/index.php/records/3581";
//         }
//     }
// },
// defaultView: 'timelineDay',
// views: {
//     timelineThreeDays: {
//         type: 'timeline',
//         duration: { days: 3 }
//     },
//     timelineMonth: { buttonText: 'month' },
//     timelineWeek: { buttonText: 'week' },
//     timelineDay: { buttonText: 'day' },
// },           
// events: function(start, end, timezone, callback) {
//     $.ajax({
//         url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/timeline",
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
// },
// resourceAreaWidth: '40%',
// //resourceLabelText: "",
// resourceColumns: [{"labelText":"Group Name","field":"text_1532948381702","group":true},{"labelText":"Client Name","field":"text-1532948551606"},{"labelText":"Start Date","field":"date_1532948579268"},{"labelText":"End Date","field":"date-1532948649198"}],
// resourceOrder: "text_1532948381702,text-1532948551606",
// resources: {
//     url: "https://geligulu.com/form-generator/public/index.php/calendar/getResources/resources/3583",
//     dataType: 'json'
// },
// resourceRender: function(resourceObj, labelTds, bodyTds) {
//     var cellText = '';
// //cellText = labelTds.find('.fc-cell-text').text();
// //labelTds.find('.fc-cell-text').html(cellText);

// for(i=0; i<labelTds.length; i++){
// //console.log($(labelTds[i]));
// var labelTd = $(labelTds[i]);
// var cellText = labelTd.find('.fc-cell-text').text();
// var result1 = cellText.indexOf("img-responsive");
// if(result1 >= 0){
//     labelTd.find('.fc-cell-text').html(cellText);
// }
// var result2 = cellText.indexOf("file-download");
// if(result2 >= 0){
//     labelTd.find('.fc-cell-text').html(cellText);
// }
// }
// },            
// };
// calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions);
// $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);

// // Vertical Resource View
// myOptions = {
// //defaultDate: '2017-12-07',
// scrollTime: '00:00', // undo default 6am scrollTime            
// header: {
//     left: 'myCustomButton prev,next today',
//     center: 'title',
//     right: 'agendaDay,agendaTwoDays,agendaThreeDays'
// },            
// customButtons: {
//     myCustomButton: {
//         text: "Client Name",
//         click: function() {
//             window.location.href = "https://geligulu.com/form-generator/public/index.php/records/3581";
//         }
//     }
// },
// views: {
//     agendaTwoDays: {
//         type: 'agenda',
//         duration: { days: 2 },

// // views that are more than a day will NOT do this behavior by default
// // so, we need to explicitly enable it
// groupByResource: true,

// // uncomment this line to group by day FIRST with resources underneath
// //groupByDateAndResource: true
// },
// agendaThreeDays: {
//     type: 'agenda',
//     duration: { days: 3 },
//     groupByResource: true,
// }
// },
// defaultView: 'agendaDay',           
// events: function(start, end, timezone, callback) {
//     $.ajax({
//         url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/v-resources",
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
// },
// allDaySlot: false,
// resources: {
//     url: "https://geligulu.com/form-generator/public/index.php/calendar/getResources/resources/3583",
//     dataType: 'json'
// },
// };
// calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions);
// $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);

// // Vertical Activities View
// myOptions = {
// scrollTime: '00:00', // undo default 6am scrollTime            
// header: {
//     left: 'myCustomButton prev,next today',
//     center: 'title',
//     right: 'agendaDay,agendaTwoDays,agendaThreeDays'
// },            
// customButtons: {
//     myCustomButton: {
//         text: "Professional Name",
//         click: function() {
//             window.location.href = "https://geligulu.com/form-generator/public/index.php/records/3582";
//         }
//     }
// },
// views: {
//     agendaTwoDays: {
//         type: 'agenda',
//         duration: { days: 2 },

// // views that are more than a day will NOT do this behavior by default
// // so, we need to explicitly enable it
// groupByResource: true,

// // uncomment this line to group by day FIRST with resources underneath
// //groupByDateAndResource: true
// },
// agendaThreeDays: {
//     type: 'agenda',
//     duration: { days: 3 },
//     groupByResource: true,
// }
// },
// defaultView: 'agendaDay',           
// events: function(start, end, timezone, callback) {
//     $.ajax({
//         url: "https://geligulu.com/form-generator/public/index.php/calendar/getEvents/3583/v-activities",
//         dataType: 'json',
//         data: {
// // our hypothetical feed requires UNIX timestamps
// //start: start.unix(),
// //end: end.unix()
// },
// success: function(response) {                      
//     callback(response);
// }
// });
// },
// allDaySlot: false,
// resources: {
//     url: "https://geligulu.com/form-generator/public/index.php/calendar/getResources/activities/3583",
//     dataType: 'json'
// },
// /*selectable: true,
// selectHelper: true,
// select: function(start, end, jsEvent, view, resource) {
// var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
// var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resource.id);

// console.log(resource)
// dialog.find( "form #tab_start" ).val(start.format());
// dialog.find( "form #tab_end" ).val(end.format());
// if(typeof resource.eventColor != 'undefined')
// dialog.find( "form #tab_color" ).val(resource.eventColor).change();
// dialog.find( "form #allDay" ).val('false');
// dialog.find( "form #resourceId" ).val(resource.id);
// if(typeof resource[activityField] != 'undefined'){
// resourceValue = resource[activityField];
// dialog.find( "form #resources" ).val(resourceValue);
// dialog.find( "form #tab_title" ).val(' in ' + resourceValue);
// }                
// dialog.dialog( "open" );

// $("#vertical-activities-view .calendar").fullCalendar('unselect');
// },*/
// };
// calendarOptions = $.extend({}, defaultOptions, myOptions);
// $('#vertical-activities-view div.calendar').fullCalendar(calendarOptions);             

// var themeSystem = "standard";
// $('#theme-system-selector select').val(themeSystem);

// // initThemeChooser({
// //     change: function(themeSystem) {
// // //$('.calendar').fullCalendar('option', 'themeSystem', themeSystem);
// // }
// // });

// var loader = "https://geligulu.com/form-generator/public/assets/images/ajax-loader.gif";
// $('#galleryModal').on('show.bs.modal', function (event) {
//     var button = $(event.relatedTarget);
//     var form_id = button.attr('data-formID'),
//     form_name = button.attr('data-fieldName'),
//     form_key = button.attr('data-formGroupKey');
//     var modal = $(this);

//     modal.find('.modal-title').html(button.parent().find('strong').text());
//     modal.find('.modal-body').html("");
//     modal.find('.modal-body').block({ message: '<img src="' + loader + '" />', css: { position: 'relative', width: '100%', border: 'none' } });

//     $.post("https://geligulu.com/form-generator/public/index.php/subforms/getAllFiles", {formID: form_id, fieldName: form_name, formGroupKey: form_key}, function(data){
//         modal.find('.modal-body').unblock();
//         modal.find('.modal-body').html(data);
//     });
// });
// });
// function notificationDetail(formData, message){
//     var rowRecord = "";
//     message += "<br><br>";

// //define a table layout structure and set width of row
// $.each(formData, function(field, value){
// //console.log(field, '-', value);
// rowRecord += "<div><strong>" + field + ":</strong> " + value + "</div>";
// });
// message += "<table><tr><td>" + rowRecord + "</td></tr></table><div class='clearfix'></div><br>";

// return message;
// }

// function addEvent(form){
//     var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
//     var title = $.trim($( "#tab_title" ).val()),
//     start = $( "#tab_start" ).val(),
//     end = $( "#tab_end" ).val(),
//     color = $( "#tab_color" ).val();

//     if(start.indexOf(":") !== -1){
//         allDay = false;
//     }else{
//         allDay = true;
//     }

//     if (title) {
//         var eventData = {
//             title: title, 
//             color: color, 
//             allDay: allDay, 
//             start: start, 
//             end: end, 
//             resourceId: $( "#resourceId" ).val(), 
//             resources: $( "#resources" ).val(), 
// //activities: activityValue,
// };
// //var formData = form.serializeArray();
// //formData.push({name: 'allDay', value: 'false'});

// $.ajax({
//     method: 'POST',
//     url: "https://geligulu.com/form-generator/public/index.php/formSaving/3583",
//     dataType: 'json',
// data: eventData, //$.param(formData)
// beforeSend: function() {
//     // showLoader();
// },
// success: function(response) {
//     if(response.success){
// // send message in firebase
// if(firebase_room_id !== ""){
//     firebase.auth().onAuthStateChanged(function(user) {
// // Once authenticated, instantiate Firechat with the logged in user
// if (user) {
//     var chatRef = firebase.database().ref(_chat_ref);
// // Create a Firechat instance
// _firechat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
// _firechat.maxLengthMessage = 10000;
// _firechat._chat.setUser(user.uid, user.displayName, function(){
//     var user = firebase.auth().currentUser;
//     var message = user.displayName + " has inserted a record.";

//     if(detailNotify === 'Yes'){
//         message = notificationDetail(eventData, message);
//         message += "<a target='_blank' href='" + window.location.href + "'>View Calendar</a>";
//     }
// //console.log(message);
// _firechat._chat.sendMessage(firebase_room_id, message, 'chatNotify');
// });
// }
// });
// }
// }else{
//     swal({ type: 'error', title: '', text: response.message});
// }

// var eventData = {
//     id: response['group-key'],
//     title: title,
//     start: start,
//     end: end,
//     color: color
// };
// $("#" + current_tab +" div.calendar").fullCalendar('renderEvent', eventData);
// $("#" + current_tab +" div.calendar").fullCalendar('refetchEvents');
// //$(".calendar").not( $("#" + current_tab +" div.calendar") ).fullCalendar('refetchEvents');
// },
// complete: function() {
//     $.unblockUI();
// }
// });
// }
// }
// $(document).ready(function () {
//     $("body").on('click','a#qrCodeNew',function(){
//         bootbox.dialog({
//             onEscape: true,
//             title: "QR Code",
//             message:'<div id="menuId" class="list-group text-center clearfix">' +
//             '<img src="data:image/png;base64, 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ABsEFgAbBBYAG/G6NTRQtB0KQnDpPzFQtM0daOGwuedM3teBOywANggsADYILAA2CCwANggsADYILAA2mtitIYSBi6xp93GoOVADd+UIsQxvvX9HzdGrcy9WqK5xyQIAwxBYAGwQWABsEFgAbBBYAGwQWABsBClrGIg2Bpt7eAhpdw8ZKG35RfUrSvvGJa82iIY7LAA2CCwANggsADYILAA2CCwANggsADbilTUMlHYdPdroaR/6DzF6tGqD6mqWINR85aNtqxGtFUoDm1KIOywARggsADYILAA2CCwANggsADYILAA2Epc1NFD11dwQC+E1hdgsI0RXCZctG6q/79He4uqivZsxcYcFwAaBBcAGgQXABoEFwAaBBcAGgQXABmUNldRsjRBCA5/aD9EvoYFbioSYZ7RdTmr+ZPLqDe6wANggsADYILAA2CCwANggsADYILAA2MjSPg0fQrTR0xYWVLf1GjM08IrS7ocyULTNMmI2e+AOC4ANAguADQILgA0CC4ANAguADQILgI143RrSNuSvLlofgpqHN/Anq0vb/SLtRzFaVUS0D0PMMiaPEAEAEVgAjBBYAGwQWABsEFgAbBBYAGwE6dYAACFwhwXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXABoEFwAaBBcAGgQXAxv8CLuf391JRZnkAAAAASUVORK5CYII=">'+
//             '<p class="mt-10">Scan me to access this form page.</p>'+
//             '</div>'
//         });
// });
// });