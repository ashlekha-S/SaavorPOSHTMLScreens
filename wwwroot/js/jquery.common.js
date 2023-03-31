var CommonJsFunction = {
    MethodType: {
        GET: "GET",
        POST: "POST"
    },

    AjaxContent: {
        ContentType: "application/json; charset=utf-8",
        DataType: "json",
    },

    Ajax: function (methodUrl, type, params, callback) {
        var $this = this;
        var xmlRequest = {
            type: type,
            url: methodUrl,
            async: false,
            data: params,
            contentType: $this.AjaxContent.ContentType,
            dataType: $this.AjaxContent.DataType,
            processData: true,
            cache: false,
            success: function (result) {
                callback(result);
            },
            error: function (result) {
                alert("An error is occured - " + result);
            }
        };
        $.ajax(xmlRequest);
    }
}