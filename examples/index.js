
const vm = new Vue({
    el: '#app',
    mounted() {
        this.$nextTick(() => {
            const options = {
                action: 'http://172.16.2.20:10086/upload/',
                note: '只能上传jpg/png文件，且不超过500kb',
            }
            const myUploader = new GoodiesUploader(document.getElementById('uploader'), options);
            myUploader.ObserveEvent.on('beforeUpload', function (file) {
                return true;
            })
            // goodiesUploader.Upload({
            //     action: 'http://172.16.2.20:10086/upload/',
            //     ruleText: '只能上传jpg/png文件，且不超过500kb',
            //     success: (res, file, fileList) => {
            //         console.log(res.data);
            //     },
            //     error: (file, fileList) => {
            //         console.log(fileList);
            //     }
            // }).render(document.getElementById('uploader'));
        })
    },
})