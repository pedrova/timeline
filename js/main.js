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
            var todaysDate = new Date();
            var oneDayInMilliseconds = 1000 * 3600 * 24;
            var oneHourInMilliseconds = 1000 * 3600;
            var oneMinuteInMilliseconds = 1000 * 60;
            var howLong = "";

            // get JSON contents and add on the page
            $.each(data.items, function(index, item) {
                $('.timeline').find("ul").append(
                    '<li id="li_' + offset + index + '"><div>' +
                    '<span class="image" style="background-image: url(' + item.cover_image + ')"></span>' +
                    '<span><h4>' + item.contents.title + '<span class="howlong" id="howlong_'+ offset + index +'"></span></h4></span>' +
                    '<span>' + item.contents.preamble + '</span>' +
                    '</div></li>'
                );

                articleDate = new Date(item.meta.created);
                displayDate = articleDate.getDate() + ' ' + monthNames[articleDate.getMonth()];

                // check how long ago the article was written
                var timeDiff = Math.abs(todaysDate.getTime() - articleDate.getTime());
                var diffDays = Math.floor(timeDiff / oneDayInMilliseconds);
                var diffHours = Math.floor(timeDiff / oneHourInMilliseconds);
                var diffMinutes = Math.floor(timeDiff / oneMinuteInMilliseconds);

                if (diffMinutes >= 60) {
                    if (diffHours >= 24) {
                        if (diffDays >= 1) {
                            if (diffDays == 1) {
                                howLong = diffDays + " dag siden";
                            } else {
                                howLong = diffDays + " dager siden";
                            }
                        }
                    } else {
                        if (diffHours == 1) {
                            howLong = diffHours + " time";
                        } else {
                            howLong = diffHours + " timer";
                        }
                    }
                } else {
                    howLong = diffMinutes + " min";
                }

                $("#howlong_" + offset + index).text(howLong);

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