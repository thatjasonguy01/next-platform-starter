; (function ($) {

    $.Components = function (element, options) {

        var defaults = {};
        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element,
            canvas = $('#canvas').contents()

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);

            config = getConfig(plugin.settings.config)
        }

        var getConfig = function (config) {
            fetch('/api/componentsConfig')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    plugin.settings.config = data;
                    bindComponents(data);
                })
                .catch(error => {
                    console.log(error);
                    console.error('There was a problem with the fetch operation:', error);
                });
        }


        var setupDragDrop = function () {
            //var $win = $.getWindow();
            //var currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;
            //var htmlBody = $('body,html');
            //var placeholder = $("<div class='dnnDropTarget'></div>");
            //var counter = 0;

            $("#pnlComponents [draggable]").on('dragstart', function (event) {
                //var validDropZone = ($(this).attr('data-dropzone') != undefined && $target.attr('data-dropzone') ? $(this).attr('data-dropzone') : '[data-dropzone]:not(.row)');
                validDropZone = 'div, .col';
                //htmlBody.addClass('isDraggingElement');
                //$(validDropZone, htmlBody).addClass('validDropZone');

                event.originalEvent.dataTransfer.setData("dropzone:" + validDropZone, '');
                //event.originalEvent.dataTransfer.setData("Text", 'undefined');
                //event.originalEvent.dataTransfer.setData('elementID', 'undefined');
                event.originalEvent.dataTransfer.setData('template', $(this).data('template'));
                event.originalEvent.dataTransfer.setData('templatedata', JSON.stringify($(this).data('data')));
                //event.originalEvent.dataTransfer.setData('styleJSON', $(this).data('styleJSON'));

                //if ($(this).attr('data-module')) {
                //    event.originalEvent.dataTransfer.setData("addmodule", $(this).attr('data-module'));
                //    event.originalEvent.dataTransfer.setData("template", $(this).attr('data-template'));
                //}
                
                dragoverqueue_processtimer = setInterval(function () {
                    DragDropFunctions.ProcessDragOverQueue($('#Canvas').contents().find('body,html'));
                }, 100);
            }).on('dragend', function (event) {
                //htmlBody.removeClass('isDraggingElement');
                //$('.validDropZone', htmlBody).removeClass('validDropZone');

                clearInterval(dragoverqueue_processtimer);
                DragDropFunctions.ClearContainerContext();
                DragDropFunctions.removePlaceholder();
            });

            canvas.on('dragstart', function (event) {
                //var $target = $($(event.target).data('target')) || $(event.target)[0];
                //var validDropZone = ($target.attr('data-dropzone') != undefined && $target.attr('data-dropzone') != '' ? $target.attr('data-dropzone') : '[data-dropzone]:not(.row)');

                //$(validDropZone, htmlBody).addClass('validDropZone');

                //if (event.originalEvent.dataTransfer) {
                //    event.originalEvent.dataTransfer.setData('move', '');
                //    event.originalEvent.dataTransfer.setData("Component", 'undefined');
                //    event.originalEvent.dataTransfer.setData("dropzone:" + validDropZone, '');
                //    event.originalEvent.dataTransfer.setData("Text", $target[0].outerHTML);
                //    event.originalEvent.dataTransfer.setData('elementID', $target[0].id);

                //    dragoverqueue_processtimer = setInterval(function () {
                //        DragDropFunctions.ProcessDragOverQueue(htmlBody.find('.validDropZone'));
                //    }, 100);
                //}
            }).on('dragenter', '[data-dropzone], .dnnSortable', function (event) {
                event.preventDefault();
                event.stopPropagation();

                //htmlBody.addClass('isDraggingElement');
                currentElement = $(event.target);
                currentElementChangeFlag = true;
                elementRectangle = event.target.getBoundingClientRect();
                countdown = 1;
            }).on('dragleave', '[data-dropzone], .dnnSortable', function (event) {
                DragDropFunctions.removePlaceholder();
                DragDropFunctions.ClearContainerContext();
            }).on('dragend', function (event) {
                //htmlBody.removeClass('isDraggingElement');
                //$('.validDropZone', htmlBody).removeClass('validDropZone');

                DragDropFunctions.removePlaceholder();
                DragDropFunctions.ClearContainerContext();
            }).on('dragover', '[data-dropzone]', function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (countdown % 15 != 0 && currentElementChangeFlag == false) {
                    countdown = countdown + 1;
                    return;
                }
                event = event || window.event;

                countdown = countdown + 1;
                currentElementChangeFlag = false;
                
                var dropzone;
                if (event.originalEvent.dataTransfer) {
                    for (var i in event.originalEvent.dataTransfer.types) {
                        if (event.originalEvent.dataTransfer.types[i].substring(0, 9) == 'dropzone:') {
                            dropzone = event.originalEvent.dataTransfer.types[i].substring(9, event.originalEvent.dataTransfer.types[i].length);
                        }
                    }
                    DragDropFunctions.AddEntryToDragOverQueue(currentElement, elementRectangle, { x: event.originalEvent.clientX, y: event.originalEvent.clientY }, dropzone);
                }
            }).on('drop', '[data-dropzone], .dnnSortable', function (event) {
                //htmlBody.removeClass('isDraggingElement');

                var e = event.isTrigger ? triggerEvent.originalEvent : event.originalEvent;

                try {
                    var $insertionPoint =  $($('#canvas')[0].contentWindow.document).find('.drop-marker'); // canvas.find($(".drop-marker"))
                    ;

                    if ($insertionPoint.length == 0) return false;
                    //var moduleId = $.getModuleIdFromElement($insertionPoint);
                    //var $scope = $.getScope(moduleId);

                    if (e.dataTransfer.types.includes('move')) {
                        var elementID = e.dataTransfer.getData('elementID');
                        var $html = $('#PageEditor')[0].contentWindow.$('#' + elementID);
                        var fromModuleId = $.getModuleIdFromElement($html);

                        // if moving from other module
                        if (moduleId != fromModuleId) {
                            //remove source IDs
                            $.each($html.find('[data-field]').andSelf(), function () {
                                $(this).removeAttr('id')
                            });
                            //update status for source module
                            $.setUpdatedStatus("ModuleSetting", fromModuleId, true);
                        }
                        // insert content
                        $insertionPoint.after($html);
                        $.getWindow().find('Body').data('ContentManager').bindContentManager($scope);                        
                    } else if (e.dataTransfer.types.includes('templatedata')) {
                        //var templateData = JSON.parse(e.dataTransfer.getData('templatedata'));
                        //var HTML = Handlebars.compile(templateData.Template.trim())(templateData).trim();
                       
                        var HTML = Handlebars.compile(e.dataTransfer.getData('template'))(JSON.parse(e.dataTransfer.getData('templateData'))).trim();

                        // if template containts site level styles
                        //if (e.dataTransfer.getData('styleJSON')) {
                        //    var $module = $.getScope(moduleId);
                        //    if (!$module.data('StyleManager')) {
                        //        $module.StyleManager($.extend({}, plugin.settings, { 'moduleId': moduleId, 'target': $module }));
                        //    }
                         //   $module.data('StyleManager').AddGlobalStyles(e.dataTransfer.getData('styleJSON'))
                        //}

                        // believe this is now deprecated
                        //$.each(templateData.CSS, function (i, stylesheet) {
                        //    addCSSToPage(stylesheet);
                        //});

                        $insertionPoint.after(HTML).after(' ');
                        //$.setNextElementID($scope);

                        //$.each($('[data-templateid]', $scope), function () {
                        //    templateData.Data.Body[$(this).attr('data-name')]['ID'] = $(this).attr('ID');
                        //});

                        //var initScripts = Handlebars.compile(templateData.Scripts.Body)(templateData).trim();

                        //addScriptsToPage(templateData.JS, 'try {' + Handlebars.compile(templateData.Scripts.Body)(templateData).trim() + '} catch(e)  { console.log(e); }');
                            
                        //App.resizeImages();
                        //$.getWindow().find('Body').data('ContentManager').bindContentManager($scope);
                    }
                    //$.setUpdatedStatus("ModuleSetting", moduleId, true);
                    
                }
                catch (e) {
                    console.log(e);
                }
                $insertionPoint.remove();
            });


            
        }






        var bindComponents = function (config) {
            Handlebars.registerPartial(
                "input",
                "<label id='lbl{{type}}{{name}}' for='input{{name}}' class='form-label'>{{label}}</label><div class='input-wrapper'><input id='{{type}}{{name}}'{{#if inputtype}} type='{{inputtype}}'{{/if}} class='form-control form-control-sm{{#if units}} hasunits{{/if}}' '{{#if placeholder}} placeholder='{{placeholder}}'{{/if}}{{#if min}} min='{{min}}'{{/if}}{{#if max}} max='{{max}}'{{/if}}{{#if step}} step='{{step}}'{{/if}}>{{#if units}}<div class='dropdown'><button class='btn btn-sm btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'></button><ul class='dropdown-menu dropdown-menu-end'>{{#each units}}<li><a class='dropdown-item' href='#'>{{this}}</a></li>{{/each}}</ul></div>{{/if}}</div>"            
            );
            
            $element.append(Handlebars.compile(config.template)(config.data));
            
            $.each(config.data.components, function(i, JSON) {
                $('#component' + JSON.name).data(JSON.data);
            });  

            setTimeout(setupDragDrop(), 0);
            
            
        }

        return plugin.init();

    }

    $.fn.Components = function (options) {
        return this.each(function () {
            var plugin = new $.Components(this, options);
            $(this).data('Components', plugin);
        });
    }

})(jQuery);