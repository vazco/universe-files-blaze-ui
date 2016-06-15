Package.describe({
    summary: 'Views for universe:files with upload buttons and cropping avatar functionality',
    name: 'universe:files-blaze-ui',
    version: '0.1.2'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use([
        'ecmascript', 'templating', 'less@1.0.0||2.0.0', 'random', 'ejson',
        'cristo:auto-install-npm@0.0.5', 'reactive-var', 'universe:i18n-blaze@1.5.1',
        'universe:collection@2.3.9', 'universe:files@1.0.4', 'universe:i18n@1.6.0', 'tracker',
        'cristo:state-in-templates@1.0.3', 'aldeed:simple-schema@1.5.3'
    ]);

    api.use('aldeed:autoform@5.5.0', 'client', {weak: true});

    api.addFiles([
        'en.i18n.yml',
        'templateHelpers.js',
        'crop/cropModalFile.html',
        'crop/cropModal.html',
        'crop/cropModal.js'
    ], 'client');

    api.addFiles([
        'avatar/editableAvatar.html',
        'avatar/editableAvatar.less',
        'avatar/editableAvatar.js'
    ], 'client');

    api.addFiles([
        'uploadButton/uploadButton.html',
        'uploadButton/uploadButton.js'
    ], 'client');

    api.mainModule('exports.js');

});
