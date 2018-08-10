function unloadBodyAndLogout(logOffUrl) {
    $('body').unload();
    location.replace(logOffUrl);
}