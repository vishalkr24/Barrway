var fbInstances = [];
//var assetsImagePath = window.location.origin + '/form-generator/public/assets/images';

var assetsImagePath = ASSET_URL + '/assets/images';

function hide_extra_attributes(fld) {
    $("div.form-group.form_setup-wrap", fld).nextUntil("div.form-group.more_setup-wrap").hide();
    $("div.form-group.more_setup-wrap", fld).nextUntil("div.form-group.advance_setup-wrap").hide();
    $("div.form-group.advance_setup-wrap", fld).nextAll("div.form-group").hide();
};

var fields = [
    {
        label: 'Map',
        attrs: {
            type: 'map'
        },
        icon: '<i class="fa fa-map-o" aria-hidden="true"></i>'
    },
    {
        label: 'Line',
        attrs: {
            type: 'Line'
        },
        icon: '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>'
    },
    {
        label: 'Banner',
        attrs: {
            type: 'banner'
        },
        icon: '<i class="fa fa-image" aria-hidden="true"></i>'
    },
    {
        label: 'One to Many Form',
        attrs: {
            type: 'tabulator'
        },
        icon: '<i class="fa fa-sitemap" aria-hidden="true"></i>'
    },
    {
        label: 'Table',
        attrs: {
            type: 'table'
        },
        icon: '<i class="fa fa-table" aria-hidden="true"></i>'
    },
    {
        label: 'tinyMCE content',
        attrs: {
            type: 'tinyMCE-content'
        },
        icon: '<i class="fa fa-code" aria-hidden="true"></i>'
    },
    {
        label: 'Text with Input',
        attrs: {
            type: 'text-with-input'
        },
        icon: '<i class="fa fa-text-width" aria-hidden="true"></i>'
    },
    {
        label: 'File Upload',
        attrs: {
            type: 'file'
        }
    },
    {
        label: 'Hyperlink',
        attrs: {
            type: 'hyperlink'
        },
        icon: '<i class="fas fa-link"></i>'
    },
    {
        label: 'Social Follow',
        attrs: {
            type: 'social_follow'
        },
        icon: '<i class="fab fa-facebook"></i>'
    },
    {
        label: 'Signature',
        attrs: {
            type: 'signature'
        },
        icon: '<i class="fas fa-signature"></i>'
    },
    {
        label: 'captcha',
        attrs: {
            type: 'captcha'
        },
        icon: '<i class="fas fa-lock"></i>'
    },
    //{
    //    label: 'PayPal Standard',
    //    attrs: {
    //        type: 'PayPal'
    //    },
    //    icon: '<i class="fab fa-paypal"></i>'
    //}
];
if (typeof extraFields !== 'undefined') {
    fields.push(extraFields);
}

var templates = {
    banner: function (fieldData) {
        var fileName = fieldData.value ? fieldData.value : assetsImagePath + '/dummy_banner.jpg';
        return {
            field: '<img style="width: 100%" class="' + fieldData.className + '" src="' + fileName + '">'
        };
    },
    captcha: function (fieldData) {
        return {
            field: '<i class="fas fa-lock fa-3x"></i>'
        };
    },
    file: function (fieldData) {
        var fileType = fieldData.subtype;
        if (fileType === 'file') {
            return {
                field: '<input type="file" class="' + fieldData.className + '" name="' + fieldData.name + '-preview" id="' + fieldData.name + '-preview">'
            };
        }
        else if (fileType === 'camera' || fileType === 'Camera Upload') {
            return {
                field: '<span class="fa fa-camera" style="font-size:4em" id="' + fieldData.name + '"></span>'
            };
        }
    },
    hyperlink: function (fieldData) {
        var href = fieldData.href ? fieldData.href : '#',
            title = fieldData.placeholder ? fieldData.placeholder : '';
        return {
            field: '<a id="' + fieldData.name + '" class="' + fieldData.className + '" href="' + href + '" target="' + fieldData.target + '" title="' + title + '" style="color: ' + fieldData.hyperlink_color + '">' + fieldData.label + '</a>'
        };
    },
    Line: function (fieldData) {
        return {
            field: '<hr noshade="noshade" id="' + fieldData.name + '" class="' + fieldData.className + '" style="border-style: inset;border-width: 1px;">'
        };
    },
    map: function (fieldData) {
        var title = encodeURIComponent($.trim(fieldData.label)),
            coord = '',
            latitude = (typeof fieldData.Lat_Value !== 'undefined') ? $.trim(fieldData.Lat_Value) : '',
            longitude = (typeof fieldData.Log_Value !== 'undefined') ? $.trim(fieldData.Log_Value) : '';

        if (latitude !== '' && longitude !== '') { coord = '&coord=' + latitude + ',' + longitude; }

        return {
            field: '<iframe width="100%" height="300" src="https://maps.google.com/maps?width=100%&height=300&hl=en' + coord + '&q=+(' + title + ')&ie=UTF8&t=&z=15&iwloc=B&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>'
        };
    },
    //PayPal: function (fieldData) {
    //    if (fieldData.PAYPAL_CURRENCY && fieldData.amount) {
    //        var amountText = '';
    //        if (!isNaN(fieldData.amount)) {
    //            amountText = '<div class="amountText" style="font-size:large;">' + fieldData.PAYPAL_CURRENCY + ' ' + fieldData.amount + '</div><br/>';
    //        }
    //        return {
    //            field: amountText + '<img src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/silver-rect-paypalcheckout-26px.png">'
    //        };
    //    } else {
    //        return {
    //            field: '<i class="fab fa-paypal fa-3x"></i>'
    //        };
    //    }
    //},
    signature: function (fieldData) {
        $.extend($.kbw.signature.options, {
            guideline: fieldData.guideline === 'Yes' ? true : false,
            guidelineColor: fieldData.guidelineColor,
            background: fieldData.background,
            color: fieldData.color,
            thickness: fieldData.thickness,
            guidelineOffset: fieldData.guidelineOffset,
            guidelineIndent: fieldData.guidelineIndent
        });
        var outputTemplate = '<div id="' + fieldData.name + '" style="width: ' + fieldData.pad_width + 'px; height: ' + fieldData.pad_height + 'px;"></div>';
        return {
            field: outputTemplate
        };
    },
    social_follow: function (fieldData) {
        var template = '';
        if (fieldData.facebook && $.trim(fieldData.facebook) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.facebook + '" target="_blank"><div title="Follow on Facebook" class="sbuttons facebook">Facebook</div></a></li>';
        }
        if (fieldData.twitter && $.trim(fieldData.twitter) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.twitter + '" target="_blank"><div title="Follow on Twitter" class="sbuttons twitter">Twitter</div></a></li>';
        }
        if (fieldData.linkedin && $.trim(fieldData.linkedin) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.linkedin + '" target="_blank"><div title="Follow on LinkedIn" class="sbuttons linkedin">LinkedIn</div></a></li>';
        }
        if (fieldData.google && $.trim(fieldData.google) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.google + '" target="_blank"><div title="Follow on Google+" class="sbuttons google">Google+</div></a></li>';
        }
        if (fieldData.instagram && $.trim(fieldData.instagram) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.instagram + '" target="_blank"><div title="Follow on Instagram" class="sbuttons instagram">Instagram</div></a></li>';
        }
        if (fieldData.youtube && $.trim(fieldData.youtube) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.youtube + '" target="_blank"><div title="Follow on Youtube" class="sbuttons youtube">Youtube</div></a></li>';
        }
        if (fieldData.vimeo && $.trim(fieldData.vimeo) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.vimeo + '" target="_blank"><div title="Follow on Vimeo" class="sbuttons vimeo">Vimeo</div></a></li>';
        }
        if (fieldData.pinterest && $.trim(fieldData.pinterest) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.pinterest + '" target="_blank"><div title="Follow on Pinterest" class="sbuttons pinterest">Pinterest</div></a></li>';
        }
        if (fieldData.flickr && $.trim(fieldData.flickr) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.flickr + '" target="_blank"><div title="Follow on Flickr" class="sbuttons flickr">Flickr</div></a></li>';
        }
        if (fieldData.tumblr && $.trim(fieldData.tumblr) !== '') {
            template += '<li class="social-list"><a href="' + fieldData.tumblr + '" target="_blank"><div title="Follow on Tumblr" class="sbuttons tumblr">Tumblr</div></a></li>';
        }

        if (template !== '') {
            return {
                field: '<ul class="social-networks" style="float: ' + fieldData.align + '">' + template + '</ul>'
            };
        } else {
            return {
                field: '<img class="field-iconImg" src="' + assetsImagePath + '/social_follow.png">'
            };
        }
    },
    table: function (fieldData) {
        var Display_Only = (typeof fieldData.Display_Only !== 'undefined' && fieldData.Display_Only !== 'No') ? 'disabled' : '';
        var width = (typeof fieldData.width !== 'undefined') ? fieldData.width + 'px' : '100%';
        var $table = $("<table>", { 'class': fieldData.className, 'name': fieldData.name, 'style': 'border-collapse: collapse; border-style: solid;width: ' + width, 'border': fieldData.border });
        var $thead = $("<thead>");
        $table.append($thead);
        // columns
        var tableHeads = '', multipleHeads;
        if (fieldData.columnHeadings && fieldData.columnHeadings.trim() !== '') {
            var headings = fieldData.columnHeadings.trim();
            var headArray = headings.split('|');
        } else {
            var headArray = [];
        }
        multipleHeads = checkForMultipleHeaders(headArray);
        var columnRows = (multipleHeads > 0) ? 2 : 1;
        var resultstring, tableColumns = (multipleHeads > 0) ? 0 : parseInt(fieldData.columns);
        for (var i = 0; i < columnRows; i++) {
            resultstring = '';
            resultstring += '<tr>';
            for (var j = 0; j < fieldData.columns; j++) {
                if (multipleHeads > 0 && i === 1) {
                    // second row of column
                    tableHeads = getSubHeading(headArray[j]);
                    if (tableHeads['multiple']) {
                        tableHeads['subheadings'].forEach(function (subheading) {
                            resultstring += '<th>' + subheading + '</th>';
                        });
                        tableColumns += tableHeads['subheadings'].length;
                    }
                } else {
                    // first row of column
                    if (headArray.length > 0 && headArray[j]) {
                        tableHeads = getSubHeading(headArray[j]);
                        if (!tableHeads['multiple']) {
                            if (multipleHeads > 0) {
                                resultstring += '<th rowspan="2">' + tableHeads['heading'] + '</th>';
                                tableColumns++;
                            }
                            else {
                                resultstring += '<th>' + tableHeads['heading'] + '</th>';
                            }
                        } else {
                            resultstring += '<th colspan="' + tableHeads['subheadings'].length + '">' + tableHeads['heading'] + '</th>';
                        }
                    }
                }
            }
            resultstring += '</tr>';
            $thead.append(resultstring);
        }

        // rows
        var $tbody = $("<tbody>");
        $table.append($tbody);
        var numRows = parseInt(fieldData.rows);
        if (fieldData.rowHeadings && fieldData.rowHeadings.trim() !== '') {
            var headings = fieldData.rowHeadings.trim();
            var rowHeadArray = headings.split('|');
        } else {
            var rowHeadArray = [];
        }
        for (var i = 0; i < numRows; i++) {
            // columns
            resultstring = '';
            resultstring += '<tr>';
            for (var j = 0; j < tableColumns; j++) {
                if (j === 0 && rowHeadArray.length > 0 && rowHeadArray[i]) {
                    resultstring += '<td>' + rowHeadArray[i].trim() + '</td>';
                } else {
                    if (typeof headArray[j] !== 'undefined') {
                        tableHeads = getSubHeading(headArray[j]);
                        if (tableHeads['multiple']) {
                            for (var k = 1; k <= tableHeads['subheadings'].length; k++) {
                                var field = generateColumnField(fieldData.columnInputs, j + 1, '', '', i, Display_Only, '');
                                resultstring += '<td>' + field.result + '</td>';
                            }
                        } else {
                            var field = generateColumnField(fieldData.columnInputs, j + 1, '', '', i, Display_Only, '');
                            var widthClass = (Math.round((field.width * 12) / 100));
                            var putClassCol = (widthClass != '0' || widthClass !== 'undefined') ? "col-sm-" + widthClass : "";
                            resultstring += '<td class="' + putClassCol + '">' + field.result + '</td>';
                            //                            resultstring += '<td>' + field.result + '</td>';
                        }
                    }
                }
            }
            resultstring += '</tr>';
            $tbody.append(resultstring);
        }
        return {
            field: '<div class="table-responsive">' + $table[0].outerHTML + '</div>'
        };
    },
    tabulator: function (fieldData) {
        var referenceForm = fieldData.reference_form;
        if (referenceForm !== '0') {
            var outputTemplate = '  <div class="tabulator-section"> <div id="' + fieldData.name + '"></div></div>' +
                '<script>' +
                'var elementID = fieldData.name;' +
                'var elementHeight = fieldData.size;' +
                'var $tabulator = initTabulator(elementID + "-preview", {' +
                '$tabulator.tabulator({ height: elementHeight, layout: "fitDataFill", tooltipsHeader: true, responsiveLayout: false });' +
                //$.getJSON(BASE_URL + "/create-form-tabulator/" + referenceForm, function (data) { $tabulator.setColumns(data.formDataHeaders); });
                'var scope = angular.element($("#FormGeneratorController")).scope(); $.post(scope.currentUrl + "/api/FormAPI/getReferralFormFieldsAndData", { "action": 3, "formId": referenceForm }, function (data, status) { $tabulator.setColumns(data.formDataHeaders); });</script > ';

                        return {
                            field: outputTemplate
                        };
            return {
                field: '<div id="' + fieldData.name + '"></div>'
            };
        } else {
            return {
                field: '<img class="img-responsive" src="' + assetsImagePath + '/tabulator.jpg">'
            };
        }
    },
    'text-with-input': function (fieldData) {
        var heading_1 = typeof fieldData.prefix !== 'undefined' ? fieldData.prefix : 'Prefix',
            heading_2 = typeof fieldData.suffix !== 'undefined' ? fieldData.suffix : 'Suffix',
            placeholder = typeof fieldData.placeholder !== 'undefined' ? fieldData.placeholder : '',
            value = typeof fieldData.value !== 'undefined' ? fieldData.value : '';
        return {
            field: '<p>' + heading_1 + ' <input type="text" class="editable-area" placeholder="' + placeholder + '" value="' + value + '"> ' + heading_2 + '</p>'
        };
    },
    'tinyMCE-content': function (fieldData) {
        return {
            field: (fieldData.value ? fieldData.value : '')
        };
    }
};
if (typeof extraTemplates !== 'undefined') {
    templates = $.extend({}, templates, extraTemplates);
}

