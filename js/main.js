(function() {
    $(function() {
        var urlChannels = "https://zooom.no/api/v1/channels";
        // Get Channels
        $.get({
            url: urlChannels,
            dataType: "jsonp"
        }).done(function(data) {
            var active = 'class="active"';
            var hide = '';
            var mobileHide = 'class="hide"';

            // get JSON contents and add on the page
            $.each(data.items, function (index, item) {
                // Mobile Dropdown
                $('.dropdown-menu').append(
                    '<li ' + mobileHide + ' id="dropdownli_' + index + '" role="presentation">' +
                    '<a class="link" role="menuitem" tabindex="-1" href="#" data-value="' + item.channel.urlSafeName + '">' +
                    item.channel.name +
                    '</a></li>'
                );
                mobileHide = '';
                if (index === 0) {
                    $(".dropdown").find('.btn').html(item.channel.name + ' <span class="caret"></span>');
                }
                $("#dropdownli_" + index + " a").click(function() {
                    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
                    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
                });
                $(".ddimage").append(
                    '<span ' + hide + ' id="ddimage_' + item.channel.urlSafeName +
                    '" style="background-image: url(' + item.cover_image + ')"></span>'
                );
                hide = 'class="hide"';

                // Desktop/Tablet Navbar
                $('#navbar').find("ul").append(
                    '<li id="navli_' + index + '" ' + active +
                    ' style="background-image: url(' + item.cover_image + ')"></li>'
                );
                active = '';
                $( "#navli_" + index).append(
                    '<a class="link" href="#" data-value="' + item.channel.urlSafeName + '" data-toggle="pill">' +
                    item.channel.name + '</a>'
                );
                if (index > 1) {
                    return false;
                }
            });
        });

        $("nav").on("click", ".link", function() {
            var urlSafeName = $(this).data( "value" );
            $("#channel").val(urlSafeName);
            $("#offset").val(1);
            getArticles(urlSafeName, true, 0);
        });

        $(".dropdown-menu").on("click", ".link", function() {
            var urlSafeName = $(this).data( "value" );
            $(".dropdown-menu li").removeClass("hide");
            $(this).parent().addClass("hide");
            $(".ddimage span").removeClass("show").addClass("hide");
            $("#ddimage_" + urlSafeName).removeClass("hide").addClass("show");
            $("#channel").val(urlSafeName);
            $("#offset").val(1);
            getArticles(urlSafeName, true, 0);
        });

        getArticles("havornreiret", false, 0);

        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                var urlSafeName = $("#channel").val();
                var offset = parseInt($("#offset").val(), 10);
                if (offset < 10) {
                    // limit to 10 times the user can scroll to bottom and load more articles
                    getArticles(urlSafeName, false, offset);
                    $("#offset").val(offset+1);
                }
            }
        });
    });

    function getArticles(urlSafeName, empty, offset) {
        if (empty) {
            $(".timeline ul").empty();
        }
        var urlArticles = "https://zooom.no/api/v1/articles/" + urlSafeName + "?limit=10&offset=" + offset;

        $.get({
            url: urlArticles,
            dataType: "jsonp"
        }).done(function(data) {
            var articleDate = "";
            var monthNames = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
            var displayDate = "";
            var previousDate = "";

            // get JSON contents and add on the page
            $.each(data.items, function(index, item) {
                $('.timeline').find("ul").append(
                    '<li id="li_' + offset + index + '"><div>' +
                    '<span class="image" style="background-image: url(' + item.cover_image + ')"></span>' +
                    '<span><h3>' + item.contents.title + '</h3></span>' +
                    '<span>' + item.contents.preamble + '</span>' +
                    '</div></li>'
                );

                articleDate = new Date(item.meta.created);
                displayDate = articleDate.getDate() + ' ' + monthNames[articleDate.getMonth()];

                // Add dates in li::after pseudo-element
                if (displayDate === previousDate) {
                    $("#li_" + offset + index).addClass("samedate");
                    return true;
                }
                $("#li_" + offset + index).attr('data-content', displayDate);
                previousDate = displayDate;
            });
        });
    }
})();