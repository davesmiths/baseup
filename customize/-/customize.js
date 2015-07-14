window["github.com/davesmiths/uri-js"]={parse:function(s,r){var t,a,e,p,h,i,n,o=s,u=[],c={},f=":",m="/",l="indexOf",d="split",v="shift",y="join",b=s[l](f),g=s[l](m),w=s[l]("?"),j=s[l]("#");return s=s.replace(/^\s+|\s+$/g,""),-1!==b&&(-1===g||g>b)&&(-1===w||w>b)&&(s=s[d](f),a=s[v](),s=s[y](f)),(a===r||"http,https,ftp"[d](a,2)[1])&&(-1!==j&&(b=s[d]("#"),s=b[v](),t=b[y]("#")||""),-1!==w&&(-1===j||j>w)&&(b=s[d]("?"),s=b[v](),b=b[y]("?")[d]("&"),u=b.map(function(s,r){return s=s[d]("="),r=s[v]().replace(/^amp;/,""),s=s[y]("="),c[r]=s,{key:r,value:s}})),s.substr(0,2)===m+m&&(s=s.substr(2)[d](m),b=s[v]()[d]("@"),g=b.pop()[d](f),b=b[y]("@")[d](f),e=b[v]()||r,p=b[y](f)||r,h=g[v](),i=g[y](f)||r,s=m+s[y](m))),n=s||r,{readonly:{source:o,params:u},params:c,hash:t,scheme:a,user:e,pass:p,host:h,port:i,path:n}},stringify:function(s,r){var t,a=s.scheme,e="",p=s.params,h=s.host,i=s.user,n=s.pass,o=s.port,u=s.hash,c=a?a+":":"";if(h&&(c+="//"),i&&(c+=i,n&&(c+=":"+n),c+="@"),c+=h||"",o&&(c+=":"+o),c+=s.path||"",p){for(t in p)p.hasOwnProperty(t)&&(e+=t+(p[t]?"="+p[t]:"")+"&");e&&(c+="?"+e.slice(0,-1))}return u!==r&&(c+="#"+u),c}};


// Custom events
(function(context) {

    'use strict';

    var db = {},
        trigger,
        on;

    trigger = function(id, fn) {

        var done,
            fnexists = fn ? true : false;

        db[id] = db[id] || {count:0,length:0,callback:[]};

        db[id].length += 1;

        done = function() {
            var cb = function() {
                var dbidcallbacklength = db[id].callback.length,
                    i;

                db[id].count += 1;
                if (db[id].count === db[id].length && dbidcallbacklength) {
                    for (i = 0; i < dbidcallbacklength; i++) {
                        db[id].callback[i]();
                    }
                }
            };
            // If the function exists then treat as a async, even if no AJAX is done in the function
            if (fnexists) {
                // setTimeout ensures all triggers are collected into the db before a done is called, thus allowing db[id].length to be more than 1
                setTimeout(cb, 1);
            }
            // Otherwise call done immediately, allows the use of the on/trigger pattern without using setTimeout unnecessarily
            else {
                cb();
            }
        };
        fn = fn || function(done) {done();};
        fn(done);
    };

    on = function(id, fn) {
        db[id] = db[id] || {count:0,length:0,callback:[]};
        db[id].callback.push(fn);
    };

    context.stream = {on: on, trigger: trigger};

}(this));

