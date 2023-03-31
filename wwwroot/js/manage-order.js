// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {

    // $.ajaxSetup({
    //    cache: false,
    //    statusCode: {
    //        401: function () {
    //            alert("401")
    //            window.location.href = "/WebForms/SessionExpired.aspx?metaredirectx";
    //        },
    //        403: function () {
    //            alert("430")
    //            window.location.href = "~/Base/ErrorPage";
    //        },
    //        500: function () {
    //            alert("500")
    //            window.location.href = "~/Base/ErrorPage";
    //        }
    //    },
    //    beforeSend: function () {
            
    //    },
    //    complete: function () {


    //    }
    //});
    
    $(".manage-order_menus--navigation").click(function () {
        window.location.href = $(this).attr("action");
    });
   
    setInterval(onLoadPickupOrders, 60000);
    setInterval(onAutoPrint, 10000);
    $(".order-rejected--reason").change(function () {
        var reason = $(this).val();
        if ("Other" == reason) {
            var container = $(".other_reason--container");
            $(container).removeClass("hide");
            $(container).find("input[type=text]").val("");
            $(this).addClass("hide");
        } 
    });

    $(".close-order--reason").click(function () {
        var container = $(".other_reason--container");
        $(container).addClass("hide");
        $(container).find("input[type=text]").val("");
        var ddl = $(".order-rejected--reason");
        $(ddl).removeClass("hide");
        $(ddl).val("Sold out of food item, please re-order");
    });

    $(".reject-order").click(function () {
        showLoading();
        var ddlReason = $(".order-rejected--reason");
        var reason;
        if ($(ddlReason).val() !== "Other") {
            reason = $(ddlReason).val();
        }
        else {
            var customReason = $("#inputOrderRejectReason").val();
            if (customReason != "" && customReason != undefined) {
                reason = customReason;
            }
            else {
                alert("Reason is required!");
                return;
            }
        }
       
        var id;
        var IsDelivery = $(this).attr("delivery");
        var status = $(this).attr("data-type").replace(/\s/g, '');
        var selectedRows = $("#dataTable tbody tr").find("input[type=checkbox]:checked");
        if (selectedRows.length > 0) {
            $(selectedRows).each(function () {
                var orderId = $(this).attr("id");
                if (id) {
                    id = id + "," + orderId;
                }
                else {
                    id = orderId;
                }
            });
        }
        else {
            id = $(this).attr("data");
        }
        $.ajax({
            url: "/KitchenDashboard/AcceptRejectOrder",
            type: "POST",
            dataType: "json",
            data: { status: status, id: id, reason: reason, systemDateTime: onSystemDateTime(), IsDelivery: parseInt(IsDelivery)},
            success: function (response) {
                hideLoading();
                if (response == "true") {
                    if (status == "Reject" || status == "RejectAll") {
                        toastr.success("Order has been rejected!");
                    }
                    setTimeout(function () {
                        location.reload();
                    }, 300);
                }
                else {
                    toastr.error("Try again!");
                }
            },
            error: function (xhr) {
                hideLoading();
                toastr.error("Try again!");
            }
        });
    });

    clickEvents();

    $(".order_ready").click(function () {
        var foodOrderId = $(this).attr("data");
        var status = "Ready";
        onUpdateOrderStatus(foodOrderId, status);
    });

    $(document).on('click', '.off_campus', function () {
        showLoading();
        var orderId = $(this).attr("element-f");
        $.ajax({
            url: "/KitchenDashboard/GetOffCampusIds",
            type: "POST",
            dataType: "json",
            data: { foodOrderId: orderId},
            success: function (response) {
                hideLoading();
                $("[id=offCampusIds]").show();
                $("[id=offCampusImg]").attr("src", response.idImagePath);
                $("[id=offCampusTitle]").text(response.idTitle);                
            },
            error: function (xhr) {
                hideLoading();
                toastr.error("Try again!");
            }
        });
    });
});

function onUpdateOrderStatus(foodOrderId, status) {
    showLoading();
    setTimeout(function () {
        $.ajax({
            url: "/KitchenDashboard/AcceptRejectOrder",
            type: "POST",
            dataType: "json",
            data: { status: status, id: foodOrderId, reason: "", systemDateTime: onSystemDateTime() },
            success: function (data) {
                hideLoading();
                if (status == "Accept") {
                    toastr.success("Order has been accepted!");
                }
                else if (status == "Reject") {
                    toastr.success("Order has been rejected!");
                }                  
                 
                setTimeout(function () {
                    location.reload();
                }, 300);
            }
        });
    }, 300);
}

