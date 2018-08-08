<h1 align="center">
    <a href="https://github.com/vazco">vazco</a>/Universe Files Blaze UI
</h1>

&nbsp;

<h3 align="center">
  -- Abandonware. This package is deprecated! --
</h3>

&nbsp;

## Using as standalone

### for file:

```html
<template name="myFile">
     {{> universeUploadButton name='file' value=doc.avatar class='img-circle'}}
 </template>
```

```js
Template.myFile.events({
    fileUploaded (e, tmpl, result) {
        console.log('uploaded', result);
    },
    fileError (e, tmpl, error) {
         console.error('uploaded', error);
    }
});
```

### for image:

```html
<template name="myImage">
     {{> universeUploadButton name='image' isImage=true value=doc.avatar class='img-circle'}}
 </template>
```

- parameter isImage=true will activate making sizes for uploaded image (default: small, medium, large)

```js
Template.myImage.events({
    fileUploaded (e, tmpl, result) {
        console.log('uploaded', result);
    },
    fileError (e, tmpl, error) {
         console.error('uploaded', error);
    }
});
```

### for avatar:

```html
<template name="myAvatar">
     {{> universeAvatar name='avatar' value=doc.avatar class='img-circle'}}
 </template>
```

```js
Template.myAvatar.events({
    fileUploaded (e, tmpl, result) {
        console.log('uploaded', result);
    },
    fileError (e, tmpl, error) {
         console.error('uploaded', error);
    }
});
```

## Using with AutoForms

### for file:

```js
import {getFileSchemaField} from 'meteor/universe:files-blaze-ui';
// adding to schema:
const mySchema = new SimpleSchema(Object.assign({
        title: {
            type: String
        }
    },
    getFileSchemaField({
        name: 'file',
        isImage: false
    })
));
```

```html
<template name="myTemplate">
    {{#autoForm schema=getSchema id="myForm"}}
        {{> afQuickField name='title'}}
        {{> afQuickField name='file' class='img-circle' label=false}}
        <button type="submit">Submit</button>
    {{/autoForm}}
</template>
```

### for avatar

```js
import {getFileSchemaField} from 'meteor/universe:files-blaze-ui';
// adding to schema:
const mySchema = new SimpleSchema(Object.assign({
        title: {
            type: String
        }
    },
    getAvatarSchemaField({
        name: 'logo'
    })
));
```

```html
<template name="myTemplate">
    {{#autoForm schema=getMySchema id="myLogo"}}
        {{> afQuickField name='title'}}
        {{> afQuickField name='logo'  label=false}}
        <button type="submit">Submit</button>
    {{/autoForm}}
</template>
```

## License

<img src="https://vazco.eu/banner.png" align="right">

**Like every package maintained by [Vazco](https://vazco.eu/), Universe Files Blaze UI is [MIT licensed](https://github.com/vazco/uniforms/blob/master/LICENSE).**
