function onGetOrderInformation(evt) {
    var orderId = $(evt).attr("data");
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetOrderInformationForPrint",
        type: "POST",
        dataType: "html",
        data: { orderId: orderId },
        success: function (data) {               
            $("#receipt-container").html('').html(data);          
            setTimeout(function () {
                printReceipt('receipt-container')
            },300)
            hideLoading();
        }
    });
}