function onUpdateStatusAll(evt) {
    showLoading();
    var status = $(evt).text();
    var multiIds;
    var grid = $("#dataTable tbody tr").find("input[type=checkbox]:checked");
    if (grid.length > 0) {
        $(grid).each(function () {
            var orderId = $(this).attr("id");
            if (multiIds) {
                multiIds = multiIds + "," + orderId;
            }
            else {
                multiIds = orderId;
            }
        });

        if (multiIds) {
            setTimeout(function () {
                $.ajax({
                    url: "/KitchenDashboard/AcceptRejectOrder",
                    type: "POST",
                    dataType: "json",
                    data: { status: status, id: multiIds, reason: "", systemDateTime: onSystemDateTime() },
                    success: function (data) {
                        hideLoading();
                        if (status == "Accept") {
                            toastr.success("Order has been accepted!");
                        }
                        else if (status == "Deliver") {
                            toastr.success("Order has been delivered!");
                        }
                        else if (status == "Reject") {
                            toastr.success("Order has been rejected!");
                        }

                        setTimeout(function () {
                            location.reload();
                        }, 300);
                    }
                });
            }, 300);
        }
        else {
            hideLoading();
        }
    }
    else {
        hideLoading();
        if ($("#toast-container").length == 0)
            toastr.error("Please select at least one order!");       
    }
}

function onUpdateStatus(evt) {
    debugger;
    showLoading();
    var status = $(evt).text();
    var id = $(evt).attr("data");
    var IsDelivery = $(evt).attr("delivery");
    var sss =parseInt(IsDelivery)
    setTimeout(function () {
        $.ajax({
            url: "/KitchenDashboard/AcceptRejectOrder",
            type: "POST",
            dataType: "json",
            data: { status: status, id: id, reason: "", systemDateTime: onSystemDateTime(), IsDelivery: parseInt(IsDelivery) },
            success: function (data) {
                hideLoading();
                location.reload();
            }
        });
    }, 300);
}

function onRejectOrder(evt,type) {
    var container = $(".other_reason--container");
    $(container).addClass("hide");
    $(container).find("input[type=text]").val("");
    $(".order-rejected--reason").val("Sold out of food item, please re-order").removeClass("hide");
    var btnRejectOrder = $(".reject-order");
    $(btnRejectOrder).attr("data", "");
    $(btnRejectOrder).attr("data-type", "");
    $(btnRejectOrder).attr("data", $(evt).attr("data"));
    $(btnRejectOrder).attr("data-type", type);
    if (type == "Reject All") {
        var grid = $("#dataTable tbody tr").find("input[type=checkbox]:checked");
        if (grid.length > 0) {
            $("#rejectOrder").show();
        }
        else {    
            if ($("#toast-container").length == 0)
                    toastr.error("Please select at least one order!");
        }
    }
    else {
        $("#rejectOrder").show();
    }
}

function onLoadOrderInvoice(evt) {
    var orderId = $(evt).attr("data");
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetOrderInvoice",
        type: "POST",
        dataType: "html",
        data: { orderId: orderId},
        success: function (data) {
            $("body").addClass("overflow-hidden");
            $('.invoice--info').html(data);
            $("#orderInvoice").show();
            localStorage.setItem("item", orderId);
            hideLoading();
        }
    });
}

function onLoadOrderInvoiceToPDF() {    
    var orderId = localStorage.getItem("item");
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetOrderInvoiceToPDF",
        type: "POST",
        dataType: "html",
        data: { orderId: orderId },
        success: function (data) {    
            onGenerateInvoiceToPDF(data);
        }
    });
}

function onGenerateInvoiceToPDF(data) {
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GenerateInvoicePDF",
        type: "POST",
        dataType: "html",
        data: { data: data, orderId: $("#hdnOrderNumber").val()},
        success: function (res) {
            var pdf = res.replace(/"/g, "");
            var downloadAnchorTag = $("<a id=donwloadTag />");
            downloadAnchorTag.attr("download", pdf);
            downloadAnchorTag.attr("href", pdf);
            $("body").append(downloadAnchorTag);
            downloadAnchorTag[0].click();
            $("#donwloadTag").remove();
            hideLoading();
            setTimeout(function () {
                onDeletePDF(pdf);
            }, 500);
        }
    });
}

function onDeletePDF(fileName) {
    $.ajax({
        url: "/KitchenDashboard/DeleteInvoicePDF",
        type: "POST",
        dataType: "html",
        data: { fileName: fileName },
        success: function (res) {}
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
    $("#orderInvoice").hide();
}

function onLoadOrdersCount() {
    //showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetOrdersCount",
        type: "GET",
        dataType: "json",
        data: {},
        success: function (data) {
            if (data != null && data != "") {
                $(".new_orders--count").text(parseInt(data.new) > 99 ? "99+" : data.new);
                $(".ready_orders--count").text(parseInt(data.ready) > 99 ? "99+" : data.ready);
                $(".herepickup_orders--count").text(parseInt(data.herePickup) > 99 ? "99+" : data.herePickup);
                $(".delivery_orders--count").text(parseInt(data.delivery) > 99 ? "99+" : data.delivery);
                $(".completed_orders--count").text(parseInt(data.delivered) > 99 ? "99+" : data.delivered);
            }
           // hideLoading();             
        },
        error: function (xhr) {
           // hideLoading();
        }
    });
}

