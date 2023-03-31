$(document).ready(function () {
    onBindEvents();
});

function onBindEvents() {
    $(".balance-invoice").click(function () {
        showLoading();
        $.ajax({
            url: "/Report/GetBalanceInvoice",
            type: "POST",
            dataType: "html",
            data: { search: $(this).attr("data") },
            success: function (data) {
                $("body").addClass("overflow-hidden");
                $('.invoice--info').html(data);
                $("#balanceInvoice").show();
                hideLoading();
            }
        });
    });
}

function showLoading() {
    $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
}

function hideLoading() {
    $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
}

function onClose() {
    $("#balanceInvoice").hide();
}