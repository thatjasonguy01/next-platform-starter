Handlebars.registerHelper('dynamic', function (data, context, options) {
    return new Handlebars.SafeString(Handlebars.compile(data.template)(data));
});
Handlebars.registerPartial(
    "config",
    "{{#compare @root.settings.mode '==' 'edit'}} data-editable data-name='{{this.name}}' data-type='{{this.data-type}}' {{#if this.type}}{{#isContentEditable type}}{{/isContentEditable}}{{/if}}{{/compare}}"
)
Handlebars.registerPartial(
    "head",
    "{{#each this}}<{{this.type}}{{#compare type '==' 'script'}} type='text/javascript'{{/compare}}{{#if this.src}} src='{{this.src}}'{{/if}}{{#if this.charset}} charset='{{this.charset}}'{{/if}}{{#if this.name}} name='{{this.name}}'{{/if}}{{#if this.content}} content='{{this.content}}'{{/if}}{{#if this.rel}} rel='{{this.rel}}'{{/if}}{{#if this.href}} href='{{this.href}}'{{/if}}{{#if this.integrity}} integrity='{{this.integrity}}'{{/if}}{{#if this.crossorigin}} crossorigin='{{this.crossorigin}}'{{/if}}>{{#compare type '==' 'script'}}</script>{{/compare}}{{/each}}"
);
Handlebars.registerPartial(
    "block",
    "<{{#if this.type}}{{this.type}}{{else}}div{{/if}}{{>config}}{{#if this.class}} class='{{this.class}}'{{/if}} data-dropzone>"
);
Handlebars.registerPartial(
    "endblock",
    "</{{#if this.type}}{{this.type}}{{else}}div{{/if}}>"
);
Handlebars.registerPartial(
    "link",
    "<a{{>config}} href='{{@root.settings.httpalias}}{{this.href}}'{{#if this.target}} target='{{this.target}}'{{/if}}{{#if this.class}} class='{{this.class}}'{{/if}}>{{this.text}}</a>"
);
Handlebars.registerPartial( 
    "button",
    "<a{{>config}} href='{{@root.settings.httpalias}}{{this.href}}'{{#if this.target}} target='{{this.target}}'{{/if}} class='btn{{#if this.class}} {{this.class}}{{/if}}'>{{this.text}}</a>"
);
Handlebars.registerPartial(
    "text",
    "<{{this.type}}{{>config}}{{#if this.class}} class='{{this.class}}'{{/if}}>{{this.text}}</{{this.type}}>"
);
Handlebars.registerPartial(
    "img",
    "<img{{>config}} src='{{this.src}}'{{#if this.class}} class='{{this.class}}'{{/if}}{{#if this.style}} style='{{this.style}}'{{/if}} />"
);
Handlebars.registerPartial(
    "icon",
    "<i{{>config}} class='{{#if this.class}}{{this.class}}{{/if}}'{{#if this.style}} style='{{this.style}}'{{/if}}></i>"
);
Handlebars.registerPartial(
    "hr",
    "<hr{{>config}} class='{{#if this.class}}{{this.class}}{{/if}}'{{#if this.style}} style='{{this.style}}'{{/if}} />"
);
Handlebars.registerHelper('isContentEditable', function(type, options) {
    if(['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'a', 'button'].includes(type)) {
        return 'contenteditable="true"';
    }
});
Handlebars.registerHelper('compare', function(lvalue, operator, rvalue, options) {

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
Handlebars.registerPartial(
    "section",
    "<div class='section'>{{#with section}}<label>{{label}}</label>{{/with}}"
);
Handlebars.registerPartial(
    "endsection",
    "</div>"
);