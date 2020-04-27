const vm = new Vue({
    el: '#app',
    mounted() {
        this.$nextTick(() => {
            dragUploader.Upload({
                action: 'https://jsonplaceholder.typicode.com/posts/',
                ruleText: '只能上传jpg/png文件，且不超过500kb',
                beforeUpload: (file) => {
                    return true;
                },
                success: (res, file, fileList) => {
                    console.log(res);
                },
                error: (res) => {
                    console.log(res);
                }
            }).render(document.getElementById('uploader'));
        })
    },
})