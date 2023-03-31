$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/kitchendashboard/GetRevenueChart",
        data: {},
        dataType: "json",
        success: function (response) {
            $("#revenue-chart").simpleBarGraph({
                data: response,
                rowsCount: 8,
                height: "200px",
                rowCaptionsWidth: "24px",
                barsColor: "#3D9970"
            });

        },
    });
    onLoadOrderSummary("Monthly");
    $(".order_summary--filters").click(function () {
        var type = $(this).attr("type");
        $(".order_summary--filters").removeClass("filter_active");
        $(this).addClass("filter_active");
        onLoadOrderSummary(type);
    });
});

function onLoadOrderSummaryChart() {
    $("#ordersummary-chart").percentcircle({
        animate: true,
        diameter: 100,
        guage: 10,
        coverBg: '#fff',
        bgColor: '#efefef',
        fillColor: '#4885ed',
        percentSize: '18px',
        percentWeight: 'normal'
    });
}
function humanizeNumber(n) {
    n = n.toString()
    while (true) {
        var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
        if (n == n2) break
        n = n2
    }
    return n
}
function humanizeNumber(n) {
    n = n.toString()
    while (true) {
        var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
        if (n == n2) break
        n = n2
    }
    return n
}
function showLoading() {
    $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
}
function hideLoading() {
    $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
}

function onLoadOrderSummary(type) {
    $.ajax({
        url: "/KitchenDashboard/GetOrderSummaryChart",
        type: "POST",
        dataType: "json",
        data: { type: type },
        success: function (response) {
            $("#ordersummary-chart").html("");
            $("#ordersummary-chart").attr("data-percent", response.orderPercentage);
            $(".total_order").text(humanizeNumber(response.totalOrder));
            if (parseInt(response.totalOrder) > 1) {
                $(".text_orders_UPDTE").text("Orders");
            }
            if (parseInt(response.totalOrder)  == 1) {
                $(".text_orders_UPDTE").text("Order");
            }            
            $(".total_count--rejected").text(humanizeNumber(response.rejected));
            $(".total_count--deleivered").text(humanizeNumber(response.delivered));
            $(".total_count--cancelled").text(humanizeNumber(response.cancelled));
            $(".total_count--pickup").text(humanizeNumber(response.pickup));
            setTimeout(function () {
                onLoadOrderSummaryChart();
            }, 300);

        },
    });

}