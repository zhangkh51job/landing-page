
const request = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open(options.method, url);
        if (options.onCreate) {
            options.onCreate(xhr);
        }
        if (options.headers) {
            Object.keys(options.headers).forEach((k) =>
                xhr.setRequestHeader(k, options.headers[k])
            );
        }
        if (options.isBlob) {
            xhr.responseType = "blob";
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                let message = `xhr request failed, code: ${xhr.status};`;
                let responseText = xhr.responseText;
                if (responseText) {
                    message = message + ` response: ${responseText}`;
                }
                reject({
                    code: xhr.status,
                    message: message,
                    isRequestError: true,
                });
                return;
            }
            if (options.isBlob) {
                const url = URL.createObjectURL(xhr.response);
                const aTag = document.createElement("a");
                aTag.style.display = "none";
                aTag.href = url;
                document.body.appendChild(aTag);
                aTag.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url); // 释放URL 对象
                    document.body.removeChild(aTag);
                }, 800);
                resolve(true);
            } else {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch (err) {
                    reject(err);
                }
            }
        };

        xhr.send(options.body);
    });
};

export const requestTwoMoblieConfig = async (url, app_id, general_id) => {
    const pack_no = Number(window.pack_no) || 0
    let res = await request(`${url}/WebClip/Create`, {
        method: "POST",
        body: JSON.stringify({
            app_id: Number(app_id),
            // param: (location.search || "").replace("?", ""),
            param: `id=${general_id}&ch=${pack_no}`,
        }),
    });
    if (res.data && res.data.md_5) {
        request(`${url}/WebClip/Download?md5=${res.data.md_5}`, {
            method: "GET",
            isBlob: true,
        }).then(() => {
            setTimeout(() => {
                var aTag = document.createElement("a");
                aTag.href =
                    url + "/mobileprovision/embedded.mobileprovision ";
                aTag.download =
                    "./mobileprovision/embedded.mobileprovision";
                aTag.click();
            }, 500);
        });
    }
};

