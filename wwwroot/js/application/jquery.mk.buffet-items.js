
var weekVm;
$(document).ready(function () {

    sessionStorage.removeItem("source");
    sessionStorage.removeItem("modal");

    var b = onGetParameterValues("b");
    if (b != undefined && b != null && b == "1") {       
        OpenSelectDishPopup();
    }

    $("[id$=addNewBuffetMenu]").click(function () {
        ClearField();
        $("[id$=popUpTitle]").text("Add Buffet Menu");
        $("[id$=buffetMenuName]").val("");
        $("[id$=addBuffetMenu]").show();
        $("[id$=buffetMenuSave]").removeAttr("element");
    });

    $("[id$=buffetMenuCancel]").click(function () {
        ClearField();
        $("[id$=buffetMenuName]").val("");
        $("[id$=addBuffetMenu]").hide();
        $("[id$=buffetMenuSave]").removeAttr("element");
    });    

    $("[id$=buffetMenuName]").keypress(function (e) {
        setTimeout(function ($elem) {
            if ($elem.val().length > 0) {
                ClearField();
            }            
        }, 0, $(this));        
    });

    $("[id$=buffetMenuSave]").click(function () {
        var E = $(".error");
        var B = $("[id$=buffetMenuName]");           
        $(B).removeAttr("style");
        $(E).text("");
        if ($(B).val().trim().length == 0) {
            $(B).css("border-color", "red");
            $(E).text("Title can't be empty!");
            return false;
        }
        
        var BuffetMenuDTO = {
            EncryptedId: $(this).attr("element") == undefined ? "" : $(this).attr("element"),
            Title: $(B).val().trim()
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/UpsertWeek", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetMenuDTO), function (result) {
            result = parseInt(result);   
            if (result > 0) {
                if (BuffetMenuDTO.EncryptedId.length > 0) {
                    onToastrSuccess("Updated successfully!");
                }
                else {
                    onToastrSuccess("Added successfully!");
                }
                setTimeout(function () {
                    window.location.href = "/manage/buffetitems";
                }, 300);
            }
            else if (result == -2) {
                onToastrError("Week name is already exists!");
            }
            else {
                onToastrError("Please try again!");
            }
        });
    });

    $(document).on('click', '.edit-buffet-week', function () {
        showLoading();
        var parent = $(this).closest(".delete_icon");
        var BuffetMenuDTO = {
            EncryptedId: $(parent).attr("element")
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/GetWeek", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetMenuDTO), function (result) {
            ClearField();
            if (result != null && result.menuSetID > 0) {
                $("[id$=popUpTitle]").text("Edit Buffet Menu");
                weekVm = result;                
                $("[id$=buffetMenuSave]").attr("element", result.encryptedId);
                $("[id$=buffetMenuName]").val(result.setTitle);
                $("[id$=addBuffetMenu]").show();
            }
            else {
                onToastrError("Please try again!");
            }
            hideLoading();
        });

    });

    $(document).on('click', '.items-container', function () {
        showLoading();        
        var BuffetMenuDTO = {
            EncryptedId: $(this).attr("element-c"),
            EncryptedMenuSetId: $(this).attr("element-m"),
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "html";
        CommonJsFunction.Ajax("/ManageKitchen/GetDishes", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetMenuDTO), function (result) {

            $("[id$=selectBuffetMenuDish]").animate({
                scrollTop: 0
            });

            $("[id$=buffetMenuDishDataTable]").html(result);
            $("[id$=selectBuffetMenuDish]").show();

            hideLoading();

            $("body").addClass("overflow-hidden");  

            $("[id$=buffetMenuDishSave]").attr({
                "element-c": BuffetMenuDTO.EncryptedId,
                "element-m": BuffetMenuDTO.EncryptedMenuSetId
            });

            sessionStorage.setItem("modal", "selectdish");
            sessionStorage.setItem("element-c", BuffetMenuDTO.EncryptedId);
            sessionStorage.setItem("element-m", BuffetMenuDTO.EncryptedMenuSetId);
        });

    });

    $("[id$=searchDish]").keyup(function () {
        SearchDish($(this).val());
    });
    
    $("[id$=closepopup],[id$=buffetMenuDishCancel]").click(function () {
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
        $("body").removeClass("overflow-hidden");
        $("[id$=selectBuffetMenuDish]").hide();
        $("[id$=buffetMenuDishSave]").removeAttr("element-c").removeAttr("element-m");
        $("[id$=selectBuffetMenuDish]").animate({
            scrollTop: 0
        });
    });

    $(document).on('click', '.edit-buffet-day-dish', function () {
        var parent = $(this).closest(".delete_icon");
        window.location.href = "/manage/adddish?c=" + $(parent).attr("element-c") + "&d=" + $(parent).attr("element-d") + "&t=" + onSystemDateTime() + "&b=1";
    });

    $("[id$=btn-add-dish]").click(function () {   
        window.location.href = "/manage/menuitems?b=1&sc=1&t=" + $("[id$=hdnEncryptedSystemTime]").val() +"";
    });

    $("[id$=buffetMenuDishSave]").click(function () {
        var BuffetSelectDishDTO = [];
        var selectedDishes = $("#buffetMenuDishDataTable tbody tr").find("input[type=checkbox]:checked");
        if (selectedDishes.length > 0) {
            showLoading();        
            $(selectedDishes).each(function () {
                var c = $(this).closest("div").attr("element-bc");
                var m = $(this).closest("div").attr("element-m");
                BuffetSelectDishDTO.push({
                    MenuSetId: m,
                    CategoryId: c,
                    DishId: $(this).attr("id")
                });
            });
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "json";
            CommonJsFunction.Ajax("/ManageKitchen/UpsertDayDishes", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetSelectDishDTO), function (result) {
                result = parseInt(result);
                hideLoading();
                if (result > 0) {
                    onToastrSuccess("Submitted successfully!");
                    setTimeout(function () {
                        window.location.href = "/manage/buffetitems";
                    }, 300);
                }                 
                else {
                    onToastrError("Please try again!");
                }
            });
        }
        else {
            showLoading(); 
            var BuffetSelectDishDTO = {
                MenuSetId: $(this).attr("element-m"),
                CategoryId: $(this).attr("element-c")     
            }
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "json";
            CommonJsFunction.Ajax("/ManageKitchen/DeleteDayDishes", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetSelectDishDTO), function (result) {
                result = parseInt(result);
                hideLoading();
                if (result > 0) {
                    onToastrSuccess("Submitted successfully!");
                    setTimeout(function () {
                        window.location.href = "/manage/buffetitems";
                    }, 300);
                }
                else {
                    onToastrError("Please try again!");
                }
            });
        }
    });
    $(".buffet-price").keyup(function () {
        var counter = 0;
        setTimeout(function ($elem) {
            if ($elem.val().length > 0 && counter == 0) {
                counter = 1;
                var BuffetSelectDishDTO = {
                    BuffetPrice: $elem.val(),
                    CategoryId: $elem.attr("element-c")
                }
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax("/ManageKitchen/UpdateBuffetPrice", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetSelectDishDTO), function (result) {
                   
                });                
            }
        }, 1000, $(this));  
    });
    RebindEvents();
});
 
