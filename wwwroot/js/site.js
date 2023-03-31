// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
     
    var location = window.location.href.toLocaleLowerCase();       
    $(".nav-link").removeClass("active");
    if (location.indexOf("home") > 0)
        $(".home_").addClass("active");
    else if (location.indexOf("manageusers") > 0)
        $(".manage_users").addClass("active");
    else if (location.indexOf("orders") > 0)
        $(".manage_orders").addClass("active");
    else if (location.indexOf("managereports") > 0)
        $(".manage_reports").addClass("active");
    else if (location.indexOf("reviewfeedbacks") > 0)
        $(".reviewfeedbacks").addClass("active");
    else if (location.indexOf("refund") > 0)
        $(".refunds").addClass("active");
    else if (location.indexOf("messages") > 0 || location.indexOf("message") > 0)
        $(".messages").addClass("active");
    else if (location.indexOf("dashboard") > 0 || location.indexOf("kitchendashboard") > 0)
        $(".dashboard_").addClass("active");
    else if (location.indexOf("report") > 0) {
        $(".manage_reports,.financial_reports").removeClass("collapsed");
        $("#managereport").addClass("collapse show");
        $(".list-group-item-action").removeClass("active");
        if (location.indexOf("report/financial") > 0) {
            $("#financialreport").addClass("collapse show");
            if (location.indexOf("report/financial/school") > 0) {
                $(".financialreports_school").addClass("active");
            }
            else if (location.indexOf("report/financial/saavor") > 0) {
                $(".financialreports_saavor").addClass("active");
            }
            else {
                $(".financialreports").addClass("active");
            }
        }
        else if (location.indexOf("report/order") > 0) {
            $(".managereports").addClass("active");
        }
        else if (location.indexOf("report/balance") > 0) {
            $(".managebalance").addClass("active");
        }
        else if (location.indexOf("userdata") > 0)
            $(".manage_users_data").addClass("active");
    }
    else if (location.indexOf("manage") > 0) {
        $(".manage_kitchen").removeClass("collapsed");
        $("#manageKitchen").addClass("collapse show");
        $(".list-group-item-action").removeClass("active");
        if (location.indexOf("groupcode") > 0) {
            $(".groupCode").addClass("active");
        }  
        else if (location.indexOf("manage") > 0) {
            $(".kitchenConfiguration").addClass("active");
        }         
    }
   

    $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
    //onNewOrderPlace();
    GetEncryptedBrowserDate();

    $('[data-toggle="tooltip"]').tooltip();

});

function onSystemDateTime() {
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var min = currentDate.getMinutes()
    var format = "AM";
    if (hour > 11) { format = "PM"; }
    if (hour > 12) { hour = hour - 12; }
    if (hour == 0) { hour = 12; }
    if (hour < 10) { hour = "0" + hour; }
    if (min < 10) { min = "0" + min; }
    currentDate = yyyy + '-' + mm + '-' + dd + " " + hour + ":" + min + " " + format;
    return currentDate;
}

function onSystemDate() {
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var min = currentDate.getMinutes()
    var format = "AM";
    if (hour > 11) { format = "PM"; }
    if (hour > 12) { hour = hour - 12; }
    if (hour == 0) { hour = 12; }
    if (hour < 10) { hour = "0" + hour; }
    if (min < 10) { min = "0" + min; }
    currentDate = yyyy + '-' + mm + '-' + dd;
    return currentDate;
}

function onLoadKitchenUserInformation(userId) {
    showLoading();
    $.ajax({
        url: "/KitchenDashboard/GetManagerUserInfo",
        type: "POST",
        dataType: "html",
        data: { userId: JSON.stringify(userId) },
        success: function (data) {
            $('.cont_manager_user--infor').html(data);
             $("#managerUserInformation").show();
            hideLoading();
        }
    })
}

function showLoading() {
    $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
}

function hideLoading() {
    $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
}

