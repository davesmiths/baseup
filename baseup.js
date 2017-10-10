/*
// BaseUp JS
*/


// Legacy browser support requires jQuery to work

(function($){

    'use strict';
    // isIE
    /* github.com/davesmiths/isIE */var isIE=false,isIEmode;/*@cc_on isIE=@_jscript_version;@*/if(isIE!==false){if(isIE==5.8)isIE=8;else if(isIE==5.7 && window.XMLHttpRequest)isIE=7;else if(isIE==5.7 || isIE==5.6)isIE=6;else if(isIE<=5.5)isIE=5;isIEmode=isIE;if(document.documentMode)isIEmode=document.documentMode;}


    $.fn.baseUp = function(o) {

        /*
        //  - Fix for .clear to work when placed after positional floats in IE 6 and 7
        //    - Note clear must not have hasLayout triggered otherwise the fix will fail
        //    - Note Positional floats can also be cleared with a wrapping .lay element
        */
        if (o.legacySupportClear) {
            if (isIE == 7 || isIE == 6) {
                return this.each(function() {
                    var $this = $(this);
                    if ($this.find('> .baseup-legacy-support-clear-a').length === 0) {
                        $this.prepend('<div class="baseup-legacy-support-clear-a"></div><div class="baseup-legacy-support-clear-b"></div>');
                    }
                });
            }
        }

        /*
        //  - Fix for .lay .lay-left, lay-right and .lay-centered to ensure positional
        //    floats display as expected in IE 6
        */
        if (o.legacySupportLay) {
            if (isIE == 6) {
                return this.each(function() {
                    var $this = $(this);
                    if ($this.find('> .baseup-legacy-support-lay').length === 0) {
                        $this.html('<div class="baseup-legacy-support-lay">'+$this.html()+'</div>');
                    }
                });
            }
        }

        if (o.legacySupportCols) {

            // For IE 6 at the mo, but really it's whether child selector is supported
            if (isIE == 6) {
                this.each(function() {

                    var $cols,$this,val,valLength;

                    $cols = $this = $(this);

                    // Cols classes
                    if ($this.find('> .baseup-legacy-support-lay').length) {
                        $cols = $this.find('> .baseup-legacy-support-lay');
                    }

                    $cols.find('> *').not('.clear').each(function() {
                        $(this).addClass('col');
                    });


                    // Widths classes
                    // Copies the class div.widths-blah or div.widths-blah-Nup, renames to width-blah or width-blah-Nup and applies to all children except with .clear class or those already with a width class
                    val = $this.attr('class').match(/\s?widths-[0-9a-z-]+/g);
                    if (val) {
                        valLength = val.length;
                        // Get the last set widths class if more than one is set
                        for (i = 0; i < valLength; i++) {
                            val[i] = val[i].replace('widths', 'width');
                            if ((m = val[i].match(/([0-9]+)up$/))) {
                                val[i] = {bp: m[1], val: val[i]};
                            }
                            else {
                                val[i] = {bp: 0, val: val[i]};
                            }

                        }

                        $cols.find('> *').not('.clear').each(function() {
                            var $this,className,bp;

                            $this = $(this);
                            className = $this.attr('class');

                            for (i = 0; i < valLength; i++) {
                                bp = val[i].bp + 'up';
                                if (val[i].bp === 0) {
                                    bp = '';
                                }
                                if (!className.match(new RegExp("/\s?width-[0-9a-z]+"+bp+"/g"))) {
                                    $this.addClass(val[i].val);
                                }
                            }
                        });
                    }

                });

            }
            return this;

        }
    };

    // Engage legacy support
    $(function() {
        $('.clear').baseUp({legacySupportClear:true});
        $('.lay, .lay-left, .lay-right, .lay-centered').baseUp({legacySupportLay:true});
        $('.cols').baseUp({legacySupportCols:true});
    });

    // If flex is not supported, then we want to engage float positions
    (function() {

        var flexsupported,display;

        flexsupported = false;

        // document.documentElement.style.backgroundColor = 'red';

        try {

            display = document.documentElement.style.display;

            document.documentElement.style.display = 'flex';
            if (document.documentElement.style.display === 'flex') {
                //supported
                flexsupported = true;
                // document.documentElement.style.backgroundColor = 'green';
            }
            else {
                document.documentElement.style.display = '-webkit-flex';
                if (document.documentElement.style.display === '-webkit-flex') {
                    //supported
                    flexsupported = true;
                    // document.documentElement.style.backgroundColor = 'green';
                }
            }

            document.documentElement.style.display = display;

        }
        // Catch required for some versions of IE
        catch (e) {

        }

        if (!flexsupported) {
            document.documentElement.className += ' baseup-noflex';
        }

    }());


    // Provide means to create a sensible max-width for browsers that don't support media queries

    // https://raw.githubusercontent.com/paulirish/matchMedia.js/master/matchMedia.js
    /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

    window.matchMedia || (window.matchMedia = function() {

        // For browsers that support matchMedium api such as IE 9 and webkit
        var styleMedia = (window.styleMedia || window.media);

        // For those that don't support matchMedium
        if (!styleMedia) {
            var style       = document.createElement('style'),
                script      = document.getElementsByTagName('script')[0],
                info        = null;

            style.type  = 'text/css';
            style.id    = 'matchmediajs-test';

            script.parentNode.insertBefore(style, script);

            // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
            info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

            styleMedia = {
                matchMedium: function(media) {
                    var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                    // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                    if (style.styleSheet) {
                        style.styleSheet.cssText = text;
                    } else {
                        style.textContent = text;
                    }

                    // Test if media query is true or false
                    return info.width === '1px';
                }
            };
        }

        return function(media) {
            return {
                matches: styleMedia.matchMedium(media || 'all'),
                media: media || 'all'
            };
        };
    }());

    if (!window.matchMedia('(min-width:400px)').matches) {

        (function() {

            var bp,bps,i,clientWidth;

            if (document.documentElement && document.documentElement.clientWidth) {

                bps = [];
                clientWidth = document.documentElement.clientWidth;

                bps[0] = 0;bps[1] = 700;bps[2] = 940;bps[3] = 1180;

                bp = 0;
                for (i = 1; i < bps.length; i += 1) {
                    if (bps[i] >= clientWidth) {
                        break;
                    }
                    bp = i;
                }

                document.documentElement.className += ' baseup-legacy-bp-' + bp;

            }

        }());

    }


}(jQuery));