function RebindEvents() {
    $('.delete-buffet-week').bootstrap_confirm_delete(
        {
            callback: function (event) {
                var parent = (event.data.originalObject).closest(".delete_icon");
                var BuffetMenuDTO = {
                    EncryptedId: $(parent).attr("element")
                }
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax("/ManageKitchen/DeleteWeek", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetMenuDTO), function (result) {
                    result = parseInt(result);
                    if (result > 0) {
                        onToastrSuccess("Deleted successfully!");
                        setTimeout(function () {
                            window.location.href = "/manage/buffetitems";
                        }, 300);
                    }
                    else if (result == -2) {
                        onToastrError("This week is in use");
                    }
                    else {
                        onToastrError("Please try again!");
                    }
                    
                });
            }
        }
    );
}

function ClearField() {
    var E = $(".error");
    var B = $("[id$=buffetMenuName]");
    $(B).removeAttr("style");
    $(E).text("");
}

function SearchDish(value) {
    $('#buffetMenuDishDataTable tr').each(function () {
        var found = 'false';
        $(this).each(function () {
            if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                found = 'true';
            }
        });
        if (found == 'true') {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
} 

function OpenSelectDishPopup() {
    var c = sessionStorage.getItem("element-c");
    var m = sessionStorage.getItem("element-m");
    var BuffetMenuDTO = {
        EncryptedId: c,
        EncryptedMenuSetId: m,
    }
    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
    CommonJsFunction.AjaxContent.DataType = "html";
    CommonJsFunction.Ajax("/ManageKitchen/GetDishes", CommonJsFunction.MethodType.POST, JSON.stringify(BuffetMenuDTO), function (result) {

        $("[id$=selectBuffetMenuDish]").animate({
            scrollTop: 0
        });

        $("[id$=buffetMenuDishDataTable]").html(result);
        $("[id$=selectBuffetMenuDish]").show();

        hideLoading();

        $("body").addClass("overflow-hidden");
        $("[id$=buffetMenuDishSave]").attr({
            "element-c": BuffetMenuDTO.EncryptedId,
            "element-m": BuffetMenuDTO.EncryptedMenuSetId
        });

        //sessionStorage.removeItem("modal");
        //sessionStorage.removeItem("element-c");
        //sessionStorage.removeItem("element-m");        
    });
}