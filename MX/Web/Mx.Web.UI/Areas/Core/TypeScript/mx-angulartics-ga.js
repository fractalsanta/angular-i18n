angular.module('App')
    .config([
    '$analyticsProvider', 'Core.Constants', function (analyticsProvider, constants) {
        if (!window.ga) {
            return;
        }
        _.forIn(constants.GoogleAnalyticsAccounts, function (id, name) {
            window.ga('create', id, 'auto', { 'name': name });
        });
        analyticsProvider.settings.trackRelativePath = true;
        analyticsProvider.registerPageTrack(function (path) {
            if (_.keys(constants.GoogleAnalyticsAccounts).length == 0) {
                return;
            }
            _.forIn(constants.GoogleAnalyticsAccounts, function (id, name) {
                window.ga(name + '.send', 'pageview', path);
            });
        });
        analyticsProvider.registerEventTrack(function (action, properties) {
            if (_.keys(constants.GoogleAnalyticsAccounts).length == 0) {
                return;
            }
            if (properties.value) {
                var parsed = parseInt(properties.value, 10);
                properties.value = isNaN(parsed) ? 0 : parsed;
            }
            if (properties.noninteraction) {
                _.forIn(constants.GoogleAnalyticsAccounts, function (id, name) {
                    window.ga(name + '.send', 'event', properties.category, action, properties.label, properties.value, { nonInteraction: 1 });
                });
            }
            else {
                _.forIn(constants.GoogleAnalyticsAccounts, function (id, name) {
                    window.ga(name + '.send', 'event', properties.category, action, properties.label, properties.value);
                });
            }
        });
    }]);
