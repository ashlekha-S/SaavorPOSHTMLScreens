Financial = {
    Url: {
        GetFinancialData: "/Report/GetSaavorFinancialReport",        
        GetExportLink: "/Report/GetExportLink",        
    },    
    ID: {
        btnSearch: "btnSearch",
        fromDate: "fromDate",
        endDate: "endDate",
        financialContainer: "financialContainer",
        toastContainer: "toast-container",
        selectedFilters: "selectedFilters",
        iCopyLink: "spnCopyLink",
        spnLoadMore: "spnLoadMore",
        aLoadMore: "aLoadMore",
        aBacktoResult: "aBacktoResult",
        spnBacktoResult: "spnBacktoResult",
    },
    Class: {
        multiselectcontainer:"multiselect-container",
    },   
    Attr: {}, 
    Message: {
        SelectKitchens: "Please select kitchen!",
    }, 
    Init: function () {
        var $this = this;
        $this.ClickEvent();
       
    },
    ClickEvent: function () {
        var $this = this;
        $("#" + $this.ID.btnSearch).click(function () {
            $("#" + $this.ID.spnBacktoResult).hide();
            CommonMethods.ShowLoad();
            var profileIds;
            $("." + $this.Class.multiselectcontainer).find("input[type=checkbox]:checked").each(function () {
                 
                if (profileIds) {
                    profileIds = profileIds + "," + $(this).attr("value");
                }
                else {                     
                    profileIds = $(this).attr("value");
                }
            });
            if (profileIds == undefined) {
                CommonMethods.ToastrError($this.Message.SelectKitchens);
                CommonMethods.HideLoad();
                return
            }            
            $("#" + $this.ID.selectedFilters).text("From " + $("#" + $this.ID.fromDate).val() + " to " + $("#" + $this.ID.endDate).val())
            var FinancialSearchDTO = {
                ProfileIds: profileIds,
                StartDate: $("#" + $this.ID.fromDate).val(),
                EndDate: $("#" + $this.ID.endDate).val(),
                ReportType: "Saavor"
            }
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "html";
            CommonJsFunction.Ajax($this.Url.GetFinancialData, CommonJsFunction.MethodType.POST, JSON.stringify(FinancialSearchDTO), function (result) {
                $("#" + $this.ID.financialContainer).html("").html(result);
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax($this.Url.GetExportLink, CommonJsFunction.MethodType.POST, JSON.stringify(FinancialSearchDTO), function (result) {
                    $("[id$=hdnLnk]").val(result);
                    setTimeout(function () {                       
                        var rows = $("[id$=dataTable_]").find("tr").length;
                        if (parseInt(rows) == 2) {
                            var columns = $('#dataTable_ tr:last').find("td").length;
                            if (parseInt(columns) > 1) {
                                $("[id$=iCopyLink]").show();
                            } else {
                                $("[id$=iCopyLink]").hide();
                            }
                        }
                        else {
                            $("[id$=iCopyLink]").show();
                        }

                        if (profileIds.indexOf("multiselect-all") > -1) {
                            $("#" + $this.ID.spnLoadMore).show();
                        }
                        else {
                            $("#" + $this.ID.spnLoadMore).hide();
                        }
                        CommonMethods.HideLoad();
                    }, 300);
                });

            });

        });

        $("#" + $this.ID.iCopyLink).click(function () {
            var sampleTextarea = document.createElement("textarea");
            document.body.appendChild(sampleTextarea);
            sampleTextarea.value = $("[id$=hdnLnk]").val(); //save main text in it
            sampleTextarea.select(); //select textarea contenrs
            document.execCommand("copy");
            document.body.removeChild(sampleTextarea);
            onToastrSuccess("Copied!");
        });
         
        $("#" + $this.ID.aLoadMore).click(function () {
            CommonMethods.ShowLoad();
            var profileIds;
            $("." + $this.Class.multiselectcontainer).find("input[type=checkbox]:checked").each(function () {

                if (profileIds) {
                    profileIds = profileIds + "," + $(this).attr("value");
                }
                else {
                    if ($(this).attr("value") != "multiselect-all") {
                        profileIds = $(this).attr("value");
                    }
                }
            });
            if (profileIds == undefined) {
                CommonMethods.ToastrError($this.Message.SelectKitchens);
                CommonMethods.HideLoad();
                return
            }
            $("#" + $this.ID.selectedFilters).text("From " + $("#" + $this.ID.fromDate).val() + " to " + $("#" + $this.ID.endDate).val())
            var FinancialSearchDTO = {
                ProfileIds: profileIds,
                StartDate: $("#" + $this.ID.fromDate).val(),
                EndDate: $("#" + $this.ID.endDate).val(),
                ReportType: "Saavor"
            }
            $("#" + $this.ID.spnBacktoResult).show();
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "html";
            CommonJsFunction.Ajax($this.Url.GetFinancialData, CommonJsFunction.MethodType.POST, JSON.stringify(FinancialSearchDTO), function (result) {
                $("#" + $this.ID.financialContainer).html("").html(result);
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax($this.Url.GetExportLink, CommonJsFunction.MethodType.POST, JSON.stringify(FinancialSearchDTO), function (result) {
                    $("[id$=hdnLnk]").val(result);
                    setTimeout(function () {
                        var rows = $("[id$=dataTable_]").find("tr").length;
                        if (parseInt(rows) == 2) {
                            var columns = $('#dataTable_ tr:last').find("td").length;
                            if (parseInt(columns) > 1) {
                                $("[id$=iCopyLink]").show();
                            } else {
                                $("[id$=iCopyLink]").hide();
                            }
                        }
                        else {
                            $("[id$=iCopyLink]").show();
                        }

                        if (profileIds.indexOf("multiselect-all") > -1) {
                            $("#" + $this.ID.spnLoadMore).show();
                        }
                        else {
                            $("#" + $this.ID.spnLoadMore).hide();
                        }
                        CommonMethods.HideLoad();
                    }, 300);
                });

            });
        });

        $("#" + $this.ID.aBacktoResult).click(function () {
            $("#" + $this.ID.btnSearch).click();
        });
    }
}

//Common Method for use in Discover Above JS Class
CommonMethods = {
    HideTimeOunt: function (counterId,timeOut) {
        setTimeout(function () {
            $("#" + counterId).hide();
        }, timeOut);
    },

    AjaxCall: function (Url,callType,data) {
        var postData = JSON.stringify(data);         
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "html";
        CommonJsFunction.Ajax(
            Url
            //, CommonJsFunction.MethodType.POST
            ,callType
            , postData
            , function (result) {                 
                return result;
            });
    },

    ToastrError: function (message) {
        if ($("#" + Financial.ID.toastContainer).length == 0)
               toastr.error(message);
    },

    ShowLoad: function () {
        $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
    },

    HideLoad: function () {
        $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
    }
}
