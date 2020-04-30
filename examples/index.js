
var vm = new Vue({
    el: '#app',
    mounted() {
        this.$nextTick(function () {
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
        })
    },
})