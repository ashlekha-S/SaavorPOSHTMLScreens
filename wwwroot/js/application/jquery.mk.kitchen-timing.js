var deletedSlots = [];

$(document).ready(function () {
    setTimeout(function () {
        $('.deliverySlots').each(function () {
            $(this).focus();
        });
    }, 50)

    $("[id$=timepickerFrom]").timepicker({
        uiLibrary: 'bootstrap4'
    });

    $("[id$=timepickerTo]").timepicker({
        uiLibrary: 'bootstrap4'
    });

    $(document).on('click', '.add-slot', function () {        
        var p = $(this).closest("#addslots");
        var slotContainerHtml = "slot-container-html";
        var tableBody = "tbl-pickUp-Slots";
        if (p.length === 0) {
            p = $(this).closest("#addDeliverySlots");
            slotContainerHtml = "slot-container-html-delivery";
            tableBody = "tbl-delivery-Slots";
        }

        var slothtml = $("[id$=" + slotContainerHtml + "]").find("tbody").html();
        $(p).find("[id$=" + tableBody+"]").find("tbody").append(slothtml);
        $('.deliverySlots').each(function () {
            $(this).focus();
        });
    }); 

    $(document).on('click', '.remove-slot', function () {
        var element = $(this).attr("element");
        if (element != undefined) {
            deletedSlots.push(parseInt(element));
        }
        $(this).parent().parent().remove();
    });    

    $('body').on('focus', ".deliverySlots", function () {
        $(this).timepicker({
            uiLibrary: 'bootstrap4' 
        });
    });
      
    $('[id$=cbopenclose]').change(function () {
        if ($(this).is(":checked")) {
            $("[id$=kopenclosestatus]").text("Open");
            if (parseInt($("[id$=hdn24hrs]").val()) > 0 ) {
                $("[id$=tfrom],[id$=tto]").hide();
                $("[id$=24hours],[id$=pdslots],[id$=addslots]").show();
            }
            else {
                $("[id$=24hours],[id$=tfrom],[id$=tto],[id$=pdslots],[id$=addslots],[id$=deliverySlots],[id$=addDeliverySlots]").show();
            }
            
        } else {
            $("[id$=kopenclosestatus]").text("Closed");
            $("[id$=24hours],[id$=tfrom],[id$=tto],[id$=pdslots],[id$=addslots],[id$=deliverySlots],[id$=addDeliverySlots]").hide();
        }
    });

    $('[id$=cb24hours]').change(function () {
        if ($(this).is(":checked")) {
            $("[id$=timepickerFrom]").val("12:00 AM");
            $("[id$=timepickerTo]").val("11:59 PM");
            $("[id$=tfrom],[id$=tto]").hide();
        } else {
            $("[id$=timepickerFrom],[id$=timepickerTo]").val("");
            $("[id$=tfrom],[id$=tto]").show();
        }
    });     

    $("[id$=btn-add-timing]").click(function () {          
        var start = $("[id$=timepickerFrom]").val();
        var end = $("[id$=timepickerTo]").val();
        start = new Date("May 26, 2016 " + start);
        end = new Date("May 26, 2016 " + end);
        var isClosed = $('[id$=cbopenclose]').is(":checked");

        if ($("[id$=timepickerFrom]").val().length == 0 && isClosed) {
            onToastrError('Please enter start time.');
            return false;
        }
        if ($("[id$=timepickerTo]").val().length == 0 && isClosed) {
            onToastrError('Please enter end time.');
            return false;
        }
         
        var result = end.getTime() - start.getTime();
        //var is24Hrs = $("[id$=cb24hours]").is(":checked");
        var is24Hrs = false;

        if (result <= 0 && isClosed && is24Hrs == false) {
            if (result == 0)
                onToastrError('End time should be greater than Start time');
            else
                onToastrError('Select valid time.');
        } else {
            
            var res = onAddDeliverySlots();         
            if (!res)
                return false;

            var b = onGetParameterValues("b");
            var TimingDTO = {
                AvailableFrom: $("[id$=timepickerFrom]").val(),
                AvailableTo: $("[id$=timepickerTo]").val(),
                //IsFullDay: $('[id$=cb24hours]').is(":checked"),
                IsFullDay: false,
                IsOpen: $('[id$=cbopenclose]').is(":checked"),
                EncryptedBusinessTimingID: b,
                DaysName: $(".dayname").text()
            };
            showLoading();
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "json";
            CommonJsFunction.Ajax("/ManageKitchen/UpsertTiming", CommonJsFunction.MethodType.POST, JSON.stringify(TimingDTO), function (result) {
                hideLoading();                 
                if (parseInt(result.status) > 0)
                {
                    onToastrSuccess("Saved successfully!");
                    setTimeout(function () {
                        if (result.businessTimingId > 0)
                            window.location.href = window.location.href;
                        else
                            window.location.href = "/manage/timing";

                    }, 300)
                }
                else
                    onToastrError('Please try again!');
            });
        }     

    });

    $('[id$=btn-add-slots]').click(function () {
        var DeliverySlotsDTO = [];
        var isValid = true;
        var b = onGetParameterValues("b");
        var prevStartTime;
        var prevEndTime;

        $("[id$=slot-container]").find(".row").each(function () {
            var element = $(this).find("[id$=slot-start]").attr("element");
            var start = $(this).find("[id$=slot-start]").val();
            var end = $(this).find("[id$=slot-end]").val();
            var slotType = $(this).find("[id$=hndSlotType]").val();
            var maximumOrder = $(this).find("[id$=slot-pickup]").val();

            if (prevStartTime != undefined && prevEndTime != undefined && prevStartTime == start && prevEndTime == end) {
                onToastrError('Enter a different delivery slot');
                isValid = false;
                return false;
            }

            prevStartTime = start            
            prevEndTime = end

            start = new Date("May 26, 2016 " + start);
            end = new Date("May 26, 2016 " + end);
            var result = end.getTime() - start.getTime();
            if (result <= 0) {
                if (result == 0)
                    onToastrError('End time should be greate than Start time');
                else                 
                    onToastrError('Enter a valid delivery slot');
                isValid = false;
                return false;
            } else {
                DeliverySlotsDTO.push({
                    AvailableFrom: moment(start, 'hh:mm A').format('HH:mm'),
                    AvailableTo: moment(end, 'hh:mm A').format('HH:mm'),
                    BusinessTimingId: b == undefined ? '' : b,
                    DeletedSlots: deletedSlots,
                    DeliverySlotId: element != undefined ? parseInt(element) : 0,
                    SlotType: slotType,
                    MaximumOrders: maximumOrder
                });
            }         
        });

        if (isValid) {            
            showLoading();
            CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
            CommonJsFunction.AjaxContent.DataType = "json";
            CommonJsFunction.Ajax("/ManageKitchen/UpsertSlots", CommonJsFunction.MethodType.POST, JSON.stringify(DeliverySlotsDTO), function (result) {
                hideLoading();
                if (parseInt(result) > 0)
                {
                    onToastrSuccess("Saved successfully!");
                    setTimeout(function () {
                        window.location.reload();
                    },300)
                }
                else
                    onToastrError('Please try again!');
            });
        }   
    });

    $('.numberonly').keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode
        if (String.fromCharCode(charCode).match(/[^0-9]/g))
            return false;
    }); 

    $('.numberonly').on("cut copy paste", function (e) {
        e.preventDefault();
    });
});

