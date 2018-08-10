// Highlight the current page in the menu
$(document).ready(function () {
    var pageUrl = window.location.pathname;
    var selectedPage = $('a[href*="' + pageUrl.substring(7) + '"]');

    selectedPage.addClass('selected');
});

// google analytics:
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37023398-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();