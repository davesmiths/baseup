
(function($) {

    'strict';

    var dom_ready,filter_class_a,filter_class_bc,filter_class_all,$main;


    // Actions
    make_it_so = function() {

        var html,$filters_placeholder,address,fragment;

        html = '';
        address = window.location.href;

        html += '<p>Filters: ';
        html += '<a href="" class="filter-class-all">All</a> ';
        html += '<a href="#class-a" class="filter-class-a">Class A Browsers</a> ';
        html += '<a href="#class-afw" class="filter-class-afw">Class A Browsers Full-Width Friendly</a> ';
        html += '<a href="#class-b" class="filter-class-b">Class B Browsers</a> ';
        html += '</p>';

        $filters_placeholder = $('.filters-placeholder').html(html);

        $main = $('main');

        fragment = address.match(/\#[a-zA-Z-]+$/g);

        if (fragment) {
            if (fragment[0] == '#class-a') {
                filter_class_a();
            }
            else if (fragment[0] == '#class-b') {
                filter_class_b();
            }
            else if (fragment[0] == '#class-afw') {
                filter_class_afw();
            }
        }

    };

    classes = 'a b afw';

    filter_class_a = function() {
        $main.removeClass(classes).addClass('a');
    };
    filter_class_b = function() {
        $main.removeClass(classes).addClass('b');
    };
    filter_class_afw = function() {
        $main.removeClass(classes).addClass('afw');
    };
    filter_class_all = function() {
        $main.removeClass(classes);
    };


    // Event Stream Handling

    // Dom Ready Event
    $(make_it_so);

    // Document Click Events
    $(document).on('click', function(e) {

       var $el;

       $el = $(e.target);

       if ($el.is('.filter-class-a')) {
            filter_class_a();
       }
       else if ($el.is('.filter-class-b')) {
            filter_class_b();
       }
       else if ($el.is('.filter-class-afw')) {
            filter_class_afw();
       }
       else if ($el.is('.filter-class-all')) {
            filter_class_all();
       }

       return true;

    });

}(jQuery));
