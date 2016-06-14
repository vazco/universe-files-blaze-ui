import {Template} from 'meteor/templating';
import {Blaze} from 'meteor/blaze';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

Template.cropModal.onRendered(function(){
    this.$modal = this.$('.js-crop-modal');
    this.$modal.modal('show');
});

Template.cropModal.events({
    'shown.bs.modal .js-crop-modal' (e, tmpl) {
        tmpl.cropper = new Cropper(tmpl.find('img'), {aspectRatio: 1});
    },
    'click .js-save' (e, {data, cropper, $modal}) {
        const {dropZone, file} = data;
        dropZone.removeAllFiles();
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => {
                blob.name = file.name;
                blob.isCropped = true;
                dropZone.addFile(blob);
                dropZone.processQueue();
                cropper.destroy();
            }, file.type);
        }
        $modal.modal('hide');
    },
    'click .js-cancel' (e, {cropper, data}) {
        const {dropZone, file} = data;
        file.isCropped = true;
        dropZone.processQueue();
        cropper && cropper.destroy();
    },
    'hidden.bs.modal' (e, tmpl) {
        Blaze.remove(tmpl.view)
    }
});

if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}