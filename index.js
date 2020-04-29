const Observe = function () {
    let __message = {};
    return {
        //注册消息接口
        on: function (type, fn) {
            if (typeof __message[type] === 'undefined') {
                __message[type] = [fn];
            } else {
                __message[type].push(fn);
            }
        },
        //移除消息接口
        off: function (type, fn) {
            if (__message[type] instanceof Array) {
                let i = __message[type].length - 1;
                for (; i >= 0; i--) {
                    __message[type][i] === fn && __message[type].splice(i, 1);
                }
            }
        },
        //发布消息接口
        subscribe: function (type, data) {
            if (!__message[type]) return;
            let events = data, i = 0, len = __message[type].length;   // 执行队列长度
            //遍历执行函数
            for (; i < len; i++) {
                //依次执行注册消息对应的方法
                __message[type][i].call(this, events)
            }
            if (type === 'beforeUpload') {
                return __message.beforeUpload[0]();
            }
        }
    }
};
window.GoodiesUploader = function (el, options) {
    this.fileList = [];
    this.options = options;
    const content = `
    <div id="drapUpWrap" class="goodies-upload__wrap">
        <div class="goodies-upload__container">
            <div id="drapInputWrap">
                <input id="drapInputFile" type="file" class="goodies-upload__input" />
            </div>
            <div class="goodies-upload__dragger">
                <i class="iconfont icon-upload"></i>
                <div class="text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
        </div>
        <div class="goodies-upload__tip" style="display: ${this.options.note ? 'block' : 'none'};">${this.options.note}</div>
        <ul class="goodies-upload-list" id="drapUpList" style="display: none;"></ul>
    </div>`;
    el.innerHTML = content;
    let file = {}; // upload file
    let status = 0; // upload status: 0 not upload 1 before upload 2 uploading 3 uploaded -1 faild upload
    const drapUpWrap = document.getElementById("drapUpWrap");
    const drapInputWrap = document.getElementById("drapInputWrap");
    const drapInputFile = document.getElementById("drapInputFile");
    const drapUpList = document.getElementById("drapUpList");
    const drapContainer = document.querySelector('.goodies-upload__container');
    let listIndex = 0;
    this.ObserveEvent = Observe();
    // methods
    this.onChangeFile = (uploadFile, index) => {
        file = uploadFile;
        const result = this.ObserveEvent.subscribe('beforeUpload', file);
        if (result === false) {
            return false;
        }
        drapUpList.setAttribute("style", "display: block;");
        drapUpList.innerHTML = drapUpList.innerHTML + `
        <li id="listIndex${index}" class="goodies-upload-list__item has-progressbar" title="${file.name}">
            <div class="goodies-uploadlist__item-name">
                <i class="iconfont icon-document"></i>${file.name}
            </div>
            <div class="goodies-upload-list__item-status-label">
                <i class="iconfont icon-checked"></i>
                <i class="iconfont icon-close"></i>
            </div>
            <div class="goodies-upload-progress-bar">
                <div class="goodies-upload-progress-bar__outer">
                    <div class="goodies-upload-progress-bar__inner" style="width: 0%;"></div>
                </div>
                <div class="goodies-upload--progress__text">0%</div>
            </div>
        </li>
        `
        this.fileList.push(file);
        listIndex++;
        // upload file
        let formData = new FormData();
        formData.append(options.name || 'file', file);
        if (options.data && typeof options.data === 'object') {
            for (let key in options.data) {
                formData.append(key, options.data[key]);
            }
        }
        let request = new XMLHttpRequest();
        request.open("POST", this.options.action, true);
        const nodeList = document.querySelectorAll('.goodies-upload-list__item');
        if (nodeList.length > 0) {
            for (let node of nodeList) {
                node.querySelector('.icon-close').addEventListener('click', (event) => {
                    drapUpList.removeChild(node);
                    drapInputWrap.innerHTML = "";
                    let fileList = [];
                    if (this.fileList.length > 0) {
                        for (let item of this.fileList) {
                            if (item.name != node.getAttribute('title')) {
                                fileList.push(item);
                            }
                        }
                    }
                    this.fileList = fileList;
                    if (request) request.abort();
                    setTimeout(() => {
                        drapInputWrap.innerHTML = `<input id="drapInputFile" type="file" class="goodies-upload__input" />`;
                        document.getElementById("drapInputFile").addEventListener("change", (event) => {
                            onChangeFile(event.target.files[0], listIndex);
                        })
                    }, 500);
                })
            }
        }
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
            if (options.success) options.success(response, file, this.fileList);
            // Clean up request
            request = null;
        }
        // Handle low level network errors
        request.onerror = () => {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            // TODO
            if (options.error) options.error(file, this.fileList);
            // Clean up request
            request = null;
        };
        // Not all browsers support upload events
        if (request.upload) {
            request.upload.addEventListener('progress', (event) => {
                const listItem = document.getElementById(`listIndex${index}`);
                var percentCompleted = Math.round((event.loaded * 100) / event.total);
                const inner = listItem.querySelector('.goodies-upload-progress-bar .goodies-upload-progress-bar__outer .goodies-upload-progress-bar__inner');
                const text = listItem.querySelector('.goodies-upload-progress-bar .goodies-upload--progress__text');
                inner.setAttribute('style', `width: ${percentCompleted}%`);
                text.innerHTML = `${percentCompleted}%`;
                if (percentCompleted === 100) {
                    listItem.setAttribute('class', 'goodies-upload-list__item');
                }
            });
        }
        request.send(formData);
    }
    // listeners
    drapUpWrap.addEventListener("dragover", (event) => {
        event.preventDefault();
        drapContainer.setAttribute('class', 'goodies-upload__container is-dragover');
    });
    drapUpWrap.addEventListener("dragleave", (event) => {
        event.preventDefault();
        drapContainer.setAttribute('class', 'goodies-upload__container');
    })
    drapUpWrap.addEventListener("drop", (event) => {
        event.preventDefault();
        drapContainer.setAttribute('class', 'goodies-upload__container');
        this.onChangeFile(event.dataTransfer.files[0], listIndex);
    });
    drapInputFile.addEventListener("change", (event) => {
        this.onChangeFile(event.target.files[0], listIndex);
    });
}