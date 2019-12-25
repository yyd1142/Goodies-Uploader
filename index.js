function fileUploader(id, op) {
    const el = document.getElementById(id);
    const mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'esay-uploader-main');
    el.appendChild(mainDiv);

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('class', 'esay-uploader-input');
    input.setAttribute('id', 'esay-uploader');
    mainDiv.appendChild(input);
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
    });

    const button = document.createElement('div');
    button.setAttribute('class', 'esay-uploader-button');
    button.innerHTML = op.buttonText || '上传文件';
    mainDiv.appendChild(button);
    // this.success = () => op.success(xhr);
}