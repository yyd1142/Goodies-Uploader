window.GoodiesUploader = class GoodiesUploader {
    constructor(el, options) {
        this.$el = document.querySelector(el);
        this.$file = "";
        this.$fileList = [];
        this.$options = options;
        this._cache = {}; // 事件订阅发布，字典
        this.listIndex = 0;
        this.init();
    }
    // init uploader
    init() {
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
                <div class="goodies-upload__tip" style="display: ${this.$options.note ? 'block' : 'none'};">${this.$options.note}</div>
                <ul class="goodies-upload-list" id="drapUpList" style="display: none;"></ul>
            </div>`;
        this.$el.innerHTML = content;
        const drapUpWrap = document.getElementById("drapUpWrap");
        const drapInputFile = document.getElementById("drapInputFile");
        const drapContainer = document.querySelector('.goodies-upload__container');

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
            this.onChangeFile(event.dataTransfer.files[0], this.listIndex);
        });
        drapInputFile.addEventListener("change", (event) => {
            this.onChangeFile(event.target.files[0], this.listIndex);
        });
    }
    onChangeFile(file, index) {
        this.$file = file;
        const result = this.trigger('beforeUpload', file)._cache.beforeUpload[0]();
        if (result === false) {
            // stop upload
            return false;
        }
        const drapUpList = document.getElementById("drapUpList");
        const drapInputWrap = document.getElementById("drapInputWrap");
        drapUpList.setAttribute("style", "display: block;");
        drapUpList.innerHTML = drapUpList.innerHTML + `
            <li id="listIndex${index}" class="goodies-upload-list__item has-progressbar" title="${this.$file.name}">
                <div class="goodies-uploadlist__item-name">
                    <i class="iconfont icon-document"></i>${this.$file.name}
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
        this.$fileList.push(file);
        this.listIndex++;
        // upload file
        let formData = new FormData();
        const options = this.$options;
        formData.append(options.name || 'file', file);
        if (options.data && typeof options.data === 'object') {
            for (let key in options.data) {
                formData.append(key, options.data[key]);
            }
        }
        let request = new XMLHttpRequest();
        request.open("POST", options.action, true);
        const nodeList = document.querySelectorAll('.goodies-upload-list__item');
        if (nodeList.length > 0) {
            for (let node of nodeList) {
                node.querySelector('.icon-close').addEventListener('click', (event) => {
                    drapUpList.removeChild(node);
                    drapInputWrap.innerHTML = "";
                    let fileList = [];
                    if (this.$fileList.length > 0) {
                        for (let item of this.$fileList) {
                            if (item.name != node.getAttribute('title')) {
                                fileList.push(item);
                            }
                        }
                    }
                    this.$fileList = fileList;
                    if (request) request.abort();
                    setTimeout(() => {
                        drapInputWrap.innerHTML = `<input id="drapInputFile" type="file" class="goodies-upload__input" />`;
                        document.getElementById("drapInputFile").addEventListener("change", (event) => {
                            this.onChangeFile(event.target.files[0], this.listIndex);
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
            /**
            var response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                request: request
            };*/
            this.trigger('success', { responseData, file, fileList: this.$fileList });
            // Clean up request
            request = null;
        }
        // Handle low level network errors
        request.onerror = () => {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            // TODO
            this.trigger('error', { file, fileList: this.$fileList });
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
    // 绑定
    on(type, callback) {
        let fns = (this._cache[type] = this._cache[type] || [])
        if (fns.indexOf(callback) === -1) {
            fns.push(callback)
        }
        return this
    }
    // 触发 emit
    trigger(type, data) {
        let fns = this._cache[type]
        if (Array.isArray(fns)) {
            fns.forEach((fn) => fn(data));
        }
        return this
    }
    // 解绑
    off(type, callback) {
        let fns = this._cache[type]
        if (Array.isArray(fns)) {
            if (callback) {
                let index = fns.indexOf(callback)
                if (index !== -1) {
                    fns.splice(index, 1)
                }
            } else {
                // 全部清空
                fns.length = 0
            }
        }
        return this
    }
}