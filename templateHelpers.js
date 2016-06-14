import FileCollection from 'meteor/universe:files';
import {__} from 'meteor/universe:i18n-blaze';
import {Template} from 'meteor/templating';
import {Tracker} from 'meteor/tracker';
import Dropzone from 'dropzone';


Template.registerHelper('getImageURL', getImageUrl);

Template.registerHelper('getAvatarURL', function (field, size = '') {
    return getImageUrl(field, size) || '/images/default_avatar.jpg';
});

Template.registerHelper('getFileURL', function (field) {
    let path;
    if (typeof field === 'string') {
        path = field;
    } else {
        path = field && field.path;
    }
    return path ? FileCollection.getFullFileUrl(path) : '/404';
});

function getImageUrl (field, size = '') {
    size = typeof size === 'string' ?  size : '';
    let path;
    if (typeof field === 'string') {
        path = field;
    } else {
        path = field && field.path;
    }
    return path? FileCollection.getFullImageUrl(path, size) : '';
}

Tracker.autorun(() => Object.assign(Dropzone.prototype.defaultOptions, __('universe:files-blaze-ui.dropzoneMsgs')));