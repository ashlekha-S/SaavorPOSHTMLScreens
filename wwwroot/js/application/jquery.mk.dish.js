var dishImagePath;
var typeArray = [];
var itemArray = [];
var isValidImage = false;
$(document).ready(function () {

    //$("body").click(function (evt) {
    //    if (!$(evt.target).is("#txtPreparationTime")) {
    //        var pT = $('[id$=txtPreparationTime]').val().trim();
    //        $("[id$=hdnPreparationTime]").val(pT);
    //        PT(pT);
    //    }
    //});

    $("#dishImageUpload").change(function () {
        readURL(this);
    });

    $('[id$=chkCustomization]').change(function () {
        if ($(this).is(":checked")) {
            $(".customization").show();
            $("[id$=add-custmization]").show();
        } else {
            $(".customization").hide();
            $("[id$=add-custmization]").hide();
            //$(".customization").html('');
        }
    });

    $(".add-dish-customization").click(function () {
        ClearCustomizationPopupControl();
        $("[id$=add-customization-popup]").show();
    });

    $("[id$=add-customization-popup-cancel]").click(function () {
        $("[id$=add-customization-popup]").hide();
    });

    $("[id$=doneCustomization]").click(function () {
        if (!Validation()) {
            return false;
        }
        if (parseInt($("[id$=hdnContainerEdit]").val()) == 1) {
            $("[id$=hdnContainerEdit]").val("0");
            var container = $('.customization-container').eq(parseInt($("[id$=hdnContainerEditIndex]").val()));
            if (container != undefined) {
                $(container).find("#customization-title-container").find("input").each(function () {
                    if ($(this).attr("id") == "hdnTitle") {
                        $(this).val($("[id$=customizationTitle]").val());
                        $(container).find(".c-title").text($("[id$=customizationTitle]").val());
                    }
                    if ($(this).attr("id") == "hdnDescription") {
                        $(this).val($("[id$=customizationDescription]").val());
                    }
                    if ($(this).attr("id") == "hdnRequired") {
                        $(this).val($('input[name="Required"]:checked').val());
                    }
                    if ($(this).attr("id") == "hdnSelection") {
                        $(this).val($('input[name="Selection"]:checked').val());
                    }
                });
            }
        }
        else {
            var html = $("[id$=add-customization-html-container]").html();
            var T = "Title";
            var D = "Description";
            var R = "Required";
            var S = "Selection";

            var Title = new RegExp('\\$T\\.' + T, 'g');
            var Description = new RegExp('\\$T\\.' + D, 'g');
            var Required = new RegExp('\\$T\\.' + R, 'g');
            var Selection = new RegExp('\\$T\\.' + S, 'g');

            html = html.replace(Title, $("[id$=customizationTitle]").val());
            html = html.replace(Description, $("[id$=customizationDescription]").val());
            html = html.replace(Required, $('input[name="Required"]:checked').val());
            html = html.replace(Selection, $('input[name="Selection"]:checked').val());

            $(".customization").append(html);

        }
        $("[id$=add-customization-popup]").hide();
        ClearCustomizationPopupControl();
    });

    $(document).on('click', '.customization-add-more', function () {         
        var self = $(this).closest(".row")[0];
        var selfPrevious = $(self).prev("div");        
        $(selfPrevious).append($("[id$=customization-item-html-container]").html());
    });

    $(document).on('click', '.remove-add-more-item', function () {
        $(this).parent().prev("div").remove();
        $(this).parent().prev("div").remove();
        $(this).parent().prev("div").remove();
        $(this).parent().remove();         
        var element = $(this).attr("element");
        if (element != undefined) {
            itemArray.push(parseInt(element));
        }
    });

    $(document).on('click', '.delete-container', function () {         
        var parent = $(this).closest(".customization-container");
        $(parent).remove();
        var element = $(this).attr("element");
        if (element != undefined) {
            typeArray.push(parseInt(element));
        }
    });

    $(document).on('click', '.edit-container', function () {
        var parent = $(this).closest(".customization-container");
        $("[id$=hdnContainerEditIndex]").val($(parent).index());
        $("[id$=hdnContainerEdit]").val("1");
        $(parent).find("#customization-title-container").find("input").each(function () {
            if ($(this).attr("id") == "hdnTitle") {
                $("[id$=customizationTitle]").val($(this).val());
            }
            if ($(this).attr("id") == "hdnDescription") {
                $("[id$=customizationDescription]").val($(this).val());
            }
            if ($(this).attr("id") == "hdnRequired") {
                var v = $(this).val();
                if (v == "Yes") {
                    $("[id$=rdoCRYes]").prop("checked", true);
                }
                else {
                    $("[id$=rdoCRNo]").prop("checked", true);
                }
            }
            if ($(this).attr("id") == "hdnSelection") {
                var v = $(this).val();
                if (v == "Single") {
                    $("[id$=rdoCTYes]").prop("checked", true);
                }
                else {
                    $("[id$=rdoCTNo]").prop("checked", true);
                }
            }

        });
        $("[id$=add-customization-popup]").show();
    });

    $("[id$=isDishTaxable]").click(function () {
        var T = $("[id$=txtTaxPercentage]");
        $(T).css("border-color", "#ced4da");
        if ($(this).is(":checked")) {
            $("[id$=txpercentage]").removeClass("hide");
        } else {
            $("[id$=txpercentage]").addClass("hide");
        }
    });
    
    $("[id$=btn-add-dish]").click(function () {
        var category;
        var spiceLevel;
        var isValid = true;
        $("[id$=addDish]").find(".s-required").each(function () {
            var val = $(this).val().trim();
            var cId = $(this).attr("id");
            if (val == '') {
                $(this).css("border-color", "red");
                onToastrError($(this).attr("error-message"));
                isValid = false;
            }
            else {
                if (!isValid)
                    isValid = false;
                $(this).css("border-color", "#ced4da");
            }
        });

        $('.dish-category').find("input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                if (category == undefined)
                    category = this.value;
                else
                    category = category + "," + this.value;
            }
        });

        $('.spice-level').find("input[type=radio]").each(function () {
            if ($(this).is(":checked")) {
                spiceLevel = this.value;
            }
        });       

        if (isValid) {     
            var c = onGetParameterValues("c");
            var d = onGetParameterValues("d");
            var b = onGetParameterValues("b");
            var customType = [];
            var cateringItems = [];

            if ($("[id$=chkCustomization]").is(":checked"))   {
                $(".customization-container").each(function () {
                    var customizableItems = [];
                    $(this).find("#customization-item-container").each(function () {
                        var event = $(this);
                        $(event).find(".item").each(function () {
                            var item;
                            var price;
                            var available;
                            var itemId;
                            $(this).find("input").each(function () {
                                switch ($(this).attr("id")) {
                                    case "cItem":
                                        var element = $(this).attr("element");
                                        itemId = element != undefined ? parseInt(element) : 0;
                                        var parents = $(this).parents().parents().closest("#add-customization-html-container");
                                        item = $(this).val();
                                        if (parents.length == 0 && item == "") {
                                            isValid = false;
                                            $(this).css("border-color", "red");
                                            return false;
                                        }
                                        else {
                                            $(this).removeAttr("style");
                                        }
                                        break;
                                    case "cPrice":
                                        var parents = $(this).parents().parents().closest("#add-customization-html-container");
                                        price = $(this).val();
                                        if (parents.length == 0 && price == "") {
                                            isValid = false;
                                            $(this).css("border-color", "red");
                                            return false;
                                        } else {
                                            $(this).removeAttr("style");
                                        }
                                        break;
                                    default:
                                        available = $(this).is(":checked");
                                }
                            });
                            if (item != undefined && price != undefined && available != undefined) {
                                customizableItems.push({
                                    Name: item,
                                    Cost: price,
                                    Available: available,
                                    DishCustomTypeID: itemId,
                                });
                            }
                        });
                    });

                    $(this).find("#customization-title-container").each(function () {
                        var title;
                        var description;
                        var ismultiple;
                        var isrequired;
                        var typeId;
                        $(this).find("input[type=hidden]").each(function () {
                            switch ($(this).attr("id")) {
                                case "hdnTitle":
                                    title = $(this).val();
                                    break;
                                case "hdnDescription":
                                    description = $(this).val();
                                    break;
                                case "hdnSelection":
                                    ismultiple = $(this).val();
                                    break;
                                case "hdnRequired":
                                    isrequired = $(this).val();
                                    break;
                                case "hdnCustomtypeId":
                                    typeId = $(this).val();
                                    break;
                            }
                        });

                        if (title != "$T.Title") {
                            customType.push({
                                Title: title,
                                Description: description,
                                IsMultiple: ismultiple,
                                IsRequired: isrequired,
                                Items: customizableItems,
                                DishCustomTypeID: typeId
                            });
                        }
                    });
                });
            }

            if ($("[id$=catering-add-more]").length > 0) {                
                $("[id$=catering_qty_prc_cntr]").each(function () {
                    var event = $(this);
                    $(event).find(".item").each(function () {
                        var qty;
                        var price;                        
                        var itemId;
                        var available;
                        $(this).find("input").each(function () {                           
                            switch ($(this).attr("id")) {
                                case "cTItem":
                                    var element = $(this).attr("element");
                                    itemId = element != undefined ? parseInt(element) : 0;
                                    var parents = $(this).parents().parents().closest("#catering-price-item-html-container");
                                    qty = $(this).val();
                                    if (parents.length == 0 && qty == "") {
                                        isValid = false;
                                        $(this).css("border-color", "red");
                                        onToastrError("Quantity must be greater then 0");
                                        return false;
                                    }
                                    else {
                                        $(this).removeAttr("style");
                                    }
                                    break;
                                case "cTPrice":
                                    var parents = $(this).parents().parents().closest("#catering-price-item-html-container");
                                    price = $(this).val();
                                    if (parents.length == 0 && price == "") {
                                        isValid = false;
                                        $(this).css("border-color", "red");
                                        onToastrError("$Price must be greater then 0");
                                        return false;
                                    } else {
                                        $(this).removeAttr("style");
                                    }
                                    break;
                                default:
                                    available = '';
                            }
                        });
                        if (qty != undefined && price != undefined) {
                            cateringItems.push({
                                QtyUpTo: qty,
                                DishPrice: price,
                                DishPriceID: itemId
                            });
                        }
                    });
                });
            }
          
            var adjustedQuantity = $("[id$=txtAdjustedQuantity]").val();
            if (adjustedQuantity != null && adjustedQuantity != undefined) {                
                var v = adjustedQuantity;
                var minus = v.split("-");
                if (minus.length > 1 ) {
                    adjustedQuantity = parseInt(minus[minus.length - 1]);
                }
                if (minus.length > 1 && parseInt(adjustedQuantity) > parseInt($("[id$=txtAvailableToSell]").val())) {
                    onToastrError("Adjusted quantity should be less than Available to sell!");
                    isValid = false;
                    hideLoading();
                    return false
                }
                
            }
            var taxPercentage = "0.00";
            if ($("[id$=isDishTaxable]").is(":checked")) {
                taxPercentage = $("[id$=txtTaxPercentage]").val().trim();
            }
            
            var dishPrice = "0";
            if ($("[id$=txtPrice]").length > 0) {
                dishPrice = $("[id$=txtPrice]").val().trim();

                if (parseFloat(dishPrice) <= 0 && b == undefined) {
                    onToastrError("$Price must be greater then 0");
                    isValid = false;
                    return false;
                }
            }
            
            if (!isValidImage) {
                dishImagePath = "";
            }
            var DishDTO = {
                DishId: 0,
                ImageName: dishImagePath == null ? '' : dishImagePath,
                ImagePath: dishImagePath == null ? '' : dishImagePath,
                DishName: $("[id$=txtDishName]").val().trim(),
                Description: $("[id$=txtDescription]").val().trim(),
                Ingredients: $("[id$=txtIngredients]").val().trim(),
                CaloriesServing: $("[id$=txtCalories]").val().trim(),
                Price: $("[id$=txtPrice]").length > 0 ? $("[id$=txtPrice]").val().trim() : "0",
                PreparationTime: $("[id$=hdnPreparationTime]").val().trim(),                
                Quantity: $("[id$=txtQuantity]").length == 0 ? $("[id$=hdnQuantity]").val() : $("[id$=txtQuantity]").val().trim(),
                AvailableToSell: $("[id$=txtAvailableToSell]").length == 0 ? "0" : $("[id$=txtAvailableToSell]").val().trim(),
                PromisedQuantity: $("[id$=txtPromisedQuantity]").length == 0 ? "0" : $("[id$=txtPromisedQuantity]").val().trim(),
                AdjustedQuantity: $("[id$=txtAdjustedQuantity]").length == 0 ? "" : $("[id$=txtAdjustedQuantity]").val().trim(),
                CuisineId: $("[id$=ddlCuisine]").val(),
                TaxPercentage: taxPercentage,
                Category: category,
                SpiceLevel: spiceLevel,
                IsCustomization: $("[id$=chkCustomization]").is(":checked"),
                EncryptedCategoryId: c == undefined ? '': c,
                EncryptedDishId: d == undefined ? '' : d,
                CustomType: customType,
                TypeArray: typeArray,
                ItemArray: itemArray,
                CateringItems: cateringItems
            };
             
            if (isValid) {
                showLoading();
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax("/ManageKitchen/UpsertDish", CommonJsFunction.MethodType.POST, JSON.stringify(DishDTO), function (result) {
                    if (result != null && parseInt(result) > 0) {
                        var upload = $('input[type=file]')[0].files[0];
                        if (upload != undefined && isValidImage) {
                            var dishImage = new FormData();
                            dishImage.append("DishImage", upload);
                            $.ajax({
                                url: "/ManageKitchen/UploadDishImage",
                                type: "POST",
                                processData: false,
                                contentType: false,
                                data: dishImage,
                                success: function (response) {
                                    if (response != null && response.status == "success") {
                                        var b = onGetParameterValues("b");
                                        var sc = onGetParameterValues("sc");
                                        if (sc != undefined && sc != null && sc == "1") {
                                            window.location.href = "/manage/menuitems?b=1&sc=1&t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                                        }
                                        else if (b != undefined && b != null && b == "1") {
                                            window.location.href = "/manage/buffetitems?b=1";
                                        }
                                        else {
                                            window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                                        }
                                    } else {
                                        hideLoading();
                                        onToastrError("Please try again!");
                                    }
                                },
                                error: function (er) { }
                            });
                        }
                        else {
                            var b = onGetParameterValues("b");
                            var sc = onGetParameterValues("sc");
                            if (sc != undefined && sc != null && sc == "1") {
                                window.location.href = "/manage/menuitems?b=1&sc=1&t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                            }
                            else if (b != undefined && b != null && b == "1") {
                                window.location.href = "/manage/buffetitems?b=1";
                            }
                            else {
                                window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                            }
                        }
                    }
                    else if (result != null && parseInt(result) == 0) {
                        hideLoading();
                        onToastrError("Dish name already exists.");
                    }

                });
            }
            else {
                onToastrError("Please fill required fields!");
            }
        }
    });

    $("[id$=addDish]").find(".s-required").keyup(function () {
            var val = $(this).val().trim();
            if (val != '') {
                $(this).css("border-color", "#ced4da");
            }            
    });

    $("[id$=addDish]").find(".s-required").blur(function () {
        var val = $(this).val().trim();
        if (val == '') {
            $(this).css("border-color", "red");
            onToastrError($(this).attr("error-message"));
        } else {
            $(this).css("border-color", "#ced4da");
        }
    });

    $('.numberonly').keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode
        if (String.fromCharCode(charCode).match(/[^0-9]/g))
            return false;
    }); 

    $(".decimalonly").blur(function () {
        if (isNaN(parseFloat(this.value)))
            this.value = '';            
        else
            this.value = parseFloat(this.value).toFixed(2);
    });

    var pV;
    $('.minusornumberonly').keypress(function (e) {
        setTimeout(function ($elem) {
            var v = $elem.val();
            var minus = v.split("-");
            if ($elem.val().length > 1 && minus[minus.length - 1] == "") {
                $elem.val(pV);
                v = pV;
            }
            pV = v;
        }, 0, $(this));
   
        var charCode = (e.which) ? e.which : event.keyCode;   
        if (String.fromCharCode(charCode).match(/[^0-9-]/g))
            return false;
    });

    $("[id$=delete-dish]").bootstrap_confirm_delete(
        {
            callback: function (event) {
                var D = onGetParameterValues("d");
                if (D != null && D != undefined) {
                    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                    CommonJsFunction.AjaxContent.DataType = "json";
                    CommonJsFunction.Ajax("/ManageKitchen/DeleteDish", CommonJsFunction.MethodType.POST, JSON.stringify(D), function (result) {
                        if (result != null && parseInt(result) > 0) {
                            onToastrSuccess("Deleted successfully!");
                            setTimeout(function () {
                                window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
                            }, 2000);
                        }
                        else { onToastrError("Please try again!"); }
                    });
                }
            }
        }
    );

    setTimeout(function () {
        var pT = $('[id$=hdnPreparationTime]').val().trim();
        PT(pT);
        $(".decimalonly").each(function () {
            if (isNaN(parseFloat(this.value)))
                this.value = '';
            else
                this.value = parseFloat(this.value).toFixed(2);
        });
    }, 300);

    $('#txtPreparationTime').datetimepicker({
       // minDate: moment().add(300, 'm'),
      //  debug: true
    });

    $("[id$=btn_dish_back]").click(function () {
        var b = onGetParameterValues("b");
        var sc = onGetParameterValues("sc");        
        if (sc != undefined && sc != null && sc == "1") {
            window.location.href = "/manage/menuitems?b=1&sc=1&t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
        }
        else if (b != undefined && b != null && b == "1") {
            window.location.href = "/manage/buffetitems?b=1";
        } 
        else {
            window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
        }

    });

    $(document).on('click', '.catering-add-more', function () {
        var self = $(this).closest(".row")[0];
        var selfPrevious = $(self).prev("div");
        $(selfPrevious).append($("[id$=catering-price-item-html-container]").html());
    });

    $(document).on('click', '.remove-add-more-catering-price-item', function () {
        $(this).parent().prev("div").remove();
        $(this).parent().prev("div").remove();
        $(this).parent().prev("div").remove();
        $(this).parent().remove();
        var element = $(this).attr("element");
        if (element != undefined) {
            itemArray.push(parseInt(element));
        }
    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var size = input.files[0].size;
        if ((size/1024) > 1024) {
            onToastrError("File too Big, please select a file less than 1MB");
            return
        }
        else {
            var reader = new FileReader();
            reader.onload = function (e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    if (height < 2800 && width < 2800) {
                        $('#dishImagePreview').css('background-image', 'url(' + e.target.result + ')');
                        $('#dishImagePreview').hide();
                        $('#dishImagePreview').fadeIn(650);
                        isValidImage = true;
                    }
                    else {
                        onToastrError("Height and Width must not exceed 3000px!");
                        //isValidImage = false;
                        dishImagePath = "";
                        $('#dishImagePreview').css('background-image', 'url(/images/no-image.png)');

                    }
                };
            }

            var dishImage = new FormData();
            dishImage.append("DishImage", input.files[0]);

            $.ajax({
                url: "/ManageKitchen/GetDishImagePath",
                type: "POST",
                processData: false,
                contentType: false,
                data: dishImage,
                success: function (response) {
                    if (response != null && response.status == "success") {
                        dishImagePath = response.path;
                    }
                },
                error: function (er) { }
            });
            reader.readAsDataURL(input.files[0]);

        }
       
    }
}

