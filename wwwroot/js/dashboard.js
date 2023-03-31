$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/Dashboard/GetRevenueChart",
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
    $("#search").autocomplete({
        source: function (request, response) {
            showLoading();
            $.ajax({
                url: "/Dashboard/AutoCompleteKitchen",
                type: "POST",
                dataType: "json",
                data: { search: request.term },
                success: function (data) {
                    hideLoading();
                    response($.map(data.result, function (item) {
                        return { label: item.kitchenId + " - " + item.kitchenName, value: item.kitchenId };
                    }));

                }
            })
        },
        change: function () {
        },
        select: function (event, ui) {
            showLoading();
            setTimeout(function () {
                $("#button-search_kitchen").click();
            }, 300);
        }
    });
    $(".order_summary--filters").click(function () {
        var type = $(this).attr("type");
        $(".order_summary--filters").removeClass("filter_active");
        $(this).addClass("filter_active");
        onLoadOrderSummary(type);
    });
    $('.delete--action').bootstrap_confirm_delete(
        {
            callback: function (event) {
                showLoading();
                var kitchenId = (event.data.originalObject).attr("data");
                $.ajax({
                    url: "/Dashboard/DeleteKitchen",
                    type: "POST",
                    dataType: "json",
                    data: { kitchenId: kitchenId },
                    success: function (data) {
                        hideLoading();
                        setTimeout(function () {
                            toastr.success("Kitchen/s Removed Successfully!");
                            event.data.originalObject.closest('tr').remove();
                        }, 300);
                    }
                })
            }
        }
    );
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
        url: "/Dashboard/GetOrderSummaryChart",
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
            if (parseInt(response.totalOrder) ==  1) {
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
