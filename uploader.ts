var dragUploader = {
    Upload: (options: any) => {
        let file: any = {};
        return {
            render: (el) => {
                const content = `
                <div id="drapUpWrap" class="drag-up__wrap">
                    <div class="drag-up__container">
                        <input id="drapInputFile" type="file" class="drag-up__input" />
                        <div class="drag-up__dragger">
                            <i class="iconfont icon-upload"></i>
                            <div class="text">将文件拖到此处，或<em>点击上传</em></div>
                        </div>
                    </div>
                    <div class="drag-up__tip" style="display: ${options.ruleText ? 'block' : 'none'};">${options.ruleText}</div>
                    <ul class="drag-up-list" id="drapUpList" style="display: none;"></ul>
                </div>
                `;
                el.innerHTML = content;
                const drapUpWrap = document.getElementById("drapUpWrap");
                const drapInputFile = document.getElementById("drapInputFile");
                const drapUpList = document.getElementById("drapUpList");
                const drapContainer = document.querySelector('.drag-up__container');
                const onChangeFile = (uploadFile: any) => {
                    file = uploadFile;
                    const continueUpload = options.beforeUpload(file);
                    if (continueUpload === false) {
                        return false;
                    }
                    drapUpList.setAttribute("style", "display: block;");
                    drapUpList.innerHTML = `
                    <li class="drag-up-list__item" title="${file.name}">
                        <div class="drag-uplist__item-name">
                            <i class="iconfont icon-document"></i>${file.name}
                        </div>
                        <div class="el-upload-list__item-status-label">
                            <i class="iconfont icon-checked"></i>
                            <i class="iconfont icon-close"></i>
                        </div>
                    </li>
                    `
                    let formData = new FormData();
                    formData.append('file', file);
                    if (options.data && typeof options.data === 'object') {
                        for (let key in options.data) {
                            formData.append(key, options.data[key]);
                        }
                    }
                    let request = new XMLHttpRequest();
                    request.open("POST", options.action, true);
                    request.onreadystatechange = () => {
                        if (!request || request.readyState !== 4) {
                            return;
                        }
                        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                            return;
                        }
                        // Prepare the response
                        var responseData = request.response ? JSON.parse(request.response) : '';
                        var response = {
                            data: responseData,
                            status: request.status,
                            statusText: request.statusText,
                            request: request
                        };
                        options.success(response, file, []);
                        // Clean up request
                        request = null;
                    }
                    // Handle low level network errors
                    request.onerror = () => {
                        // Real errors are hidden from us by the browser
                        // onerror should only fire if it's a network error
                        options.error(`Network Error.`);
                        // Clean up request
                        request = null;
                    };
                    request.send(formData);
                }
                drapUpWrap.addEventListener("dragover", (event: any) => {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container is-dragover');
                });
                drapUpWrap.addEventListener("dragleave", (event: any) => {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container');
                })
                drapUpWrap.addEventListener("drop", (event: any) => {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container');
                    onChangeFile(event.target.files[0]);
                });
                drapInputFile.addEventListener("change", (event: any) => {
                    onChangeFile(event.target.files[0]);
                });
            }
        }
    }
}