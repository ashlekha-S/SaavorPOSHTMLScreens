$(document).ready(function () {
    $("[id$=addNewCuisine]").click(function () {
        var C = $("[id$=cuisineName]");
        $(C).removeAttr("style");
        $(C).val("");
        $("[id$=error]").text('')
        $("[id$=addCuisine]").show();
    });

    $("[id$=addCuisineCancel]").click(function () {
        $("[id$=addCuisine]").hide();
    });

    $("[id$=cuisineSave]").click(function () {
        var C = $("[id$=cuisineName]");
        $(C).removeAttr("style");
        if ($(C).val().trim().length == 0) {
            $(C).css("border-color", "red");
            return false;
        }
        showLoading();
        var CuisinesDTO = {
            CuisineName: $(C).val().trim()
        }
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        CommonJsFunction.Ajax("/ManageKitchen/UpsertCuisine", CommonJsFunction.MethodType.POST, JSON.stringify(CuisinesDTO), function (result) {
            hideLoading();
            result = parseInt(result);
            var error = $("[id$=error]");
            $(error).text("");
            if (result == 1) {
                $("[id$=addCuisine]").hide();
                onToastrSuccess("Saved successfully!");
                Bind();
            }
            else if (result == 0) {
                $(error).text("Cuisine name already exists."); 
            }
            else{
                $(error).text("Please try again!");
            }
        });
    });
     
    //$(document).on('click', '.delete-cuisine', function () { 
    //    showLoading();
    //    var CuisinesDTO = {
    //        BusinessCuisineId: $(this).attr("data")
    //    }
    //    var beingUsed = $(this).attr("isdish");
    //    if (parseInt(beingUsed) > 0) {
    //        hideLoading();
    //        onToastrError("Please delete dish first. This Cuisine is used inside your dish.");
    //        return;
    //    }
    //    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
    //    CommonJsFunction.AjaxContent.DataType = "json";
    //    CommonJsFunction.Ajax("/ManageKitchen/DeleteCuisine", CommonJsFunction.MethodType.POST, JSON.stringify(CuisinesDTO), function (result) {
    //        hideLoading();
    //        onToastrSuccess("Deleted successfully!");
    //        Bind();
    //    });
    //});
    $("[id$=button-search_cuisine]").click(function () {
        var S = $("[id$=search]");
        if ($(S).val().trim().length == 0) {
           return false;
        }
        $("[id$=clearSearch]").show();
        Bind();
    });

    //$("[id$=search]").keyup(
    //    function () {
    //        var value = $(this).val().trim();
    //        if (value.length == 0) {
    //            $("[id$=clearSearch]").hide();
    //        } else {
    //            $("[id$=clearSearch]").show();
    //        }
                
    //    });

    $("[id$=button-search_clear]").click(function () {
        $("[id$=search]").val("");
        $("[id$=clearSearch]").hide();
        Bind();
    });

    $("[id$=cuisineName]").autocomplete({
        source: function (request, response) {            
            $.ajax({
                url: "/ManageKitchen/AutoCompleteCuisine",
                type: "POST",
                dataType: "json",
                data: { search: request.term },
                success: function (data) {                    
                    response($.map(data, function (item) {
                        return { label: item.cuisineName, value: item.cuisineName };
                    }));                    
                }
            })
        },
        change: function () {
        },
        select: function (event, ui) {

            // set the target element
            let target = $(this);

            // retrieve selected value from event
            let selected = ui.item.value;

            // set target value using .attr (using .val() does not work, for some reason)
             
        }
    });

    $("[id$=cuisineName]").keyup(
        function () {
            $("[id$=error]").text('');
        });

    RebindEvents();
});
 
function Bind() {
    showLoading();
    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
    CommonJsFunction.AjaxContent.DataType = "html";
    CommonJsFunction.Ajax("/ManageKitchen/BindCuisine", CommonJsFunction.MethodType.POST, JSON.stringify($("[id$=search]").val()), function (result) {        
        hideLoading();
        if (result != null) {
            $("[id$=cuisineContainer]").html(result);
        }
        RebindEvents();
    });
}  
function RebindEvents() {
    $('.delete-cuisine').bootstrap_confirm_delete(
        {
            callback: function (event) {               
                var parent = (event.data.originalObject).closest(".delete_icon");                
                var CuisinesDTO = {
                    BusinessCuisineId: $(parent).attr("element")
                }                
                var beingUsed = $(parent).attr("isdish");
                if (parseInt(beingUsed) > 0) {
                    hideLoading();
                    onToastrError("Please delete dish first. This Cuisine is used inside your dish.");
                    return;
                }
                showLoading();  
                CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
                CommonJsFunction.AjaxContent.DataType = "json";
                CommonJsFunction.Ajax("/ManageKitchen/DeleteCuisine", CommonJsFunction.MethodType.POST, JSON.stringify(CuisinesDTO), function (result) {
                    hideLoading();
                    onToastrSuccess("Deleted successfully!");
                    Bind();
                });
            }
        }
    );
}