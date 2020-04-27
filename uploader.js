var dragUploader = {
    Upload: function (options) {
        var file = {};
        return {
            render: function (el) {
                var content = "\n                <div id=\"drapUpWrap\" class=\"drag-up__wrap\">\n                    <div class=\"drag-up__container\">\n                        <input id=\"drapInputFile\" type=\"file\" class=\"drag-up__input\" />\n                        <div class=\"drag-up__dragger\">\n                            <i class=\"iconfont icon-upload\"></i>\n                            <div class=\"text\">\u5C06\u6587\u4EF6\u62D6\u5230\u6B64\u5904\uFF0C\u6216<em>\u70B9\u51FB\u4E0A\u4F20</em></div>\n                        </div>\n                    </div>\n                    <div class=\"drag-up__tip\" style=\"display: " + (options.ruleText ? 'block' : 'none') + ";\">" + options.ruleText + "</div>\n                    <ul class=\"drag-up-list\" id=\"drapUpList\" style=\"display: none;\"></ul>\n                </div>\n                ";
                el.innerHTML = content;
                var drapUpWrap = document.getElementById("drapUpWrap");
                var drapInputFile = document.getElementById("drapInputFile");
                var drapUpList = document.getElementById("drapUpList");
                var drapContainer = document.querySelector('.drag-up__container');
                var onChangeFile = function (uploadFile) {
                    file = uploadFile;
                    var continueUpload = options.beforeUpload(file);
                    if (continueUpload === false) {
                        return false;
                    }
                    drapUpList.setAttribute("style", "display: block;");
                    drapUpList.innerHTML = "\n                    <li class=\"drag-up-list__item\" title=\"" + file.name + "\">\n                        <div class=\"drag-uplist__item-name\">\n                            <i class=\"iconfont icon-document\"></i>" + file.name + "\n                        </div>\n                        <div class=\"el-upload-list__item-status-label\">\n                            <i class=\"iconfont icon-checked\"></i>\n                            <i class=\"iconfont icon-close\"></i>\n                        </div>\n                    </li>\n                    ";
                    var formData = new FormData();
                    formData.append('file', file);
                    if (options.data && typeof options.data === 'object') {
                        for (var key in options.data) {
                            formData.append(key, options.data[key]);
                        }
                    }
                    var request = new XMLHttpRequest();
                    request.open("POST", options.action, true);
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
                        options.success(response, file, []);
                        // Clean up request
                        request = null;
                    };
                    // Handle low level network errors
                    request.onerror = function () {
                        // Real errors are hidden from us by the browser
                        // onerror should only fire if it's a network error
                        options.error("Network Error.");
                        // Clean up request
                        request = null;
                    };
                    request.send(formData);
                };
                drapUpWrap.addEventListener("dragover", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container is-dragover');
                });
                drapUpWrap.addEventListener("dragleave", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container');
                });
                drapUpWrap.addEventListener("drop", function (event) {
                    event.preventDefault();
                    drapContainer.setAttribute('class', 'drag-up__container');
                    onChangeFile(event.target.files[0]);
                });
                drapInputFile.addEventListener("change", function (event) {
                    onChangeFile(event.target.files[0]);
                });
            }
        };
    }
};
