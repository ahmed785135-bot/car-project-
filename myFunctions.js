/* myFunctions.js */
$(document).ready(function() {
    // إظهار/إخفاء التفاصيل
    $('.details-toggle').change(function() {
        var rowId = $(this).attr('id').replace('detail-', '');
        $('#info-' + rowId).toggle();
    });

    // إظهار نموذج الحجز
    $('#continue-btn').click(function() {
        if ($('.car-select:checked').length > 0) {
            $('#booking-form-container').show();
        } else {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
        }
    });

    // التحقق من النموذج وحساب التكلفة
    $('#booking-form').submit(function(e) {
        e.preventDefault();
        
        var name = $('#fullname').val();
        var nid = $('#nid').val();
        var sDate = $('#start_date').val();
        var eDate = $('#end_date').val();
        var mobile = $('#mobile').val();
        var email = $('#email').val();

        // التعابير النمطية للتحقق
        var nameRegex = /^[\u0600-\u06FF\s]+$/;
        var nidRegex = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        var mobileRegex = /^09(3|4|5|6|8|9)[0-9]{7}$/;

        if (!nameRegex.test(name) && name !== "") {
            alert("الاسم يجب أن يحتوي أحرفاً عربية فقط.");
            return;
        }
        if (!nidRegex.test(nid)) {
            alert("الرقم الوطني غير صالح. يجب أن يتكون من 11 خانة ويبدأ برمز محافظة صحيح (01-14).");
            return;
        }
        
        var start = new Date(sDate);
        var end = new Date(eDate);
        if (sDate === "" || eDate === "" || end <= start) {
            alert("يرجى التحقق من التواريخ. يجب أن يكون تاريخ النهاية لاحقاً للبداية.");
            return;
        }

        if (mobile !== "" && !mobileRegex.test(mobile)) {
            alert("رقم الموبايل غير صالح.");
            return;
        }

        // الحسابات
        var timeDiff = Math.abs(end.getTime() - start.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        var totalCost = 0;
        var selectedCarsInfo = "السيارات المختارة:\n";
        
        $('.car-select:checked').each(function() {
            var price = parseFloat($(this).data('price'));
            var carModel = $(this).data('model');
            totalCost += (price * diffDays);
            selectedCarsInfo += "- " + carModel + "\n";
        });

        var discount = 0;
        if (diffDays > 7) {
            discount = totalCost * 0.10;
        }
        var finalCost = totalCost - discount;

        var resultMsg = selectedCarsInfo +
                        "عدد أيام التأجير: " + diffDays + "\n" +
                        "المجموع: " + totalCost + " ل.س\n" +
                        "الخصم: " + discount + " ل.س\n" +
                        "المبلغ النهائي: " + finalCost + " ل.س";
        
        alert(resultMsg);
    });
});