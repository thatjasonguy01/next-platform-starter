; (function ($) {

    $.Forms = function (element, options) {

        var defaults = {};
        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);

            config = getConfig(plugin.settings.config)
            
        }

        var getConfig = function (config) {
            fetch('/api/pagebuilderConfig?name=' + config )
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    plugin.settings.config = data;
                    bindSettings(data);
                })
                .catch(error => {
                    console.log(error);
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        var bindSettings = function (config) {
            Handlebars.registerPartial(
                "input",
                "<label id='lbl{{type}}{{name}}' for='input{{name}}' class='form-label'>{{label}}</label><div class='input-wrapper'><input id='{{type}}{{name}}'{{#if inputtype}} type='{{inputtype}}'{{/if}} class='form-control form-control-sm{{#if units}} hasunits{{/if}}' '{{#if placeholder}} placeholder='{{placeholder}}'{{/if}}{{#if min}} min='{{min}}'{{/if}}{{#if max}} max='{{max}}'{{/if}}{{#if step}} step='{{step}}'{{/if}}>{{#if units}}<div class='dropdown'><button class='btn btn-sm btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'></button><ul class='dropdown-menu dropdown-menu-end'>{{#each units}}<li><a class='dropdown-item' href='#'>{{this}}</a></li>{{/each}}</ul></div>{{/if}}</div>"            
            );
            Handlebars.registerPartial(
                "select",
                "<div class='dropdown'><button class='btn btn-sm btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'></button><ul class='dropdown-menu dropdown-menu-end'>{{#each options}}<li><a class='dropdown-item' href='#'val='{{value}}'>{{label}}</a></li>{{/each}}</ul></div>"
            );
            Handlebars.registerPartial(
                "switch",
                "<div id='lbl{{type}}{{name}}' class='form-check form-switch'><input id='{{type}}{{name}}' class='form-check-input' type='checkbox' role='switch' id='{{../../name}}_{{name}}'><label class='form-check-label' for='{{../../name}}_{{name}}'>{{label}}</label></div>"
            );
            Handlebars.registerPartial(
                "range",
                "<label id='lbl{{type}}{{name}}' for='{{../../name}}_{{name}}' class='form-label'>{{label}}</label><input id='{{type}}{{name}}' type='range' class='form-range' {{#if min}} min='{{min}}'{{/if}}{{#if max}} max='{{max}}'{{/if}}{{#if step}} step='{{step}}'{{/if}} id='{{../../name}}_{{name}}'/>"
            );
            Handlebars.registerPartial(
                "setting",
                "<div {{#if this.class}} class='{{this.class}}'{{/if}}><label>{{this.label}}</label>{{#compare this.type '==' 'input'}}{{>input}}{{/compare}}{{#compare this.type '==' 'select'}}{{>select}}{{/compare}}</div>"
            );
            Handlebars.registerPartial(
                "buttongroups",
                "<label id='lbl{{type}}{{name}}' for='toolbar{{name}}' class='form-label'>{{label}}</label><div id='{{type}}{{name}}' class='btn-toolbar' role='toolbar' aria-label='Toolbar with button groups'>{{#each this.options}}<div class='btn-group me-2' role='group' aria-label='First group' data-removeregex='{{removeRegex}}'>{{#each this.buttons}}<button type='button' class='btn btn-sm btn-secondary' data-value='{{value}}'><i class='{{this.icon}}'></i></button>{{/each}}</div>{{/each}}</div>"
            )

            $element.append(Handlebars.compile(config.template)(config.data));
            
            $.each(config.data.sections, function(i, section) {
                $.each(section.settings, function(i, JSON) {
                    $('#' + JSON.type + JSON.name).data(JSON);
                });
            });

            getConfig = function(settings){
                switch(settings.binding.action) {
                    case 'getAttr': 
                       $('#' + settings.type + settings.name).val(plugin.settings.target.attr(settings.binding.attr));
                    break;
                    case 'getClass':
                        switch (settings.type){
                            case 'input':
                                $('#' + settings.type + settings.name).val(plugin.settings.target.attr('class'));
                                break;
                            case 'buttongroup':
                                $.each($('#' + settings.type + settings.name).find('.btn'), function(i, btn){
                                    //if (plugin.settings.target.is('.' + $(this).attr('data-value'))){
                                    //    $(this).addClass('active').siblings().removeClass('active');
                                    //}

                                });
                                //$('[' + plugin.settings.target.attr('class') + ']').addClass('active').siblings.removeClass('active');
                                break;
                        }  
                    break;
                    case 'getStyle':
                        $('#' + settings.type + settings.name).val(plugin.settings.target.css(settings.property));
                        break;
                    break;
                }
            }

            setConfig = function (triggers, value, removeRegex) {
                var $target = plugin.settings.target;
                var replaceKey = '-[vp]'
                var replaceValue = window['viewport'];
                $.each(triggers, function (i, trigger){
                    switch(trigger.action) {
                        case 'addClass':       
                            if($target.attr('class')) {
                                $target.removeClass(($target.attr('class').match(new RegExp(removeRegex.replace(replaceKey,replaceValue), "g")) || []).join(" "));
                            }
                            $target.addClass(value.replace(replaceKey, replaceValue));
                            return;
                        case 'addAttr':
                            plugin.settings.target.removeAttr(trigger.attr).attr(trigger.attr,  value);
                            return;
                        case 'addStyle':
                            plugin.settings.target.css(settings.property,  value);
                            return;
                    }
                })
            }

            $('input', $element).on('input change blur', function(e) {
                if ($(this).data('triggers') && $(this).data('triggers')[e.type]) {
                    setConfig($(this).data('triggers')[e.type], this.value);                    
                }
            });

            $('button, a').on('click', function(e) {
                if ($(this).data('triggers') && $(this).data('triggers')[e.type]) {
                    setConfig($(this).data('triggers')[e.type], this.value);                    
                }
            });

            $('.btn-group .btn, .btn-group a').on('click', function(e) {
                var parent = $(this).closest('.btn-toolbar') || $(this).closest('.btn-group');
                if (parent.data('triggers') && parent.data('triggers')[e.type]) {
                    setConfig(parent.data('triggers')[e.type], $(this).data('value'), $(this).closest('[data-removeregex]').data('removeregex'));                    
                }
            });

            $('.dropdown-menu a').on('click', function() {
                $('button', $(this).closest('.dropdown')).text($(this).text());
            })
        }

        plugin.setTarget = function($target) {
            var config = plugin.settings.config;
            plugin.settings.target = $target;
            $.each(config.data.sections, function (i, section) {
                $.each(section.settings, function (i, settings) {
                    if (settings.binding) {
                        getConfig(settings);                    
                    }
                    if (settings.showfor || settings.showforCSS) {
                        var show = false;
                        if (settings.showfor) {
                           show =  $target.is(settings.showfor);
                        }
                        if (settings.showforCSS && show == false) {
                            var keys = Object.keys(settings.showforCSS);
                            $.each(keys, function(index, key) {
                                show = (show == true) ? true : $target.css(key) == settings.showforCSS[key];
                            });
                            
                        }
                        $('#' + settings.type + settings.name).closest('.item').toggle(show);
                    }
                });
            });
        }

        return plugin.init();

    }

    $.fn.Forms = function (options) {
        return this.each(function () {
            var plugin = new $.Forms(this, options);
            $(this).data('Forms', plugin);
        });
    }

})(jQuery);