function Decimalonly(event) {
    if (isNaN(parseFloat(event.value)))
        event.value = '';
    else
        event.value = parseFloat(event.value).toFixed(2);
};

function ClearCustomizationPopupControl() {
    $("[id$=customizationTitle]").val("");
    $("[id$=customizationDescription]").val("");
    $(".manage-kitchen-textbox-container").find("input").prop("checked", false);
    $("[id$=rdoCRYes]").prop("checked", true);
    $("[id$=rdoCTYes]").prop("checked", true);
}

function Validation() {
    var T = $("[id$=customizationTitle]");
    var D = $("[id$=customizationDescription]");
    var M = $(".error-message");
    $(T).removeAttr("style");
    $(D).removeAttr("style");
    $(M).text("");

    if ($(T).val().trim().length == 0) {
        $(T).css("border-color", "red");
        return false;
    }
    if ($(D).val().trim().length == 0) {
        $(D).css("border-color", "red");
        return false;
    }
    if ($('input[name="Required"]:checked').val() == undefined) {
        $(M).text("Required can't be empty");
        return false;
    }
    if ($('input[name="Selection"]:checked').val() == undefined) {
        $(M).text("Selection can't be empty");
        return false;
    }
    return true;
}

function PT(pT) {    
    if (pT != undefined && pT != null && pT != "") {
        $("[id$=hdnPreparationTime]").val(pT);
        var prepTimeArray = pT.split(":");
        if (prepTimeArray.length > 0) {
            var prepHrs = prepTimeArray[0];
            var prepMins = prepTimeArray[1];
            if (parseInt(prepHrs) > 0 && parseInt(prepMins) > 0) {
                var val = prepHrs + " Hour(s) " + prepMins + " minute(s)";
                $("[id$=spnPreparationTimeFormatted]").text(val);
            }
            else if (parseInt(prepHrs) > 0 && parseInt(prepMins) == 0) {
                var val = prepHrs + " Hour(s) ";
                $("[id$=spnPreparationTimeFormatted]").text(val);
            }
            else if (parseInt(prepHrs) == 0 && parseInt(prepMins) > 0) {
                var val = prepMins + " minute(s)";
                $("[id$=spnPreparationTimeFormatted]").text(val);
            }
        }
    }
}