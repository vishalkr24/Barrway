(function () {
    'use strict';  
    FormGeneratorApp.directive("fbLogin", function ($rootScope,$timeout) {
        $timeout(function () {
            return function (scope, iElement, iAttrs) {
                if (FB) {
                    FB.XFBML.parse(iElement[0]);
                }
            };
        }, 250);
    }); 
    FormGeneratorApp.directive("randomBackgroundcolor", function () {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {              
                var color = '#';             
                var max = 0xffffff;
                color= '#' + Math.round(Math.random() * max).toString(16);            
                element.css('background-color', color);
                element.css('color', "#fff");

            }
        }
    });
    FormGeneratorApp.directive("copyToClipboard", copyClipboardDirective);

    FormGeneratorApp.directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title titleupdt">{{r_title}}</h5>' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
              
                '</div>' +
                '<div class="modal-body" ng-transclude></div>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

    FormGeneratorApp.directive('chatPage', function () {
        var directive = {};
        directive.restrict = 'E';
        directive.replace = true;
        directive.templateUrl = "/Templates/chat/chatModeloPop.html";
        directive.scope = {
            formDetailsDataInfo: "=",
            roomChatDetails: "=",
        };
        return directive;
    });
    
    FormGeneratorApp.directive("chatDetailsRepeater", function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                roomChatDetails: '=',
                searchText:'='
            },
            template: "<div id='anchor{{m.Id}}'  ng-class='{'reply':m.userId!=user.Id}' ng-repeat='m in roomChatDetails.chatHistoryTemp | filter:{message: searchText} track by $index' class='message message-chatNotify  message-self ' data-message-id='-MIJnjfsax5dSJ11Vfm6' data-message-status='Yes' data-user-id='tzd5YATlvkVozExid1ZjsQHHmAC2' data-message-delete='0' data-user-name='L-system' data-class='firechat-message'>" +
                "<div class='message message-chatNotify' data-message-id='-MIK1UkrcA4hk6BdZJiE' data-message-status='Yes' data-user-id='HrdG7fK0bHeohjBpGithEINoPDe2' data-message-delete='0' data-user-name='geligulu_com' data-class='firechat-message'>" +
                "<div class='clearfix'> <label class='fourfifth'> <label class='fifth alignleft' ng-show='m.userId==user.Id'>                                                       <a class='cursorClass delteIcon' ng-click='deleteMessage(m)'>" +
                "<i class='fa fa-trash fa-lg'></i>                                                          </a>                                                       </label>"+
  "<strong class='name' title='L-system'> {{m.name}} </strong>                                                        <em>({{ ToCustomDateTime(m.timestamp)}})</em>:"+
                                                    "</label>                                                    <label class='fifth alignright' ng-show='m.userId!=user.Id'>"+
                " <a href='javascript:;' data-event='firechat-user-chat' ng-click='privateMessageAlert(m)' class='icon user-chat' title='Invite to Private Chat'>" +
                "  <i class='fa fa-comments fa-lg'></i>" +
                                                       "  </a>                                                        <a href='#!' data-event='firechat-user-mute-toggle' class='icon user-mute' title='Mute User'>"+
                                                           "     <i class='fa fa-ban fa-lg'></i>                                                        </a>" +
                                                           "</label> <div class='clearfix message-content' ng-bind-html='m.message'>" +
                                                        
                "</div><div class='chat__messsage' ng-if='m!=undefined  && m.filePath!=undefined && m.filePath.length>0'> "+
                                                           "<a target='_blank' ng-if= '!checkIsImage(m.filePath)' href='{{m.filePath!=undefined ?m.filePath:'sdfsdf'}}' > {{ filterPath(m.filePath) }    }</a >" +
                                                           "  <a target='_blank' ng-if='checkIsImage(m.filePath)' href='{{m.filePath!=undefined ?m.filePath:'sdfsfd'}}'>                                                           <img height='130' src='{{m.filePath!=undefined ?m.filePath:'dsfsf'}}'>" +
                                                           " </a>" +
                                                           " </div>" +
                                                           " </div>" +
                                                           " </div></div>"
        }
    });
    FormGeneratorApp.directive("directiveWhenScrolled", function () {
        return function (scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.directiveWhenScrolled);
                }
            });      
        };
    });
    FormGeneratorApp.directive("scrollBottom", function () {
        return {
            link: function (scope, element, attr) {
                var $id = $("#" + attr.scrollBottom);
                $(element).on("click", function () {
                    $id.scrollTop($id[0].scrollHeight);
                });
            }
        }
    });
}(FormGeneratorApp));


function copyClipboardDirective() {
    var clip;
    function link(scope, element) {
        function clipboardSimulator() {
            var self = this,
                textarea,
                container;         
            function createTextarea() {
                if (!self.textarea) {
                    container = document.createElement('div');
                    container.id = 'simulate-clipboard-container';
                    container.setAttribute('style', ['position: fixed;', 'left: 0px;', 'top: 0px;', 'width: 0px;', 'height: 0px;', 'z-index: 100;', 'opacity: 0;', 'display: block;'].join(''));
                    document.body.appendChild(container);
                    textarea = document.createElement('textarea');
                    textarea.setAttribute('style', ['width: 1px;', 'height: 1px;', 'padding: 0px;'].join(''));
                    textarea.id = 'simulate-clipboard';
                    self.textarea = textarea;
                    container.appendChild(textarea);               
                }
            }
            createTextarea();
        }
        clipboardSimulator.prototype.copy = function () {
            this.textarea.innerHTML = '';
            this.textarea.appendChild(document.createTextNode(scope.textToCopy));
            this.textarea.focus();  
            this.textarea.select();     
            setTimeout(function () {             
                document.execCommand('copy');     
                if (navigator.clipboard && window.isSecureContext) {
                    // navigator clipboard api method'
                    navigator.clipboard.writeText(scope.textToCopy);
                } else {
                    // text area method
                    let textArea = document.createElement("textarea");
                    textArea.value = scope.textToCopy;
                    // make the textarea out of viewport
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    textArea.style.top = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    new Promise((res, rej) => {
                        // here the magic happens
                        document.execCommand('copy') ? res() : rej();
                        textArea.remove();
                    });
                }
              


            }, 180);
        };
        clip = new clipboardSimulator();
        element[0].addEventListener('click', function () {
            clip.copy();
        });
    }
    return {
        restrict: 'A',
        link: link,
        scope: {
            textToCopy: '='
        }
    };
};