function generatePDF(reportheader, filename, tableId, pageType) {   
    var doc = new jsPDF('p', 'pt', 'letter');
    if ("financialDataTableExport" == tableId) {
        doc = new jsPDF('l', 'pt', 'letter');

        $('#financialDataTableExport tr').each(function () {
           // if (!$.trim($(this).text())) $(this).remove();
            if ($(this).find("td").length == 1) $(this).remove();
        });
    }
   
    var htmlstring = '';
    var tempVarToCheckPageHeight = 0;
    var pageHeight = 0;
    pageHeight = doc.internal.pageSize.height;
    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    margins = {
        top: 150,
        bottom: 60,
        left: 40,
        right: 40,
        width: 600
    };
    var y = 20;
    doc.setLineWidth(2);
    doc.text(40, y = y + 30, reportheader);
    doc.autoTable({
        html: '#' + tableId,
        startY: 70,
        theme: 'grid',
        //columnStyles: {
        //    0: {
        //        cellWidth: 80,
        //    },
        //    1: {
        //        cellWidth: 120,
        //    },
        //    2: {
        //        cellWidth: 100,
        //    },
        //    3: {
        //        cellWidth: 180,
        //    },
        //    4: {
        //        cellWidth: 80,
        //    }
        //},
        styles: {
            mincellheight: 40
        }
    })
    doc.save(filename);    
}

function printReceipt(containerId) {
    $.ajax({
        url: "/Home/GetBrowserDate",
        type: "POST",
        dataType: "html",
        data: { browserDate:onSystemDateTime() , formate:"ddd MMM yy" },
        success: function (data) {            
            if (data != null && data != undefined) {
                var datetime = data.split("-");
                var receipt_current_date_object = $(".receipt_current_date");
                var date = datetime[0].replace(/\"/g, '');
                var time = datetime[1].replace(/\"/g, '');
                var datetimehtml = "Received: " + date + " at " + time;
                $(receipt_current_date_object).html('');
                $(receipt_current_date_object).html(datetimehtml);
            }
        }
    })
    setTimeout(function () {
        var number = 1 + Math.floor(Math.random() * 6);
        var receipt = $("#" + containerId).html();
        var doc = window.open('', 'Receipt', 'height=500, width=500');
        doc.document.write('<html>');
        doc.document.write('<body>');
        doc.document.write('<link rel="stylesheet" href="/css/dashboard.css?' + number + '" type="text/css" />');
        doc.document.write('<link rel="stylesheet" href="/css/dataTables.bootstrap4.min.css" type="text/css" />');
        doc.document.write('<link rel="stylesheet" href="/css/receiteprint.css?' + number + '" type="text/css" />');
        doc.document.write(receipt);
        doc.document.write('</body></html>');
        doc.document.close();
        setTimeout(function () { doc.print(); doc.close(); }, 500)  }, 500)
    
}

function onNewOrderPlace() {
  
    //Appending HTML5 Audio Tag in HTML Body
    //$('<audio id="orderTone" controls autoplay><source src="/css/Order_Tone.mp3" type="audio/mpeg"/></audio>').appendTo('body');
    $('<audio id="player" autoplay><source src="/css/Order_Tone.mp3" type="audio/mp3"></audio>').appendTo('body');
    //var audio = new Audio("/css/Order_Tone.mp3");
    //audio.play();
   
}

// This function is used to get the query string value from URL
function onGetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

function onToastrError(messgae) {
    if ($("#toast-container").length == 0)
        toastr.error(messgae);  
}

function onToastrSuccess(messgae) {
     if ($("#toast-container").length == 0)
        toastr.success(messgae);
}

function GetEncryptedBrowserDate() {     
    CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
    CommonJsFunction.AjaxContent.DataType = "json";
    CommonJsFunction.Ajax("/ManageKitchen/GetEncryptedBrowserDate", CommonJsFunction.MethodType.POST, JSON.stringify(onSystemDate()), function (result) {
        if (result != null) {
            $("[id$=hdnEncryptedSystemTime]").val(result);
        }
        hideLoading(); 
    });
}

function iInfo() {
    $("#iInformation").show();
}
function iInfoClose() {
    $("#iInformation").hide();
    $("#iInformationGC").hide();
    $("#iInformationCD").hide();
    $("#iInformationDC").hide();
    $("#iInformationGC").hide();
}
function iInfoGC() {
    $("#iInformationGC").show();
}
function iInfoCD() {
    $("#iInformationCD").show();
}
function iInformationDC() {
    $("#iInformationDC").show();
}

function iInformationGC() {
    $("#iInformationGC").show();
}