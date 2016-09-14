import addStateToTemplate from 'meteor/cristo:state-in-templates';
import FileCollection from 'meteor/universe:files';
import {Template} from 'meteor/templating';
import {Blaze} from 'meteor/blaze';
import jQuery from 'jquery';
import Dropzone from 'dropzone';
import 'dropzone/dist/basic.css';
import {ACCEPTED_IMAGES, DEFAULT_FILESIZE} from '../exports.js';
const {AutoForm} = Package['aldeed:autoform'] || {};

addStateToTemplate(Template.universeAvatar);
addStateToTemplate(Template.afUniverseAvatar);

Template.universeAvatar.onRendered(function () {
    this.autorun(() => {
        const data = Template.currentData() || {};
        const {name = 'avatar', previewTemplateName = 'cropModalFile', disabledCropper = false,
            acceptedFiles = ACCEPTED_IMAGES, maxFilesize = DEFAULT_FILESIZE} = data;
        const url = FileCollection.getUploadingUrl(true);
        if (this.dropZone) {
            this.dropZone.destroy();
        }

        this.dropZone = new Dropzone('div.js-avatar-zone', {
            url,
            paramName: name,
            autoProcessQueue: false,
            uploadMultiple: disabledCropper,
            maxFiles: 1,
            maxFilesize,
            headers: {
                'Cache-Control': null,
                'X-Requested-With': null
            },
            acceptedFiles,
            previewTemplate: Blaze.toHTMLWithData(Template[previewTemplateName], data)
        });

        if (!disabledCropper) {
            this.dropZone.on('addedfile', file => {
                triggerEvent(this, 'fileAdded', name, file, this.dropZone);
                if (!file.isCropped) {
                    const reader = new FileReader();
                    reader.onloadend = () => showModal(reader.result, this.dropZone, file);
                    reader.readAsDataURL(file);
                }
            });
        }

        this.dropZone.on('success', (file, res) => {
            let ret;
            try {
                ret = EJSON.parse(res);
            } catch (e) {
                ret = e;
            }
            if (ret && ret[name] && !ret[name].error) {
                if (triggerEvent(this, 'fileUploaded', name, ret[name], file, this.dropZone, res)) {
                    preloadImage(ret[name], () => {
                        this.state.set('result', ret[name]);
                        this.dropZone.removeFile(file);
                        this.state.set('progress', 0);
                    });
                }
            } else {
                if(triggerEvent(this, 'fileError', name, ret && ret[name], file, this.dropZone, res)){
                    this.dropZone.removeFile(file);
                    this.state.set('progress', 0);
                }
            }
        });

        this.dropZone.on('error', (file, err, res) => {
            if(triggerEvent(this, 'fileError', name, err, file, this.dropZone, res)){
                this.dropZone.removeFile(file);
                this.state.set('progress', 0);
            }
        });

        this.dropZone.on('uploadprogress', (file, progress) => this.state.set('progress', parseInt(progress)));
    });

});

Template.universeAvatar.helpers({
    getFieldName () {
        const data = Template.currentData() || {};
        return data.name || 'avatar';
    },
    getUrl () {
        const tmpl = Template.instance();
        const {value} = tmpl.data || {};
        const res = tmpl.state.get('result') || {};
        const tmplPath = res.path || (value && value.path );
        if (tmplPath) {
            return FileCollection.getFullFileUrl(tmplPath);
        }
        return '';
    }
});

function showModal (src, dropZone, file) {
    Blaze.renderWithData(Template.cropModal, {src, dropZone, file}, document.body)
}

function triggerEvent (tmpl, type, fieldName, ...params) {
    var event = jQuery.Event(type);
    Object.assign(event, {type, fieldName});
    $(tmpl.firstNode).trigger(event, params);
    return !event.isDefaultPrevented();
}


if (AutoForm) {
    const {SimpleSchema} = Package['aldeed:simple-schema'];
    SimpleSchema.messages({
        'uploadingError': '[value]'
    });
    AutoForm.addInputType('universe-avatar', {
        template: 'afUniverseAvatar',
        valueOut () {
            const {state} = Blaze.getView(this[0]).templateInstance();
            return state ? state.get('result') : undefined;
        }
    });
    Template.afUniverseAvatar.events({
        fileError (e, t, error) {
            const id = t.$(e.target).closest('form').attr('id');
            const {noStickyErrors, name} = t.data || {};
            if (id && !noStickyErrors) {
                const vc = AutoForm.getValidationContext(id);
                if (vc) {
                    vc.resetValidation();
                    vc.addInvalidKeys([
                        {name , type: 'uploadingError', value: error.reason || error.message || error}
                    ]);
                }
            }
        },
        fileUploaded (e,t) {
            const id = t.$(e.target).closest('form').attr('id');
            if (id) {
                const vc = AutoForm.getValidationContext(id);
                vc && vc.resetValidation();
            }
        }
    });
}

function preloadImage ({path}, cb) {
    try {
        const preLoadedImg = new Image();
        preLoadedImg.onload = cb;
        preLoadedImg.onerror = cb;
        preLoadedImg.onabort = cb;
        preLoadedImg.src = FileCollection.getFullFileUrl(path);
    } catch (e) {
        cb();
    }
}
