$(document).ready(function () {

    Bind();

    $("[id$=btn-add-subcategory]").click(function () {
        $("[id$=subCategoryName]").val("");
        $("[id$=addSubCategory]").show();
    });

    $("[id$=subCategoryCancel]").click(function () {
        $("[id$=subCategorySave]").removeAttr("data");
        $("[id$=addSubCategory]").hide();
    });

    $(document).on('click', '[id$=btn-add-dish]', function () {
        var b = onGetParameterValues("b");
        if (b != undefined && b != null && b == "1")
        {
            window.location.href = "/manage/adddish?c=" + $(this).attr("element") + "&t=" + onSystemDateTime() + "&b=1&sc=1";
        }
        else
            window.location.href = "/manage/adddish?c=" + $(this).attr("element") + "&t=" + onSystemDateTime() + "";
    });

    $(document).on('click', '.dish-info', function () {
        var b = onGetParameterValues("b");
        if(b != undefined && b != null && b == "1")
            window.location.href = "/manage/adddish?c=" + $(this).attr("element-c") + "&d=" + $(this).attr("element-d") + "&t=" + onSystemDateTime() + "&b=1&sc=1";
        else
            window.location.href = "/manage/adddish?c=" + $(this).attr("element-c") + "&d=" + $(this).attr("element-d") + "&t=" + onSystemDateTime() + "";

    });

    $("[id$=subCategorySave]").click(function () {
        var C = $("[id$=subCategoryName]");
        $(C).removeAttr("style");
        if ($(C).val().trim().length == 0) {
            $(C).css("border-color", "red");
            return false;
        }
        var categoryId = 0;
        var element = $(this).attr("element");
        if (element != undefined) {
            categoryId = element;
        }
        var SubCategoryDTO = {
            MenuTitle: $(C).val().trim(),
            CategoryId: categoryId
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/UpsertSubCategory", CommonJsFunction.MethodType.POST, JSON.stringify(SubCategoryDTO), function (result) {
            result = parseInt(result);
            var error = $("[id$=error]");
            $(error).text("");
            if (result == 1) {
                $("[id$=addSubCategory]").hide();
                $(C).val("");
                $(this).removeAttr("element");
                if (categoryId == 0) {
                    onToastrSuccess("Added successfully!");
                }
                else {
                    onToastrSuccess("Updated successfully!");
                }
                setTimeout(function () {
                    window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                }, 300);
            }
            else if (result == 2) {               
                onToastrError("Sub category already exists with this name")
            }
            else if (result == 0) {
                $(error).text("");
            }
            else {               
                onToastrError("Please try again!");
            }
        });
    });

    $(document).on('click', '.edit-category', function () {
        showLoading();
        var parent = $(this).closest(".delete_icon");        
        var SubCategoryDTO = {
            CategoryId: $(parent).attr("element")
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/GetSubCategory", CommonJsFunction.MethodType.POST, JSON.stringify(SubCategoryDTO), function (result) {
            if (result != null && result != -1) {
                $("[id$=subCategoryName]").val(result.menuTitle);
                $("[id$=subCategorySave]").attr("element", result.categoryId);
                $("[id$=addSubCategory]").show();
                //Bind();
            }
            hideLoading();
        });
        
    });
    
    $("[id$=button-search_clear]").click(function () {
        $("[id$=search]").val("");
        $("[id$=clearSearch]").hide();
        Bind();
    });

    $("[id$=button-search_category]").click(function () {
        var S = $("[id$=search]");
        if ($(S).val().trim().length == 0) {
            return false;
        }
        //$("[id$=clearSearch]").show();
        //Bind();
    });

    $(document).on('click', '.dishoutofstock', function () {
        var SubCategoryDTO = {
            DishId: $(this).attr("element"),
            OutOfStock: $(this).is(":checked")
        };
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/UpsertSubCategoryDish", CommonJsFunction.MethodType.POST, JSON.stringify(SubCategoryDTO), function (result) {
           // Bind(); 
        });
    });

    $(".btn_back").click(function () {     
        
        var b = onGetParameterValues("b");
        var sc = onGetParameterValues("sc");
        if (sc != undefined && sc != null && sc == "1") {
            window.location.href = "/manage/buffetitems?b=1";
        }
        else if (b != undefined && b != null && b == "1") {
            window.location.href = "/manage/buffetitems?b=1";
        }
        else {
            window.location.href = "/manage/kitchen";
        }
      
    });

    $("[id$=search]").keyup(function () {
        SearchCategoryDish($(this).val());
    });

    RebindEvents();   
});

function Bind() {
    showLoading();
    var subCategoryInputDTO = {
        DishName: $("[id$=search]").val(),
        BrowserDate: onSystemDate()
    }
    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
    CommonJsFunction.AjaxContent.DataType = "html";
    CommonJsFunction.Ajax("/ManageKitchen/BindSubCategory", CommonJsFunction.MethodType.POST, JSON.stringify(subCategoryInputDTO), function (result) {
        if (result != null) {
            $("[id$=subCategoryContainer]").html(result);
            hideLoading();
        }
        RebindEvents();
    });
}

function RebindEvents() {
    $('.delete-category').bootstrap_confirm_delete(
        {
            callback: function (event) {
                var parent = (event.data.originalObject).closest(".delete_icon");
                var SubCategoryDTO = {
                    CategoryId: $(parent).attr("element")
                }
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax("/ManageKitchen/DeleteSubCategory", CommonJsFunction.MethodType.POST, JSON.stringify(SubCategoryDTO), function (result) {
                    onToastrSuccess("Deleted successfully!");
                    setTimeout(function () {
                        window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                    }, 300);
                });
            }
        }
    );
}

function SearchCategoryDish(value) {
    $('#subCategoryContainer div,#subCategoryContainer table tr').each(function () {
        if (value != null && value != undefined && value != "") {
            var cls = $(this).attr("class");
            if (cls == undefined) {
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
                    if ($(this).parents().closest("td").length > 0) {
                        var td = $(this).parents().closest("td");
                        $(td).find("div").each(function () {
                            $(this).show();
                        });
                    }

                }
            }
            else {
                $(this).hide();
                if ($(this).parents().closest("td").length > 0) {
                    var td = $(this).parents().closest("td");
                    $(td).find("div").each(function () {
                        $(this).show();
                    });
                }

            }
        }
        else {
            $(this).show();
        }
        
    
    });
}
