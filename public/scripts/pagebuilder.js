$(document).ready(function () {
    Handlebars.registerPartial(
        "config",
        "{{#compare @root.settings.mode '==' 'edit'}} data-editable data-type='{{this.data-type}}' {{/compare}}"
    )
       Handlebars.registerPartial(
            "head",
            "{{#each this}}<{{this.type}}{{#if this.charset}} charset='{{this.charset}}'{{/if}}{{#if this.name}} name='{{this.name}}'{{/if}}{{#if this.content}} content='{{this.content}}'{{/if}}{{#if this.rel}} rel='{{this.rel}}'{{/if}}{{#if this.href}} href='{{this.href}}'{{/if}}>{{/each}}"
        );
        Handlebars.registerPartial(
            "block",
            "<{{#if this.type}}{{this.type}}{{else}}div{{/if}}{{#if this.class}}{{>config}}class='{{this.class}}'{{/if}}>"
        );
        Handlebars.registerPartial(
            "endblock",
            "</{{#if this.type}}{{this.type}}{{else}}div{{/if}}>"
        );
        Handlebars.registerPartial(
            "link",
            "<a href='{{this.href}}'{{#if this.target}} target='{{this.target}}'{{/if}}{{#if this.class}} class='{{this.class}}'{{/if}}>{{this.text}}</a>"
        );
        Handlebars.registerPartial(
            "text",
            "<{{this.type}}{{#if this.class}} class='{{this.class}}'{{/if}}>{{this.text}}</{{this.type}}>"
        );
        Handlebars.registerPartial(
            "img",
            "<img src='{{this.src}}'{{#if this.class}} class='{{this.class}}'{{/if}}{{#if this.style}} style='{{this.style}}'{{/if}} />"
        );
        Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

            var operators, result;
            
            if (arguments.length < 3) {
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }
            
            if (options === undefined) {
                options = rvalue;
                rvalue = operator;
                operator = "===";
            }
            
            operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '!==': function (l, r) { return l !== r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'typeof': function (l, r) { return typeof l == r; }
            };
            
            if (!operators[operator]) {
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }
            
            result = operators[operator](lvalue, rvalue);
            
            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        var getJSON = function(org, site, env, page) {
            fetch('/api/pagebuilderJSON?org=' + org + '&site=' + site + '&env=' + env + '&page=' + page)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data fetched:', data);
                    console.log(data);
                    renderPage(data);
                    // Process the data
                })
                .catch(error => {
                    console.log(error);
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        var renderPage = function (json) {
            
            var pageJSON = json.respJSON.page;
            var modulesJSON = json.respJSON.modules;
            var pageOutput = Handlebars.compile(pageJSON.template)(pageJSON);
           
            const sections = ['header', 'main', 'footer'];
            sections.forEach((section) => {
                var modules = pageJSON[section]['modules']; 
                var moduleOutput = '';
                if (modules && modules.length > 0) {
                    modules.forEach((module) => {
                        var moduleJSON = modulesJSON[module];
                        moduleOutput += Handlebars.compile(moduleJSON.template)(moduleJSON);
                    });  
                }
                pageOutput = pageOutput.replace('[[' + section + 'Modules]]', moduleOutput);
            });

            var canvas = $('#canvas')[0].contentWindow.document;
            canvas.open();
            canvas.write(pageOutput);
            canvas.close();
        };

     getJSON('organization1', 'site1', 'dev', 'home');
});

