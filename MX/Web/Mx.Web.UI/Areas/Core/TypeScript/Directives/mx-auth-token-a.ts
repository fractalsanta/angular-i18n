module Core {
    "use strict";

    var AuthenticationTokenName = "AuthToken";

    class MxAuthTokenA implements ng.IDirective {
        constructor(
            $authService: Core.Auth.IAuthService
            ) {
            return <ng.IDirective> {
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
                    element.on("click", (e) => {
                        var authToken = $authService.GetAuthToken();
                        var href = element.attr("href");

                        if (href.indexOf("?") != -1) {
                            if (href.indexOf(AuthenticationTokenName) != -1) {
                                var queryString = href.slice(href.indexOf("?") + 1).split("&");
                                for (var i = 0; i < queryString.length; i++) {
                                    var pair = queryString[i].split("=");
                                    if (decodeURIComponent(pair[0]) == AuthenticationTokenName) {
                                        href = href.replace(AuthenticationTokenName + "=" + pair[1], AuthenticationTokenName + "=" + authToken);
                                    }
                                }
                            } else {
                                href += "&" + AuthenticationTokenName + "=" + authToken;
                            }
                        } else {
                            href += "?" + AuthenticationTokenName + "=" + authToken;
                        }

                        element.attr("href", href);
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxAuthTokenA", MxAuthTokenA, Core.Auth.$authService);
}