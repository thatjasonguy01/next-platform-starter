window['viewport'] = "";


; (function ($) {

    $.PageBuilder = function (element, options) {

        var defaults = {
            'mode': 'view'
        };
        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element,
            $manager = $('#pageBuilder'),
            canvas = $('#canvas')[0].contentWindow.document;

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);
            $manager.data('settings', plugin.settings);

            if ($manager.data("eventsBound") != true) {
                bindEvents();
            }
            // loadPages();
            bindData();
            loadCanvas();
        }

        var loadPages = function () {
            fetch('/api/getPages')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                //    renderCanvas(data);
                })
                .catch(error => {
                    console.log(error);
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        var loadCanvas = function () {

            var getJSON = function () {
                fetch('/api/pagebuilderJSON?org=' + plugin.settings.org + '&site=' + plugin.settings.site + '&env=' + plugin.settings.env + '&page=' + plugin.settings.page + (plugin.settings.mode == 'edit' ? '&mode=edit' : ''))
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        renderCanvas(data);
                    })
                    .catch(error => {
                        console.log(error);
                        console.error('There was a problem with the fetch operation:', error);
                    });
            }

            var renderCanvas = function (json) {

                var interceptNavigation = function () {
                    $('a, button', canvas).on('click', function (e) {
                        e.preventDefault();
                        if (plugin.settings.mode == 'view'){
                            plugin.settings.page = $(this).attr('href').replace("https://www.mysite.com/", "");
                            loadCanvas()
                        }
                    })
                }

                var pageOutput = Handlebars.compile(json.page.template)(json.page);
                canvas.open();
                canvas.write(pageOutput);
                canvas.close();

                interceptNavigation();

                if (plugin.settings.mode == 'edit') {
                    bindCanvas($('#canvas').contents().find('[data-editable]'));
                }

            };

            getJSON();
        }
    
        var bindCanvas = function ($elements) {

            $elements.not('[data-noedit]').off('mousedown').on('click dblclick', function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                selectCanvasElement($(this))
                $('#pnlSettings').show();
                $('#pnlComponents').hide();
            });
        }

        var selectCanvasElement = function(target) {
            $('#pnlSettings').data('Forms').setTarget(target);
            plugin.settings.target = target;
            $('#canvas').trigger('setfocus', target);

            $('[data-selected]', canvas).removeAttr('data-selected');
            target.attr('data-selected', '');

            $(window).trigger('positionContextMarker');

        }

        var enterEditMode = function () {
            plugin.settings.mode = 'edit';

            loadCanvas();
            
            if (!$('#pnlComponents').data('Components')) {
                $('#pnlComponents').Components({'config': 'settings.json'}).show();
            } else {
                //$('#pnlComponents').show(); 
            }

            if (!$('#pnlSettings').data('Forms')) {
                $('#pnlSettings').Forms({'config': 'settings.json'});//.show();
           // } else {
           //     $('#pnlSettings').show(); 
            }

            $('.admin').show();
        }

        var exitEditMode = function () {
            plugin.settings.mode = 'view'
            loadCanvas();

            //$('#pnlSettings').hide();
            $('.admin').hide();
        }

        setPreviewSize = function (el) {
            if (!el) {
                if (localStorage.getItem("previewSize") != "null") {
                    el = $('#navPreviewSize button[data-size="' + localStorage.getItem("previewSize") + '"]')[0];
                } else {
                    el = $('#navPreviewSize button[data-size="xs"]')[0];
                }
            }

                $(el).addClass('active').siblings().removeClass('active');
                $('#canvas').css({ 'width': $(el).data('width'), 'max-height': '100%', 'min-width': $(el).data('minwidth') });
    
                localStorage.setItem('resolution', $(el).data('value'));
                localStorage.setItem('viewport', $(el).data('viewport'));
    
                window['viewport'] = $(el).data('viewport')
                $('#canvas').trigger('viewportChange');
            
        }

        var bindData = function () {
        }

        var bindEvents = function () {

            var script = $('<script>', {
                type: 'text/javascript',
                src: 'https://kit.fontawesome.com/d664a6ba8a.js' // Replace with the actual path to your script file
              });
              $('head').append(script);

            $('#btnEdit').on('click', function () {
                $(this).toggle().siblings().toggle();
                enterEditMode();
            })

            $('#btnCancelEdit').on('click', function () {
                $(this).toggle().siblings().toggle();
                exitEditMode();
            })

            $('#navPreviewSize > button').on('click', function(e) {
                setPreviewSize(this);
            });

            $("nav > button").on('click', function() {
                $(this).addClass('active').siblings().removeClass('active');
                $("nav").siblings($(this).data('target')).show().siblings().not('nav').hide();
            });

            $(window).on('positionContextMarker', function () {
                positionContextMarker();
            })

            $manager.data('eventsBound', true);
        }

        var positionContextMarker = function ($element) {
            try {
                var $target =  $element ||  $('[data-selected]', canvas);
                var tokenMenu = $('#tokenMenu', canvas);

                if (tokenMenu.length == 0) {
                    $("body", canvas).append($('<div id="tokenMenu" class="btn-toolbar" role="toolbar" aria-label=""><span data-dragcontext-marker-text><label id="tokenMenu_Type"></label></span><div class="btn-group" role="group"><button id="tokenMenu_Up" type="button" class="btn"><i class="fa fa-level-up"></i></button><button id="tokenMenu_Add" type="button" class="btn"><i class="fa fa-plus"></i></button><button id="tokenMenu_Move" type="button" class="btn"><i class="fa fa-arrows"></i></button><button id="tokenMenu_Delete" type="button" class="btn"><i class="fa fa-trash"></i></button></div></span></div></div>'));
                    tokenMenu = $('#tokenMenu', canvas);

                    $('#tokenMenu_Up, .actionMenuUp a', canvas).on('click touchend', function (e) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        var $parent = $('[data-selected]', canvas).parent().closest('[data-editable]');
                        if ($parent.length != 0) {
                            //$editor.data('mode', 'ModuleSettings');
                            selectCanvasElement($parent);
                        }
                    });
                }
                
                if ($target.length > 0) {
                    var contentWindow = $('#canvas')[0].contentWindow;
                        $('#tokenMenu', canvas).data('target', $target).find('label').text($target.attr('data-name') || $target.attr('data-type'));
                        $('#tokenMenu_Up', canvas).toggle($target.parents('[data-editable]').length > 0);
                        //$('#tokenMenu_Add', $win).toggle($target.parents('[data-type="CONTENT"]').length > 0 && !$target.is('[no-action]'));
                        //$('#tokenMenu_Delete', $win).toggle($target.parents('[data-type="CONTENT"]').length > 0);
                        //$('#tokenMenu_Move', $win).toggle($target.parents('[data-type="CONTENT"]').length > 0);

                        //$('#tokenMenu_Add, #tokenMenu_Move, #tokenMenu_Delete',$contextMarker.parent()).toggle(!$(selected).is('[no-action]'));
                        //$('.actionMenu', $win).hide(5, function () {
                        //    $('#tokenMenu', $win).show();
                        //});
                        
                        var rect = $target.get(0).getBoundingClientRect();
                        var top = Math.max((rect.top + $(contentWindow).scrollTop() - 28), 0);
                        var left = Math.max((rect.left + $(contentWindow).scrollLeft() - 4), 0) 
                        var offscreenRight = 0 ; //left + $('#tokenMenu', canvas).width() > $.getWindow().width();

                        $('#tokenMenu', canvas).css({
                            top: Math.max( (rect.top + $(contentWindow).scrollTop() - 26), 0) + "px",
                            left: offscreenRight ? 'unset' : Math.max((rect.left + $(contentWindow).scrollLeft() - 4), 0) + "px",
                            right: offscreenRight ? 0 : 'unset'
                        })
                } else {
                    $('#tokenMenu', $win).hide();
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return plugin.init();

    }

    $.fn.PageBuilder = function (options) {
        return this.each(function () {
            var plugin = new $.PageBuilder(this, options);
            $(this).data('PageBuilder', plugin);
        });
    }

})(jQuery);

$(document).ready(function () {
    $('#pageBuilder').PageBuilder({
        'org': 'organization1',
        'site': 'site1',
        'env': 'dev',
        'page': 'home',
    });
});