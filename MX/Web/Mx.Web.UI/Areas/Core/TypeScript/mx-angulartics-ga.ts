/**
 * @license Angulartics v0.15.18
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * Universal Analytics update contributed by http://github.com/willmcclellan
 * License: MIT
 */

/* Enable analytics support for Google Analytics in angulartics.js */

interface Window {
    ga: any;
}

angular.module('App')
    .config([
        '$analyticsProvider', 'Core.Constants', (analyticsProvider, constants: Core.IConstants)=> {

            if (!window.ga) {
                return;
            }

            // create tracking objects
            _.forIn(constants.GoogleAnalyticsAccounts, (id, name) => {
                window.ga('create', id, 'auto', { 'name': name });
            });

            analyticsProvider.settings.trackRelativePath = true;

            analyticsProvider.registerPageTrack((path) => {

                if (_.keys(constants.GoogleAnalyticsAccounts).length == 0) {
                    return;
                }
                _.forIn(constants.GoogleAnalyticsAccounts, (id, name)=> {
                    window.ga(name + '.send', 'pageview', path);
                });
            });


            /* Track Event in GA
             * @name eventTrack
             *
             * @param {string } action Required 'action'(string) associated with the event
             * @param {object } properties Comprised of the mandatory field 'category'(string) and optional  fields 'label'(string), 'value'(integer) and 'noninteraction'(boolean)
             *
             * @link https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
             *
             * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
             */
            analyticsProvider.registerEventTrack((action, properties)=> {

                if (_.keys(constants.GoogleAnalyticsAccounts).length == 0) {
                    return;
                }

                // GA requires that eventValue be an integer, see:
                // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
                // https://github.com/luisfarzati/angulartics/issues/81
                if (properties.value) {
                    var parsed = parseInt(properties.value, 10);
                    properties.value = isNaN(parsed) ? 0 : parsed;
                }

                if (properties.noninteraction) {
                    _.forIn(constants.GoogleAnalyticsAccounts, (id, name)=> {
                        window.ga(name + '.send', 'event', properties.category, action, properties.label, properties.value, { nonInteraction: 1 });
                    });
                } else {
                    _.forIn(constants.GoogleAnalyticsAccounts, (id, name)=> {
                        window.ga(name + '.send', 'event', properties.category, action, properties.label, properties.value);
                    });
                }
            });
        }]);
