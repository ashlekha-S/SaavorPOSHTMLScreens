$(document).ready(function () {
    $('.delete--action').bootstrap_confirm_delete(
        {
            callback: function (event) {
                showLoading();
                var reviewId = (event.data.originalObject).attr("data");
                $.ajax({
                    url: "/KitchenDashboard/DeleteKitchenReview",
                    type: "POST",
                    dataType: "json",
                    data: { reviewId: reviewId },
                    success: function (data) {
                        hideLoading();
                        setTimeout(function () {
                            toastr.success("Review has been deleted successfully!");
                            event.data.originalObject.parents('.row').remove();
                        }, 300);
                    }
                })
            }
        }
    );
    $(".review-reply").click(function () {
        showLoading();
        var reply = $("#txtReply").val();
        var id = $("#hdnId").val();
        $.ajax({
            url: "/KitchenDashboard/ReviewReply",
            type: "POST",
            dataType: "json",
            data: { reply: reply, id: id },
            success: function (data) {
                $("#replyToReview").hide();
                hideLoading();
                location.reload();
            }
        });
    });
});

function onReply(evt) {
    var data = $(evt).attr("data");
    $("#hdnId").val(data);
    $("#replyToReview").show();
}

function showLoading() {
    $(".loading_container_overlay,.loader_container").addClass("show").removeClass("hide");
}

function hideLoading() {
    $(".loading_container_overlay,.loader_container").addClass("hide").removeClass("show");
}