function initThemeChooser(settings) {
    //console.log('from init theme chooser');
    //console.log(settings);
    var isInitialized = true;
    var $currentStylesheet = $();
    var $loading = $('#loading');
    //var $systemSelect = $('#theme-system-selector select')
    //.on('change', function() {
    //    setThemeSystem(this.value);
    //});

    setThemeSystem("jquery-ui");

    function setThemeSystem(themeSystem) {
       // alert();
        var $allSelectWraps = $('.selector[basic-calendar-theme-system]').hide();
        var $selectWrap = $allSelectWraps.filter('[basic-calendar-theme-system="' + themeSystem +'"]').show();
        var $select = $selectWrap.find('select')
        .off('change') // avoid duplicate handlers :(
        .on('change', function() {
            setTheme(themeSystem, this.value);
        });        
        
        if(checkCookie('basic-calendar-theme') !== ''){
            $select.val(checkCookie('basic-calendar-theme'));
        }
        
        setTheme(themeSystem, $select.val());
    }


    function setTheme(themeSystem, themeName) {
        //console.log(themeSystem + ',' + themeName);
        $.cookie("calendar-themeSystem", themeSystem, { expires: 365, path: '/' });
        $.cookie("basic-calendar-theme", themeName, { expires: 365, path: '/' });
        var stylesheetUrl = generateStylesheetUrl(themeSystem, themeName);
        var $stylesheet;

        function done() {
           // //console.log('called done');
            if (!isInitialized) {
                isInitialized = true;
                //console.log('in if ');
                settings.init(themeSystem);
            }
            else {
                //console.log('in else '); //console.log(settings);
                
                settings.change(themeSystem);

            }
        }
        
        if (stylesheetUrl) {
            stylesheetUrl = stylesheetUrl.replace('undefined', 'base');
            $stylesheet = $('<link rel="stylesheet" type="text/css" href="' + stylesheetUrl + '"/>').appendTo('head');
            $loading.show();

            whenStylesheetLoaded($stylesheet[0], function () {
                $currentStylesheet.remove();
                $currentStylesheet = $stylesheet;
                $loading.hide();
                done();
               
            });
        } else {
            $currentStylesheet.remove();
            $currentStylesheet = $();
            done();
            
        }

        function generateStylesheetUrl(themeSystem, themeName) {
            if (themeSystem === 'jquery-ui') {
                return 'https://code.jquery.com/ui/1.12.1/themes/' + themeName + '/jquery-ui.css';
            }
            else if (themeSystem === 'bootstrap3') {
                if (themeName) {
                    return 'https://bootswatch.com/3/' + themeName + '/bootstrap.min.css';
                }
                else { // the default bootstrap theme
                    return 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
                }
            }
        }

        function whenStylesheetLoaded(linkNode, callback) {
            var isReady = false;

            function ready() {
                if (!isReady) { // avoid double-call
                    isReady = true;
                    callback();
                }
            }

            linkNode.onload = ready; // does not work cross-browser
            setTimeout(ready, 2000); // max wait. also handles browsers that don't support onload
        }
    }
}


var themeSystem1 = $.cookie('calendar-themeSystem') // "{{$_COOKIE['calendar-themeSystem']}}";

$('#theme-system-selector select').val(themeSystem1);


initThemeChooser({
    change: function (themeSystem1) {
        $('.calendar').fullCalendar('option', 'themeSystem', themeSystem1);
    }
});
