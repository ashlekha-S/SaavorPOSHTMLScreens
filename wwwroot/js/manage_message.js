//$(document).ready(function () {
//    $(".message-post").click(function () {
//        var subject = $("#subject").val();
//        var message = $("#message").val();
//        if (subject != "" && message != "") {



//        }
//        else {
//            if (subject == "")
//                onErrorMessage("Please enter subject!");
//            else if (message == "")
//                onErrorMessage("Please enter message!");
//        }
//    });
//});
 

Message = {
    Url: {
        UpsertMessage: "Message/UpsertMessage",
        GetMessage: "Message/GetMessage",        
        DeleteMessage: "Message/DeleteMessage",        
    },
   
    ID: {
        messagePost: "messagePost",
        subject: "subject",
        message: "message",   
        formMessage: "form-message",
        toastContainer: "toast-container",
        fromAccount: "fromAccount"
    },

    Class: {
        addMorePosition: "addMorePosition",
        loadingContainerOverlay: "loading_container_overlay",
        loaderContainer: "loader_container",
        deleteMessage: "delete--action"
        
    },    

    Attr: {
        src: "src",
        maxlength: "maxlength"
    },     

    CustomMessages: {
        Error: "Please try again!",
        Success: "Message added successfully!",
        Update: "Message updated successfully!",
        Delete: "Message deleted successfully!"
    },

    Init: function () {
        var $this = this;

        //Bind Event
        $this.ClickEvent();
        $this.ReInitialize();

        $("#" + $this.ID.subject).attr($this.Attr.maxlength, "100");
        $("#" + $this.ID.message).attr($this.Attr.maxlength, "1000");
        $("#" + $this.ID.fromAccount).attr($this.Attr.maxlength, "100");

        $("form[name='form-message']").validate({
            // Specify validation rules
            rules: {
                // The key name on the left side is the name attribute
                // of an input field. Validation rules are defined
                // on the right side
                subject: "required",
                message: "required",
                
            },
            // Specify validation error messages
            messages: {
                subject: "Please enter subject",
                message: "Please enter message"
            },
            // Make sure the form is submitted to the destination defined
            // in the "action" attribute of the form when valid
            //submitHandler: function (form) {
            //    form.submit();
            //}
        });
        
        var messageId = CommonMethods.GetParameterValues("m");
        if (messageId != undefined) {
            CommonMethods.ShowLoading();
            $.ajax({
                url: Message.Url.GetMessage,
                type: "POST",
                dataType: "json",
                data: { messageId: messageId == undefined ? "" : messageId},
                success: function (response) {
                    CommonMethods.SetControlValue("#" + $this.ID.subject,response.subject)
                    CommonMethods.SetControlValue("#" + $this.ID.message, response.message);
                    CommonMethods.SetControlValue("#" + $this.ID.fromAccount, response.accountName);
                    CommonMethods.HideLoading();
                },
                error: function (result) {
                    CommonMethods.ToastError("#" + $this.ID.toastContainer, "An error is occured - " + result);
                    CommonMethods.HideLoading();
                }
            });
        }

    },

    ReInitialize: function () {
        var $this = this;      
    },

    ClickEvent: function () {
        var $this = this;      
       
        $("#" + $this.ID.messagePost).click(function () {
            
            var isValid = $("#" + $this.ID.formMessage).valid();
            var error = $("#errors");
            $(error).text("");
            $(error).show();            
            if (CommonMethods.GetControlValue("#" + $this.ID.subject).trim().length == 0 && CommonMethods.GetControlValue("#" + $this.ID.message).trim().length == 0) {
                $(error).text("Fields cannot be left blank or empty");
                return false;
            }

            if (CommonMethods.GetControlValue("#" + $this.ID.subject).trim().length == 0) {
                $(error).text("Subject cannot be left blank or empty");
                return false;
            }

            if (CommonMethods.GetControlValue("#" + $this.ID.message).trim().length == 0) {
                $(error).text("Message cannot be left blank or empty");
                return false;
            }
            if (isValid) {
                var messageId = CommonMethods.GetParameterValues("m");
                CommonMethods.ShowLoading();
                $.ajax({
                    url: Message.Url.UpsertMessage,
                    type: "POST",
                    dataType: "json",
                    data: { messageId: messageId == undefined ? "" : messageId, subject: CommonMethods.GetControlValue("#" + $this.ID.subject), message: CommonMethods.GetControlValue("#" + $this.ID.message), fromAccount: CommonMethods.GetControlValue("#" + $this.ID.fromAccount) },
                    success: function (response) {
                        CommonMethods.HideLoading();
                        if (response > 0) {
                            if (messageId == undefined)
                                CommonMethods.ToastSuccess($this.CustomMessages.Success)
                            else
                                CommonMethods.ToastSuccess($this.CustomMessages.Update)

                            setTimeout(function () {
                                location.href = "/messages";
                            }, 1000);
                        }
                        else {
                            CommonMethods.ToastError("#" + $this.ID.toastContainer,$this.CustomMessages.Error);
                        }
                    },
                    error: function (result) {
                        CommonMethods.ToastError("#" + $this.ID.toastContainer, "An error is occured - " + result);
                        CommonMethods.HideLoading();
                    }
                });
            }
        });

        $('.' + $this.Class.deleteMessage).bootstrap_confirm_delete({
                callback: function (event) {
                    CommonMethods.ShowLoading();
                    var MessageId = (event.data.originalObject).attr("data");
                    $.ajax({
                        url: Message.Url.DeleteMessage,
                        type: "POST",
                        dataType: "json",
                        data: { messageId: MessageId },
                        success: function (response) {
                            CommonMethods.HideLoading();
                            if (response > 0) {
                                setTimeout(function () {
                                    CommonMethods.ToastSuccess($this.CustomMessages.Delete)
                                    event.data.originalObject.closest('tr').remove();
                                }, 300);
                            }
                            else {
                                CommonMethods.ToastError("#" + $this.ID.toastContainer, $this.CustomMessages.Error);
                            } 
                        },
                        error: function (result) {
                            CommonMethods.ToastError("#" + $this.ID.toastContainer, "An error is occured - " + result);
                            CommonMethods.HideLoading();
                        }
                    })
                }
            }
        );
    },  
}

//Common Method  
CommonMethods = {

    SetControlValue: function (controlId,val) {
        $(controlId).val(val);
    },

    GetControlValue: function(controlId) {
        return $(controlId).val();
    },

    GetParameterValues: function(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    },

    ToastError: function (controlId,message) {
        if ($(controlId).length == 0)
            toastr.error(message);
    },

    ToastSuccess: function ( message) {
            toastr.success(message);
    },

    ShowLoading: function () {
        $("." + Message.Class.loaderContainer).addClass("show").removeClass("hide");
        $("." + Message.Class.loadingContainerOverlay).addClass("show").removeClass("hide");
    },

    HideLoading: function () {
        $("." + Message.Class.loaderContainer).addClass("hide").removeClass("show");
        $("." + Message.Class.loadingContainerOverlay).addClass("hide").removeClass("show");
    }
    
}

 
 