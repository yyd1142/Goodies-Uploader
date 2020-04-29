# Goodies-Uploader
GoodiesUploader is an open source library that provides drag’n’drop file uploads.

## Installing

```bash
$ npm install goodies-uploader
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/goodiesUploader/dist/goodiesUploader.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/goodiesUploader/dist/goodiesUploader.min.js"></script>
```

## Example

> **NOTE:** goodiesUploader is now activated and available as window.goodiesUploader.
> This is all you need to get goodiesUploader up and running, but if you want it to look like the demo on this page, you’ll need to use the index.css in the dist folder.

```html
<div id="uploader"></div>
```

```js
goodiesUploader.Upload({
    action: 'http://172.16.2.20:10086/upload/',
    ruleText: 'Only jpg/png files can be uploaded, and no more than 500kb',
    success: (res, file, fileList) => {
        console.log(res.data);
    },
    error: (file, fileList) => {
        console.log(fileList);
    }
}).render(document.getElementById('uploader'));
```

## goodiesUploader API