(function() {

    'use strict';

    var _selectors,
        _in = {templates:{}},
        _out = {},
        _payload = {},
        _tid = {},
        _urls = {},
        asyncs,
        getSettingsFromURI,
        makeInputs,
        makeInputsDone,
        makeInputDone,
        makeOutputs,
        makeOutputsDone,
        makePayloads,
        makePayloadsDone,
        makeDeliveries,
        makeHeadingMargins,
        makeSettingsForURI,
        trim,
        processRules,
        makeWidthClasses,
        makePositionClasses,
        resizeOutput,
        round,
        inputChange,
        inputBaseChange,
        inputBasesChange,
        inputBasesxChange,
        breakpointAdd,
        init,
        redraw;

    _urls = {
        templateDemoHTML: '-/template-demo.html',
        templateCSS: '-/template.css?v=1',
        templateJS: '-/template.js'
    };
    _selectors = {

        // inputs
        inputs: {

            base: '#input-base',
            fontSize: '#input-fontsize',
            columns: '.input-columns',

            at: '.input-at',
            basesx: '.input-basesx',

            decimalPlaces: '#input-decimalplaces',
            heights: '#input-heights',
            ns: '#input-ns',

            positionClasses: '#input-positionclasses',
            layoutClasses: '#input-layoutclasses',
            copyClasses: '#input-copyclasses',
            legacysupport: '.input-legacysupport',

            h1: '#input-h1',
            h2: '#input-h2',
            h3: '#input-h3',
            h4: '#input-h4',
            h5: '#input-h5',
            h6: '#input-h6',

            h1nx: '#input-h1nx',
            h2nx: '#input-h2nx',
            h3nx: '#input-h3nx',
            h4nx: '#input-h4nx',
            h5nx: '#input-h5nx',
            h6nx: '#input-h6nx',

            hadj: '#input-hadj',
            h1adj: '#input-h1adj',
            h2adj: '#input-h2adj',
            h3adj: '#input-h3adj',
            h4adj: '#input-h4adj',
            h5adj: '#input-h5adj',
            h6adj: '#input-h6adj',

            gutnxsmall: '#input-gutnxsmall',
            gutnxmedium: '#input-gutnxmedium',
            gutnxlarge: '#input-gutnxlarge',
            gutnxxlarge: '#input-gutnxxlarge',

            scrollbardepthadjust: '#input-scrollbardepthadjust',

            hfont: '#input-hfont',
            hweight: '#input-hweight',
            copyfont: '#input-copyfont',
            copyweight: '#input-copyweight'

        },

        breakpointadd: '.input-breakpoint-add',

        baseBasedBPs: '.input-base-based-bps',

        maxWidths: '.input-maxwidths',
        maxWidthsBP: '.input-maxwidths-bp',
        bases: '.input-bases',

        formbreakpoint: '.form-breakpoint',
        formbreakpointremove: '.form-breakpoint-remove',


        // outputs
        css: '.output-css',
        js: '.output-js',
        headcss: '.output-headcss',
        headjs: '.output-headjs',
        demo: '.output-demo',


        layoutoptions: '.layoutoptions',
        generaloptions: '.generaloptions',
        copyoptions: '.copyoptions',
        tabbedoptions: '.tabbedoptions'

    };


    makeInputs = function() {

        _in.breakpoints = [];
        $(_selectors.formbreakpoint).each(function(i) {
            _in.breakpoints[i] = {
                at: $(this).find(_selectors.inputs.at).val() * 1,
                base: $(this).find(_selectors.bases).val() * 1,
                basex: $(this).find(_selectors.inputs.basesx).val() * 1
            };
        });
        _in.breakpointsLength = _in.breakpoints.length;
        _in.columns = $(_selectors.inputs.columns).val();
        _in.decimalPlaces = $(_selectors.inputs.decimalPlaces).val();
        _in.heightClasses = $(_selectors.inputs.heights).val() * 1;
        _in.classNamespace = $(_selectors.inputs.ns).val().replace(/\s+/g, '');
        _in.maxWidths = $(_selectors.maxWidths).val().replace(/\s+/g, '').split(',');
        _in.maxWidthsLength = _in.maxWidths.length;

        _in.base = $(_selectors.inputs.base).val();

        _in.positionClasses = $(_selectors.inputs.positionClasses)[0].checked;
        _in.copyClasses = $(_selectors.inputs.copyClasses)[0].checked;
        _in.layoutClasses = $(_selectors.inputs.layoutClasses)[0].checked;
        _in.legacysupport = $(_selectors.inputs.legacysupport)[0].checked;

        _in.fontSize = $(_selectors.inputs.fontSize).val();
        // Handle simple divisions like 2/3
        if (_in.fontSize.indexOf('/') !== -1) {
            _in.fontSize = _in.fontSize.split('/');
            _in.fontSize = _in.fontSize[0] * 1 / _in.fontSize[1] * 1;
        }
        _in.fontSize = _in.fontSize * 1;

        _in.h1 = $(_selectors.inputs.h1).val() * 1;
        _in.h2 = $(_selectors.inputs.h2).val() * 1;
        _in.h3 = $(_selectors.inputs.h3).val() * 1;
        _in.h4 = $(_selectors.inputs.h4).val() * 1;
        _in.h5 = $(_selectors.inputs.h5).val() * 1;
        _in.h6 = $(_selectors.inputs.h6).val() * 1;

        _in.h1nx = $(_selectors.inputs.h1nx).val() * 1;
        _in.h2nx = $(_selectors.inputs.h2nx).val() * 1;
        _in.h3nx = $(_selectors.inputs.h3nx).val() * 1;
        _in.h4nx = $(_selectors.inputs.h4nx).val() * 1;
        _in.h5nx = $(_selectors.inputs.h5nx).val() * 1;
        _in.h6nx = $(_selectors.inputs.h6nx).val() * 1;

        _in.hadj = $(_selectors.inputs.hadj).val(); // nx || px so far

        _in.h1adj = $(_selectors.inputs.h1adj).val() * 1;
        _in.h2adj = $(_selectors.inputs.h2adj).val() * 1;
        _in.h3adj = $(_selectors.inputs.h3adj).val() * 1;
        _in.h4adj = $(_selectors.inputs.h4adj).val() * 1;
        _in.h5adj = $(_selectors.inputs.h5adj).val() * 1;
        _in.h6adj = $(_selectors.inputs.h6adj).val() * 1;

        _in.hfont = $(_selectors.inputs.hfont).val();
        _in.hweight = $(_selectors.inputs.hweight).val();
        _in.copyfont = $(_selectors.inputs.copyfont).val();
        _in.copyweight = $(_selectors.inputs.copyweight).val();

        _in.headingspaceminimum = 1; // x base

        _in.scrollbardepthadjust = $(_selectors.inputs.scrollbardepthadjust).val() * 1;

        _in.gutnxsmall = $(_selectors.inputs.gutnxsmall).val() * 1;
        _in.gutnxmedium = $(_selectors.inputs.gutnxmedium).val() * 1;
        _in.gutnxlarge = $(_selectors.inputs.gutnxlarge).val() * 1;
        _in.gutnxxlarge = $(_selectors.inputs.gutnxxlarge).val() * 1;


        stream.trigger('loadtemplates', function(trigger) {
            if (typeof _in.templates.css === 'undefined') {
                $.ajax(_urls.templateCSS, {dataType:'text',async:false,cache:false}).done(function(text) {
                    _in.templates.css = text;
                    trigger();
                });
            }
            else {
                trigger();
            }
        });
        stream.trigger('loadtemplates', function(trigger) {
            if (typeof _in.templates.js === 'undefined') {
                $.ajax(_urls.templateJS ,{dataType:'text',async:false,cache:false}).done(function(text) {
                    _in.templates.js = text;
                    trigger();
                });
            }
            else {
                trigger();
            }
        });
        stream.trigger('loadtemplates', function(trigger) {
            if (typeof _in.templates.demo === 'undefined') {
                $.ajax(_urls.templateDemoHTML, {dataType:'text',async:false}).done(function(text) {
                    _in.templates.demo = text;
                    trigger();
                });
            }
            else {
                trigger();
            }
        });

    };




    makeOutputs = function(o) {

        var hidegutlefts,
            gutlefts,
            gutrights,
            guts,
            gutsfws,
            gutbottoms,
            gutsmargin,
            gutsmarginall,
            gutspadding,
            gutspaddingall,
            pullgutlefts,
            pullgutleftwidths,
            pullgutrights,
            pullgutrightwidths,
            heights,
            maxwidths,
            // ords,
            widthpx,
            widthspx,
			nMaxWidths,
            nWidths,
            nHeight,
            nGutsWhole,
            nGutsFraction,
			nGutsPX,
            j,
            i,
            k,
            m,
            bpi,
            isgt0,
            is0,
            is1,
            _inbreakpointi,
            _outbreakpointi,
            currentBase,
            isnotfirst,
            isforlay,
            maxwidthbps = [],
            maxwidthbp,
            pullgutGutters,
            pullgutGuttersLength,
            pullgutNames,
            pullgutNamesLength,
            baseChanged,
            val,
            headingMargins,
            headingLineHeights,
            copyfontsizeem,
            copyfontsizepx;





        _out.ns = _in.classNamespace;

        _out.lay = 'lay';
        _out.laycentered = 'lay-centered';
        _out.layleft = 'lay-left';
        _out.layright = 'lay-right';

        _out.col = 'col';
        _out.colgut = 'col-gut';
        _out.colguthide = 'hide-col-gut';
        _out.colnone = 'col-none';

        _out.gutsfw = 'guts-fw';

        _out.inngut = 'gut';
        _out.innguthide = 'hide-gut-left';
        _out.innnone = 'gut-none';

        _out.gut = 'gut';
        _out.gutleft = 'gut-left';
        _out.gutsmall = 'gut-left-small';
        _out.gutmedium = 'gut-left-medium';
        _out.gutlarge = 'gut-left-large';
        _out.gutxlarge = 'gut-left-xlarge';

        _out.gutright = 'gut-right';
        _out.gutrightsmall = 'gut-right-small';
        _out.gutrightmedium = 'gut-right-medium';
        _out.gutrightlarge = 'gut-right-large';
        _out.gutrightxlarge = 'gut-right-xlarge';

        _out.gutbot = 'gut-bottom';

        _out.pullleft = 'pull-left';
        _out.pullright = 'pull-right';

        _out.pullgut = 'pull-gut-left';
        _out.pullgutright = 'pull-gut-right';

        _out.clear = 'clear';
        _out.clearnone = 'clear-none';
        _out.width = 'width';
        _out.height = 'height';
        _out.widthmax = 'width-max';
        _out.pos = 'pos';
        // _out.ord = 'ord';
        _out.clearie6and7fixp1 = 'clear-ie6and7fixp1';
        _out.clearie6and7fixp2 = 'clear-ie6and7fixp2';
        _out.layie6fix = 'lay-ie6fix';
        _out.layoutgutter = 'layout-gutter';
        _out.rizzlecssproperty = 'rizzlecssproperty';


        // Breakpoints
        _out.breakpoints = [];

        // Copy
        _out.copylineheight = 1/_in.fontSize; // Or font-size adjust
        _out.defaultcopyfontsize = 16; // The default untouched font-size cross-browser

        // Headings
        _out.h1 = round(100*_in.h1, _in.decimalPlaces);
        _out.h2 = round(100*_in.h2, _in.decimalPlaces);
        _out.h3 = round(100*_in.h3, _in.decimalPlaces);
        _out.h4 = round(100*_in.h4, _in.decimalPlaces);
        _out.h5 = round(100*_in.h5, _in.decimalPlaces);
        _out.h6 = round(100*_in.h6, _in.decimalPlaces);

        // I devised the algorithm to decrease the line-height the larger the font-size. Such that when the font-size is the same as copy, the line-height is also the same.
        // Reasoning that the larger the font-size the less words per line and therefore the line-height can be less (as it's easier to scan across fewer words).
        // Plus the results looked good ;)
        headingLineHeights = {
            'h1': 1 + ((_out.copylineheight - 1) / _in.h1),
            'h2': 1 + ((_out.copylineheight - 1) / _in.h2),
            'h3': 1 + ((_out.copylineheight - 1) / _in.h3),
            'h4': 1 + ((_out.copylineheight - 1) / _in.h4),
            'h5': 1 + ((_out.copylineheight - 1) / _in.h5),
            'h6': 1 + ((_out.copylineheight - 1) / _in.h6)
        };

        _out.h1lineheight = round(headingLineHeights.h1, _in.decimalPlaces);
        _out.h2lineheight = round(headingLineHeights.h2, _in.decimalPlaces);
        _out.h3lineheight = round(headingLineHeights.h3, _in.decimalPlaces);
        _out.h4lineheight = round(headingLineHeights.h4, _in.decimalPlaces);
        _out.h5lineheight = round(headingLineHeights.h5, _in.decimalPlaces);
        _out.h6lineheight = round(headingLineHeights.h6, _in.decimalPlaces);

        _out.hfont = _in.hfont;
        _out.hweight = _in.hweight;
        _out.copyfont = _in.copyfont;
        _out.copyweight = _in.copyweight;



        // widths
        _out.widthclasses = makeWidthClasses({columns: _in.columns}); // returns {widths:, widthsall:}

        currentBase = -1;

        for (i = 0; i < _in.breakpointsLength; i += 1) {

            _outbreakpointi = _out.breakpoints[i] = {};
            _inbreakpointi = _in.breakpoints[i];

            baseChanged = false;

            if (currentBase !== _inbreakpointi.base) {
                currentBase = _inbreakpointi.base;
                // A change of base detected
                // Therefore ensure all breakpoints[i].base reliant stuff is carried over
                baseChanged = true;
            }

            _outbreakpointi.basechanged = baseChanged;

            bpi = i;
            if (i > 0 && baseChanged) {
                bpi = i - 1;
            }

            isgt0 = (i > 0) ? true : false;
            is0 = (i === 0) ? true : false;
            is1 = (i === 1) ? true : false;

            copyfontsizepx = _inbreakpointi.base/_out.copylineheight;
            copyfontsizeem = copyfontsizepx/_out.defaultcopyfontsize;
            _outbreakpointi.copyfontsize = round(copyfontsizeem, _in.decimalPlaces); // The default untouched font-size cross-browser


            // Heading Margins


            _in.headingspaceminimum = 2;

            headingMargins = makeHeadingMargins(_inbreakpointi.base, headingLineHeights, copyfontsizepx);

            _outbreakpointi.h1bottomval = round(headingMargins.h1.bottom, _in.decimalPlaces) + 'px';
            _outbreakpointi.h2bottomval = round(headingMargins.h2.bottom, _in.decimalPlaces) + 'px';
            _outbreakpointi.h3bottomval = round(headingMargins.h3.bottom, _in.decimalPlaces) + 'px';
            _outbreakpointi.h4bottomval = round(headingMargins.h4.bottom, _in.decimalPlaces) + 'px';
            _outbreakpointi.h5bottomval = round(headingMargins.h5.bottom, _in.decimalPlaces) + 'px';
            _outbreakpointi.h6bottomval = round(headingMargins.h6.bottom, _in.decimalPlaces) + 'px';


            _outbreakpointi.h1paddingtopval = round(headingMargins.h1.paddingTop, _in.decimalPlaces) + 'px';
            _outbreakpointi.h2paddingtopval = round(headingMargins.h2.paddingTop, _in.decimalPlaces) + 'px';
            _outbreakpointi.h3paddingtopval = round(headingMargins.h3.paddingTop, _in.decimalPlaces) + 'px';
            _outbreakpointi.h4paddingtopval = round(headingMargins.h4.paddingTop, _in.decimalPlaces) + 'px';
            _outbreakpointi.h5paddingtopval = round(headingMargins.h5.paddingTop, _in.decimalPlaces) + 'px';
            _outbreakpointi.h6paddingtopval = round(headingMargins.h6.paddingTop, _in.decimalPlaces) + 'px';



            _outbreakpointi.base = _inbreakpointi.base;
            _outbreakpointi.base2x = _inbreakpointi.base * 2;
            _outbreakpointi.base1o2 = round(_inbreakpointi.base/2, _in.decimalPlaces);
            _outbreakpointi.halfbase = round(_inbreakpointi.base/2, _in.decimalPlaces);
            _outbreakpointi.halfbase2x = round(_inbreakpointi.base * 2 / 2, _in.decimalPlaces);
            _outbreakpointi.halfbase1o2 = round(_inbreakpointi.base/4, _in.decimalPlaces);

            // isFirst
            _outbreakpointi.is0 = is0;
            _outbreakpointi.is1 = is1;
            _outbreakpointi.isgt0 = isgt0;

            // bp
            if (is0) {
                _outbreakpointi.bp = '';
            }
            else {
                _outbreakpointi.bp = '-' + i + 'up';
            }

            // at
            _outbreakpointi.at = _inbreakpointi.at;



            // maxwidth based on breakpoints
            maxwidthbp = _inbreakpointi.at - _inbreakpointi.base;
            _outbreakpointi.maxwidthbp = maxwidthbp;
            maxwidthbps.push(maxwidthbp);


            // widths
            _outbreakpointi.widthclasses = makeWidthClasses({columns: _in.columns});

            // cols
            _outbreakpointi.cols = [];
            for (j = 0; j < _in.columns; j += 1) {
                _outbreakpointi.cols.push({
                    num:j+1,
                    width:round(100/(j+1), _in.decimalPlaces)
                });
            }

            // poss
            _outbreakpointi.poss = makePositionClasses({columns: _in.columns});


            // Everything based on base
            hidegutlefts = [];
            gutlefts = [];
            gutrights = [];
            gutsfws = [];
            gutbottoms = [];
            gutsmargin = [];
            gutsmarginall = [];
            gutspadding = [];
            gutspaddingall = [];
            pullgutlefts = [];
            pullgutleftwidths = [];
            pullgutrights = [];
            pullgutrightwidths = [];
            gutbottoms = [];
            heights = [];
            maxwidths = [];
            widthpx = [];
            widthspx = [];
            // ords = [];

            nMaxWidths = 8;
            nWidths = 24;
            nHeight = _in.heightClasses + 1;
            nGutsWhole = 7;
            nGutsFraction = 5;
            nGutsPX = 11;


            for (m = bpi; m <= i; m++) {

                // for (j = 0; j < _in.columns; j++) {
                //     ords.push({
                //         value:-100-j,
                //         selector: '.' + _out.ns + _out.ord + '-' + (j+1) + _out.breakpoints[m].bp,
                //     });
                // }


                // Maxwidths
                for (j = 1; j < nMaxWidths; j += 1) {
                    maxwidths.push({
                        selector: '.' + _out.ns + _out.widthmax + '-' + j + 'dx' + _out.breakpoints[m].bp,
                        val: (_inbreakpointi.base * ((j * 12) - 1)) + 'px',
                    });
                }
                maxwidths.push({
                    val: 'none',
                    selector: '.' + _out.ns + _out.widthmax + '-none' + _out.breakpoints[m].bp
                });



                // Widths px
                for (j = 1; j < nWidths; j += 1) {
                    widthpx.push({
                        selector: '.' + _out.ns + _out.width + '-' + j + 'x' + _out.breakpoints[m].bp,
                        val: _inbreakpointi.base * j + 'px',
                    });
                }
                for (j = 1; j < nWidths; j += 1) {
                    widthspx.push({
                        selector: '.' + _out.ns + _out.width + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > *',
                        val: _inbreakpointi.base * j + 'px',
                    });
                }
                for (j = 1; j < nWidths; j += 1) {
                    widthspx.push({
                        selector: '.' + _out.ns + 'child-' + _out.width + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > * > *',
                        val: _inbreakpointi.base * j + 'px',
                    });
                }
                for (j = 1; j < nWidths; j += 1) {
                    widthspx.push({
                        selector: '.' + _out.ns + 'gchild-' + _out.width + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > * > * > *',
                        val: _inbreakpointi.base * j + 'px',
                    });
                }



                // Heights
                heights.push({
                    val: round(_inbreakpointi.base / 2, _in.decimalPlaces) + 'px',
                    selector: '.' + _out.ns + _out.height + '-1o2x' + _out.breakpoints[m].bp
                });
                for (j = 1; j < nHeight; j += 1) {
                    heights.push({
                        val: _inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.height + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                heights.push({
                    val: '100%',
                    selector: '.' + _out.ns + _out.height + '-1o1' + _out.breakpoints[m].bp
                });
                heights.push({
                    val: 'auto',
                    selector: '.' + _out.ns + _out.height + '-auto' + _out.breakpoints[m].bp
                });



                // Hide Gut Lefts
                hidegutlefts.push({
                    val: -_inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.innguthide + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    hidegutlefts.push({
                        val: -_inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.innguthide + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        hidegutlefts.push({
                            val: round(-_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.innguthide + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    hidegutlefts.push({
                        val: -j + 'px',
                        selector: '.' + _out.ns + _out.innguthide + '-' + j + 'px' + _out.breakpoints[m].bp
                    });
                }
                hidegutlefts.push(
                    {
                        val: '0',
                        selector: '.' + _out.ns + _out.innguthide + '-none' + _out.breakpoints[m].bp
                    }
                );



                // Guts Full Widths
                gutsfws.push({
                    val: -_inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.gutsfw + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutsfws.push({
                        val: -_inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.gutsfw + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutsfws.push({
                            val: -round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutsfw + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutsfws.push({
                        val: -j + 'px',
                        selector: '.' + _out.ns + _out.gutsfw + '-' + j + 'px' + _out.breakpoints[m].bp
                    });
                }
                gutsfws.push({
                    val: _inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.gutsfw + _out.breakpoints[m].bp + ' > * > *'
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutsfws.push({
                        val: _inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.gutsfw + '-' + j + 'x' + _out.breakpoints[m].bp + ' > * > *'
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutsfws.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutsfw + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp + ' > * > *'
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutsfws.push({
                        val: j + 'px',
                        selector: '.' + _out.ns + _out.gutsfw + '-' + j + 'px' + _out.breakpoints[m].bp + ' > * > *'
                    });
                }



                // Components Gut Margin
                gutbottoms.push({
                    val: round(_inbreakpointi.base, _in.decimalPlaces) + 'px',
                    selector: '.' + _out.ns + _out.gutbot + 's' + _out.breakpoints[m].bp + ' > *'
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutbottoms.push({
                        val: round(_inbreakpointi.base * j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gutbot + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutbottoms.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutbot + 's-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutbottoms.push({
                        val: round(j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gutbot + 's-' + j + 'px' + _out.breakpoints[m].bp + ' > *'
                    });
                }



                // Guts Margin
                gutsmargin.push({
                    val: -round(_inbreakpointi.base, _in.decimalPlaces) + 'px',
                    selector: '.' + _out.ns + _out.gut + 's' + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutsmargin.push({
                        val: -round(_inbreakpointi.base * j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutsmargin.push({
                            val: -round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gut + 's-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutsmargin.push({
                        val: -round(j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'px' + _out.breakpoints[m].bp
                    });
                }



                // Guts Margin All
                gutsmarginall.push({
                    val: '',
                    selector: '.' + _out.ns + _out.gut + 's' + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutsmarginall.push({
                        val: '',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutsmarginall.push({
                            val: '',
                            selector: '.' + _out.ns + _out.gut + 's-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutsmarginall.push({
                        val: '',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'px' + _out.breakpoints[m].bp
                    });
                }



                // Guts Padding
                gutspadding.push({
                    val: round(_inbreakpointi.base, _in.decimalPlaces) + 'px',
                    selector: '.' + _out.ns + _out.gut + 's' + _out.breakpoints[m].bp + ' > *'
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutspadding.push({
                        val: round(_inbreakpointi.base * j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutspadding.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gut + 's-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutspadding.push({
                        val: round(j, _in.decimalPlaces) + 'px',
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'px' + _out.breakpoints[m].bp + ' > *'
                    });
                }



                // Guts Padding All
                gutspaddingall.push({
                    val: val,
                    selector: '.' + _out.ns + _out.gut + 's' + _out.breakpoints[m].bp + ' > *'
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutspaddingall.push({
                        val: val,
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutspaddingall.push({
                            val: val,
                            selector: '.' + _out.ns + _out.gut + 's-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp + ' > *'
                        });
                    }
                }
                for (j = 1; j < nGutsPX; j += 1) {
                    gutspaddingall.push({
                        val: val,
                        selector: '.' + _out.ns + _out.gut + 's-' + j + 'px' + _out.breakpoints[m].bp + ' > *'
                    });
                }



                // Gut Lefts
                gutlefts.push({
                    val: _inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.gutleft + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutlefts.push({
                        val: _inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.gutleft + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutlefts.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutleft + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                gutlefts.push(
                    {
                        val: '0',
                        selector: '.' + _out.ns + _out.gutleft + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxsmall + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutsmall + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxmedium + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutmedium + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxlarge + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutlarge + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxxlarge + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutxlarge + _out.breakpoints[m].bp
                    }
                );



                // Gut Rights
                gutrights.push({
                    val: _inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.gutright + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutrights.push({
                        val: _inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.gutright + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutrights.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutright + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                gutrights.push(
                    {
                        val: '0',
                        selector: '.' + _out.ns + _out.gutright + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxsmall + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutrightsmall + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxmedium + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutrightmedium + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxlarge + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutrightlarge + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * (_in.gutnxxlarge + 1) + 'px',
                        selector: '.' + _out.ns + _out.gutrightxlarge + _out.breakpoints[m].bp
                    }
                );



                // Gut Bottoms
                gutbottoms.push({
                    val: _inbreakpointi.base + 'px',
                    selector: '.' + _out.ns + _out.gutbot + _out.breakpoints[m].bp
                });
                for (j = 1; j < nGutsWhole; j += 1) {
                    gutbottoms.push({
                        val: _inbreakpointi.base * j + 'px',
                        selector: '.' + _out.ns + _out.gutbot + '-' + j + 'x' + _out.breakpoints[m].bp
                    });
                }
                for (j = 1; j < nGutsFraction; j += 1) {
                    for (k = 1; k < j; k++) {
                        gutbottoms.push({
                            val: round(_inbreakpointi.base * k / j, _in.decimalPlaces) + 'px',
                            selector: '.' + _out.ns + _out.gutbot + '-' + k + 'o' + j + 'x' + _out.breakpoints[m].bp
                        });
                    }
                }
                gutbottoms.push(
                    {
                        val: '0',
                        selector: '.' + _out.ns + _out.gutbot + '-none' + _out.breakpoints[m].bp
                    }
                );



                // Pull Gut Lefts
                pullgutlefts.push(
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-small' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-medium' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-large' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-xlarge' + _out.breakpoints[m].bp
                    }
                );
                pullgutleftwidths.push(
                    {
                        val: 'auto',
                        selector: '.' + _out.ns + _out.pullgut + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxsmall + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-small' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxmedium + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-medium' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxlarge + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-large' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxxlarge + 'px',
                        selector: '.' + _out.ns + _out.pullgut + '-xlarge' + _out.breakpoints[m].bp
                    }
                );



                // Pull Gut Rights
                pullgutrights.push(
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-small' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-medium' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-large' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-xlarge' + _out.breakpoints[m].bp
                    }
                );
                pullgutrightwidths.push(
                    {
                        val: 'auto',
                        selector: '.' + _out.ns + _out.pullgutright + '-none' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxsmall + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-small' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxmedium + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-medium' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxlarge + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-large' + _out.breakpoints[m].bp
                    },
                    {
                        val: _inbreakpointi.base * _in.gutnxxlarge + 'px',
                        selector: '.' + _out.ns + _out.pullgutright + '-xlarge' + _out.breakpoints[m].bp
                    }
                );



            }

            // Process the base dependent rules
            hidegutlefts = processRules(hidegutlefts);
            gutsfws = processRules(gutsfws);
            gutbottoms = processRules(gutbottoms);
            gutsmargin = processRules(gutsmargin);
            gutsmarginall = processRules(gutsmarginall);
            gutspadding = processRules(gutspadding);
            gutspaddingall = processRules(gutspaddingall);
            gutlefts = processRules(gutlefts);
            gutrights = processRules(gutrights);
            pullgutlefts = {more:processRules(pullgutlefts), core:[]};
            pullgutleftwidths = pullgutleftwidths;
            pullgutrights = {more:processRules(pullgutrights), core: []};
            pullgutrightwidths = pullgutrightwidths;
            gutbottoms = processRules(gutbottoms);
            maxwidths = processRules(maxwidths);
            widthpx = processRules(widthpx);
            widthspx = processRules(widthspx);
            heights = processRules(heights);
            // ords = ords;



            // Not dependent on base
            pullgutlefts.main = processRules([
                {
                    selector: '.' + _out.ns + _out.pullgut + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgut + '-none' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgut + '-small' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgut + '-medium' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgut + '-large' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgut + '-xlarge' + _outbreakpointi.bp
                }
            ]);
            pullgutlefts.none = {
                selector: '.' + _out.ns + _out.pullgut + '-none' + _outbreakpointi.bp
            };
            pullgutlefts.legacy = {
                selector: '.' + _out.ns + _out.pullgut + _outbreakpointi.bp
            };
            pullgutrights.main = processRules([
                {
                    selector: '.' + _out.ns + _out.pullgutright + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgutright + '-none' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgutright + '-small' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgutright + '-medium' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgutright + '-large' + _outbreakpointi.bp
                },
                {
                    selector: '.' + _out.ns + _out.pullgutright + '-xlarge' + _outbreakpointi.bp
                }
            ]);
            pullgutrights.none = {
                selector: '.' + _out.ns + _out.pullgutright + '-none' + _outbreakpointi.bp
            };
            pullgutrights.legacy = {
                selector: '.' + _out.ns + _out.pullgutright + _outbreakpointi.bp
            };
            _outbreakpointi.innguthides = hidegutlefts;
            _outbreakpointi.gutsfws = gutsfws;
            _outbreakpointi.gutbottoms = gutbottoms;
            _outbreakpointi.gutsmargin = gutsmargin;
            _outbreakpointi.gutsmarginall = gutsmarginall;
            _outbreakpointi.gutspadding = gutspadding;
            _outbreakpointi.gutspaddingall = gutspaddingall;
            _outbreakpointi.gutlefts = gutlefts;
            _outbreakpointi.gutrights = gutrights;
            _outbreakpointi.pullgutlefts = pullgutlefts;
            _outbreakpointi.pullgutleftwidths = pullgutleftwidths;
            _outbreakpointi.pullgutrights = pullgutrights;
            _outbreakpointi.pullgutrightwidths = pullgutrightwidths;
            _outbreakpointi.gutbottoms = gutbottoms;
            _outbreakpointi.maxwidths = maxwidths;
            _outbreakpointi.widthpx = widthpx;
            _outbreakpointi.widthspx = widthspx;
            // _outbreakpointi.ords = ords;
            if (_in.heightClasses > 0) {
                _outbreakpointi.heights = heights;
            }


            // gutter
            _outbreakpointi.gutters = [];
            for (j = 1; j < 13; j += 1) {
                isnotfirst = (j > 1) ? 1 : 0;
                isforlay = (j < 7) ? 1 : 0;
                _outbreakpointi.gutters.push({
                    base: _inbreakpointi.base * j,
                    halfbase: round(_inbreakpointi.base * j / 2, _in.decimalPlaces),
                    i: j,
                    isnotfirst: isnotfirst,
                    isforlay: isforlay
                });
            }



            // basex
            for (j = 1; j < 13; j += 1) {
                _outbreakpointi['base'+j] = _inbreakpointi.base * j;
            }


        }

        _out.legacysupport = _in.legacysupport;
        _out.layoutclasses = _in.layoutClasses;
        _out.copyclasses = _in.copyClasses;
        _out.positionclasses = _in.positionClasses;



        // Form outputs
        // Alternative breakpoints based on base
        _out.formBaseBasedBPs = [];
        for (i = 1; i < 8; i += 1) {
            _out.formBaseBasedBPs.push((_in.base * ((i * 12) - 1)) + _in.scrollbardepthadjust);
        }
        // MaxWidths
        _out.formMaxWidths = [];
        for (i = 1; i < 8; i += 1) {
            _out.formMaxWidths.push((_in.base * ((i * 12) - 1)));
        }
        // Add maxwidths from breakpoints
        for (i = 1; i < _in.breakpointsLength; i += 1) {
            _out.formMaxWidths.push(_in.breakpoints[i].at * 1);
        }
        _out.formMaxWidthBP = maxwidthbps.slice(1);
        _out.formMaxWidthBP = '0,' + _out.formMaxWidthBP.join(',');


        // Demo
        _out.demo = {lays:[]};
        for (j = 1; j <= _in.columns; j += 1) {
            _out.demo.lays.push({j:j,isPrime:false,columns:[]});
            if (j === 2 ||
                j === 3 ||
                j === 5 ||
                j === 7 ||
                j === 11 ||
                j === 13 ||
                j === 17 ||
                j === 19 ||
                j === 23 ||
                j === 29 ||
                j === 31 ||
                j === 37 ||
                j === 41 ||
                j === 43 ||
                j === 47
            ) {
                _out.demo.lays[j-1].isPrime = true;
            }
            for (k = 0; k < j; k += 1) {
                _out.demo.lays[j-1].columns.push({});
            }
        }


        stream.trigger('makeoutputs');

        return;

    };

    makePayloads = function() {

        // Render outputs
        _payload.css = Mustache.render(_in.templates.css, _out);
        _payload.js = Mustache.render(_in.templates.js, _out);
        _payload.demo = Mustache.render(_in.templates.demo, _out.demo);

        stream.trigger('makepayloads');

        return;

    };

    makeDeliveries = function() {

        // Textarea outputs
        $(_selectors.css).val(trim(_payload.css));
        $(_selectors.js).val(trim(_payload.js));
        resizeOutput($(_selectors.css)[0]);
        resizeOutput($(_selectors.js)[0]);


        // Head element outputs
        $(_selectors.headcss).html(trim(_payload.css));
        $(_selectors.headjs).html(trim(_payload.js));

        // Form
        $(_selectors.maxWidths).val(_out.formMaxWidths);
        $(_selectors.maxWidthsBP).val(_out.formMaxWidthBP);
        $(_selectors.baseBasedBPs).val(_out.formBaseBasedBPs);

        // Demo
        $(_selectors.demo).html(_payload.demo);

        stream.trigger('makedeliveries');

        return;

    };


    trim = function(str) {

        return str.replace(/^\s+/, '').replace(/\s+$/, '');

    };

    processRules = function(rules) {

        var i,
            val,
            selector,
            a = {},
            b = [];

        for (i in rules) {

            if (rules.hasOwnProperty(i)) {

                val = rules[i].val;
                selector = rules[i].selector;

                if (a[val] === undefined) {
                    a[val] = {val:val, selector:selector};
                    b.push(a[val]);
                }
                else {
                    a[val].selector += ',' + "\n" + selector;
                }
            }

        }

        return b;

    };


    makeWidthClasses = function(o) {

        var i = 1,
            j,
            width,
            widths = {},
            output = {widths:[], widthsall: []},
            columns = o.columns,
            fractions;

        // Create an object where the properties are widths and the values are an array of objects with numerators and denominators
        for (i; i <= columns; i += 1) {
            j = 1;
            for (j; j <= columns; j += 1) {
                width = round(100*i/j, _in.decimalPlaces);
                if (width <= 100) {
                    if (!widths[width]) {
                        widths[width] = [];
                    }
                    widths[width].push({
                        numerator:i,
                        denominator:j,
                        isnotfirst:true
                    });
                }
                output.widthsall.push({
                    numerator:i,
                    denominator:j,
                    isnotfirst:true,
                    isfirstWidth:false
                });
            }
        }

        output.widthsall[0].isnotfirst = false;
        output.widthsall[0].isfirstWidth = true;

        for (i in widths) {

            if (widths.hasOwnProperty(i)) {

                fractions = widths[i];
                fractions[0].isnotfirst = false;
                output.widths.push({
                    fractions: widths[i],
                    value: i
                });
            }

        }

        return output;

    };

    makePositionClasses = function(o) {

        var i = 1,
            j,
            positions = {},
            position,
            output = [],
            columns = o.columns,
            isnotveryfirst = false,
            fractions;

        // Create an object where the properties are widths and the values are an array of objects with numerators and denominators
        for (i; i <= o.columns; i += 1) {
            j = 1;
            for (j; j <= columns; j += 1) {
                position = round(100*(i-1)/j, _in.decimalPlaces);
                if (position < 100) {
                    if (!positions[position]) {
                        positions[position] = [];
                    }
                    positions[position].push({
                        numerator:i,
                        denominator:j,
                        isnotfirst:true,
                        isnotveryfirst:isnotveryfirst
                    });
                    isnotveryfirst = true;
                }
            }
        }
        // Create the position classes
        if (_in.positionClasses) {
            for (i in positions) {
                if (positions.hasOwnProperty(i)) {
                    fractions = positions[i];
                    fractions[0].isnotfirst = false;
                    output.push({
                        fractions: positions[i],
                        value: i,
                        valueinteger: round(i, 0) -50 // -50 to 50
                    });
                }
            }
        }

        return output;

    };


    makeHeadingMargins = function(base, lineHeights, copyfontsizepx) {

        var out = {},
            height,
            h,
            i,
            bottom,
            paddingTop,
            use,
            x;

        for (i = 1; i < 7; i++) {

            h = 'h' + i;

            if(_in.hadj === 'px') {
                bottom = _in[h + 'adj'];
            }
            else {
                bottom = _in[h + 'adj'] * base;
            }



            height = (copyfontsizepx * _in[h] * lineHeights[h]);

            paddingTop = ((_in[h + 'nx'] - 1) * base) - height - bottom;
            // - base used to account for margin bottom of base on paragraphs etc.

            //if (paddingTop < base) {
            //    paddingTop = paddingTop - base;
            //}

            out[h] = {
                paddingTop: paddingTop,
                bottom: bottom
            };

        }

        return out;

    };

    resizeOutput = function(el) {
    	if (el.scrollHeight !== undefined && el.clientHeight !== undefined) {
			el.style.height = "1px";
			el.style.height = el.scrollHeight +"px";
			el.style.height = el.scrollHeight + el.scrollHeight - el.clientHeight + 'px';
		}

    };

    round = function(num, decimalPlaces) {

        var scaler = Math.pow(10, decimalPlaces);
        return Math.floor(num * scaler)/scaler;

    };

//    updateGutters = function() {
//        // for each breakpoint, except 0, add the max width and a
//        // lower and higher value based on the gutter width
//        var i
//        ,   base = ''
//        ,   gutter
//        ,   at
//        ,   breakpoints = $('.form-breakpoint')
//        ;
//
//        for (i = 0; i < _in.breakpointsLength; i += 1) {
//            gutter = _in.breakpoints[i].basex * _in.base;
//            breakpoints.eq(i).find('.input-gutter').val(gutter);
//        }
//    };



    inputChange = function() {

        clearTimeout(_tid.inputChange);
        _tid.inputChange = setTimeout(redraw, 1);

    };

    inputBaseChange = function() {
        inputBasesxChange();
    };
    inputBasesxChange = function() {

        var multipliers = [];

        clearTimeout(_tid.inputBasesxChange);

        $(_selectors.inputs.basesx).each(function() {
            multipliers.push($(this).val());
        });
        $(_selectors.bases).each(function(i) {
            var $this = $(this);
            $this.val(multipliers[i] * $(_selectors.inputs.base).val());
        });

        _tid.inputBasesxChange = setTimeout(redraw, 1);

    };
    inputBasesChange = function() {

        var bases = [];

        clearTimeout(_tid.inputBasesChange);

        $(_selectors.bases).each(function() {
            bases.push($(this).val());
        });
        $(_selectors.inputs.basesx).each(function(i) {
            var $this = $(this);
            $this.val(bases[i] / $(_selectors.inputs.base).val());
        });

        _tid.inputBasesChange = setTimeout(redraw, 1);

    };

    breakpointAdd = function(o) {
        var last = $(_selectors.formbreakpoint).last(),
            lastIndex = last.index(),
            next;
        last.after(last.clone(1));
        next = last.next();
        next.find('td:first').text(lastIndex);
        next.find(_selectors.inputs.at).prop('disabled', false);
        if (o === undefined || o.redraw === true) {
            redraw();
        }
        return false;
    };
    makeSettingsForURI = function() {

        var uri,i,val;

        uri = '';

        for (i in _selectors.inputs) {
            if (_selectors.inputs.hasOwnProperty(i)) {
                if (i === 'at' || i === 'basesx') {
                    val = '';
                    $(_selectors.inputs[i]).each(function() {
                        val += ',' + $(this).val();
                    });
                    val = val.slice(1);
                    uri += '&' + i + '=' + val;
                }
                else if (i === 'positionClasses' || i === 'legacysupport' || i === 'layoutClasses' || i === 'copyClasses') {
                    uri += '&' + i + '=' + $(_selectors.inputs[i]).prop('checked');
                }
                else {
                    uri += '&' + i + '=' + $(_selectors.inputs[i]).val();
                }
            }
        }
        return '?' + uri.slice(1);
    };
    getSettingsFromURI = function() {

        var uri,i,selector,at,atLength,basesx;

        uri = window["github.com/davesmiths/uri-js"].parse(window.location.href);

        if (uri.params.at !== undefined) {

            at = uri.params.at.split(',');
            atLength = at.length;
            basesx = uri.params.basesx.split(',');

            $(_selectors.formbreakpoint).slice(1).remove();
            for (i = 1; i < atLength; i++) {
                breakpointAdd({redraw:false});
            }

            $(_selectors.formbreakpoint).each(function(i) {
                $(this).find(_selectors.inputs.at).val(at[i]);
                $(this).find(_selectors.inputs.basesx).val(basesx[i]);
            });
        }

        for (i in _selectors.inputs) {
            if (_selectors.inputs.hasOwnProperty(i) && i !== 'at' && i !== 'basesx') {
                selector = _selectors.inputs[i];
                if (uri.params[i] !== undefined) {
                    if (i === 'positionClasses' || i === 'legacysupport' || i === 'layoutClasses' || i === 'copyClasses') {
                        $(selector).prop('checked', uri.params[i] === 'true');
                    }
                    else {
                        $(selector).val(decodeURIComponent(uri.params[i]));
                    }
                }
            }
        }
    };

    init = function() {

        getSettingsFromURI();

        $(_selectors.formbreakpoint).slice(1).append('<td class="form-breakpoint-remove"><span tabindex="-1">x</span></td>').parent().find('tr:first').append('<th>Remove</th>');

        inputBaseChange();

        _out.uriPermalink = makeSettingsForURI();
        if (window.history.replaceState !== undefined) {
            window.history.replaceState(null, null, _out.uriPermalink);
        }

    };

    redraw = function() {
        makeInputs();
    };

    // Event stream handling
    stream.on('loadtemplates', function() {
        stream.trigger('makeinputs');
    });
    stream.on('makeinputs', function() {
        makeOutputs();
        makePayloads();
        makeDeliveries();
    });

    $(document)
        .on('change', function(e) {

            var $t = $(e.target)
            ;

            _out.uriPermalink = makeSettingsForURI();
            if (window.history.replaceState !== undefined) {
                window.history.replaceState(null, null, _out.uriPermalink);
            }

            // On change of various input
            if (
                $t.is(_selectors.inputs.decimalPlaces) ||
                $t.is(_selectors.inputs.positionClasses) ||
                $t.is(_selectors.inputs.layoutClasses) ||
                $t.is(_selectors.inputs.copyClasses) ||
                $t.is(_selectors.inputs.heights) ||
                $t.is(_selectors.inputs.at) ||
                $t.is(_selectors.inputs.columns) ||
                $t.is(_selectors.inputs.ns) ||
                $t.is(_selectors.inputs.legacysupport) ||
                $t.is(_selectors.inputs.gutnxsmall) ||
                $t.is(_selectors.inputs.gutnxmedium) ||
                $t.is(_selectors.inputs.gutnxlarge) ||
                $t.is(_selectors.inputs.gutnxxlarge) ||
                $t.is(_selectors.inputs.scrollbardepthadjust) ||
                $t.is(_selectors.inputs.fontSize) ||
                $t.is(_selectors.inputs.hfont) ||
                $t.is(_selectors.inputs.hweight) ||
                $t.is(_selectors.inputs.copyfont) ||
                $t.is(_selectors.inputs.copyweight) ||
                $t.is(_selectors.inputs.h1) ||
                $t.is(_selectors.inputs.h2) ||
                $t.is(_selectors.inputs.h3) ||
                $t.is(_selectors.inputs.h4) ||
                $t.is(_selectors.inputs.h5) ||
                $t.is(_selectors.inputs.h6) ||
                $t.is(_selectors.inputs.hadj) ||
                $t.is(_selectors.inputs.h1adj) ||
                $t.is(_selectors.inputs.h2adj) ||
                $t.is(_selectors.inputs.h3adj) ||
                $t.is(_selectors.inputs.h4adj) ||
                $t.is(_selectors.inputs.h5adj) ||
                $t.is(_selectors.inputs.h6adj) ||
                $t.is(_selectors.inputs.h1nx) ||
                $t.is(_selectors.inputs.h2nx) ||
                $t.is(_selectors.inputs.h3nx) ||
                $t.is(_selectors.inputs.h4nx) ||
                $t.is(_selectors.inputs.h5nx) ||
                $t.is(_selectors.inputs.h6nx)
            ) {
                inputChange();
            }

            else if ($t.is(_selectors.inputs.base)) {
                inputBaseChange();
            }
            else if ($t.is(_selectors.inputs.basesx)) {
                inputBasesxChange();
            }
            else if ($t.is(_selectors.bases)) {
                inputBasesChange();
            }



        })
        .on('click', function(e) {

            var $t = $(e.target),
                rtn = true;

            if ($t.is(_selectors.breakpointadd)) {
                breakpointAdd();
                if (window.history.replaceState !== undefined) {
                    window.history.replaceState(null, null, makeSettingsForURI());
                }
                rtn = false;
            }
            else if ($t.closest(_selectors.formbreakpointremove).length) {
                $t.closest('tr').remove();
                inputChange();
                if (window.history.replaceState !== undefined) {
                    window.history.replaceState(null, null, makeSettingsForURI());
                }
                rtn = false;
            }

            return rtn;
        })
        .on('submit', function(e) {
            var $t = $(e.target),
                rtn = true;

            if ($t.not('input[type="submit"]')) {
                rtn = false;
            }
            return rtn;
        })
        .on('radiotab-opened', function() {
            resizeOutput($(_selectors.css)[0]);
            resizeOutput($(_selectors.js)[0]);
        })
        .ready(init);


}(this));


$(function() {

    var radiotab,
        $tabs,
        panels,
        tabs,
        i;

    radiotab = 'radiotab';
    $tabs = $('[data-' + radiotab + ']');
    panels = {};
    tabs = {};

    $tabs.each(function() {
        var $this,
            group;
        $this = $(this);
        group = $this.data(radiotab);
        tabs[group] = tabs[group] || $([]);
        tabs[group] = tabs[group].add($this);
        panels[group] = panels[group] || $([]);
        panels[group] = panels[group].add($($(this).attr('href')));
    });
    for (i in panels) {
        if (panels.hasOwnProperty(i)) {
            $(panels[i]).slice(1).hide();
        }
    }
    $tabs.on('click', function(e) {

        var group;

        e.preventDefault();

        group = $(this).data(radiotab);

        panels[group].hide();

        $($(this).attr('href')).show().trigger(radiotab + '-opened');

    });
});
