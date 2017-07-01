(function() {
    $(function() {
        var urlArticles = "https://zooom.no/api/v1/articles/havornreiret?limit=10&offset=0";
        var urlChannels = "https://zooom.no/api/v1/channels";

        // Get Articles
        // TODO: Add ajax on fail
        $.ajax({
            url: urlArticles,
            type: "GET",
            dataType: "jsonp"
        }).done(function(data) {
            console.log(data);
            var listTags = [];
            var images = [];
            var headings = [];
            var texts = [];

            // get JSON contents
            $.each(data.items, function (index, item) {
                listTags.push("<li><div></div></li>");
                images.push('<span class="image" style="background-image: url('+item.cover_image+')"></span>');
                headings.push("<span><h3>"+item.contents.title+"</h3></span>");
                texts.push("<span>"+item.contents.preamble+"</span>");
            });

            // Add elements on the page
            $('.timeline').find("ul").append( listTags.join('') );
            $("li > div").each(function(index){
                $( this ).append(images[index]);
                $( this ).append(headings[index]);
                $( this ).append(texts[index]);
            });
        });

        // Get Channels
        // TODO: Add ajax on fail
        $.ajax({
            url: urlChannels,
            type: "GET",
            dataType: "jsonp"
        }).done(function(data) {
            console.log(data);
            var listTags = [];
            var images = [];

            // get JSON contents
            var active = 'class="active"';
            $.each(data.items, function (index, item) {
                listTags.push('<li ' + active + ' style="background-image: url('+item.cover_image+')"></li>');
                active = '';
                images.push('<a class="link" href="#" data-toggle="pill">'+item.channel.name+'</a>');
                if (index > 1) {
                    return false;
                }
            });

            // Add elements on the page
            $('.navbar-header').find("ul").append( listTags.join('') );
            $("li").each(function(index){
                $( this ).append(images[index]);
            });
        });

        $("nav").on("click", ".link", function() {
            console.log($( this ));
        });
    });
})();