function clickEvents() {
    $("#header-checkbox").click(function () {
        var grid = $("#dataTable tbody tr");
        if ($(this).is(":checked")) {
            $(grid).find("input[type=checkbox]").prop("checked", true);
        }
        else {
            $(grid).find("input[type=checkbox]").prop("checked", false);
        }

    });

    $(".select-item").click(function () {
        var grid = $("#dataTable tbody tr");
        var length = grid.length;
        var selected = grid.find("input[type=checkbox]:checked").length;
        var headerCheckbox = $("#header-checkbox");
        if (parseInt(length) === parseInt(selected)) {
            headerCheckbox.prop("checked", true);
        }
        else {
            headerCheckbox.prop("checked", false);
        }
    });
}

function onAutoPrint() {
    var dataTable = $("#dataTable");
    if (dataTable != undefined && dataTable.length > 0) {
        //$(dataTable).find(".usrarved-ato-prt").each(function () {            
        if ($(dataTable).find(".usrarved-ato-prt").length > 0) {
            var currentObject = $(dataTable).find(".usrarved-ato-prt")[0];
            var foodOrderId = $(currentObject).attr("data");             
            var ptST = $(currentObject).attr("ptST");
            var iap = $(currentObject).attr("iap");
            if (iap != undefined && parseInt(iap) == 1 && ptST != undefined && parseInt(ptST) == 0) {
                var print = $(dataTable).find(".grid-receipt-print");
                onGetOrderInformation(currentObject);
                $(currentObject).attr("ptST", "1");
                $(currentObject).removeClass("usrarved-ato-prt");
                $.ajax({
                    url: "/KitchenDashboard/UpdateOrderPrintStatus",
                    type: "Post",
                    dataType: "json",
                    data: { foodOrderId: foodOrderId },
                    success: function (data) {
                         
                    },
                    error: function (xhr) {
                        // hideLoading();
                    }
                });
            }
        }
    }
}
function onLoadPickupOrders() {

    var pageNumber = 1;
    var search = "";
    var location = window.location.href.toLocaleLowerCase();
    if (location.indexOf("pickup") > 0) {

        if (location.indexOf("pagenumber") > 0) {
            var array = location.split("=");
            pageNumber = parseInt(array[1]);
        }
        else {
            pageNumber = 1;
        }
    }

    $.ajax({
        url: "/KitchenDashboard/LoadPickupOrders",
        type: "POST",
        dataType: "html",
        data: { pageNumber: pageNumber, search: search },
        success: function (data) {
            $(".pickup-orders").html("").html(data);

            setTimeout(function () {
                clickEvents();
                var dataTable = $("#dataTable");
                if (dataTable != undefined && dataTable.length > 0) {
                    if ($(dataTable).find(".user-arrived").length > 0) {
                        var hiddenObject = $(dataTable).find('input[type="hidden"]');
                        var foodOrderId = $(dataTable).find(".user-arrived").attr("data");
                        var ptST = $(dataTable).find(".user-arrived").attr("ptST");
                        var iap = $(dataTable).find(".user-arrived").attr("iap");
                        if (iap != undefined && parseInt(iap) == 1 && ptST != undefined && parseInt(ptST) == 0) {
                            var print = $(dataTable).find(".grid-receipt-print");
                            onGetOrderInformation(print);
                            $.ajax({
                                url: "/KitchenDashboard/UpdateOrderPrintStatus",
                                type: "Post",
                                dataType: "json",
                                data: { foodOrderId: foodOrderId },
                                success: function (data) {

                                },
                                error: function (xhr) {
                                    // hideLoading();
                                }
                            });
                        }
                    }
                }

            }, 300);
        }
    });
}

function onApplySelectedAction(event) {    
    var currentAction = $(event).text();
  //  str.toLowerCase();
    var grid = $("#dataTable");
    var length = $(grid).find("tbody tr").length;
    var selectedRows = $(grid).find("tbody tr").find("input[type=checkbox]:checked").length;
    if (parseInt(selectedRows) > 0) {
        $(grid).find("span.delivered").each(function () {    
            if (currentAction.toLowerCase() != $(this).text().toLowerCase().trim()) {
                var parentObject = $(this).closest("tr");
                $(parentObject).find("input[type=checkbox]").prop("checked", false);
            }
        });
        setTimeout(function () {
            selectedRows = $(grid).find("tbody tr").find("input[type=checkbox]:checked").length;
            if (length != selectedRows) {
               $("#header-checkbox").prop("checked", false);
            }
            if (parseInt(selectedRows) > 0) {
                onUpdateStatusAll(event);
            } else {
                toastr.error("Here is no order to perform this action. Please try again!");
            }
        }, 300);
    }
    else {

        if ($("#toast-container").length == 0) {
            toastr.error("Please select atleat one order to perform this action!");
        }
    }
   
}
 