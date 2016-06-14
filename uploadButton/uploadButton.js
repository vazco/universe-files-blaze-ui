import {Template} from 'meteor/templating';
import {EJSON} from 'meteor/ejson';
import {ACCEPTED_IMAGES, DEFAULT_FILESIZE, ACCEPTED_FILES} from '../exports.js';
import Dropzone from 'dropzone';
import FileCollection from 'meteor/universe:files';
import addStateToTemplate from 'meteor/cristo:state-in-templates';
import 'dropzone/dist/basic.css';
const {AutoForm} = Package['aldeed:autoform'] || {};

addStateToTemplate(Template.universeUploadButton);

Template.universeUploadButton.bindI18nNamespace('universe:files-blaze-ui');

Template.universeUploadButton.onRendered(function () {
    this.autorun(() => {
        const data = Template.currentData() || {};
        const {name = 'file', previewTemplateName = '_universeUploadButton_preview', isImage = false} = data;
        let {acceptedFiles, maxFilesize = DEFAULT_FILESIZE} = data;

        if (!acceptedFiles) {
            acceptedFiles = isImage ? ACCEPTED_IMAGES : ACCEPTED_FILES;
        }
        const options = {
            url: FileCollection.getUploadingUrl(isImage),
            paramName: name,
            uploadMultiple: false,
            maxFilesize,
            acceptedFiles,
            previewTemplate: Blaze.toHTMLWithData(Template[previewTemplateName], data)
        };
        if (this.dropZone) {
            this.dropZone.destroy();
        }
        this.dropZone = new Dropzone(this.firstNode, options);

        this.dropZone.on('addedfile', file => triggerEvent(this, 'fileAdded', name, file, this.dropZone));

        this.dropZone.on('success', (file, res) => {
            let ret;
            try {
                ret = EJSON.parse(res);
            } catch (e) {
                ret = e;
            }
            if (ret && ret[name] && !ret[name].error) {
                if (triggerEvent(this, 'fileUploaded', name, ret[name], file, this.dropZone, res)) {
                    this.state.set('result', ret[name]);
                    this.dropZone.removeFile(file);
                    this.state.set('progress', 0);
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


function triggerEvent (tmpl, type, fieldName, ...params) {
    var event = jQuery.Event(type);
    Object.assign(event, {type, fieldName});
    $(tmpl.firstNode).trigger(event, params);
    return !event.isDefaultPrevented();
}

if (AutoForm) {
    AutoForm.addInputType('universe-upload-button', {
        template: 'afUniverseUploadButton',
        valueOut () {
            const {state} = Blaze.getView(this[0]).templateInstance();
            return state ? state.get('result') : undefined;
        }
    });
    Template.afUniverseUploadButton.events({
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
