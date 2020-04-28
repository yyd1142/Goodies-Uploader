var goodiesUploader = {
    fileList: [],
    Upload: function (options) {
        var file = {};
        return {
            render: function (el) {
                var content = "\n                <div id=\"drapUpWrap\" class=\"goodies-upload__wrap\">\n                    <div class=\"goodies-upload__container\">\n                        <div id=\"drapInputWrap\">\n                            <input id=\"drapInputFile\" type=\"file\" class=\"goodies-upload__input\" />\n                        </div>\n                        <div class=\"goodies-upload__dragger\">\n                            <i class=\"iconfont icon-upload\"></i>\n                            <div class=\"text\">\u5C06\u6587\u4EF6\u62D6\u5230\u6B64\u5904\uFF0C\u6216<em>\u70B9\u51FB\u4E0A\u4F20</em></div>\n                        </div>\n                    </div>\n                    <div class=\"goodies-upload__tip\" style=\"display: " + (options.ruleText ? 'block' : 'none') + ";\">" + options.ruleText + "</div>\n                    <ul class=\"goodies-upload-list\" id=\"drapUpList\" style=\"display: none;\"></ul>\n                </div>";
                el.innerHTML = content;
                var drapUpWrap = document.getElementById("drapUpWrap");
                var drapInputWrap = document.getElementById("drapInputWrap");
                var drapInputFile = document.getElementById("drapInputFile");
                var drapUpList = document.getElementById("drapUpList");
                var drapContainer = document.querySelector('.goodies-upload__container');
                var listIndex = 0;
                var onChangeFile = function (uploadFile, index) {
                    file = uploadFile;
                    if (options.beforeUpload) {
                        var continueUpload = options.beforeUpload(file);
                        if (continueUpload === false) {
                            return false;
                        }
                    }
                    drapUpList.setAttribute("style", "display: block;");
                    drapUpList.innerHTML = drapUpList.innerHTML + ("\n                    <li id=\"listIndex" + index + "\" class=\"goodies-upload-list__item has-progressbar\" title=\"" + file.name + "\">\n                        <div class=\"goodies-uploadlist__item-name\">\n                            <i class=\"iconfont icon-document\"></i>" + file.name + "\n                        </div>\n                        <div class=\"goodies-upload-list__item-status-label\">\n                            <i class=\"iconfont icon-checked\"></i>\n                            <i class=\"iconfont icon-close\"></i>\n                        </div>\n                        <div class=\"goodies-upload-progress-bar\">\n                            <div class=\"goodies-upload-progress-bar__outer\">\n                                <div class=\"goodies-upload-progress-bar__inner\" style=\"width: 0%;\"></div>\n                            </div>\n                            <div class=\"goodies-upload--progress__text\">0%</div>\n                        </div>\n                    </li>\n                    ");
                    goodiesUploader.fileList.push(file);
                    listIndex++;
                    // upload file
                    var formData = new FormData();
                    formData.append(options.name || 'file', file);
                    if (options.data && typeof options.data === 'object') {
                        for (var key in options.data) {
                            formData.append(key, options.data[key]);
                        }
                    }
                    var request = new XMLHttpRequest();
                    request.open("POST", options.action, true);
                    var nodeList = document.querySelectorAll('.goodies-upload-list__item');
                    if (nodeList.length > 0) {
                        var _loop_1 = function (node) {
                            node.querySelector('.icon-close').addEventListener('click', function (event) {
                                drapUpList.removeChild(node);
                                drapInputWrap.innerHTML = "";
                                var fileList = [];
                                if (goodiesUploader.fileList.length > 0) {
                                    for (var _i = 0, _a = goodiesUploader.fileList; _i < _a.length; _i++) {
                                        var item = _a[_i];
                                        if (item.name != node.getAttribute('title')) {
                                            fileList.push(item);
                                        }
                                    }
                                }
                                goodiesUploader.fileList = fileList;
                                if (request)
                                    request.abort();
                                setTimeout(function () {
                                    drapInputWrap.innerHTML = "<input id=\"drapInputFile\" type=\"file\" class=\"goodies-upload__input\" />";
                                    document.getElementById("drapInputFile").addEventListener("change", function (event) {
                                        onChangeFile(event.target.files[0], listIndex);
                                    });
                                }, 500);
                            });
                        };
                        for (var _i = 0, nodeList_1 = nodeList; _i < nodeList_1.length; _i++) {
                            var node = nodeList_1[_i];
                            _loop_1(node);
                        }
                    }
                    request.onreadystatechange = function () {
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
                        if (options.success)
                            options.success(response, file, goodiesUploader.fileList);
                        // Clean up request
                        request = null;
                    };
                    // Handle low level network errors
                    request.onerror = function () {
                        // Real errors are hidden from us by the browser
                        // onerror should only fire if it's a network error
                        // TODO
                        if (options.error)
                            options.error(file, goodiesUploader.fileList);
                        // Clean up request
                        request = null;
                    };
                    // Not all browsers support upload events
                    if (request.upload) {
                        request.upload.addEventListener('progress', function (event) {
                            var listItem = document.getElementById("listIndex" + index);
                            var percentCompleted = Math.round((event.loaded * 100) / event.total);
                            var inner = listItem.querySelector('.goodies-upload-progress-bar .goodies-upload-progress-bar__outer .goodies-upload-progress-bar__inner');
                            var text = listItem.querySelector('.goodies-upload-progress-bar .goodies-upload--progress__text');
                            inner.setAttribute('style', "width: " + percentCompleted + "%");
                            text.innerHTML = percentCompleted + "%";
                            if (percentCompleted === 100) {
                                listItem.setAttribute('class', 'goodies-upload-list__item');
                            }
                        });
                    }
                    request.send(formData);
                };
                drapUpWrap.addEventListener("dragover", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'goodies-upload__container is-dragover');
                });
                drapUpWrap.addEventListener("dragleave", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'goodies-upload__container');
                });
                drapUpWrap.addEventListener("drop", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'goodies-upload__container');
                    onChangeFile(event.dataTransfer.files[0], listIndex);
                });
                drapInputFile.addEventListener("change", function (event) {
                    onChangeFile(event.target.files[0], listIndex);
                });
            }
        };
    }
};