var typeUserDisabledAttrs = {
    banner: ['required', 'description', 'placeholder'],
    button: ['value'],
    captcha: ['required', 'description', 'placeholder', 'value', 'className'],
    hidden: ['access'],
    hyperlink: ['required', 'description', 'value'],
    Line: ['required', 'description', 'placeholder', 'value'],
    map: ['required', 'description', 'placeholder', 'value'],
    signature: ['required', 'placeholder', 'value', 'className'],
    social_follow: ['required', 'placeholder', 'value', 'className', 'description'],
    table: ['required', 'placeholder', 'value', 'description'],
    tabulator: ['required', 'placeholder', 'value', 'className'],
    'text-with-input': ['description', 'className'],
    'tinyMCE-content': ['required', 'placeholder', 'description', 'className'],
    PayPal: ['required', 'placeholder', 'description', 'className', 'value', 'access']
};
var yCoord = { '0': 'Select a value' };
for (var i = 1; i <= 200; i++) {
    yCoord[i.toString()] = i.toString();
}
//console.log(yCoord);
var xCoord = { '': 'Select a value' };
for (var i = 65; i <= 90; i++) {
    xCoord[String.fromCharCode(i).toString()] = String.fromCharCode(i).toString();
}
//console.log(xCoord)
//console.log(yCoord)

