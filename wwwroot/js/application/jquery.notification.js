$(document).ready(function () {
    var soundObject = null;
    $.ajax({
        url: "/Notification/OrderNotification",
        type: "GET",
        dataType: "json",
        data: {},
        success: function (response) {
            if (response != null && response != undefined) {
                if (response.count != null && response.count != undefined) {
                    OrderNotification(response);
                }
            }
        }
    });
    setInterval(function () {
        
        $.ajax({
            url: "/Notification/OrderNotification",
            type: "GET",
            dataType: "json",
            data: {},
            success: function (response) {               
                if (response != null && response != undefined) {                  
                    OrderNotification(response);
                }                
            }
        });
    }, 500);
});

function BindHtml(templateID, data) {   
    var templateHtml = $("#" + templateID).html();
    for (p in data) {
        var regExp = new RegExp('\\$T\\.' + p, 'g');
        templateHtml = templateHtml.replace(regExp, data[p]);
    }    
    return templateHtml;
};

function RedirectToOrders(event) {
    var menuLength = $("#sidenavAccordion").find(".nav > .nav-link").length;
    if (menuLength > 0) {
        window.location.href = $(event).attr("action");
    } else {
        $("#notificationDropdownContainer").addClass("show");
        alert("Please select the Kicthen!");
    }
}

function OrderNotification(response) {
    if (response.count != null && response.count != undefined) {
        if (parseInt(response.count) > 99) {
            $("#pdOc").text("+99");
        } else {
            $("#pdOc").text(response.count);
        }
        var count = $("#hdnPO").val();
        if (count != null && count != undefined) {
          
            if (parseInt(response.count) > parseInt(count)) {
            //if (1==1) {
                //var orderNotifyBell = new Audio("/css/Order_Tone.mp3");
                //orderNotifyBell.play();                 
                var x = document.getElementById("pendingOrderTone");
                x.play()
                $("#hdnPO").val(response.pendingOrders);
            }
            else {
                $("#hdnPO").val(response.pendingOrders);
            }
        }
        $("#hdnPO").val(response.pendingOrders);
        var templateHtml = "";
        var notificationDropdownContainer = $("#notificationDropdownContainer");
        $(notificationDropdownContainer).html('');
        if (response != null && response.orders != null && response.orders.length > 0) {
            for (var i = 0; i < response.orders.length; i++) {
                templateHtml = BindHtml("notificationsHtml", response.orders[i]);
                if (i == 0) {
                    $(notificationDropdownContainer).append('<div class="row"><div class="col-12 p-2 text-center_ font-weight-600 font-size-20 roboto-bold">Notifications</div></div> <div class="dropdown-divider"></div>');
                }
                $(notificationDropdownContainer).append(templateHtml);
            }
        }
        else {

            $("#notificationDropdownContainer").html('<div class="row"><div class= "col-12 text-center p-2" >No notification found!</div></div>');
        }
    }
    else {

        $("#notificationDropdownContainer").html('<div class="row"><div class= "col-12 text-center p-2" >No notification found!</div></div>');
    }

}

