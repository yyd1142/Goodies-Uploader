# Goodies-Uploader
GoodiesUploader is an open source library that provides drag’n’drop file uploads.

## Installing

Using npm:

```bash
$ npm install goodies-uploader
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/goodies-uploader@1.0.3/dist/goodies-uploader.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/goodies-uploader@1.0.3/dist/goodies-uploader.js"></script>
```

## goodies-uploader Example

> **NOTE:** goodies-uploader is now activated and available as `window.GoodiesUploader`.
> This is all you need to get goodies-uploader up and running, but if you want it to look like the demo on this page, you’ll need to use the `theme.css` in the dist folder.

```html
<div id="uploader"></div>
```

```js
import GoodiesUploader from 'goodies-uploader/dist/goodies-uploader';

var uploader = new GoodiesUploader('#uploader', { action: 'http://172.16.2.20:10086/upload/' });
uploader.on('beforeUpload', function (file) {
    console.log(file);
    return true;
});
uploader.on('success', function (res) {
    console.log(res);
});
uploader.on('error', function (res) {
    console.log(res);
});
```

## goodies-uploader API

