$(document).ready(function () {
       
    $("[id$=btnPrintQr]").click(function () {
        setTimeout(function () {
            var number = 1 + Math.floor(Math.random() * 6);
            var receipt = $("#qrCodeImage").html();
            var doc = window.open('', 'Receipt', 'height=500, width=500');
            doc.document.write('<html>');
            doc.document.write('<body>');
            doc.document.write('<link rel="stylesheet" href="/css/dashboard.css?' + number + '" type="text/css" />');
            doc.document.write('<link rel="stylesheet" href="/css/dataTables.bootstrap4.min.css" type="text/css" />');
            doc.document.write('<link rel="stylesheet" href="/css/receiteprint.css?' + number + '" type="text/css" />');
            doc.document.write(receipt);
            doc.document.write('</body></html>');
            doc.document.close();
            setTimeout(function () { doc.print(); }, 500)
        }, 500)
    });

    $("[id$=btnCancelQr]").click(function () {
        $("[id$=viewQRCode]").hide();
    });
      
    $('#chkqrCode').change(function () {
        if ($(this).is(":checked")) {
            $("[id$=spnQRCode]").text("Disable Scan QR code")
            $("[id$=viewQRCode1]").show();
        } else {
            $("[id$=spnQRCode]").text("Enable Scan QR code")
            $("[id$=viewQRCode1]").hide();
        }
    });

    $("[id$=viewQRCode1]").click(function () {
        $("[id$=viewQRCode]").show();
    });

    //var enableQRCode = $("[id$=chkqrCode]").is(":checked");
    //if (enableQRCode == true) {
    //    $("[id$=viewQRCode1]").show();
    //} else {
    //    $("[id$=viewQRCode1]").hide();
    //}

    $("[id$=editKitchen]").click(function () {
        $("[id$=editKitchenPopup]").show();
    });

    $("[id$=editUpdateKitchenCancel]").click(function () {
        $("[id$=editKitchenPopup]").hide();
    });

    $("[id$=btnManageKitchen]").click(function () {
        var displayDelivery = $('input[name="DisplayCalories"]:checked').val();
        var BusinessVmDTO = {
            IsDelivery: $("[id$=Delivery]").is(":checked"),
            IsPickup: $("[id$=Pickup]").is(":checked"),
            DisplayDelivery: displayDelivery == "Yes" ? true : false,
            MealLimit: $("[id$=mealLimit]").val().trim().length == 0 ? 0 : $("[id$=mealLimit]").val().trim(),
            DisplayMessage: $('#message').val(),
            MinimumTimeRequired: $("[id$=miniHrsReq]").val().trim(),
            DeliveryPrice: $("[id$=deliveryPrice]").val().trim().length == 0 ? 0.00 : $("[id$=deliveryPrice]").val().trim(),
            MinimumOrderAmount: $("[id$=minimum]").val().trim().length == 0 ? 0.00 : $("[id$=minimum]").val().trim(),
            Capacity: $("[id$=diningCapacity]").val().trim().length == 0 ? 0: $("[id$=diningCapacity]").val().trim(),
            IsScanCode: $("[id$=chkqrCode]").is(":checked"),
            IsKitchenOpen: $("[id$=chkOpenClose]").is(":checked"),
            VendorCharges: $("[id$=vendorCharges]").val().trim(),
            IsReceiveOrderNotes: $("[id$=chkReceiveOrderNotes]").is(":checked"),
            IsMinDelivery: $("[id$=chkIsMinDeliverySlot]").is(":checked"),
            MinDeliveryTime: $("[id$=txtMinDeliveryTime]").val().trim().length == 0 ? 0 : $("[id$=txtMinDeliveryTime]").val().trim(),
            VendorDiscountPercentage: $("[id$=txtVendorDiscountPercentage]").val().trim().length == 0 ? 0 : $("[id$=txtVendorDiscountPercentage]").val().trim(),
            RequireAvailableQty: $("[id$=chkIsDishQty]").is(":checked"),
            PickupMinimumOrderAmount: $("[id$=minimumPickupOrderAmount]").val().trim().length == 0 ? 0.00 : $("[id$=minimumPickupOrderAmount]").val().trim(),
        };
        
        if ($("[id$=miniHrsReq]").val().trim().length > 0) {
            if ($("[id$=chkIsMinDeliverySlot]").is(":checked") && ($("[id$=txtMinDeliveryTime]").val().trim().length == 0 || parseInt(($("[id$=txtMinDeliveryTime]").val())) == 0)) {
                if (parseInt(($("[id$=txtMinDeliveryTime]").val())) == 0)
                    onToastrError('Please enter valid minimum delivery time!');
                else
                    onToastrError('Minimum delivery time is required!');
                return false;
            }
            showLoading();
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "json";
            CommonJsFunction.Ajax("/ManageKitchen/UpsertBussiness", CommonJsFunction.MethodType.POST, JSON.stringify(BusinessVmDTO), function (result) {
                hideLoading();
                if (parseInt(result) > 0) {
                    onToastrSuccess("Saved successfully!");
                }
                else
                    onToastrError('Please try again!');  
            });
        }
        else {
                onToastrError('Minimum hours is required!');  
        }
    });

    $("[id$=Delivery]").change(function () {
        if ($(this).is(":checked")) {
            $("[id$=deliveryDetailsContainer]").show();
        } else {
            $("[id$=deliveryDetailsContainer]").hide();
        }
    });

    $("[id$=Pickup]").change(function () {
        if ($(this).is(":checked")) {
            $("[id$=qrCodeContainer]").show();
        } else {
            $("[id$=qrCodeContainer]").hide();
        }
    });

    $(".decimalonly").blur(function () {
        if (isNaN(parseFloat(this.value)))
            this.value = '';
        else
            this.value = parseFloat(this.value).toFixed(2);
    });

    $('.numberonly').keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode
        if (String.fromCharCode(charCode).match(/[^0-9]/g))
            return false;
    }); 

    $("[id$=aMenuItems]").click(function () {
        window.location.href = "/manage/menuitems?t=" + $("[id$=hdnEncryptedSystemTime]").val() + "";
    });

    $('#chkIsMinDeliverySlot').change(function () {
        if ($(this).is(":checked")) {
            $("[id$=lblMinDeliveryTime]").show();
            $("[id$=cntMinimumDeliveryTime]").show();
            var DTT = $("[id$=txtMinDeliveryTime]");
            //$(DTT).val("");
            $(DTT).show();      
            $("[id$=spnMinDeliveryTime]").text("Disable minimum delivery time");
        } else {
            $("[id$=lblMinDeliveryTime]").hide();
            $("[id$=txtMinDeliveryTime]").hide();
            $("[id$=cntMinimumDeliveryTime]").hide();
            $("[id$=spnMinDeliveryTime]").text("Enable minimum delivery time");
        }
    });

    $("[id$=txtMinDeliveryTime]").keyup(function () {      
        var V = $(this).val().replace(/Min(s)/g, "");
        if (parseInt(V) == 0) {
            onToastrError('Please enter time greater than 0!');
            $(this).val("");
        }
        else if (parseInt(V) >= 60 ) {
            onToastrError('Please enter time less than 60!');
            $(this).val("");
        }
    });

    $("[id$=txtVendorDiscountPercentage]").keyup(function () {
        var V = $(this).val();
       if (parseInt(V) > 100) {
            onToastrError('Please enter percentage less than or equal 100!');
            $(this).val("");
        }        
    });
});

function RemoveSlot(evt) {
    $(evt).parent().parent().remove();    
}

function Decimalonly(event) {
    if (isNaN(parseFloat(event.value)))
        event.value = '';
    else
        event.value = parseFloat(event.value).toFixed(2);
};