function onRebindPicker() {
    $('body').on('focus', ".deliverySlots", function () {
        $(this).timepicker({
            uiLibrary: 'bootstrap4'
        });
    });
}

function onAddDeliverySlots() {
    var DeliverySlotsDTO = [];
    var isValid = true;
    var b = onGetParameterValues("b");
    var prevStartTime;
    var prevEndTime;
    var isDeliverySlotFill = true;
    var conditionResult = false;

    $("[id$=slot-container]").find("tbody").find("tr").each(function () {        
        var element = $(this).find("[id$=slot-start]").attr("element");
        var start = $(this).find("[id$=slot-start]").val();
        var end = $(this).find("[id$=slot-end]").val();
        var slotType = $(this).find("[id$=hndSlotType]").val();
        var maximumOrder = $(this).find("[id$=slot-pickup]").val();
       
        if (maximumOrder != undefined && maximumOrder != "" && !$.isNumeric(maximumOrder)) {           
            onToastrError('Maximum order must have mumeric value!');
            isValid = false;
            return false;
        }
        if (prevStartTime == undefined && prevEndTime == undefined && start.length == 0 && end.length == 0) {
            isValid = false;
            isDeliverySlotFill = false;
            conditionResult = true;
            return true;
        }

        if (prevStartTime != undefined && prevEndTime != undefined && prevStartTime == start && prevEndTime == end) {
            onToastrError('Enter a different delivery slot');
            isValid = false;
            return false;
        }

        prevStartTime = start
        prevEndTime = end

        isDeliverySlotFill = true;
        conditionResult = false;

        start = new Date("May 26, 2016 " + start);
        end = new Date("May 26, 2016 " + end);
        var result = end.getTime() - start.getTime();
        if (result <= 0) {
            if (DeliverySlotsDTO.length > 0) {
                isValid = true;
                return true;
            }
            else if (result == 0)
                onToastrError('End time should be greate than Start time');
            else
                onToastrError('Enter a valid delivery slot');
            isValid = false;
            return false;
        } else {
            isValid = true;
            DeliverySlotsDTO.push({
                AvailableFrom: moment(start, 'hh:mm A').format('HH:mm'),
                AvailableTo: moment(end, 'hh:mm A').format('HH:mm'),
                BusinessTimingId: b == undefined ? '' : b,
                DeletedSlots: deletedSlots,
                DeliverySlotId: element != undefined ? parseInt(element) : 0,
                SlotType: slotType,
                MaximumOrders: maximumOrder
            });
        }
    });

    if (isValid == false && isDeliverySlotFill == false && conditionResult)
        return true;

    if (isValid) {    
        showLoading();
        var data = JSON.stringify(DeliverySlotsDTO);
        var URL = "/ManageKitchen/UpsertSlots";
        CommonJsFunction.AjaxContent.ContentType = "application/json; charset=utf-8";
        CommonJsFunction.AjaxContent.DataType = "json";
        if (DeliverySlotsDTO.length == 0) {
            data = JSON.stringify(b);
            URL = "/ManageKitchen/DeleteSlots"
        }
        CommonJsFunction.Ajax(URL, CommonJsFunction.MethodType.POST, data, function (result) {
            hideLoading();
            if (parseInt(result) > 0) {
                //onToastrSuccess("Saved successfully!");
                //setTimeout(function () {
                //    window.location.reload();
                //}, 300)
                return true;
            }
            else {
                onToastrError('Please try again!');
                return false;
            }
               
        });
        return true;
    }  
}