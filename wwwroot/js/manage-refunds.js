 
$(document).ready(function () {
    // Disable inspect element
    //$(document).bind("contextmenu", function (e) {
    //    e.preventDefault();
    //});
    //$(document).keydown(function (e) {
    //    if (e.which === 123) {
    //        return false;
    //    }
    //});

 

    $(".order-refund--reason").change(function () {
        var reason = $(this).val();
        if ("Other" == reason) {
            var container = $(".other_reason--container");
            $(container).removeClass("hide");
            $(container).find("input[type=text]").val("");
            $(this).addClass("hide");
        }
        else {
            if ("-1" == reason) {
                $("#inputOrderRefundReason").val("");
            }
            else {
                $("#inputOrderRefundReason").val(reason);
            }
        }
    });

    $(".close-order--reason").click(function () {
        var container = $(".other_reason--container");
        $(container).addClass("hide");
        $(container).find("input[type=text]").val("");
        var ddl = $(".order-refund--reason");
        $(ddl).removeClass("hide");
        $(ddl).val("-1");
    });

    $(".refund-item").click(function () {  
        var txtAmountObject = $('#txtAmount');
        var selectedItem = $(".invoive-item--table tbody tr").find("input[type=checkbox]:checked");
        if (selectedItem != null && selectedItem.length > 0) {
            $(txtAmountObject).attr('readonly', true);
            $(txtAmountObject).addClass('input-disabled');
        } else {
            $(txtAmountObject).removeAttr("readonly");
            $(txtAmountObject).removeClass('input-disabled');
        }
        onLoadItemDetail();
    });

    $(".refund-items").click(function () {       
        showLoading();
        var foodOrderId = $("#hndF").val();
        var refundReason = $("#inputOrderRefundReason").val();
        var refundAmount = 0;
        var maximumAmount = $(".order-amount_maximum").text().replace("$", "").replace("Maximum", "").replace(" ", "");
        var selectedItem = $(".invoive-item--table tbody tr").find("input[type=checkbox]:checked");
        var qty;
        if (selectedItem != null && selectedItem.length > 0) {
            var itemAmount = 0;
            var lineItem = "";
            $(selectedItem).each(function () {    
               
                var price = $(this).attr("data");
                itemAmount += Number(price);
                refundAmount = itemAmount;

                var parent = $(this).closest("tr");
                var foodOrderDetailId = parent.find("#hdnFD").val();
                var foodItems = parent.find("#hdnLI").val();
                qty = parent.find("select").find(":selected").val();
                if (qty == "-1")
                    return;

                if (lineItem == "") {
                    lineItem = foodOrderDetailId + "|" + qty + "|" + foodItems
                }
                else {
                    lineItem = lineItem + "," + foodOrderDetailId + "|" + qty + "|" + foodItems
                }
            });
        }
        else {
            refundAmount = $("#txtAmount").val();
        }
      
        if (parseInt($(".error-border__bottom").length) == 0 && refundReason != "" && refundAmount != "" && Number(refundAmount) <= Number(maximumAmount)) {
            $.ajax({
                url: "/KitchenDashboard/ProcessRefund",
                type: "POST",
                dataType: "json",
                data: { foodOrderId: foodOrderId, refundAmount: refundAmount, refundReason: refundReason, lineItem: lineItem },
                success: function (data) {
                    if (data != null && data != undefined) {
                        if (data == "1") {
                            toastr.success("Refunded successfully");
                        }
                        else {
                            toastr.error('Please try again!');
                        }
                    }
                    else {
                        toastr.error('Please try again!');
                    }
                    onClose();
                    hideLoading();
                }
            });
        }
        else {
            hideLoading();
            if ($("#toast-container").length > 0)
                return false;
            if (parseInt(qty) <= 0) {
               
                    toastr.error("Please select Qty!");
            }
            else if (refundReason == "") {
                toastr.error("Warning: Please select refund reason!");
            }
            else if (refundAmount == "") {
                toastr.error("Warning: Please enter refund amount!");
            }
            else {
                toastr.error("Warning: You cannot apply an amount greater than the maximum amount!")
            }
           
        }
    });

    $('#txtAmount').keypress(function (event) {
        return isNumber(event, this)
    });

    $('#txtAmount').bind('copy paste cut', function (e) {
        e.preventDefault();  
    });

    $(".item-qty").change(function () {
        var qty = $(this).val();
        var parent = $(this).closest("tr");
        if (qty != "-1") {
          
            parent.find("td").removeClass("error-border__bottom");
            var item = parent.find("input[type=checkbox]:checked");
            if (item.length > 0) {
                onLoadItemDetail();
            }
        }
        else {
            var item = parent.find("input[type=checkbox]:checked");
            if (item.length > 0) {
                parent.find("td").addClass("error-border__bottom");
                if ($("#toast-container").length == 0)
                    toastr.error("Please select Qty!");
            }
            
        }
    });
});

function onLoadItems(evt) {
    var orderId = $(evt).attr("data");
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetItemToRefund",
        type: "POST",
        dataType: "html",
        data: { orderId: orderId },
        success: function (data) {
            $("body").addClass("overflow-hidden");
            $('.item_refund--info').html(data);
            $("#orderRefunds").show();
            hideLoading();
        }
    });
} 

function showLoading() {
    $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
}

function hideLoading() {
    $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
}

function onClose() {
    $("body").removeClass("overflow-hidden");
    $("#orderRefunds").hide();
}

// THE SCRIPT THAT CHECKS IF THE KEY PRESSED IS A NUMERIC OR DECIMAL VALUE.
function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function onLoadItemDetail() {
    $(".invoive-item--table tbody tr").find("td").removeClass("error-border__bottom");
    var selectedItem = $(".invoive-item--table tbody tr").find("input[type=checkbox]:checked");
    if (selectedItem != null && selectedItem.length > 0) {
        var itemAmount = 0;
        $(selectedItem).each(function () {
            var parent = $(this).closest("tr");
            var qty = parent.find("select").find(":selected").val();
            var foodOrderDetailId = parent.find("#hdnFD").val();
            if (qty == "-1") {
               // qty = parent.find("#hdnQt").val();
                if ($("#toast-container").length == 0)
                    toastr.error("Please select Qty!");

                parent.find("td").addClass("error-border__bottom");

              return false;
            }
            if (parseInt(qty) > 0) {
                $.ajax({
                    url: "/KitchenDashboard/GetItemDetailToRefund",
                    type: "POST",
                    dataType: "json",
                    data: { foodOrderDetailId: foodOrderDetailId, qty: qty },
                    success: function (data) {                        
                        var price = data;                       
                        itemAmount += Number(price);
                        $("#txtAmount").val("$" + itemAmount.toFixed(2));
                    }
                });
            }
        });
    }
    else {
        $("#txtAmount").val("");
    }
}

 