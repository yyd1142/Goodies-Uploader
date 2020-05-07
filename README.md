# Goodies-Uploader
GoodiesUploader is an open source library that provides drag’n’drop file uploads.

## Installing

Using npm:

```bash
$ npm install goodies-uploader
```

Using jsDelivr CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/goodies-uploader@1.0.5/dist/goodies-uploader.css">
<script src="https://cdn.jsdelivr.net/npm/goodies-uploader@1.0.5/dist/goodies-uploader.js"></script>
```

Using unpkg CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/goodies-uploader@1.0.5/dist/goodies-uploader.css">
<script src="https://unpkg.com/goodies-uploader@1.0.5/dist/goodies-uploader.js"></script>
```

## Example

> **NOTE:** goodies-uploader is now activated and available as `window.GoodiesUploader`.
> This is all you need to get goodies-uploader up and running, but if you want it to look like the demo on this page, you’ll need to use the `goodies-uploader.css` in the dist folder.

```html
<div id="uploader"></div>
```

```js
import 'goodies-uploader/dist/goodies-uploader';
var uploader = new GoodiesUploader('#uploader', { action: 'http://172.16.2.20:10086/upload/' });
```

## Configuration options

Option | Description | Type | Default
| :-----| :-----|:-----|:-----|
action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 必选参数，上传的地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | String&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | - -
headers | 设置上传的请求头部 | Object | - -
name | 上传的文件字段名 | String | `file`
data | 上传时附带的额外参数 | Object | - -
tip | 提示说明文字 | String | - -
multiple | 是否支持多选文件 | Boolean | `false`
disabled | 是否禁用 | Boolean | `false`

## Events

`beforeUpload` 上传文件之前的钩子，参数为上传的文件，若返回`false`则停止上传。

```js
uploader.on('beforeUpload', function (file) {
    if (file.name.indexOf('.jpg') === -1 && file.name.indexOf('.png') === -1) {
        console.log('上传文件格式仅支持jpg、png。')
        return false;
    } else {
        return true;
    }
});
```

`success` 文件上传成功时的钩子。返回值: `{ response, file, fileList }`

```js
uploader.on('success', function (res) {
    console.log(res);
});
```

`error` 文件上传失败时的钩子。返回值: `{ file, fileList }`

```js
uploader.on('error', function (res) {
    console.log(res);
});
```

## Try it Yourself

[Demo](https://unpkg.com/goodies-uploader@1.0.5/examples/index.html)