var typeUserAttrs = {
    text: {
        //        popover_alignment: {
        //            label: 'Popup Alignment',
        //            options: {
        //                'top': 'Top',
        //                'bottom': 'Bottom',
        //                'left': 'Left',
        //                'right': 'Right',
        //                'auto': 'Auto'
        //            },
        //            value: 'auto'
        //        },
        UserField: {
            label: 'User Field',
            options: {
                '': 'None',
                'name': 'User Name',
                'fullName': 'Full Name',
                'email': 'User Email',
                'phoneNumber': 'User Phone'
            }
        },
        form_setup: { // Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: ''
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: ''
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        maxlength: {
            label: 'Max Length',
            type: 'number',
            min: '0'
        },
        Min_Value: {
            label: 'Min Length',
            type: 'number',
            min: '0',
            class: 'fld-minlength form-control'
        },
        Unique_Value: {
            label: 'Unique Value',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'plaintext': 'plaintext',
                'textarea': 'textarea',
                'html': 'html',
                'email': 'email',
                'image': 'image',
                'link': 'link',
                'color': 'color',
                'rownum': 'rownum'
            }
        },
        prefix: {
            label: 'Prefix',
            type: 'text',
            placeholder: 'Enter prefix'
        },
        suffix: {
            label: 'Suffix',
            type: 'text',
            placeholder: 'Enter suffix'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        Inline_Edit: {
            label: 'Allow inline editing',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        attributeType: { label: 'Worksheet Field Type', options: { '': 'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet' } },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    textarea: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        maxlength: {
            label: 'Max Length',
            type: 'number',
            min: '0'
        },
        rows: {
            label: 'rows',
            type: 'number',
            min: '0',
            value: '5'
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'plaintext': 'plaintext',
                'textarea': 'textarea',
                'html': 'html'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    number: {
        types: {
            label: 'Type',
            options: {
                'simple': 'Simple',
                'slider': 'Slider',
                'calculator': 'Calculation',
                'num_pad': 'Number Pad',
                'num_pad_popup': 'Number Pad Pop-up',
                'waiting_records': 'Waiting records'
            }
        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        min: {
            label: 'Minimum Value',
            type: 'number'
        },
        max: {
            label: 'Maximum Value',
            type: 'number'
        },
        step: {
            label: 'step',
            type: 'text',
            value: 'any',
            style: 'width: 100px'
        },
        number_decimal: {
            label: 'Number of decimals',
            type: 'number',
            min: '0'
        },
        Incremental: {
            label: 'Auto Incremental',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        Start_Value: {
            label: 'Increment Start Value',
            type: 'number',
            min: '0'
        },
        End_Value: {
            label: 'Increment End Value',
            type: 'number',
            min: '0'
        },
        Unique_Value: {
            label: 'Unique Value',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'plaintext': 'plaintext',
                'money': 'money',
                'tick': 'tick',
                'tickCross': 'tickCross',
                'star': 'star',
                'progress': 'progress'
            }
        },
        progress_color: {
            label: 'Progress bar color',
            description: 'Colour of progress bar (default #2DC214).',
            type: 'color',
            value: '#2DC214'
        },
        //        progress_legend :{
        //            label: 'Show value on bar',
        //            options: {
        //                '': 'No',
        //                'Yes': 'Yes'
        //            }
        //        },
        column_calculation: {
            label: 'Column Calculation',
            options: {
                '': '-- Select a function --',
                'avg': 'Average value of the column',
                'sum': 'Sum of all values in the column',
                'max': 'Maximum value in the column',
                'min': 'Minimum value in the column'
            }
        },
        table_calculation: {
            label: 'Table Calculation',
            type: 'text',
            placeholder: 'Enter table name for column calculation'
        },
        table_calculation_columns: {
            label: 'Table Columns',
            options: {
                '': '-- Select a column --'
            }
        },
        table_calculate_column: {
            label: 'Calculate column',
            type: 'hidden'
        },
        prefix: {
            label: 'Prefix',
            type: 'text',
            placeholder: 'Enter prefix'
        },
        suffix: {
            label: 'Suffix',
            type: 'text',
            placeholder: 'Enter suffix'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        Update_Form_Field: {
            label: 'Update Master Field',
            type: 'text',
            value: ''
        },
        update_operation: {
            label: 'Update Formula',
            options: {
                '': 'Select Operation',
                '+': 'Plus',
                '-': 'Minus',
                '*': 'Multiply',
                '/': 'Divide'
            }
        },
        Inline_Edit: {
            label: 'Allow inline editing',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            'value': 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            'value': 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        attributeType: { label: 'Worksheet Field Type', options: { '': 'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet' } },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    autocomplete: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {

                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },

        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        Use_as_tags: {
            label: 'Use as tags',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        referenceSettings: {
            label: 'Reference Settings',
            type: 'button',
            value: 'Settings',
            class: 'referralFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Reference Settings',
            'data-label': 'Reference to'
        },
        Referral_Forms: {
            label: 'Reference to Form',
            type: 'number',
            value: ''
        },
        Referral_Form_Fields: {
            label: 'Reference to Field',
            type: 'text',
            value: ''
        },
        default_values: {
            label: 'Pick Default values',
            title: 'Do you want to use this field to put default values into form fields?',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    select: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {

                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },

        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        prefix: {
            label: 'Prefix',
            type: 'text',
            placeholder: 'Enter prefix'
        },
        suffix: {
            label: 'Suffix',
            type: 'text',
            placeholder: 'Enter suffix'
        },
    Use_as_tags: {
        label: 'Use as tags',
        options: {
            '': 'No',
            'Yes': 'Yes'
        }
    },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        referenceSettings: {
            label: 'Reference Settings',
            type: 'button',
            value: 'Settings',
            class: 'referralFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Reference Settings',
            'data-label': 'Reference to'
        },
        Referral_Forms: {
            label: 'Reference to Form',
            type: 'number',
            value: ''
        },
        Referral_Form_Fields: {
            label: 'Reference to Field',
            type: 'text',
            value: ''
        },
        default_values: {
            label: 'Pick Default values',
            title: 'Do you want to use this field to put default values into form fields?',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        populate_fields: {
            label: 'Populate other fields',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'No'
        },
        dependent_field_names: {
            label: 'Dependent field',
            placeholder: 'Enter comma seperated dependent field names of this form'
        },
        multiple_records: {
            label: 'Multiple records',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            }
        },
        Display_tab: {
            label: 'display in tab',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        Inline_Edit: {
            label: 'Allow inline editing',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    "checkbox-group": {
        //        worksheet:{label: 'Worksheet', options: worksheets},
        //        coordinateSet:{
        //            label: 'Coordinate Settings',
        //            type: 'button',
        //            value: 'Settings',
        //            class: 'columnFieldsCheckbox'
        //        },
        //        columnInputsCheckbox:{
        //            label: ' ',
        //            type: 'hidden'
        //        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },

        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color11',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        media_options: {
            label: 'Upload option images',
            type: 'file',
            multiple: 'multiple',
            accept: "image/*",
            onchange: "createMediaOptions(this.id)"
        },
        /*toggle:{
            type: 'checkbox'
        },
        other:{
            type: 'checkbox',
            label: 'Enable "Other"',
            description: 'Let users to enter an unlisted option'
        },*/
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        referenceSettings: {
            label: 'Reference Settings',
            type: 'button',
            value: 'Settings',
            class: 'referralFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Reference Settings',
            'data-label': 'Reference to'
        },
        Referral_Forms: {
            label: 'Reference to Form',
            type: 'number',
            value: ''
        },
        Referral_Form_Fields: {
            label: 'Reference to Field',
            type: 'text',
            value: ''
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        Display_tab: {
            label: 'display in tab',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        //        attributeType:{label: 'Worksheet Field Type', options: {'':'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet'}},
        className: { "label": "Class", "value": "checkbox", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    "radio-group": {
        //        worksheet:{label: 'Worksheet', options: worksheets},
        //        coordinateSetRadio:{
        //            label: 'Coordinate Settings',
        //            type: 'button',
        //            value: 'Settings',
        //            class: 'columnFieldsRadio'
        //        },
        //        columnInputsRadio:{
        //            label: ' ',
        //            type: 'hidden'
        //        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Conrol Width (in %)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        types: {
            label: 'Type',
            options: {
                'simple': 'Default',
                'choice': 'Choice Option',
                'queue_server': 'Queue Server',
                'status': 'Queue Status',
                'session_status': 'Session Status',
                'approval': 'Approval Status'
            },
            onchange: "createChoiceOptions(this.id)"
        },
        yes_choice_fields: {
            label: '"Yes" choice fields',
            placeholder: 'Enter comma seperated field names of this form'
        },
        no_choice_fields: {
            label: '"No" choice fields',
            placeholder: 'Enter comma seperated field names of this form'
        },
        media_options: {
            label: 'Upload option images',
            type: 'file',
            multiple: 'multiple',
            accept: "image/*",
            onchange: "createMediaOptions(this.id)"
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'plaintext': 'plaintext',
                'html': 'html',
                'email': 'email',
                'image': 'image',
                'link': 'link',
                'star': 'star',
                'color': 'color',
                'tick': 'tick',
                'tickCross': 'tickCross'
            }
        },
        column_calculation: {
            label: 'Column Calculation',
            options: {
                '': '-- Select a function --',
                'avg': 'Average value of the column',
                'sum': 'Sum of all values in the column',
                'max': 'Maximum value in the column',
                'min': 'Minimum value in the column'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        referenceSettings: {
            label: 'Reference Settings',
            type: 'button',
            value: 'Settings',
            class: 'referralFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Reference Settings',
            'data-label': 'Reference to'
        },
        Referral_Forms: {
            label: 'Reference to Form',
            type: 'number',
            value: ''
        },
        Referral_Form_Fields: {
            label: 'Reference to Field',
            type: 'text',
            value: ''
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        default_values: {
            label: 'Pick Default values',
            title: 'Do you want to use this field to put default values into form fields?',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        Display_tab: {
            label: 'display in tab',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        Inline_Edit: {
            label: 'Allow inline editing',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        //        attributeType:{label: 'Worksheet Field Type', options: {'':'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet'}},
        className: { "label": "Class", "value": "radio", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    date: {
        types: {
            label: 'Type',
            options: {
                //'date': 'Simple Date',
                //'time': 'Simple Time',
                'date_picker': 'Date picker',
                'time_picker': 'Time picker',
                'datetime_picker': 'DateTime picker'
            }
        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {

                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        Min_Value: {
            label: 'Min Value',
            type: "text",
            placeholder: "yyyy/mm/dd or hh:ii or yyyy/mm/dd hh:ii"
        },
        Max_Value: {
            label: 'Max Value',
            type: "text",
            placeholder: "yyyy/mm/dd or hh:ii or yyyy/mm/dd hh:ii"
        },
        set_default: {
            label: 'Set Default Value',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            }
        },
        Unique_Value: {
            label: 'Unique Value',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        prefix: {
            label: 'Prefix',
            type: 'text',
            placeholder: 'Enter prefix'
        },
        suffix: {
            label: 'Suffix',
            type: 'text',
            placeholder: 'Enter suffix'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        //        XCoordinate:{"label": "X- coordinate", options: xCoord},
        //        YCoordinate:{"label": "Y- coordinate", options: yCoord},
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        attributeType: { label: 'Worksheet Field Type', options: { '': 'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet' } },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    file: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {

                'left': 'Left',
                'right': 'Right',
                'center': 'Center',
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },

        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'number',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'

            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    header: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        align: {
            label: 'Alignment',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        className: { "label": "Class", "value": "header", placeholder: "Please enter space separated classes" },
        name: {
            label: 'Name',
            value: makeid()
        }
    },
    paragraph: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        className: { "label": "Class", "value": "para", placeholder: "Please enter space separated classes" },
        name: {
            label: 'Name',
            value: makeid()
        }
    },
    banner: {
        image: {
            "label": 'Select Image',
            type: 'file',
            class: "fld-image form-control file_upload",
            onchange: "changeImage(this.id)"
        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        value: {
            label: "Uploaded Image",
            type: "text",
            class: "changeImage fld-name label-control",
            disabled: "disabled"
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        //                width:{
        //                    label:"Image Width",
        //                    type : "number"
        //                },
        //                height:{
        //                    label:"Image Height",
        //                    type : "number"
        //                },
        className: { "label": "Class", "value": "img-responsive", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    button: {
        form_setup: {// Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        background_color: {
            label: 'Background Color',
            value: ''
        },
        border_width: {
            label: 'Border Radius (in %)',
            type: 'number',
            min: '0',
            max: '50'
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        width: {
            label: 'Width (in %)',
            type: 'number',
            min: '0'
        },
        alignment: {
            label: 'Alignment',
            options: {
                'left': 'Left',
                'right': 'Right'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    map: {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        Lat_Value: {
            label: 'Latitude',
            type: 'text'
        },
        Log_Value: {
            label: 'Longitude',
            type: 'text'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator'
            },
            value: 'No'
        },
        className: { "label": "Class", value: "", placeholder: "Please enter space separated classes" },
        name: { "label": "Name" }
    },
    Line: {
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        className: { "label": "Class", value: "line", placeholder: "Please enter space separated classes" },
        name: { label: "Name" }
    },
    hyperlink: {
        href: {
            label: 'Url',
            value: ''
        },
        placeholder: {
            label: 'Title',
            value: ''
        },
        form_setup: { // Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        hyperlink_color: {
            label: 'Text Color',
            value: '#362b36'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: ''
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        target: {
            label: 'Target',
            options: {
                '_self': 'None',
                '_blank': 'New Window',
                '_parent': 'Parent Window'
            }
        },
        
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { label: "Name" }
    },
    'tinyMCE-content': {
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        width: {
            label: 'Width (in %)',
            type: 'number',
            min: '0'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        className: { "label": "Class", value: "", placeholder: "Please enter space separated classes" },
        name: { label: "Name" }
    },
    tabulator: {
        reference_form: {
            label: 'Reference to Form',
            options: Referral_Forms,
            value: ''
        },
        size: {
            label: 'Size of Tabulator',
            options: {
                '50%': 'Small',
                '75%': 'Medium',
                '100%': 'Large'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        name: { label: "Name" }
    },
    table: {
        columns: {
            label: 'Columns',
            type: 'number',
            min: '1',
            value: '3'
        },
        columnHeadings: {
            label: 'Column Headings',
            type: 'text',
            placeholder: 'Enter bar(|) separated headings and for multiple headers eg head {head1,head2,...}',
            value: 'Heading 1 | Heading 2 | Heading 3 {Subheading 1, Subheading 2, Subheading 3}'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        columnFields: {
            label: 'Column Fields',
            type: 'button',
            value: 'Settings',
            class: 'columnFields'
        },
        columnInputs: {
            label: ' ',
            type: 'hidden'
        },
        rows: {
            label: 'Rows',
            type: 'number',
            min: '1',
            value: '3'
        },
        rowHeadings: {
            label: 'Row Headings',
            type: 'text',
            placeholder: 'Enter bar(|) separated headings'
        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },

        width: {
            label: 'Field Width (in px)',
            type: 'number',
            min: '0'
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: 'transparent'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '1'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        addRows: {
            label: 'Add rows',
            options: {
                '0': 'No',
                '1': 'Yes'
            }
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", value: "table mb-0", placeholder: "Please enter space separated classes" },
        name: { label: "Name" }
    },
    'text-with-input': {
        UserField: {
            label: 'User Field',
            options: {
                '': 'None',
                'name': 'User Name',
                'fullName': 'Full Name',
                'email': 'User Email',
                'phoneNumber': 'User Phone'
            }
        },
        form_setup: { // More Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },

        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: ''
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        maxlength: {
            label: 'Max Length',
            type: 'number',
            min: '0'
        },
        Min_Value: {
            label: 'Min Length',
            type: 'number',
            min: '0',
            class: 'fld-minlength form-control'
        },
        prefix: {
            label: 'Prefix',
            type: 'text',
            placeholder: 'Enter prefix'
        },
        suffix: {
            label: 'Suffix',
            type: 'text',
            placeholder: 'Enter suffix'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        type: {
            label: 'Control Type',
            options: {
                'autocomplete': 'Autocomplete',
                'checkbox-group': 'Checkbox Group',
                'date': 'Date Field',
                'number': 'Number',
                'radio-group': 'Radio Group',
                'select': 'Select',
                'text': 'Text Field',
                'textarea': 'Text Area',
                'text-with-input': 'Text with input'
            }
        },
        derivedSettings: {
            label: 'Default Values',
            type: 'button',
            value: 'Settings',
            class: 'derivedFields',
            'data-toggle': 'modal',
            'data-target': '#referenceModal',
            'data-title': 'Default Values Settings',
            'data-label': 'Derived from'
        },
        Default_Value: {
            label: 'Derived from Form',
            type: 'text',
            value: ''
        },
        Default_Value_Field: {
            label: 'Derived from Field',
            type: 'text',
            value: ''
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'plaintext': 'plaintext',
                'textarea': 'textarea',
                'html': 'html',
                'email': 'email',
                'image': 'image',
                'link': 'link',
                'color': 'color',
                'rownum': 'rownum'
            }
        },
        Inline_Edit: {
            label: 'Allow inline editing',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'

            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        worksheet: { label: 'Worksheet', options: worksheets },
        XCoordinate: { "label": "Worksheet Column", "value": '', "class": "text-uppercase fld-XCoordinate" },
        YCoordinate: { "label": "Worksheet Row", "type": "number", "value": '', "class": "form-control fld-YCoordinate" },
        attributeType: { label: 'Worksheet Field Type', options: { '': 'None', 'input': 'Write data to spreadsheet', 'output': 'Read data from spreadsheet' } },
        name: { "label": "Name" }
    },
    social_follow: {
        facebook: {
            label: 'Facebook',
            value: ''
        },
        twitter: {
            label: 'Twitter',
            value: ''
        },
        linkedin: {
            label: 'LinkedIn',
            value: ''
        },
        google: {
            label: 'Google+',
            value: ''
        },
        form_setup: { // Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        background_color: {
            label: 'Background Color',
            value: ''
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        instagram: {
            label: 'Instagram',
            value: ''
        },
        youtube: {
            label: 'Youtube',
            value: ''
        },
        vimeo: {
            label: 'Vimeo',
            value: ''
        },
        pinterest: {
            label: 'Pinterest',
            value: ''
        },
        flicker: {
            label: 'Flicker',
            value: ''
        },
        tumblr: {
            label: 'Tumblr',
            value: ''
        },
        align: {
            label: 'Alignment',
            options: {
                'left': 'Left',
                'right': 'Right',
                'none': 'Center'
            },
            value: 'left'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        className: { "label": "Class", placeholder: "Please enter space separated classes" },
        name: { label: "Name" }
    },
    signature: {
        background: {
            label: 'Background Color',
            description: 'Colour of the background',
            value: '#ffffff'
        },
        color: {
            label: 'Pen Color',
            description: 'Colour of the signature',
            value: '#000000'
        },
        thickness: {
            label: 'Thickness',
            description: 'Thickness of the lines',
            type: 'number',
            min: '0',
            value: '2'
        },
        guideline: {
            label: 'Guideline',
            description: 'Add a guide line or not?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        form_setup: { // Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: { // More Settings
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        guidelineColor: {
            label: 'Guideline Color',
            description: 'Guide line colour',
            value: '#a0a0a0'
        },
        guidelineOffset: {
            label: 'Guideline Offset',
            description: 'Guide line offset from the bottom',
            type: 'number',
            min: '0',
            value: '25'
        },
        guidelineIndent: {
            label: 'Guideline Indent',
            description: 'Guide line indent from the edges',
            type: 'number',
            min: '0',
            value: '10'
        },
        pad_width: {
            label: 'Sign Pad Width (px)',
            type: 'number',
            min: '100',
            value: '400'
        },
        pad_height: {
            label: 'Sign Pad Height (px)',
            type: 'number',
            min: '100',
            value: '150'
        },
        output_format: {
            label: 'Output Signature Format',
            description: 'Select format of data to store',
            options: {
                'JSON': 'JSON',
                'SVG': 'SVG',
                'PNG': 'PNG',
                'JPEG': 'JPEG'
            },
            value: 'JPEG'
        },
        column_format: {
            label: 'Display Format',
            description: 'Select format of data in tabulator',
            options: {
                'image': 'image',
                'plaintext': 'plaintext'
            },
            value: 'image'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        List_column1: {
            label: 'List Field Table Layout',
            title: 'Do you want to list this in form records tabulator as a column?',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        List_column2: {
            label: 'List Field Page Layout',
            options: {
                'No': 'No',
                'Yes': 'Yes'
            },
            value: 'Yes'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        Display_Only: {
            label: 'Display Only',
            options: {
                'No': 'No',
                '0': 'Display only for General User',
                '10': 'Display only for General User and Supervisor',
                '20': 'Display only for General User and Administrator',
                '21': 'Display only for Supervisor and Administrator',
                '210': 'Display only for General User, Supervisor and Administrator',
                '3210': 'Display only for all users'
            },
            value: 'No'
        },
        name: { label: "Name" }
    },
    captcha: {
        subtype: {
            label: 'Type',
            options: {
                'cp_math': 'Math Captcha',
                'cp_text': 'Imageless Captcha',
                'cp_motion': 'Drawing Captcha',
                'cp_google': 'Google reCAPTCHA'
            }
        },
        form_setup: { // Format Settings
            label: 'Format Settings',
            type: 'checkbox',
            class: 'show-format-settings',
            description: 'Show format settings'
        },
        alignment: {
            label: 'Heading Alignment',
            options: {
                'top': 'Top',
                'bottom': 'Bottom',
                'left': 'Left',
                'right': 'Right',
                'no_header': 'No Heading'
            }
        },
        justify: {
            label: 'Heading Justification',
            options: {
                'left': 'Left',
                'right': 'Right',
                'center': 'Center'
            }
        },
        label_width: {
            label: 'Heading Width (%)',
            type: 'number',
            min: '0'
        },
        width: {
            label: 'Field Width (%)',
            type: 'number',
            min: '0'
        },
        column: {
            label: 'Columns',
            options: {
                '1': 'One Column',
                '2': 'Two Columns',
                '3': 'Three Columns',
                '4': 'Four Columns',
                '5': 'Five Columns',
                '6': 'Six Columns',
                '7': 'Seven Columns',
                'eight': 'Eight Columns'
            }
        },
        column_width: {
            label: 'Column Width (%)',
            type: 'number',
            min: '0'
        },
        border: {
            label: 'Border',
            type: 'number',
            min: '0',
            value: '0'
        },
        border_top: {
            label: 'Border Top',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_right: {
            label: 'Border Right',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_bottom: {
            label: 'Border bottom',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        border_left: {
            label: 'Border Left',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        more_setup: {
            label: 'More Settings',
            type: 'checkbox',
            class: 'show-more-settings',
            description: 'Show more settings'
        },
        // Math captcha
        maxNumber: {
            label: 'Maximum calculable no.',
            description: 'Maximum number to be used in the captcha calculation',
            options: {
                '10': '10',
                '20': '20',
                '30': '30',
                '40': '40',
                '50': '50',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100'
            },
            value: '10'
        },
        // Imageless captcha
        numDigits: {
            label: 'Number of digits',
            description: 'Number of digits in the number',
            options: {
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4'
            },
            value: '3'
        },
        useDecimal: {
            label: 'Use decimal',
            description: 'Whether or not to use a decimal',
            options: {
                '': 'No',
                'Yes': 'Yes'
            }
        },
        // Drawing captcha
        //        shapes:{
        //            label: 'Shapes',
        //            description: 'An array of shape names that you want Drawing captcha to use',
        //            options: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail'],
        //            size: '14',
        //            multiple: 'multiple',
        //            style: 'height: auto'
        //        },   
        errorMsg: {
            label: 'Error Message',
            description: 'Error message for wrong shape draw',
            value: 'Please try again'
        },
        successMsg: {
            label: 'Success Message',
            description: 'Success message for valid shape draw',
            value: 'Verified'
        },
        canvasTextColor: {
            label: 'Message Colour',
            description: 'Define colour of the success and error messages',
            value: '#111'
        },
        // Google reCaptcha        
        captchaTheme: {
            label: 'Captcha Theme',
            description: 'Select google recaptcha theme',
            options: {
                'light': 'Light',
                'dark': 'Dark'
            },
            value: 'light'
        },
        advance_setup: {  // Advance Settings
            label: 'Advance Settings',
            type: 'checkbox',
            class: 'show-advance-settings',
            description: 'Show advance settings'
        },
        Hide_show: {
            label: 'Hide',
            options: {
                'No': 'No',
                'YesWithEdit': 'Yes but edit on popup',
                '0': 'Hide only for General User',
                '10': 'Hide only for General User and Supervisor',
                '20': 'Hide only for General User and Administrator',
                '21': 'Hide only for Supervisor and Administrator',
                '210': 'Hide only for General User, Supervisor and Administrator',
                '3210': 'Hide for all users'
            },
            value: 'No'
        },
        name: { label: "Name" }
    },
    PayPal: {
        amount: {
            label: 'Amount',
            description: 'Enter any fixed amount or the field name to get amount from',
            value: '0.00'
        },
        PAYPAL_CURRENCY: {
            label: 'Currency',
            options: {
                'AUD': 'Australian dollar (AUD)',
                'BRL': 'Brazilian real (BRL)',
                'CAD': 'Canadian dollar (CAD)',
                'CZK': 'Czech koruna (CZK)',
                'DKK': 'Danish krone (DKK)',
                'EUR': 'Euro (EUR)',
                'HKD': 'Hong Kong dollar (HKD)',
                'HUF': 'Hungarian forint (HUF)',
                'INR': 'Indian rupee (INR)',
                'ILS': 'Israeli new shekel (ILS)',
                'JPY': 'Japanese yen (JPY)',
                'MYR': 'Malaysian ringgit (MYR)',
                'MXN': 'Mexican peso (MXN)',
                'TWD': 'New Taiwan dollar (TWD)',
                'NZD': 'New Zealand dollar (NZD)',
                'NOK': 'Norwegian krone	(NOK)',
                'PHP': 'Philippine peso	(PHP)',
                'PLN': 'Polish złoty (PLN)',
                'GBP': 'Pound sterling (GBP)',
                'RUB': 'Russian ruble (RUB)',
                'SGD': 'Singapore dollar (SGD)',
                'SEK': 'Swedish krona (SEK)',
                'CHF': 'Swiss franc (CHF)',
                'THB': 'Thai baht (THB)',
                'USD': 'United States dollar (USD)'
            },
            value: 'HKD'
        },
        PAYPAL_ID: {
            label: 'PayPal Business Email',
            placeholder: 'Email address',
            type: 'email'
        },
        PAYMENT_MODE: {
            label: 'Payment Mode',
            options: {
                'sandbox': 'Sandbox',
                'live': 'Live'
            },
            value: 'sandbox'
        },
    }
};
if (typeof typeUserExtraAddedAttrs !== 'undefined') {
    typeUserAttrs = $.extend({}, typeUserAttrs, typeUserExtraAddedAttrs);
}

function createTableColumnsOptions(tableName, $targetDropdown, $column) {
    var $formTable = $('.table-field.form-field .field-' + tableName + '-preview table[name^="' + tableName + '"]');
    var selectedValue = parseInt($column.val());

    if ($formTable.length) {
        $targetDropdown.find('option').remove();
        $targetDropdown.append('<option value="">-- Select a column --</option>');
        $('> thead tr th', $formTable).each(function () {
            var thIndex = $(this).index(),
                thText = $(this).text(),
                isSelected = (selectedValue === thIndex) ? 'selected' : '';
            //console.log(thIndex, thText);
            $targetDropdown.append('<option value="' + thIndex + '" ' + isSelected + '>' + thText + '</option>');
        });
        $targetDropdown.parents('div.form-group').removeClass('hidden');
    }
}

function effectChildField(value, element, formIndex) {
    if (value) {
        element.val('').change();
    }
    element.prop('disabled', value);

    //element.find("option").prop('disabled', true);
    element.find("option").hide();
    if (typeof Referral_Forms_Fields[formIndex] !== 'undefined') {
        var optData = Referral_Forms_Fields[formIndex];
        for (var optDataIndex in optData) {
            //element.find("option[value='"+optDataIndex+"']").prop('disabled', false);
            element.find("option[value='" + optDataIndex + "']").show();
        }
    }
    element.find("option[value='']").show();
}

var typeUserEvents = {
    text: {
        onadd: function (fld) {
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });

            var $formField = $('.fld-Default_Value', fld),
                $columnField = $('.fld-Default_Value_Field', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }

            //            var $subtype = $('.fld-subtype', fld),
            //                $popupAlign = $('.fld-popover_alignment', fld);
            //            $popupAlign.parents('div.form-group').addClass('hidden');
            //            
            //            if($subtype.val() === 'phone pad pop-up')
            //                $popupAlign.parents('div.form-group').removeClass('hidden');
            //            
            //            $subtype.change(function(e) {
            //                if($(this).val() === 'phone pad pop-up')
            //                    $popupAlign.parents('div.form-group').removeClass('hidden');
            //                else
            //                    $popupAlign.parents('div.form-group').addClass('hidden');
            //            });
        }
    },
    autocomplete: {
        onadd: function (fld) {
            var $formField = $('.fld-Referral_Forms', fld),
                $columnField = $('.fld-Referral_Form_Fields', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    select: {
        onadd: function (fld) {
            var $formField = $('.fld-Referral_Forms', fld),
                $columnField = $('.fld-Referral_Form_Fields', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }

            //Dependent fields
            var $dependentFieldName = $('.fld-dependent_field_names', fld),
                populate_fields = $('.fld-populate_fields', fld).val();

            $dependentFieldName.parents('div.form-group').addClass('hidden');

            if (populate_fields === 'Yes') {
                $dependentFieldName.parents('div.form-group').removeClass('hidden');
            }

            $('.fld-populate_fields', fld)
                .change(function (e) {
                    if (e.target.value === 'Yes') {
                        $dependentFieldName.parents('div.form-group').removeClass('hidden');
                    } else {
                        $dependentFieldName.parents('div.form-group').addClass('hidden');
                    }
                });

            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    "checkbox-group": {
        onadd: function (fld) {
            var $formField = $('.fld-Referral_Forms', fld),
                $columnField = $('.fld-Referral_Form_Fields', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }

            var $formField2 = $('.fld-Default_Value', fld),
                $columnField2 = $('.fld-Default_Value_Field', fld);
            var formId = $.trim($formField2.val());

            if (formId === '' || formId == '0') {
                $formField2.parents('div.form-group').addClass('hidden');
                $columnField2.parents('div.form-group').addClass('hidden');
            } else {
                $formField2.parents('div.form-group').removeClass('hidden');
                $columnField2.parents('div.form-group').removeClass('hidden');
            }
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    "radio-group": {
        onadd: function (fld) {
            var $formField = $('.fld-Referral_Forms', fld),
                $columnField = $('.fld-Referral_Form_Fields', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }

            var $formField2 = $('.fld-Default_Value', fld),
                $columnField2 = $('.fld-Default_Value_Field', fld);
            var formId = $.trim($formField2.val());

            if (formId === '' || formId == '0') {
                $formField2.parents('div.form-group').addClass('hidden');
                $columnField2.parents('div.form-group').addClass('hidden');
            } else {
                $formField2.parents('div.form-group').removeClass('hidden');
                $columnField2.parents('div.form-group').removeClass('hidden');
            }
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });

            // Choice fields
            var $yesFieldNames = $('.fld-yes_choice_fields', fld),
                $noFieldNames = $('.fld-no_choice_fields', fld),
                subtype = $('.fld-types', fld).val();

            $yesFieldNames.parents('div.form-group').addClass('hidden');
            $noFieldNames.parents('div.form-group').addClass('hidden');

            if (subtype === 'choice') {
                $yesFieldNames.parents('div.form-group').removeClass('hidden');
                $noFieldNames.parents('div.form-group').removeClass('hidden');
            }
        }
    },
    textarea: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    number: {
        onadd: function (fld) {
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });

            var $formField = $('.fld-Default_Value', fld),
                $columnField = $('.fld-Default_Value_Field', fld),
                $columnField2 = $('.fld-Update_Form_Field', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
                $columnField2.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
                $columnField2.parents('div.form-group').removeClass('hidden');
            }

            /**************** Auto increment fields show/hide ****************/
            var $Incremental = $('select[name="Incremental"]', fld),
                $IncrementalFields = $('input[name="Start_Value"], input[name="End_Value"]', fld);

            if ($Incremental.val() === 'Yes')
                $IncrementalFields.parents('div.form-group').removeClass('hidden');
            else
                $IncrementalFields.parents('div.form-group').addClass('hidden');

            $Incremental.change(function (e) {
                if ($(this).val() === 'Yes')
                    $IncrementalFields.parents('div.form-group').removeClass('hidden');
                else
                    $IncrementalFields.parents('div.form-group').addClass('hidden');
            });

            /**************** Progress bar color field show/hide ****************/
            var $column_format = $('select[name="column_format"]', fld),
                $progressFields = $('input[name="progress_color"]', fld);

            if ($column_format.val() === 'progress')
                $progressFields.parents('div.form-group').removeClass('hidden');
            else
                $progressFields.parents('div.form-group').addClass('hidden');

            $column_format.change(function (e) {
                if ($(this).val() === 'progress')
                    $progressFields.parents('div.form-group').removeClass('hidden');
                else
                    $progressFields.parents('div.form-group').addClass('hidden');
            });

            /**************** update master field ****************/
            var $operationField = $('.fld-update_operation', fld),
                master_field = $columnField2.val();
            $operationField.parents('div.form-group').addClass('hidden');

            if (master_field !== '0')
                $operationField.parents('div.form-group').removeClass('hidden');

            $columnField2
                .change(function (e) {
                    $operationField.val('').change();
                    //var toggle = (e.target.value === 'progress');
                    if (e.target.value !== '0')
                        $operationField.parents('div.form-group').removeClass('hidden');
                    else
                        $operationField.parents('div.form-group').addClass('hidden');
                });

            /**************** table calculation operation ****************/
            var $fieldType = $('.fld-types', fld),
                $fieldValue = $('.fld-value', fld),
                $table = $('.fld-table_calculation', fld),
                $tableColumns = $('.fld-table_calculation_columns', fld),
                $calculateOn = $('.fld-table_calculate_column', fld);
            $table.parents('div.form-group').addClass('hidden');
            $tableColumns.parents('div.form-group').addClass('hidden');
            $calculateOn.parents('div.form-group').addClass('hidden');

            if ($fieldType.val() === 'calculator') {
                $table.parents('div.form-group').removeClass('hidden');
                if ($.trim($table.val()) !== "") {
                    createTableColumnsOptions($.trim($table.val()), $tableColumns, $calculateOn);
                    if ($calculateOn.val())
                        $fieldValue.val('SUM({' + $.trim($table.val()) + '-column-' + $calculateOn.val() + '})');
                }
            } else if ($fieldType.val() === 'slider') {
                if (isNaN($.trim($('input[name=step]', fld).val())))
                    $('input[name=step]', fld).val(1);
            }
            // change event of number types
            $fieldType
                .change(function (e) {
                    $table.parents('div.form-group').addClass('hidden');
                    $tableColumns.parents('div.form-group').addClass('hidden');
                    if (e.target.value === 'calculator') {
                        $table.parents('div.form-group').removeClass('hidden');
                        if ($.trim($table.val()) !== "") {
                            $tableColumns.parents('div.form-group').removeClass('hidden');
                        }
                    } else if (e.target.value === 'slider') {
                        if (isNaN($.trim($('input[name=step]', fld).val())))
                            $('input[name=step]', fld).val(1);
                    }
                });
            // change event of table name
            $table
                .on('change blur', function (e) {
                    if (e.target.value !== '') {
                        createTableColumnsOptions(e.target.value, $tableColumns, $calculateOn);
                    } else {
                        $tableColumns.find('option').remove();
                        $tableColumns.append('<option value="">-- Select a column --</option>');
                        $calculateOn.val('');
                        $fieldValue.val('');
                        $tableColumns.parents('div.form-group').addClass('hidden');
                    }
                });
            // change event of table columns
            $tableColumns
                .change(function (e) {
                    var tableName = $.trim($table.val());
                    if (e.target.value) {
                        $calculateOn.val(e.target.value);
                        $fieldValue.val('SUM({' + tableName + '-column-' + e.target.value + '})');
                    } else {
                        $fieldValue.val('');
                    }
                });
        }
    },
    date: {
        onadd: function (fld) {
            var $formField = $('.fld-Default_Value', fld),
                $columnField = $('.fld-Default_Value_Field', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    file: {
        onadd: function (fld) {
            var $formField = $('.fld-Default_Value', fld),
                $columnField = $('.fld-Default_Value_Field', fld);
            var formId = $.trim($formField.val());

            if (formId === '' || formId == '0') {
                $formField.parents('div.form-group').addClass('hidden');
                $columnField.parents('div.form-group').addClass('hidden');
            } else {
                $formField.parents('div.form-group').removeClass('hidden');
                $columnField.parents('div.form-group').removeClass('hidden');
            }
            // hide extra attributes
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    header: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    paragraph: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    banner: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    button: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    map: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    hyperlink: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input[name='hyperlink_color']", fld).colorpicker({ format: "rgba" });
        }
    },
    Line: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    "autogenerated-field": {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    "automatic-field": {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    tabulator: {
        onadd: function (fld) {
            var $fieldLabel = $('div.fld-label', fld), $fieldLabelText = $('label.field-label', fld),
                $referenceForm = $('.fld-reference_form', fld),
                formID = parseInt($referenceForm.val()),
                formName = '';
            if (formID) {
                formName = $referenceForm.children("option").filter(":selected").text();
            }
            if (formName !== '') {
                //$fieldLabel.text(formName);
                //$fieldLabelText.text(formName);
            }
            $referenceForm.change(function (e) {
                if ($(this).val() !== '0') {
                    formName = $(this).children("option").filter(":selected").text();
                } else {
                    formName = '';
                }
                $fieldLabel.text(formName);
                $fieldLabelText.text(formName);
            });

            var elementID = $('.fld-name', fld).val();
            var elementHeight = $('.fld-size', fld).val();
            if ($("#" + elementID + "-preview").length) {

                setTimeout(function () {
                    var $tabulator = new Tabulator("#" + elementID + "-preview", {
                        height: elementHeight,
                        layout: 'fitDataFill',
                        tooltips: true,
                        tooltipsHeader: true,
                        movableColumns: true,
                        responsiveLayout: false
                    });
                    if (formID != '0') {

                        var scope = angular.element($("#FormGeneratorController")).scope();
                        //$.post(scope.currentUrl + "/getReferralFormFieldsAndData", { "action": 3, "formId": formID },
                        //    function (data, status) {
                        //       // $("#" + elementID + "-preview").tabulator("setColumns", data.formDataHeaders);
                        //        $tabulator.setColumns(data.formDataHeaders);                              
                        //    });

                        $.getJSON(scope.currentUrl + "/getReferralFormFieldsAndDataGET?action=3&formID=" + formID, function (data) {
                            $tabulator.setHeight("200px");
                            $tabulator.setColumns(data.formDataHeaders);
                            //$tabulator.setData(BASE_URL + '/formDataList/' + formID + "/popup");
                        });

                    }
                }, 560);
     

            }

            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    table: {
        onadd: function (fld) {
            var $columnHeadings = $('.fld-columnHeadings', fld);
            var $textarea = $('<textarea>', {
                name: $columnHeadings.attr('name'),
                class: $columnHeadings.attr('class'),
                id: $columnHeadings.attr('id'),
                placeholder: $columnHeadings.attr('placeholder'),
                rows: 5
            });
            $columnHeadings.replaceWith($textarea);
            $textarea.val($columnHeadings.val());

            var $rowHeadings = $('.fld-rowHeadings', fld);
            var $textarea = $('<textarea>', {
                name: $rowHeadings.attr('name'),
                class: $rowHeadings.attr('class'),
                id: $rowHeadings.attr('id'),
                placeholder: $rowHeadings.attr('placeholder'),
                rows: 5
            });
            $rowHeadings.replaceWith($textarea);
            $textarea.val($rowHeadings.val());

            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    'text-with-input': {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
        }
    },
    'tinyMCE-content': {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });
            var $contentField = $('.fld-value', fld);
            var targetArea = $contentField.attr('id');
            $contentField.replaceWith($('<textarea>', {
                name: $contentField.attr('name'),
                class: $contentField.attr('class'),
                id: $contentField.attr('id')
            }));
            $(document).find("textarea#" + targetArea, fld).val($contentField.val()).change();
            //var URL = window.location.origin + '/form-generator/public';
            tinymce.init({
                selector: "#" + targetArea,
                height: 300,
                plugins: [
                    'advlist autolink lists link image media charmap print preview anchor textcolor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table contextmenu paste code help'
                ],
                toolbar: 'undo redo |  styleselect | bold italic |  fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table | forecolor backcolor',
                content_css: [
                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
                    //'//cdn.tinymce.com/4/skins/lightgray/content.min.css'
                ],
                relative_urls: false,
                remove_script_host: false,
                convert_urls: true,
                //image_advtab: true,
                file_picker_types: 'image media',
                media_alt_source: false,
                automatic_uploads: true,
                media_url_resolver: function (data, resolve) {
                    if (data.url.indexOf('YOUR_SPECIAL_VIDEO_URL') === -1) {
                        var embedHtml = '<iframe src="' + data.url + '" width="400" height="400" class="uploadVideo"></iframe>';
                        resolve({ html: embedHtml });
                    } else {
                        resolve({ html: '' });
                    }
                },
                table_default_attributes: {
                    border: 1,
                    cellpadding: 4
                },
                table_default_styles: {
                    borderCollapse: "collapse",
                    borderStyle: "solid"
                },
                file_picker_callback: function (cb, value, meta) {
                    console.log(meta);
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    if (meta.filetype === "media") {
                        input.setAttribute('accept', 'video/*');
                    }
                    if (meta.filetype === "image") {
                        input.setAttribute('accept', 'image/*');
                    }
                    input.onchange = function () {
                        var file = this.files[0];
                        var id = Math.round(Date.now() / 1000);
                        var reader = new FileReader();

                        reader.onload = function () {
                            var base64 = reader.result.split(',')[1];
                            $.ajax({
                                url: BASE_URL + '/mediaUplaod',
                                type: "POST",
                                data: { id: id, image64: base64, type: meta.filetype, folder: 'forms' },
                                beforeSend: function () { showSmallLoader('.mce-container.mce-floatpanel'); },
                                success: function (data) {
                                    data = $.parseJSON(data);

                                    if (data.code === '1') {
                                        if (meta.filetype === "image") {
                                            cb(ASSET_URL + data.url, { alt: '', title: id + '.jpg' });
                                        }
                                        if (meta.filetype === "media") {
                                            cb(ASSET_URL + data.url, { source2: 'alt.ogg', poster: 'image.jpg' });
                                        }
                                    } else {
                                        alert(data.msg);
                                    }
                                },
                                error: function (error) {
                                    console.log(error);
                                },
                                complete: function () { $('.mce-container.mce-floatpanel').unblock(); }
                            });
                        };
                        reader.readAsDataURL(file);
                    };
                    input.click();

                },
                init_instance_callback: function (editor) {
                    editor.on('Change', function (e) {
                        var content = e.target.getContent();
                        $(document).find("textarea#" + targetArea, fld).val(content).change();
                    });
                    editor.on('Blur', function (e) {
                        var content = e.target.getContent();
                        $(document).find("textarea#" + targetArea, fld).val(content).change();
                    });
                }
            });
        }
    },
    social_follow: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background_color", fld).colorpicker({ format: "rgba" });

            var $alignment = $('select[name=align]', fld);
            if ($alignment.val() === 'none') {
                $('ul.social-networks', fld).parent().addClass('text-center');
            }
            $alignment.on('change', function () {
                if ($(this).val() === 'none') {
                    $('ul.social-networks', fld).parent().addClass('text-center');
                } else {
                    $('ul.social-networks', fld).parent().removeClass('text-center');
                }
            });
        }
    },
    signature: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-background", fld).colorpicker({ format: "rgba" });
            $("input.fld-color", fld).colorpicker({ format: "rgba" });
            $("input.fld-guidelineColor", fld).colorpicker({ format: "rgba" });

            var elementID = $('.fld-name', fld).val();
            $('#' + elementID + '-preview').signature();
        }
    },
    captcha: {
        onadd: function (fld) {
            hide_extra_attributes(fld);
            $("input.fld-canvasTextColor", fld).colorpicker({ format: "rgba" });
            /**************** Captcha Type ****************/
            var $cpTypeElm = $('select[name="subtype"]', fld),
                cpType = $cpTypeElm.val(),
                $cpMathFields = $('select[name="maxNumber"]', fld),
                $cpTextFields = $('select[name="numDigits"], select[name="useDecimal"]', fld),
                $cpMotionFields = $('input[name="canvasTextColor"], input[name="errorMsg"], input[name="successMsg"]', fld),
                $cpGoogleFields = $('select[name="captchaTheme"]', fld);

            $cpMathFields.parents('div.form-group').addClass('hidden');
            $cpTextFields.parents('div.form-group').addClass('hidden');
            $cpMotionFields.parents('div.form-group').addClass('hidden');
            $cpGoogleFields.parents('div.form-group').addClass('hidden');

            if (cpType === 'cp_math') {
                $cpMathFields.parents('div.form-group').removeClass('hidden');
            } else if (cpType === 'cp_text') {
                $cpTextFields.parents('div.form-group').removeClass('hidden');
            } else if (cpType === 'cp_motion') {
                $cpMotionFields.parents('div.form-group').removeClass('hidden');
            } else if (cpType === 'cp_google') {
                $cpGoogleFields.parents('div.form-group').removeClass('hidden');
            }

            $cpTypeElm.change(function (e) {
                cpType = $(this).val();

                $cpMathFields.parents('div.form-group').addClass('hidden');
                $cpTextFields.parents('div.form-group').addClass('hidden');
                $cpMotionFields.parents('div.form-group').addClass('hidden');
                $cpGoogleFields.parents('div.form-group').addClass('hidden');

                if (cpType === 'cp_math') {
                    $cpMathFields.parents('div.form-group').removeClass('hidden');
                } else if (cpType === 'cp_text') {
                    $cpTextFields.parents('div.form-group').removeClass('hidden');
                } else if (cpType === 'cp_motion') {
                    $cpMotionFields.parents('div.form-group').removeClass('hidden');
                } else if (cpType === 'cp_google') {
                    $cpGoogleFields.parents('div.form-group').removeClass('hidden');
                }
            });
        }
    }
};
//var controlOrder = ['header', 'paragraph', 'Line', 'text', 'textarea', 'number', 'autocomplete', 'select', 'checkbox-group', 'radio-group', 'date', 'file', 'button', 'banner', 'table', 'hidden', 'hyperlink', 'map', 'tinyMCE-content', 'tabulator', 'text-with-input', 'social_follow'];
var controlOrder = ["autocomplete", "banner", "button", "captcha", "checkbox-group", "date", "file", "header", "hidden", "hyperlink", "Line", "map", "number", "tabulator", "paragraph", "PayPal", "radio-group", "select", "signature", "social_follow", "table", "text", "textarea", "text-with-input", "tinyMCE-content"];
var approvalField = { "label": "Approval Field Control", "name": "approval-field", "showHeader": false, "fields": [{ "type": "radio-group", "required": true, "label": "Status", "inline": true, "access": true, "types": "approval", "Hide_show": "Yes", "Display_Only": "No", "Display_tab": "Yes", "role": "2,3", "values": [{ "label": "Pending", "value": "1", "selected": true }, { "label": "Approved", "value": "2" }, { "label": "Rejected", "value": "3" }, { "label": "Deleted", "value": "4" }] }] };
var calendarControl = {
    "label": "Calendar Control", "name": "full-calendar", "showHeader": true, "fields": [{ "type": "hidden", "name": "hidden-fullcalendar", "value": "1" },

        { "type": "hidden", "name": "schedulerformgroupkey", "value": "" },
        //{ "type": "hidden", "name": "resformId", "value": "1" },
        //{ "type": "hidden", "name": "activityFormID", "value": "1" },
        //{ "type": "hidden", "name": "parentEventId", "value": "1" },
        //{ "type": "hidden", "name": "eventTagsList", "value": "1" },
        //{ "type": "hidden", "name": "resourcesTitle", "value": "" },

        { "type": "text", "required": true, "label": "Title", "subtype": "text", "column": "5", "name": "title" }, { "type": "date", "required": true, "label": "Start", "types": "datetime_picker", "name": "start" }, { "type": "date", "required": true, "label": "End", "types": "datetime_picker", "name": "end" }, { "type": "text", "subtype": "color", "label": "Color", "value": "#3b91ad", "column_format": "color", "name": "color" }, { "type": "radio-group", "label": "All Day", "inline": true, "name": "allDay", "values": [{ "label": "Yes", "value": "true" }, { "label": "No", "value": "false", "selected": true }] }, { "type": "select", "label": "Resources", "placeholder": "Select any resource from list below", "column": "3", "name": "resources", "values": [] }, { "type": "select", "label": "Activities", "placeholder": "Select any activity from list below", "name": "activities", "values": [] }, { "type": "text", "label": "Service", "subtype": "text", "name": "service" }, { "type": "textarea", "label": "Description", "subtype": "textarea", "rows": "3", "name": "description" }, { "type": "button", "subtype": "submit", "label": "Create", "alignment": "left", "className": "btn btn-success", "style": "success" }, { "type": "button", "subtype": "exit", "label": "Cancel", "alignment": "left", "className": "btn btn-default", "style": "default" }]
};
//{"label":"Calendar Control","name":"full-calendar","showHeader":true,"fields":[{"type":"hidden","name":"hidden-fullcalendar","value":"1"},{"type":"text","required":true,"label":"Title","subtype":"text","column":"3","name":"title"},{"type":"text","subtype":"color","label":"Color","value":"#3b91ad","column_format":"color","name":"color"},{"type":"radio-group","label":"All Day","inline":true,"name":"allDay","values":[{"label":"Yes","value":"true"},{"label":"No","value":"false","selected":true}]},{"type":"date","required":true,"label":"Start","types":"datetime_picker","set_default":"Yes","column":"2","name":"start"},{"type":"date","label":"End","types":"datetime_picker","name":"end"},{"type":"select","label":"Resources","placeholder":"Select any resource from list below","column":"2","name":"resources","values":[]},{"type":"select","label":"Activities","placeholder":"Select any activity from list below","name":"activities","values":[]}]}
var navigationControl = { "label": "Navigation Control", "name": "navigation-controls", "showHeader": false, "fields": [{ "type": "button", "subtype": "previous", "label": "Previous", "alignment": "left", "className": "btn btn-warning", "name": "button_1535616185326", "style": "warning" }, { "type": "button", "subtype": "next", "label": "Next", "alignment": "left", "className": "btn btn-info", "name": "button_1535616185605", "style": "info" }] };
worksheets = localStorage.getItem("worksheets") != null ? JSON.parse(localStorage.getItem("worksheets")) : "";
var fbDefaultOptions = {
    subtypes: {
        text: ['phone pad', 'phone pad pop-up', 'formula'],
        button: ['exit', 'previous', 'next'],
        file: ['file', 'camera']
    },
    stickyControls: {
        enable: false,
        offset: {
            top: 20,
            right: 20,
            left: 'auto'
        }
    },
    roles: {
        3: 'Super User', 2: 'Administrator', 1: 'Supervisor', 0: 'General User'
    },
    //controlOrder: controlOrder,
    //editOnAdd: true,
    defaultFields: [],
    sortableControls: false,
    scrollToFieldOnAdd: true,
    templates: templates,
    fields: fields,
    typeUserAttrs: typeUserAttrs,
    typeUserEvents: typeUserEvents,
    disableInjectedStyle: false,
    showActionButtons: true,
    //    disableFields: ['hidden'],
    typeUserDisabledAttrs: typeUserDisabledAttrs,
    //disabledAttrs: ['access'],
    controlPosition: 'left',
    fieldRemoveWarn: true,
    disabledFieldButtons: {
        //text: ['copy'] // fieldType: [buttons]
    },
    //disabledActionButtons: ($.inArray(window.location.host, ['localhost', '127.0.0.1', 'augurs.formgenerator.in']) === -1) ? ['data'] : []
};
/*if(window.location.host !== 'localhost'){ 
    var fbDefaultOptions = $.extend({}, fbDefaultOptions, {disabledActionButtons: ['data']});
}*/

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createChoiceOptions(elementId) {    ;
    var $element = $('#' + elementId),
        $attributes = $element.parents('.form-elements'),
        typeValue = $element.val();

    if (typeValue === 'choice') {
        var openOptions = parseInt($('div.form-group.field-options ol.sortable-options li', $attributes).length);

        if (openOptions > 2) {
            for (var c = 2; c <= openOptions - 1; c++) {
                $('div.form-group.field-options ol.sortable-options li:eq(' + c + ') a.remove.btn', $attributes).trigger('click');
            }
        }

        $('div.form-group.field-options ol.sortable-options li:eq(0) > input.option-label', $attributes).val('Yes');
        $('div.form-group.field-options ol.sortable-options li:eq(0) > input.option-value', $attributes).val('True');

        $('div.form-group.field-options ol.sortable-options li:eq(1) > input.option-label', $attributes).val('No');
        $('div.form-group.field-options ol.sortable-options li:eq(1) > input.option-value', $attributes).val('False');

        $('select[name=column_format]', $attributes).val('tickCross');

        $('input[name=yes_choice_fields], input[name=no_choice_fields]', $attributes).parents('div.form-group').removeClass('hidden');
    } else {
        $('input[name=yes_choice_fields], input[name=no_choice_fields]', $attributes).parents('div.form-group').addClass('hidden');
    }
}

// For banner image upload
function changeImage(id) {
    var formData = new FormData();
    var s = id.split('-');
    formData.append('fileUpload', document.getElementById(id).files[0]);

    var $element = $('#' + id);
    $.ajax({
        url: bannerUploadUrl,
        type: 'POST',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();

            xhr.upload.onprogress = function (ev) {
                if (ev.lengthComputable) {
                    var progress = $element.parent().find('.progress .progress-bar');
                    var percentComplete = parseInt((ev.loaded / ev.total) * 100);

                    progress.css('width', percentComplete + '%');
                    progress.text(percentComplete + '%');
                    if (percentComplete === 100) {
                        progress.removeClass('progress-bar-info progress-bar-striped active').addClass('progress-bar-success');
                    }
                }
            };

            return xhr;
        },
        beforeSend: function () {
            $element.parent().find('label').remove();
            $element.parent().append('<div class="progress"><div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width: 0%">0%</div></div>');
        },
        success: function (response) {
            if (response.code) {
                $('#value-' + s[1] + '-' + s[2] + '-' + s[3] + '-' + s[4]).val(response.banner);
                $element.parent().find('.progress').remove();
                $element.parent().append('<label>' + response.message + '</label>');
            } else {
                alert(response.message);
            }
        },
        complete: function (respo) { console.log(respo); $element.val(''); }
    });
}

// For options image upload
function createMediaOptions(elementId) {
    var $element = $('#' + elementId);
    var $attributes = $element.parents('.form-elements');

    var filedata = document.getElementById(elementId);
    var formData = new FormData();
    var i = 0, len = filedata.files.length, file;
    for (i; i < len; i++) {
        file = filedata.files[i];
        formData.append("file[]", file);
    }
    $.ajax({
        url: BASE_URL + '/forms/options-media-upload',
        type: 'POST',
        data: formData,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();

            xhr.upload.onprogress = function (ev) {
                if (ev.lengthComputable) {
                    var progress = $element.parent().find('.progress .progress-bar');
                    var percentComplete = parseInt((ev.loaded / ev.total) * 100);

                    progress.css('width', percentComplete + '%');
                    progress.text(percentComplete + '%');
                    if (percentComplete === 100) {
                        progress.removeClass('progress-bar-info progress-bar-striped active').addClass('progress-bar-success');
                        setTimeout(function () {
                            $element.parent().find('.progress').fadeOut(1000, function () {
                                $(this).remove();
                            });
                        }, 2000);

                    }
                }
            };

            return xhr;
            //            if(myXhr.upload){
            //                myXhr.upload.addEventListener('progress',progress, false);
            //            }
        },
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $element.parent().append('<div class="progress"><div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width: 0%">0%</div></div>');
        },
        success: function (response) {
            if (response.success) {
                var optionImages = response.images.length;
                if (optionImages > 0 && $attributes.find('div.form-group.field-options').length) {
                    var openOption;
                    $.each(response.images, function (index, image) {
                        $attributes.find('div.form-group.field-options div.option-actions a.add-opt').trigger('click');
                        openOption = parseInt($attributes.find('div.form-group.field-options ol.sortable-options li').length) - 1;

                        $attributes.find('div.form-group.field-options ol.sortable-options li:eq(' + openOption + ') input.option-label').val('<img src="' + image + '" alt="option_media">');
                        $attributes.find('div.form-group.field-options ol.sortable-options li:eq(' + openOption + ') input.option-value').val(image);
                    });
                    $attributes.find('select[name=column_format]').val('image');
                    //                    if(optionImages > openOptions) {
                    //                        requiredAddClicks = optionImages - openOptions;
                    //                    } 
                    //                    else if(optionImages < openOptions) {
                    //                        requiredRemoveClicks = openOptions - optionImages;
                    //                    }

                    //                    if(requiredAddClicks > 0) {
                    //                        for(var c=1; c<=optionImages; c++) {
                    //                            $attributes.find('div.form-group.field-options div.option-actions a.add-opt').trigger('click');
                    //                        }
                    //                    }

                    //                    if(requiredRemoveClicks > 0) {
                    //                        for(var c=openOptions-1; c>=optionImages; c--) {
                    //                            $attributes.find('div.form-group.field-options ol.sortable-options li:eq('+c+') a.remove.btn').trigger('click');
                    //                        }
                    //                    }
                }
            } else {
                //alert(response.message);
                swal({ type: 'error', showCloseButton: true, html: response.message });
            }
        },
        complete: function () { $element.val(''); }
    });
}

function populateDropdowns(ajaxUrl, ajaxParams, callType, majorGroup, minorGroup, activities, activitiesCategory, durationField, overlapField) {
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: ajaxParams,
        dataType: "json",
        success: function (result) {
            if (callType === 1) { // Resources
                var element = $("select[name=majorGroup], select[name=minorGroup]");
                element.find('option').remove();

                if (Object.keys(result.form_fields).length > 1) {
                    createOptions(element, result.form_fields);
                } else {
                    element.prop('disabled', true);
                }
            }
            if (callType === 2) { // Activities
                var element = $("select[name=activities], select[name=activitiesCategory], select[name=durationField]");
                element.find('option').remove();

                if (Object.keys(result.form_fields).length > 1) {
                    createOptions(element, result.form_fields);
                } else {
                    element.prop('disabled', true);
                }

                var element = $("select[name=overlapField]");
                element.find('option').remove();

                if (Object.keys(result.allowable_fields).length > 1) {
                    createOptions(element, result.allowable_fields);
                } else {
                    element.prop('disabled', true);
                }
            }

            if (majorGroup !== '') { $("select[name=majorGroup]").val(majorGroup).change(); }
            if (minorGroup !== '') { $("select[name=minorGroup]").val(minorGroup).change(); }
            if (activities !== '') { $("select[name=activities]").val(activities); }
            if (activitiesCategory !== '') { $("select[name=activitiesCategory]").val(activitiesCategory); }
            if (durationField !== '') { $("select[name=durationField]").val(durationField); }
            if (overlapField !== '') { $("select[name=overlapField]").val(overlapField); }
        }
    });
};

function createOptions(element, jsonObject) {    
    element.prop('disabled', false);
    $.each(jsonObject, function (key, value) {
        element.append($("<option/>", {
            value: key,
            text: value
        }));
    });
};

function sort_pages(tabs, fbInstancePages, fbInstances) {
    //console.log(tabs);console.log(fbInstancePages);console.log(fbInstances);
    var pages = [], fb = [];
    if (tabs.length) {
        for (var i = 0; i < (tabs.length - 1); i++) {
            var pageName = tabs[i].innerText;
            pages.push(pageName);
            var fbIndex = fbInstancePages.indexOf(pageName);
            fb.push(fbInstances[fbIndex]);
        }
    }
    var response = {};
    response['pages'] = pages; response['fb'] = fb;
    return response;
}

$(document).ready(function () {
    $(document).on({
        mouseover: function () { $(this).parents('li').addClass('delete'); },
        mouseout: function () { $(this).parents('li').removeClass('delete'); }
    }, "a.cut-button");

    $("#InformationOnly").on("change", function () {
        var value = $(this).val();
        if (value === 'No') {
            $("#informationFormID").prop('disabled', false);
            $("#informationFormID").parents(".form-group").removeClass("hidden");

            $("#subscriptionFormID").prop('disabled', false);
            $("#subscriptionFormID").parents(".form-group").removeClass("hidden");
        } else if (value === 'Yes') {
            $("#informationFormID").prop('disabled', true);
            $("#informationFormID").parents(".form-group").addClass("hidden");

            $("#subscriptionFormID").prop('disabled', true);
            $("#subscriptionFormID").parents(".form-group").addClass("hidden");
        }
    });

    $("#subscriptionForm").on("change", function () {
        var value = $(this).val();
        if (value === 'No') {
            $("#informationFormID").prop('disabled', false);
            $("#informationFormID").parents(".form-group").removeClass("hidden");

            $("#subscriptionFormID").prop('disabled', false);
            $("#subscriptionFormID").parents(".form-group").removeClass("hidden");
        } else if (value === 'Yes') {
            $("#informationFormID").prop('disabled', true);
            $("#informationFormID").parents(".form-group").addClass("hidden");

            $("#subscriptionFormID").prop('disabled', true);
            $("#subscriptionFormID").parents(".form-group").addClass("hidden");
        }
    });


    $('#referenceModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var title = button.data('title'); // Extract info from data-* attributes
        var label = button.data('label');
        var modal = $(this);
        modal.find('form').trigger('reset');
        modal.find('.modal-title').text(title);
        modal.find('form .control-label:eq(0)').text(label + ' Form:');
        modal.find('form .control-label:eq(1)').text(label + ' Field:');
        var controlDivId = button.parents('.frm-holder').attr('id');
        modal.find('input#controlDiv').val(controlDivId);

        var $formField = $("#referenceModal form select.Forms"),
            $columnField = $("#referenceModal form select.Form_Fields"),
            $columnField2 = $("#referenceModal form select.Update_Form_Fields");
        $formField.change(function (e) {
            $columnField.val('0').change();
            $columnField2.val('0').change();

            formId = $formField.val();

            disabled = (formId === '0') ? true : false;
            effectChildField(disabled, $columnField, formId);
            effectChildField(disabled, $columnField2, formId);
        });
        if (button.hasClass('referralFields')) {
            var formName = 'Referral_Forms', fieldName = 'Referral_Form_Fields';
            $formField.attr('name', formName);
            $columnField.attr('name', fieldName);
        } else if (button.hasClass('derivedFields')) {
            var formName = 'Default_Value', fieldName = 'Default_Value_Field';
            $formField.attr('name', formName);
            $columnField.attr('name', fieldName);
        }
        var Forms = $.trim($('#' + controlDivId).find('input[name="' + formName + '"]').val());

        if (Forms !== '') {
            $formField.val(Forms);
        } else {
            $formField.val(0);
        }
        var Form_Fields = $.trim($('#' + controlDivId).find('input[name="' + fieldName + '"]').val());
        if (Form_Fields !== '') {
            $columnField.val(Form_Fields);
        } else {
            $columnField.val('');
        }
        var formId = $formField.val();

        $columnField.prop('disabled', true); $columnField2.prop('disabled', true);

        var disabled = (formId === '0') ? true : false;
        effectChildField(disabled, $columnField, formId);
        effectChildField(disabled, $columnField2, formId);

        if (button.parents('li').hasClass('number-field')) {
            var Form_Fields = $.trim($('#' + controlDivId).find('input[name="Update_Form_Field"]').val());
            if (Form_Fields !== '') {
                $columnField2.val(Form_Fields);
            } else {
                $columnField2.val('');
            }
            $columnField2.parents('.form-group').removeClass('hidden');
        } else {
            $columnField2.prop('disabled', true);
            $columnField2.parents('.form-group').addClass('hidden');
        }
        $(this).off('shown.bs.modal');
    });
    $('#referenceModal form').on('submit', function (e) {
        e.preventDefault();
        var referenceInputs = $(this).serializeArray();
        console.log(referenceInputs);
        var controlDiv = $('#referenceModal form input#controlDiv').val().trim();
        referenceInputs.forEach(function (field) {
            var value = field.value;
            if (field.value == '0') { value = ''; }
            $('#' + controlDiv).find('input[name="' + field.name + '"]').val(value).change();
            $('#' + controlDiv).find('input[name="' + field.name + '"]').parents('div.form-group').removeClass('hidden');
        });

        $('#referenceModal').modal('hide');
    });

    //$("select[name=majorGroup], select[name=minorGroup]").on("change", function(){
    //    var id = $(this).attr('id'),
    //        value = $(this).val();
    //
    //    var target = (id === 'majorGroup') ? 'minorGroup' : 'majorGroup';
    //    
    //    $("select#" + target).each(function(){
    //        $(this).find("option").prop("disabled", false).show();
    //    });
    //    $("select#" + target + " option[value='" + value + "']").prop('disabled',true).hide();
    //});

    $(document).on('click', '.columnFields', function () {
        var $button = $(this);      //.columnFields
        var controlDiv = $button.parents('.frm-holder').attr('id');     //frmb-1521544097097-fld-5-holder
        var columns = $button.closest('.form-elements').find('input[type=number][name=columns]').val();  //3
        var columnHeadings = $button.closest('.form-elements').find('[name=columnHeadings]').val();  // ""
        if (columnHeadings && columnHeadings.trim() !== '') {
            var headings = columnHeadings.trim();
            var headArray = headings.split('|');
        } else {
            var headArray = []; //
        }
        var columnInputs = $button.closest('.form-elements').find('input[name=columnInputs]').val();  //column-1%5BinputType%5D=
        var params = deparam(columnInputs);     //{column-3[select][option]: "column-3%5Bselect%5D%5Boption%5D%5B%5D=Option%2

        if (columns > 0) {
            var $modalBody = $('#tableConfigModal .modal-body');
            $modalBody.find('.column-section > div').not("div#column-section-1").remove();
            $modalBody.find('input[name=controlDiv]').val(controlDiv);
            if (headArray.length) {
                $modalBody.find('#column-section-1 h4.form-control-static').html('<strong>' + removeHtmlFromString(headArray[0]) + '</strong>');
            }
            for (var i = 2; i <= columns; i++) {
                var $cloneDiv = $modalBody.find('#column-section-1').clone();
                $cloneDiv.attr('id', 'column-section-' + i);
                if (headArray.length) {
                    var columnName = headArray[i - 1];
                } else {
                    var columnName = $cloneDiv.find('h4.form-control-static').text().replace('1', i.toString());
                }
                $cloneDiv.find('h4.form-control-static').html('<strong>' + columnName + '</strong>');
                $cloneDiv.find('input').each(function () {
                    var newName = $(this).attr('name').replace('1', i.toString());
                    $(this).attr('name', newName);
                });
                $cloneDiv.find('select').each(function () {
                    var newName = $(this).attr('name').replace('1', i.toString());
                    $(this).attr('name', newName);
                });
                $modalBody.find('.column-section').append($cloneDiv);
            }
            for (var i = 1; i <= columns; i++) {
                $('#tableConfigModal .modal-body #column-section-' + i).find('input').each(function () {
                    var inputValue = params[$(this).attr('name')];
                    //                console.log($(this).attr('name'),inputValue);
                    if (typeof inputValue !== 'undefined') {
                        console.log('__', inputValue, $(this));
                        if ($(this).is(':radio')) {
                            if ($(this).attr('value') === inputValue) {
                                $(this).attr('checked', 'checked').trigger('click');
                            }
                        } else if ($(this).is(':checkbox')) {
                            $(this).prop('checked', true);
                        }
                        else if ($(this).is('input[type=number]')) {
                            $(this).val(parseInt(inputValue));
                        }
                        else if ($(this).is('input[type=text]')) {
                            $(this).val((inputValue));
                        }
                    }
                });
                $('#tableConfigModal .modal-body #column-section-' + i).find('select option').each(function () {
                    var inputValue = params[$(this).parent().attr('name')];
                    //                console.log($(this).parent().attr('name'),inputValue);
                    //                console.log(inputValue);
                    if (typeof inputValue !== 'undefined') {
                        if ($(this).attr('value') === inputValue) {
                            $(this).attr('selected', 'selected');
                        }
                    }
                });
                $('#tableConfigModal .modal-body #column-section-' + i).find('a').each(function () {
                    var inputValue = params[$(this).parent().attr('name')];
                    //                console.log($(this).parent().attr('name'),inputValue);
                    //                console.log(inputValue);
                    if (typeof inputValue !== 'undefined') {
                        if ($(this).attr('value') === inputValue) {
                            $(this).attr('selected', 'selected');
                        }
                    }
                });
            }
            $('#tableConfigModal').modal('show');
            if ($('#tableConfigModal').is(':visible')) {
                alert();
            }
        }
        else { alert('Enter atleast one column.'); }
    });

    $(document).on('click', '#tableConfigModal .columnTypeRadio', function () {
        var choice = $(this).val();
        console.log(choice);
        var mySection = $(this).closest('.my-section');
        $('.textbox, .numberbox, .datebox, .checkbobox, .radiobobox, .selectbox', mySection).addClass('hidden');
        $('.textbox input, .numberbox input, .datebox input, .checkbobox input, .radiobobox input, .selectbox .select', mySection).each(function () {
            $(this).attr('disabled', 'disabled');
        });
        $('.' + choice + 'box', mySection).removeClass('hidden');
        $('.' + choice + 'box input', mySection).each(function () {
            $(this).removeAttr('disabled');
        });}).on('submit','form#columnInputs', function (e) {
        e.preventDefault();
        var columnInputs = $(this).serialize();
        var controlDiv = $('#tableConfigModal .modal-body input[name=controlDiv]').val().trim();
        $('#' + controlDiv).find('input[name=columnInputs]').val(columnInputs);
        $('#tableConfigModal').modal('hide');
    });

    /* Copy radio or checkbox Option labels into the Value field */
    $('#form-builder-pages').on('blur', 'input.option-label', function () {
        var label = $(this).val().trim(), $valueField = $(this).next('input.option-value');
        if (label !== '') {
            var value = $valueField.val().trim();
            if (value === '') {
                //$valueField.val(label.replace(/\s/gi, "-"));
                $valueField.val(label);
            }
        }
    });

    $(document).on('click', '.columnFieldsCheckbox', function () {
        var $button = $(this);      //.columnFieldsCheckbox
        var controlDiv = $button.parents('.frm-holder').attr('id');     //frmb-1523884753710-fld-17-holder
        //    var columns = $button.closest('.form-elements').find('input[type=number][name=columns]').val();  //3
        //    var columnHeadings = $button.closest('.form-elements').find('input[name=columnHeadings]').val();  // ""
        //    if(columnHeadings && columnHeadings.trim() !==''){
        //        var headings = columnHeadings.trim();
        //        var headArray = headings.split('|');
        //    }else{
        //        var headArray = []; //
        //    }
        var columnInputs = $button.closest('.form-elements').find('input[name=columnInputsCheckbox]').val();  //column-1%5BinputType%5D=
        var params = deparam(columnInputs);     //{column-3[select][option]: "column-3%5Bselect%5D%5Boption%5D%5B%5D=Option%2

        if (controlDiv.length > 0) {
            var $modalBody = $('#checkboxConfigModal .modal-body');
            $modalBody.find('input[name=controlDiv]').val(controlDiv);
            $('#checkboxConfigModal').modal('show');
            $('#columnInputsCheckbox').find('div.column-section').html('')
            $('#' + controlDiv).find('ol.sortable-options.ui-sortable li').each(function (i, v) {
                var value = $(v).find('input.option-label').val();
                var name = $(v).find('input.option-value').val();
                var xcord = "column-" + i + "[" + name + "][x-coordinate]";
                var ycord = "column-" + i + "[" + name + "][y-coordinate]";
                var show = '<div class="my-section" id="column-section-"' + i + '>' +
                    '<h4 class="form-control-static mt-0 text-center">' +
                    '<strong>' + value + '</strong></h4>' +
                    '<div class="form-group">' +
                    '<div class="col-xs-3">' +
                    '<label for="inputType" class="control-label">X- Coordinate</label>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<input type="text" value="' + (params[xcord] !== undefined ? params[xcord] : "") + '" class="form-control text-uppercase" name="column-' + i + '[' + name + '][x-coordinate]">' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<label for="inputType" class="control-label">Y- Coordinate</label>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<input type="number" value="' + (params[ycord] !== undefined ? params[ycord] : "") + '" class="form-control" name="column-' + i + '[' + name + '][y-coordinate]" min="0">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('#columnInputsCheckbox').find('div.column-section').append(show);
            })
        }
        else { alert('Enter atleast one column.'); }
    });

    $('form#columnInputsCheckbox').on('submit', function (e) {
        e.preventDefault();
        var columnInputs = $(this).serialize();
        var controlDiv = $('#checkboxConfigModal .modal-body input[name=controlDiv]').val().trim();
        $('#' + controlDiv).find('input[name=columnInputsCheckbox]').val(columnInputs);
        $('#checkboxConfigModal').modal('hide');
    });

    $(document).on('click', '.columnFieldsRadio', function () {
        var $button = $(this);      //.columnFieldsCheckbox
        var controlDiv = $button.parents('.frm-holder').attr('id');     //frmb-1523884753710-fld-17-holder
        var columnInputs = $button.closest('.form-elements').find('input[name=columnInputsRadio]').val();  //column-1%5BinputType%5D=
        var params = deparam(columnInputs);     //{column-3[select][option]: "column-3%5Bselect%5D%5Boption%5D%5B%5D=Option%2
        if (controlDiv.length > 0) {
            var $modalBody = $('#radioConfigModal .modal-body');
            $modalBody.find('input[name=controlDiv]').val(controlDiv);
            $('#radioConfigModal').modal('show');
            $('#columnInputsRadio').find('div.column-section').html('')
            $('#' + controlDiv).find('ol.sortable-options.ui-sortable li').each(function (i, v) {
                var value = $(v).find('input.option-label').val();
                var name = $(v).find('input.option-value').val();
                var xcord = "column-" + i + "[" + name + "][x-coordinate]";
                var ycord = "column-" + i + "[" + name + "][y-coordinate]";
                var show = '<div class="my-section" id="column-section-"' + i + '>' +
                    '<h4 class="form-control-static mt-0 text-center">' +
                    '<strong>' + value + '</strong></h4>' +
                    '<div class="form-group">' +
                    '<div class="col-xs-3">' +
                    '<label for="inputType" class="control-label">X- Coordinate</label>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<input type="text" value="' + (params[xcord] !== undefined ? params[xcord] : "") + '" class="form-control text-uppercase" name="column-' + i + '[' + name + '][x-coordinate]">' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<label for="inputType" class="control-label">Y- Coordinate</label>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<input type="number" value="' + (params[ycord] !== undefined ? params[ycord] : "") + '" class="form-control" name="column-' + i + '[' + name + '][y-coordinate]" min="0">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('#columnInputsRadio').find('div.column-section').append(show);
            })
        }
        else { alert('Enter atleast one column.'); }
    });

    $('form#columnInputsRadio').on('submit', function (e) {
        e.preventDefault();
        var columnInputs = $(this).serialize();
        var controlDiv = $('#radioConfigModal .modal-body input[name=controlDiv]').val().trim();
        $('#' + controlDiv).find('input[name=columnInputsRadio]').val(columnInputs);
        $('#radioConfigModal').modal('hide');
    });
});