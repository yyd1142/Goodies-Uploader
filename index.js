window.fileUploader = (id, op) => {
    const el = document.getElementById(id);
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('id', 'de-uploader');
    el.appendChild(input);
    input.addEventListener("change", function (e) {
        const file = e.target.files[0];
        //创建formdata对象
        const formdata = new FormData();
        formdata.append("file", file);
        const xhr = new XMLHttpRequest();
        xhr.open("post", op.action);
        //回调
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                op.success(xhr);
            }
        }
        //将formdata上传
        xhr.send(formdata);
    })
}