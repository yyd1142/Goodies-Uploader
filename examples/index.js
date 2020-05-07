
var vm = new Vue({
    el: '#app',
    mounted() {
        this.$nextTick(function () {
            var uploader = new GoodiesUploader('#uploader', {
                action: 'http://172.16.2.20:10086/upload/',
                tip: '上传文件格式仅支持jpg、png。 文件大小不得大于5Mb',
                multiple: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=gb2312"
                }
            });
            uploader.on('beforeUpload', function (file) {
                if (file.name.indexOf('.jpg') === -1 && file.name.indexOf('.png') === -1) {
                    console.log('上传文件格式仅支持jpg、png。')
                    return false;
                } else {
                    return true;
                }
            });
            uploader.on('success', function (res) {
                console.log(res);
            });
            uploader.on('error', function (res) {
                console.log(res);
            });
        })
    },
})