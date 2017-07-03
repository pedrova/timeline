(function() {
    $(function() {
        var urlArticles = "https://zooom.no/api/v1/articles/havornreiret?limit=10&offset=0";
        var urlChannels = "https://zooom.no/api/v1/channels";

        // Get Articles
        // TODO: Add ajax on fail
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
                    '<li id="li_' + index + '"><div>' +
                    '<span class="image" style="background-image: url(' + item.cover_image + ')"></span>' +
                    '<span><h3>' + item.contents.title + '</h3></span>' +
                    '<span>' + item.contents.preamble + '</span>' +
                    '</div></li>'
                );

                articleDate = new Date(item.meta.created);
                displayDate = articleDate.getDate() + ' ' + monthNames[articleDate.getMonth()];

                // Add dates in li::after pseudo-element
                if (displayDate === previousDate) {
                    $("#li_" + index).addClass("samedate");
                    return true;
                }
                $("#li_" + index).attr('data-content', displayDate);
                previousDate = displayDate;
            });
        });

        // Get Channels
        // TODO: Add ajax on fail
        $.get({
            url: urlChannels,
            dataType: "jsonp"
        }).done(function(data) {
            var active = 'class="active"';

            // get JSON contents and add on the page
            $.each(data.items, function (index, item) {
                $('.navbar-header').find("ul").append(
                    '<li id="navli_' + index + '" ' + active + ' style="background-image: url(' + item.cover_image + ')"></li>'
                );
                active = '';
                $( "#navli_" + index).append(
                    '<a class="link" href="#" data-toggle="pill">' + item.channel.name + '</a>'
                );
                if (index > 1) {
                    return false;
                }
            });
        });

        $("nav").on("click", ".link", function() {
            //console.log($( this ));
        });
    });
})();