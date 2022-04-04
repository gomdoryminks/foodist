/**
 * @author minks
 */

var userAgent = navigator.userAgent.toLowerCase();

$(function() {    
    //리사이즈
    $(window).resize(function() {
        //관심상품 그룹 리스트 높이 설정
        setWishListBoxHeight();
        
        
        //리스트 타입이 썸네일인 상품 리스트 높이 설정
        setGoodsThumbListHeight();
        
        
        //레이어 팝업 높이 설정
        $(".layer_content_area").each(function() {
            if ($(this).hasClass("on")) {
                var layerId = $(this).attr("id");
                
                //레이어 팝업 열기
                openLayer(layerId);
            }
        });
    });
    
    
    //텍스트박스 클릭시 텍스트 삭제 버튼 보이기&숨기기
    $(".content_text").on("focus", function() {
        if (($(this).next(".content_text_btn").length > 0) && ($(this).prop("readonly") !== true)) {
            if ($(this).val() != "") {
                $(this).addClass("on");
            } else {
                $(this).removeClass("on");
            }
        }
    });
    
    //텍스트박스 내용 변경시 텍스트 삭제 버튼 보이기&숨기기
	$(".content_text").on("propertychange change keyup paste input", function() {
        $(this).removeClass("success");
        $(this).removeClass("error");
        
        if (($(this).next(".content_text_btn").length) > 0 && ($(this).prop("readonly") !== true)) {
            if ($(this).val() != "") {
                $(this).addClass("on");
            } else {
                $(this).removeClass("on");
            }
        }
    });
    
    //텍스트 삭제 버튼 클릭시 텍스트박스 내용 삭제
    $(".content_text_btn").on("click", function() {
        if ($(this).prev(".content_text").length > 0) {
            $(this).prev(".content_text").removeClass("success");
            $(this).prev(".content_text").removeClass("error");
            $(this).prev(".content_text").val("");
            $(this).prev(".content_text").focus();
            
            //텍스트 글자수 출력
            setTextLength($(this).prev(".content_text"));
            
            if (($(this).prev(".content_text").prop("required") !== false) && ($(this).closest(".validForm").length > 0)) {
                //폼 유효성 검사
                validFormChk($(this).closest(".validForm"));
            }
        }
    });
    
    
    //텍스트 여러개일 경우 마우스오버시 하단 테두리 변경
    $(".content_text_area2 .content_text:not(.disable)").hover(function() {
        $(this).css("border-bottom","1px solid #d8d8d8");
    }, function() {
        var focusFlag = false;
        
        if ($(this).children("input").length > 0) {
            focusFlag = $(this).children("input").is(":focus");
        }
        
        if (focusFlag !== true) {
            $(this).css("border-bottom","1px solid #f5f5f5");
        }
    });
    
    //텍스트 여러개일 경우 텍스트 클릭시 하단 테두리 변경
    $(".content_text_area2 .content_text input").on("focus", function() {
        $(this).parent(".content_text").css("border-bottom","1px solid #d8d8d8");
    });
    
    //텍스트 여러개일 경우 텍스트 떠날때 하단 테두리 변경
    $(".content_text_area2 .content_text input").on("blur", function() {
        $(this).parent(".content_text").css("border-bottom","1px solid #f5f5f5");
    });
    
    //텍스트 여러개일 경우 활성화여부 설정
    $(".content_text_area2 .content_text.disable").each(function() {
        $(this).children("input").each(function() {
            $(this).prop("disabled",true);
        });
    });
    
    
    //검색박스 마우스오버시 검색박스 테두리 변경
    $(".search_text,.search_text + .content_text_btn,.search_btn").hover(function() {
        if ($(this).closest(".content_search_area").length > 0) {
            $(this).closest(".content_search_area").css("border","solid 1px #d8d8d8");
        }
    }, function() {
        var focusFlag = false;
        
        if ($(this).hasClass("search_text")) {
            focusFlag = $(this).is(":focus");
        } else if ($(this).hasClass("content_text_btn")) {
            focusFlag = $(this).prev(".search_text").is(":focus");   
        } else if ($(this).hasClass("search_btn")) {
            focusFlag = $(this).prev().children(".search_text").is(":focus");
        }
        
        if (focusFlag !== true) {
            if ($(this).closest(".content_search_area").length > 0) {
                $(this).closest(".content_search_area").css("border","solid 1px #f9f9f9");
            }
        }
    });
    
    //검색박스 클릭시 검색박스 테두리 변경
    $(".search_text").on("focus", function() {
        if ($(this).closest(".content_search_area").length > 0) {
            $(this).closest(".content_search_area").css("border","solid 1px #d8d8d8");
        }
    });
    
    //검색박스 떠날때 검색박스 테두리 변경
    $(".search_text").on("blur", function() {
        if ($(this).closest(".content_search_area").length > 0) {
            $(this).closest(".content_search_area").css("border","solid 1px #f9f9f9");
        }
    });
    
    
    //셀렉트박스 초기값 설정
    $(".content_select_area .select_tit,.content_select_area2 .select_tit").each(function() {
        selInnerRadioValue($(this));
    });
    
    //셀렉트박스 옵션 보이기&숨기기
    $(".content_select_area .select_tit,.content_select_area2 .select_tit").click(function() {
        if ($(this).hasClass("disable") !== true) {
            if ($(this).next(".select_list").length > 0) {
                if ($(this).hasClass("on")) {
                    $(this).next('.select_list').stop(true,true).slideUp(200);
                    $(this).removeClass("on");
                    return false;
                } else {
                    $(this).next('.select_list').stop(true,true).slideDown(200);		
                    $(this).addClass("on");
                    return false;
                }
            }
        }
    });
    
    //셀렉트박스 옵션 선택시 값 변경
    $(".content_select_area .select_list input[type='radio'],.content_select_area2 .select_list input[type='radio']").click(function() {
        var text = $(this).next("label").html();
        
        if ($(this).closest(".select_list").prev(".select_tit").length > 0) {
            $(this).closest(".select_list").prev(".select_tit").html(text);
            $(this).closest(".select_list").prev(".select_tit").removeClass("on");
        }
        
        if ($(this).closest(".content_temail_area").length > 0) {
            selInnerEmailValue($(this));
        }
        
        $(this).closest(".select_list").css("display","none");
    });
    
    
    //첨부파일 업로드
    $(".content_file_area .content_file_btn .content_file").change(function() {
        var agent = navigator.userAgent.toLowerCase(); //브라우저 체크
        var dataName = ($(this).attr("data-name")) ? $(this).attr("data-name") : "content_file"; //첨부파일 name 값 (기본값 : content_file)
        var dataCnt = ($(this).attr("data-cnt")) ? $(this).attr("data-cnt") : 1; //첨부파일 최대 개수 (기본값 : 1)
        var dataSize = ($(this).attr("data-size")) ? $(this).attr("data-size") : 0; //첨부파일 최대 용량 (단위 : MB)
        var datafile = $(this).clone(true); //첨부파일 복사
        var fileCnt = ($(".content_file_area .content_file_item .content_file[data-name='" + dataName + "']").length) ? $(".content_file_area .content_file_item .content_file[data-name='" + dataName + "']").length : 0; //현재 첨부파일 개수
        
        if ((dataCnt > 0) && (dataCnt > fileCnt)) {
            var fileName = "";
            var fileSize = 0;
            var maxSize = parseInt(dataSize) * 1024 * 1024;
            
            //첨부파일 용량 체크
            if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
                //브라우저가 ie일 경우
                var oas = new ActiveXObject("Scripting.FileSystemObject");
                fileSize = oas.getFile($(this)[0].value).size;
            } else {
                //브라우저가 ie가 아닐 경우
                fileSize = $(this)[0].files[0].size;
            }
            
            if (fileSize > 0) {
                if ((maxSize == 0) || (maxSize >= fileSize)) {
                    //첨부파일명 추출
                    if (window.FileReader) {
                        //기본 브라우저
                        fileName = $(this)[0].files[0].name;
                    } else {
                        //old IE
                        fileName = $(this).val().split('/').pop().split('\\').pop();
                    }

                    $(this).parent().after(datafile);
                    datafile.attr("name",dataName + "[]");
                    datafile.wrap("<div class='content_file_item cf'></div>");
                    datafile.after("<span class='content_file_del' onclick='fileDelete(this);'><img src='../img/file2x_delete.png' alt='file_delete'></span>");
                    datafile.after("<span class='content_file_txt'>" + fileName + "</span>");
                } else if (maxSize < fileSize) {
                    alertLayer("파일 용량이 " + dataSize + "MB를 초과했습니다.","");
                }
            }
            
            //첨부파일 버튼 초기화
            if (dataCnt == fileCnt + 1) {
                $(this).prop("disabled",true);
            }
            
            if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
                //브라우저가 ie일 경우
                $(this).replaceWith($(this).clone(true));
            } else {
                //브라우저가 ie가 아닐 경우
                $(this).val("");
            }
        } else {
            //첨부파일 버튼 초기화
            $(this).prop("disabled",true);
            
            if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
                //브라우저가 ie일 경우
                $(this).replaceWith($(this).clone(true));
            } else {
                //브라우저가 ie가 아닐 경우
                $(this).val("");
            }
        }
    });
    
    
    //숫자만 입력
    $("input[numberonly]").on("keyup", function() {
         $(this).val($(this).val().replace(/[^0-9-]/g,""));
    });
    
    
    //전화번호 입력시 -(하이픈) 자동입력
    $("input.tel_text").on("keydown", function(event) {
        var key = event.charCode || event.keyCode || 0;
        var $text = $(this);
        
        if (key !== 8 && key !== 9) {
            if ($text.val().length === 3) {
                $text.val($text.val() + '-');
            }
            
            if ($text.val().length === 8) {
                $text.val($text.val() + '-');
            }
        }
        
        return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
    });
    
    
    //비활성화 항목 안의 a태그 비활성화 설정 (ie전용) 
    $(".disable a").each(function() {
        if ($(this).css("pointer-events") == "none") {
            $(this).prop("disabled",true);
        }
    });
    
    
    //체크박스 전체체크 선택&해제 (로딩시, 체크박스 체크시)
    $("input[type='checkbox'][name='all_chk']").each(function() {
        setAllChk($(this));
    });
    
    $("input[type='checkbox'][name='all_chk']").change(function() {
        setAllChk($(this));
    });
    
    
    //텍스트 + 체크박스 항목에서 체크박스 체크시 텍스트에 값 넣기&빼기 (로딩시, 체크박스 체크시)
    $(".content_tchk_area .content_chk_area input[type='checkbox']").each(function() {
        chkInnerTextValue($(this));
    });
    
    $(".content_tchk_area .content_chk_area input[type='checkbox']").change(function() {
        chkInnerTextValue($(this));
    });
    
    
    //텍스트 글자수 출력 (로딩시, 텍스트 입력시)
    $(".content_tsize_area .content_text").each(function() {
        setTextLength(this);
    });
    
    $(".content_tsize_area .content_text").on("keyup", function() {
        setTextLength(this);
    });
    
    
    //반품신청시 상품체크여부에 따라 수량설정 가능&불가능 (로딩시, 체크박스 체크시)
    $(".order_goods_name .order_goods_chk .content_chk_area input[type='checkbox']").each(function() {
        chkClaimGoodsEa($(this));
    });
    
    $(".order_goods_name .order_goods_chk .content_chk_area input[type='checkbox']").change(function() {
        chkClaimGoodsEa($(this));
    });
    
    
    //배송지 활성화여부 설정
    $(".mypage_address .my_ad_list>li.disable").each(function() {
        $(this).find("input[type='radio']").prop("disabled", true);
    });
    
    
    //폼 유효성 검사 (로딩시, 요소변경시)
    $(".validForm").each(function() {
        validFormChk($(this));
    });
    
    $(".validForm input[type='radio'],.validForm input:required,.validForm textarea:required,.validForm input.required").on("propertychange change keyup paste input", function() {
        validFormChk($(this).closest(".validForm"));
    });
    
    
    //제목 클릭시 내용 보이기&숨기기
    $(".toggle_list dt").click(function() {
        if ($(this).next("dd").length > 0) {
            if ($(this).hasClass("on")) {
                $(this).next('dd').stop(true,true).slideUp(300);
                $(this).removeClass("on");
                return false;
            } else {
                $($(this).parent().children("dd")).stop(true,true).slideUp(300);
                $($(this).parent().children("dt")).removeClass("on");
                $(this).next('dd').stop(true,true).slideDown(300);		
                $(this).addClass("on");
                return false;
            }
        }
	});
    
    
    //상품 상세에서 가격 내용 보이기&숨기기
    /*$(".goods_detail .go_de_cart_area .go_de_cart_btn").click(function() {
        if ($(this).hasClass("on")) {
            $(this).next('.go_de_cart_con').stop(true,true).slideUp(300);
            $(this).removeClass("on");
            return false;
        } else {
            $(this).next('.go_de_cart_con').stop(true,true).slideDown(300);		
            $(this).addClass("on");
            return false;
        }
	});*/
    
    
    //주문서 내용 보이기&숨기기
    $(".toggle_order_list dt").click(function() {
        if ($(this).next("dd").length > 0) {
            if ($(this).hasClass("on")) {
                $(this).next('dd').stop(true,true).slideUp(300);
                $(this).removeClass("on");
                return false;
            } else {
                $(this).next('dd').stop(true,true).slideDown(300);		
                $(this).addClass("on");
                return false;
            }
        }
	});
    
    
    //탭 설정
    $(".content_tab_list>li>a").bind("click", function() {
        var dataTab = $(this).parent().attr("data-tab");
        
        if (dataTab != null && dataTab != undefined && dataTab != "") {
            $(".content_tab_list>li").removeClass("on");
            
            if ($(".content_tab_con").length > 0) {
                $(".content_tab_con").css("display","none");

                $(".content_tab_con").find("input").each(function() {
                    $(this).prop("disabled",true);
                });
            }
            
            $(this).parent().addClass("on");
            
            if ($(".content_tab_con").length > 0) {
                $("#" + dataTab).css("display","block");

                $("#" + dataTab).find("input").each(function() {
                    $(this).prop("disabled",false);
                });
            }
            
            //폼 유효성 검사
            validFormChk($(this).closest(".validForm"));
        }
    });
    
    $(".content_tab_list").each(function() {
        if ($(this).children("li.on").length > 0) {
            var tabIdx = $(this).children("li.on").index();
            $(this).children("li").eq(tabIdx).children("a").trigger("click");
        } else {
            if ($(this).children("li").length > 0) {
                var dataTab = $(this).children("li").eq(0).attr("data-tab");

                if (dataTab != null && dataTab != undefined && dataTab != "") {
                    $(this).children("li").eq(0).children("a").trigger("click");
                }
            }
        }
    });
    
    
    //헤더 하단 테두리 제거
    if (($(".content_search_area").length > 0) || ($(".content_category_area").length > 0)) {
        $("header.header").css("-webkit-box-shadow","none");
        $("header.header").css("-moz-box-shadow","none");
        $("header.header").css("box-shadow","none");
    }
    
    
    //레이어 팝업 닫기
    $(".layer_content_area .layer_mask:not(#alert_layer .layer_mask),.layer_content_area .layer_close_btn").click(function() {
        var layerId = $(this).closest(".layer_content_area").attr("id");
        
        closeLayer(layerId);
    });
    
    
    //모바일 더블 터치시 화면확대 방지
	document.documentElement.addEventListener('touchstart', function (event) {
		if (event.touches.length > 1) {
			event.preventDefault(); 
		} 
	}, false);
	
	var lastTouchEnd = 0; 

	document.documentElement.addEventListener('touchend', function (event) {
		var now = (new Date()).getTime();

		if (now - lastTouchEnd <= 300) {
			event.preventDefault(); 
		} lastTouchEnd = now; 
	}, false);
    
    
    if ($(".order_order").length > 0) {
        //주문시 배송요청사항 직접입력 항목 보이기/숨기기
        checkDemand();
        
        //주문시 결제수단에 따른 현금영수증 입력 항목 보이기/숨기기
        checkPayment();
        
        //주문시 발급 종류에 따른 현금영수증 입력 항목 보이기/숨기기
        checkDealproof();
        
        //주문시 개인소득공제 종류에 따른 현금영수증 입력 항목 보이기/숨기기
        checkDealptype('mobile');
    }
    
    
    if ($(".mypage_modify").length > 0) {
        //회원정보 비밀번호 변경시 새 비밀번호 항목 보이기/숨기기
        checkChgPw($("input[name='password_change']"));
    }
    
    
    //회원가입 폼 작성시 유효성 검사
    $("#joinForm").submit(function(event) {
        event.preventDefault();
        
        var f = document.joinForm;
        var rtnValue = submitFormChk(f);
        
        if (rtnValue == false) {
            return false;
        }
        
        //ajax로 데이터 처리
        /*$.ajax({
            type: 'post',
            url: 'url',
            data: $(f).serialize(),
            dataType: 'json',
            async: false,
            success: function(data) {
                alertLayer("안녕하세요. 홍길동 님!<br>일반회원 가입 완료되었습니다.","openLayer('add_business_layer');");
            }
        });*/
        alertLayer("안녕하세요. 홍길동 님!<br>일반회원 가입 완료되었습니다.","openLayer('add_business_layer');");
    });
    
    //사업자 정보 신청시 유효성 검사
    $("#addBusinessForm").submit(function(event) {
        event.preventDefault();
        
        var f = document.addBusinessForm;
        
        //ajax로 데이터 처리
        /*$.ajax({
            type: 'post',
            url: 'url',
            data: $(f).serialize(),
            dataType: 'json',
            async: false,
            success: function(data) {
                alertLayer("사업자회원신청완료<br><span class='small'>사업자정보 확인 후 사업자회원으로 전환 예정입니다.<br>영업일기준 1~2일 정도 소요됩니다.</span>","location.href='../../mw/index.html';");
            }
        });*/
        alertLayer("사업자회원신청완료<br><span class='small'>사업자정보 확인 후 사업자회원으로 전환 예정입니다.<br>영업일기준 1~2일 정도 소요됩니다.</span>","location.href='../../mw/index.html';");
    });
    
    
    //swiper 이미지 슬라이드 (main index)
	var main_swiper = new Swiper('.main_slide', {
        observer: true,
        observeParents: true,
        slidesPerView : 1,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.main_slide_pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.main_slide_prev_btn',
            nextEl: '.main_slide_next_btn',
            clickable: true,
        },
        watchOverflow: true
    });
    
    
    if ($(".goods_slide>ul>li").length > 1) {
        //swiper 이미지 슬라이드 (goods detail)
        var goods_swiper = new Swiper('.goods_slide', {
            observer: true,
            observeParents: true,
            slidesPerView : 1,
            loop: true,
            pagination: {
                el: '.goods_slide_pagination',
                clickable: true,
            },
            navigation: {
                prevEl: '.goods_slide_prev_btn',
                nextEl: '.goods_slide_next_btn',
                clickable: true,
            },
            watchOverflow: true
        });
        
        $(".goods_slide").removeClass("only_goods_slide");
    } else {
        $(".goods_slide").addClass("only_goods_slide");
    }
    
    
    //swiper 이미지 슬라이드 (inquiry detail)
	var inquiry_swiper = new Swiper('.inquiry_slide', {
        observer: true,
        observeParents: true,
        slidesPerView: 'auto',
        mousewheelControl: true,
        watchOverflow: true
    });
    
    
    //swiper 이미지 슬라이드 (content file)
	var file_swiper = new Swiper('.content_file_slide', {
        observer: true,
        observeParents: true,
        slidesPerView: 'auto',
        mousewheelControl: true,
        watchOverflow: true
    });
});


$(window).load(function() {
    //메인 팝업 레이어 열기
    if ($("#popup_layer").length > 0) {
        openLayer("popup_layer");
    }
    
    
    //관심상품 그룹 리스트 높이 설정
    setWishListBoxHeight();
    
    
    //리스트 타입이 썸네일인 상품 리스트 높이 설정
    setGoodsThumbListHeight();
});


//첨부파일 삭제
function fileDelete(obj) {
    var btnObj = $(obj).parent(".content_file_item").siblings(".content_file_btn");
    var dataName = ($(obj).siblings(".content_file").attr("data-name")) ? $(obj).siblings(".content_file").attr("data-name") : "content_file"; //첨부파일 name 값 (기본값 : content_file)
    var dataCnt = ($(obj).siblings(".content_file").attr("data-cnt")) ? $(obj).siblings(".content_file").attr("data-cnt") : 1; //첨부파일 최대 개수 (기본값 : 1)
    var fileCnt = ($(btnObj).siblings(".content_file_item").children(".content_file[data-name='" + dataName + "']").length) ? $(btnObj).siblings(".content_file_item").children(".content_file[data-name='" + dataName + "']").length : 0; //현재 첨부파일 개수
    
    $(obj).parent().remove();
    
    if ((dataCnt > 0) && (dataCnt == fileCnt)) {
        $(btnObj).children(".content_file[data-name='" + dataName + "']").removeAttr("disabled");
    }
    
    if (($(btnObj).children(".content_file[data-name='" + dataName + "']").prop("required") !== false) && ($(btnObj).closest(".validForm").length > 0)) {
        //폼 유효성 검사
        validFormChk($(btnObj).closest(".validForm"));
    }
}


//셀렉트박스 사용여부에 따라 라디오버튼에 값 넣기&빼기
function selInnerRadioValue(obj) {    
    var text = "선택";
        
    if ($(obj).next(".select_list").length > 0) {
        if ($(obj).hasClass("disable") !== true) {
            if ($(obj).next(".select_list").find("input[type='radio']:checked").length > 0) {
                text = $(obj).next(".select_list").find("input[type='radio']:checked").next("label").html();
            } else {
                $(obj).next(".select_list").children("li").each(function() {
                    if ($(this).children("input[type='radio']").prop("disabled") !== true) {
                        $(this).children("input[type='radio']").prop("checked",true);
                        text = $(this).children("label").html();
                        return false;
                    }
                });
            }
        } else {
            if ($(obj).next(".select_list").find("input[type='radio']:checked").length > 0) {
                $(obj).next(".select_list").find("input[type='radio']:checked").prop("checked",false);
            }
            
            $(obj).next(".select_list").children("li").each(function() {
                if ($(this).children("input[type='radio']").prop("disabled") !== true) {
                    text = $(this).children("label").html();
                    return false;
                }
            });
            
            if ($(obj).hasClass("on")) {
                $(obj).removeClass("on");
                $(obj).next(".select_list").css("display","none");
            }
        }
        
        $(obj).html(text);
    }
}


//텍스트 + 이메일 셀렉트박스 항목에서 셀렉트박스 선택시 텍스트 값 변경
function selInnerEmailValue(obj) {
    var textObj = $(obj).closest(".content_temail_area").children(".content_text");
    var selectValue = $(obj).val();
    
    if (textObj != null && textObj != undefined && textObj != "") {
        var textValue = $(textObj).val();
        var textArray = textValue.split('@');
        selectValue = (selectValue.indexOf('@') > -1) ? selectValue : "@" + selectValue;
        
        if (selectValue != "") {
            if (textArray.length > 1) {
                $(textObj).val(textArray[0] + selectValue);
            } else {
                $(textObj).val(textValue + selectValue);
            }
            
            if (selectValue == "@") {
                $(textObj).focus();
            }
        }
    }
}


//체크박스 전체체크 선택&해제
function setAllChk(obj) {
    var chkName = $(obj).attr("data-chkname");
    
    if ($(obj).prop("checked") !== false) {
        $("input[type='checkbox'][name^='" + chkName + "']").each(function() {
            $(this).prop("checked",true);
        });
    } else {
        $("input[type='checkbox'][name^='" + chkName + "']").each(function() {
            $(this).prop("checked",false);
        });
    }
    
    if (($("input[type='checkbox'][name^='" + chkName + "'].required").length > 0) && ($(obj).closest(".validForm").length > 0)) {
        //폼 유효성 검사
        validFormChk($(obj).closest(".validForm"));
    }
}


//텍스트 + 체크박스 항목에서 체크박스 체크시 텍스트에 값 넣기&빼기
function chkInnerTextValue(obj) {
    var copyName = $(obj).attr("data-cname");
    var pastaName = $(obj).attr("data-pname");
    
    if (copyName != null && copyName != undefined && copyName != "" && pastaName != null && pastaName != undefined && pastaName != "") {
        if ($(obj).prop("checked") !== false) {
            var copyValue = $("input[name='" + copyName + "']").val();
            $("input[name='" + pastaName + "']").val(copyValue);
            $("input[name='" + pastaName + "']").prop("readonly",true);
            $("input[name='" + pastaName + "']").removeClass("on");
        } else {
            $("input[name='" + pastaName + "']").val("");
            $("input[name='" + pastaName + "']").removeAttr("readonly");
        }
        
        if (($("input[name='" + pastaName + "']").prop("required") !== false) && ($(obj).closest(".validForm").length > 0)) {
            //폼 유효성 검사
            validFormChk($(obj).closest(".validForm"));
        }
    }
}


//텍스트 오류메시지 출력
function setTextError(obj, msg) {
    $(obj).addClass("error");
    $(obj).siblings(".content_text_error").html(msg);
}


//텍스트 유효성검사 완료
function setTextSuccess(obj) {
	$(obj).removeClass("on");
	$(obj).removeClass("error");
    $(obj).addClass("success");
}


//텍스트 글자수 출력
function setTextLength(obj) {
    var textValue = $(obj).val();
	var limitSize = parseInt($(obj).siblings(".content_text_size").children(".limit_size").text());
	
	if (limitSize > 0) {
		if (textValue.length > limitSize) {
			$(obj).val(textValue.substr(0, limitSize));
			textValue = $(obj).val();
			return;
		}
	} else {
        $(obj).val("");
        textValue = $(obj).val();
        return;
    }
	
	$(obj).siblings(".content_text_size").children(".text_size").text(textValue.length);
}


//상품 수량 변경
function setGoodsEa(obj, move) {
    var ea = parseInt($(obj).siblings(".goods_ea_text").val());
    ea = (isNaN(ea)) ? 0 : ea;
    
    if (move == '-') {
        if (ea > 1) {
            ea--;
        }
    } else if (move == '+') {
        ea++;
    }
    
    $(obj).siblings(".goods_ea_text").val(ea);
}


//반품신청시 상품체크여부에 따라 수량설정 가능&불가능
function chkClaimGoodsEa(obj) {
    if ($(obj).prop("checked") !== false) {
        $(obj).closest(".order_goods_name").next(".order_goods_sel").find(".select_tit").removeClass("disable");
    } else {
        $(obj).closest(".order_goods_name").next(".order_goods_sel").find(".select_tit").addClass("disable");
    }
    
    //셀렉트박스 사용여부에 따라 라디오버튼에 값 넣기&빼기
    selInnerRadioValue($(obj).closest(".order_goods_name").next(".order_goods_sel").find(".select_tit"));
}


//관심상품 그룹 리스트 높이 설정
function setWishListBoxHeight() {
    $(".my_wi_list_box").each(function() {
        var boxWidth = $(this).width();
        
        $(this).height(boxWidth);
    });
    
    $(".my_wi_list_box .my_wi_list_img .goods").each(function() {
        var itemWidth = $(this).width();
        
        $(this).height(itemWidth);
    });
    
    $(".my_wi_list_box .my_wi_list_img .cnt").each(function() {
        var itemWidth = $(this).prev(".goods").width() - 1;
        
        $(this).width(itemWidth);
        $(this).height(itemWidth);
    });
}


//리스트 타입이 썸네일인 상품 리스트 높이 설정
function setGoodsThumbListHeight() {
    $(".content_goods_list2>li .content_goods_img").each(function() {
        var goodsWidth = $(this).width();
        
        $(this).height(goodsWidth);
        
        if ($(this).children(".content_goods_soldout").length > 0) {
            $(this).children(".content_goods_soldout").height(goodsWidth);
            $(this).children(".content_goods_soldout").css("line-height",goodsWidth + "px");
        }
    });
}


//반품신청시 환불예정금액 계산
function orderClaimPrice() {
    $(".order_detail #order_claim_price").stop(true,true).slideDown(200);
    return false;
}


//레이어 팝업 열기
function openLayer(layerId) {
    var layerTop = 0;
    
    $("#" + layerId).addClass("on");
    
    $("#" + layerId).children(".layer_box").find(".layer_content").css("height","auto");

    var winHeight = $(window).outerHeight();
    var layerHeight = $("#" + layerId).children(".layer_box").find(".layer_content").outerHeight();
    
    if ($("#" + layerId).children(".layer_mask").length > 0) {        
        if (layerHeight > (winHeight - 20)) {
            layerHeight = winHeight - 20;
        }
    } else if ($("#" + layerId).hasClass("layer_all_area")) {        
        layerHeight = winHeight;
    }
    
    /*if ($("#" + layerId + " .layer_header")) {
		layerTop += 48;
	}*/

	if ($("#" + layerId + " .layer_fix_btn")) {
		layerTop += 48;
	}

	if ($("#" + layerId + " .layer_nav")) {
		layerTop += 64;
	}
    
    $("#" + layerId).children(".layer_box").find(".layer_content").css("height",layerHeight + "px");
    
    if ($("#" + layerId + " .layer_over_content").length == 0) {
		$("#" + layerId + " .content_select_area").each(function() {
			var selectTop = $(this).position().top;
			var selectHeight = $(this).height();
			var selectListHeight = parseInt($(this).find(".select_list").height()) + 1;
			var contentHeight = layerHeight;

			if ($("#" + layerId + " .layer_content").children("section").outerHeight() > contentHeight) {
				contentHeight = $("#" + layerId + " .layer_content").children("section").outerHeight();
			}

			if (((contentHeight - selectTop - layerTop) < selectListHeight) && ((selectTop - selectHeight) > selectListHeight)) {
				$(this).addClass("up_select_area");
			} else {
				$(this).removeClass("up_select_area");
			}
		});
	}
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll_disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//레이어 팝업 열기 (내용이 동적일 경우)
function openLayer2(layerId, layerLink, layerType) {
	//$(".wrap-loading").removeClass("display-none");

	if (layerType == "all") {
		$("#" + layerId).append('<div class="layer_box"></div>');
	} else {
		$("#" + layerId).append('<div class="layer_mask"></div><div class="layer_box"></div>');
	}
	
	$("#" + layerId + " .layer_box").load(layerLink, function() {
		var layerTop = 0;

		//$(".wrap-loading").addClass("display-none");
		$("#" + layerId).addClass("on");
    
		$("#" + layerId).children(".layer_box").find(".layer_content").css("height","auto");

		var winHeight = $(window).outerHeight();
		var layerHeight = $("#" + layerId).children(".layer_box").find(".layer_content").outerHeight();
		
		if ($("#" + layerId).children(".layer_mask").length > 0) {        
			if (layerHeight > (winHeight - 20)) {
				layerHeight = winHeight - 20;
			}
		} else if ($("#" + layerId).hasClass("layer_all_area")) {        
			layerHeight = winHeight;
		}

		/*if ($("#" + layerId + " .layer_header")) {
			layerTop += 48;
		}*/

		if ($("#" + layerId + " .layer_fix_btn")) {
			layerTop += 48;
		}

		if ($("#" + layerId + " .layer_nav")) {
			layerTop += 64;
		}
		
		$("#" + layerId).children(".layer_box").find(".layer_content").css("height",layerHeight + "px");
		
		if ($("#" + layerId + " .layer_over_content").length == 0) {
			$("#" + layerId + " .content_select_area").each(function() {
				var selectTop = $(this).position().top;
				var selectHeight = $(this).height();
				var selectListHeight = parseInt($(this).find(".select_list").height()) + 1;
				var contentHeight = layerHeight;

				if ($("#" + layerId + " .layer_content").children("section").outerHeight() > contentHeight) {
					contentHeight = $("#" + layerId + " .layer_content").children("section").outerHeight();
				}

				if (((contentHeight - selectTop - layerTop) < selectListHeight) && ((selectTop - selectHeight) > selectListHeight)) {
					$(this).addClass("up_select_area");
				} else {
					$(this).removeClass("up_select_area");
				}
			});
		}

		var scrollTop = parseInt($(document).scrollTop());

		$("body").css("top", -scrollTop + "px");

		$("body").addClass("scroll_disable").on('scroll touchmove', function(event) {
			event.preventDefault();
		});


		//텍스트박스 클릭시 텍스트 삭제 버튼 보이기&숨기기
		$("#" + layerId + " .content_text").on("focus", function() {
			if (($(this).next(".content_text_btn").length > 0) && ($(this).prop("readonly") !== true)) {
				if ($(this).val() != "") {
					$(this).addClass("on");
				} else {
					$(this).removeClass("on");
				}
			}
		});
		
		//텍스트박스 내용 변경시 텍스트 삭제 버튼 보이기&숨기기
		$("#" + layerId + " .content_text").on("propertychange change keyup paste input", function() {
			$(this).removeClass("success");
			$(this).removeClass("error");
			
			if (($(this).next(".content_text_btn").length) > 0 && ($(this).prop("readonly") !== true)) {
				if ($(this).val() != "") {
					$(this).addClass("on");
				} else {
					$(this).removeClass("on");
				}
			}
		});
		
		//텍스트 삭제 버튼 클릭시 텍스트박스 내용 삭제
		$("#" + layerId + " .content_text_btn").on("click", function() {
			if ($(this).prev(".content_text").length > 0) {
				$(this).prev(".content_text").removeClass("success");
				$(this).prev(".content_text").removeClass("error");
				$(this).prev(".content_text").val("");
				$(this).prev(".content_text").focus();
				
				//텍스트 글자수 출력
				setTextLength($(this).prev(".content_text"));
				
				if (($(this).prev(".content_text").prop("required") !== false) && ($(this).closest(".validForm").length > 0)) {
					//폼 유효성 검사
					validFormChk($(this).closest(".validForm"));
				}
			}
		});
		
		
		//텍스트 여러개일 경우 마우스오버시 하단 테두리 변경
		$("#" + layerId + " .content_text_area2 .content_text:not(.disable)").hover(function() {
			$(this).css("border-bottom","1px solid #d8d8d8");
		}, function() {
			var focusFlag = false;
			
			if ($(this).children("input").length > 0) {
				focusFlag = $(this).children("input").is(":focus");
			}
			
			if (focusFlag !== true) {
				$(this).css("border-bottom","1px solid #f5f5f5");
			}
		});
		
		//텍스트 여러개일 경우 텍스트 클릭시 하단 테두리 변경
		$("#" + layerId + " .content_text_area2 .content_text input").on("focus", function() {
			$(this).parent(".content_text").css("border-bottom","1px solid #d8d8d8");
		});
		
		//텍스트 여러개일 경우 텍스트 떠날때 하단 테두리 변경
		$("#" + layerId + " .content_text_area2 .content_text input").on("blur", function() {
			$(this).parent(".content_text").css("border-bottom","1px solid #f5f5f5");
		});
		
		//텍스트 여러개일 경우 활성화여부 설정
		$("#" + layerId + " .content_text_area2 .content_text.disable").each(function() {
			$(this).children("input").each(function() {
				$(this).prop("disabled",true);
			});
		});
		
		
		//셀렉트박스 초기값 설정
		$("#" + layerId + " .content_select_area .select_tit,.content_select_area2 .select_tit").each(function() {
			selInnerRadioValue($(this));
		});
		
		//셀렉트박스 옵션 보이기&숨기기
		$("#" + layerId + " .content_select_area .select_tit,.content_select_area2 .select_tit").click(function() {
			if ($(this).hasClass("disable") !== true) {
				if ($(this).next(".select_list").length > 0) {
					if ($(this).hasClass("on")) {
						$(this).next('.select_list').stop(true,true).slideUp(200);
						$(this).removeClass("on");
						return false;
					} else {
						$(this).next('.select_list').stop(true,true).slideDown(200);		
						$(this).addClass("on");
						return false;
					}
				}
			}
		});
		
		//셀렉트박스 옵션 선택시 값 변경
		$("#" + layerId + " .content_select_area .select_list input[type='radio'],.content_select_area2 .select_list input[type='radio']").click(function() {
			var text = $(this).next("label").html();
			
			if ($(this).closest(".select_list").prev(".select_tit").length > 0) {
				$(this).closest(".select_list").prev(".select_tit").html(text);
				$(this).closest(".select_list").prev(".select_tit").removeClass("on");
			}
			
			if ($(this).closest(".content_temail_area").length > 0) {
				selInnerEmailValue($(this));
			}
			
			$(this).closest(".select_list").css("display","none");
		});
		
		
		//첨부파일 업로드
		$("#" + layerId + " .content_file_area .content_file_btn .content_file").change(function() {
			var agent = navigator.userAgent.toLowerCase(); //브라우저 체크
			var dataName = ($(this).attr("data-name")) ? $(this).attr("data-name") : "content_file"; //첨부파일 name 값 (기본값 : content_file)
			var dataCnt = ($(this).attr("data-cnt")) ? $(this).attr("data-cnt") : 1; //첨부파일 최대 개수 (기본값 : 1)
			var dataSize = ($(this).attr("data-size")) ? $(this).attr("data-size") : 0; //첨부파일 최대 용량 (단위 : MB)
			var datafile = $(this).clone(true); //첨부파일 복사
			var fileCnt = ($(".content_file_area .content_file_item .content_file[data-name='" + dataName + "']").length) ? $(".content_file_area .content_file_item .content_file[data-name='" + dataName + "']").length : 0; //현재 첨부파일 개수
			
			if ((dataCnt > 0) && (dataCnt > fileCnt)) {
				var fileName = "";
				var fileSize = 0;
				var maxSize = parseInt(dataSize) * 1024 * 1024;
				
				//첨부파일 용량 체크
				if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
					//브라우저가 ie일 경우
					var oas = new ActiveXObject("Scripting.FileSystemObject");
					fileSize = oas.getFile($(this)[0].value).size;
				} else {
					//브라우저가 ie가 아닐 경우
					fileSize = $(this)[0].files[0].size;
				}
				
				if (fileSize > 0) {
					if ((maxSize == 0) || (maxSize >= fileSize)) {
						//첨부파일명 추출
						if (window.FileReader) {
							//기본 브라우저
							fileName = $(this)[0].files[0].name;
						} else {
							//old IE
							fileName = $(this).val().split('/').pop().split('\\').pop();
						}

						$(this).parent().after(datafile);
						datafile.attr("name",dataName + "[]");
						datafile.wrap("<div class='content_file_item cf'></div>");
						datafile.after("<span class='content_file_del' onclick='fileDelete(this);'><img src='../imgs/global/file2x_delete.png' alt='file_delete'></span>");
						datafile.after("<span class='content_file_txt'>" + fileName + "</span>");
					} else if (maxSize < fileSize) {
						alertLayer("파일 용량이 " + dataSize + "MB를 초과했습니다.","");
					}
				}
				
				//첨부파일 버튼 초기화
				if (dataCnt == fileCnt + 1) {
					$(this).prop("disabled",true);
				}
				
				if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
					//브라우저가 ie일 경우
					$(this).replaceWith($(this).clone(true));
				} else {
					//브라우저가 ie가 아닐 경우
					$(this).val("");
				}
			} else {
				//첨부파일 버튼 초기화
				$(this).prop("disabled",true);
				
				if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
					//브라우저가 ie일 경우
					$(this).replaceWith($(this).clone(true));
				} else {
					//브라우저가 ie가 아닐 경우
					$(this).val("");
				}
			}
		});
		
		
		//숫자만 입력
		$("#" + layerId + " input[numberonly]").on("keyup", function() {
			 $(this).val($(this).val().replace(/[^0-9-]/g,""));
		});
		
		
		//전화번호 입력시 -(하이픈) 자동입력
		$("#" + layerId + " input.tel_text").on("keydown", function(event) {
			var key = event.charCode || event.keyCode || 0;
			var $text = $(this);
			
			if (key !== 8 && key !== 9) {
				if ($text.val().length === 3) {
					$text.val($text.val() + '-');
				}
				
				if ($text.val().length === 8) {
					$text.val($text.val() + '-');
				}
			}
			
			return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
		});
		
		
		//비활성화 항목 안의 a태그 비활성화 설정 (ie전용) 
		$("#" + layerId + " .disable a").each(function() {
			if ($(this).css("pointer-events") == "none") {
				$(this).prop("disabled",true);
			}
		});
		
		
		//텍스트 글자수 출력 (로딩시, 텍스트 입력시)
		$("#" + layerId + " .content_tsize_area .content_text").each(function() {
			setTextLength(this);
		});
		
		$("#" + layerId + " .content_tsize_area .content_text").on("keyup", function() {
			setTextLength(this);
		});
		
		
		//폼 유효성 검사 (로딩시, 요소변경시)
		$("#" + layerId + " .validForm").each(function() {
			validFormChk($(this));
		});
		
		$("#" + layerId + " .validForm input[type='radio'],#" + layerId + " .validForm input:required,#" + layerId + " .validForm textarea:required,#" + layerId + " .validForm input.required").on("propertychange change keyup paste input", function() {
			validFormChk($(this).closest(".validForm"));
		});


		//제목 클릭시 내용 보이기&숨기기
		$("#" + layerId + " .toggle_list dt").click(function() {
			if ($(this).next("dd").length > 0) {
				if ($(this).hasClass("on")) {
					$(this).next('dd').stop(true,true).slideUp(300);
					$(this).removeClass("on");
					return false;
				} else {
					$($(this).parent().children("dd")).stop(true,true).slideUp(300);
					$($(this).parent().children("dt")).removeClass("on");
					$(this).next('dd').stop(true,true).slideDown(300);		
					$(this).addClass("on");
					return false;
				}
			}
		});


		//탭 설정
		$("#" + layerId + " .content_tab_list>li>a").bind("click", function() {
			var dataTab = $(this).parent().attr("data-tab");
			
			if (dataTab != null && dataTab != undefined && dataTab != "") {
				$("#" + layerId + " .content_tab_list>li").removeClass("on");
				
				if ($("#" + layerId + " .content_tab_con").length > 0) {
					$("#" + layerId + " .content_tab_con").css("display","none");

					$("#" + layerId + " .content_tab_con").find("input").each(function() {
						$(this).prop("disabled",true);
					});
				}
				
				$(this).parent().addClass("on");
				
				if ($("#" + layerId + " .content_tab_con").length > 0) {
					$("#" + dataTab).css("display","block");

					$("#" + dataTab).find("input").each(function() {
						$(this).prop("disabled",false);
					});
				}
				
				//폼 유효성 검사
				validFormChk($(this).closest(".validForm"));
			}
		});
		
		$("#" + layerId + " .content_tab_list").each(function() {
			if ($(this).children("li.on").length > 0) {
				var tabIdx = $(this).children("li.on").index();
				$(this).children("li").eq(tabIdx).children("a").trigger("click");
			} else {
				if ($(this).children("li").length > 0) {
					var dataTab = $(this).children("li").eq(0).attr("data-tab");

					if (dataTab != null && dataTab != undefined && dataTab != "") {
						$(this).children("li").eq(0).children("a").trigger("click");
					}
				}
			}
		});
		
		
		//레이어 팝업 닫기
		$("#" + layerId + " .layer_mask:not(#alert_layer .layer_mask),#" + layerId + " .layer_close_btn").click(function() {
			var layerId = $(this).closest(".layer_content_area").attr("id");
			
			closeLayer2(layerId);
		});
	});
}

//레이어 팝업 닫기
function closeLayer(layerId) {
    $("#" + layerId).removeClass("on");
    
    if ($(".layer_content_area.on").length == 0) {
        $("body").removeClass("scroll_disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

//레이어 팝업 닫기 (내용이 동적일 경우)
function closeLayer2(layerId) {
    $("#" + layerId).removeClass("on");
	$("#" + layerId).empty();
    
    if ($(".layer_content_area.on").length == 0) {
        $("body").removeClass("scroll_disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

//레이어 alert창 열기 (msg : 메시지 내용, fun : 버튼 클릭시 실행할 함수 (함수가 여러개일 경우 세미콜론으로 구분))
function alertLayer(msg, fun) {
    if ($("#alert_layer").length > 0) {
        $("#alert_layer .layer_box .layer_content .layer_content_txt").html(msg);
        
        if (fun != "") {
            $("#alert_layer .layer_box .layer_fix_btn .content_btn2").removeAttr("onclick");
            $("#alert_layer .layer_box .layer_fix_btn .content_btn2").attr("onclick","closeLayer('alert_layer'); " + fun);
        }
        
        openLayer("alert_layer");
    }
}


//폼 유효성 검사후 버튼 활성화
function validFormChk(f) {
    var flag = true;
    
    if ($(f).length > 0) {
        //필수 체크한 요소
        $(f).find("input:required,textarea:required,input.required").each(function() {
            var objTag = $(this).prop("tagName").toLowerCase();
            var objName = $(this).attr("name");
            var objValue = "";
            
            if ($(this).prop("disabled") !== true) {
                if (objTag == "input") {
                    var objType = $(this).attr("type");

                    if (objType == "file") {
                        objName = $(this).attr("data-name") + "[]";
                    }

                    if (objName != null && objName != undefined && objName != "") {
                        switch (objType) {
                            case "text" : 
                            case "password" : 
                            case "email" : 
                            case "tel" : 
                            case "file" : 
                            case "hidden" : 
                                objValue = $(f).find("input[name='" + objName + "']:not(:disabled)").val();
                            break;
                            case "checkbox" : 
                            case "radio" : 
                                objValue = $(f).find("input[name='" + objName + "']:not(:disabled):checked").val();
                            break;
                            case "select" : 
                                 objValue = $(f).find("input[name='" + objName + "']:not(:disabled):selected").val();
                            break;
                            default : 
                                objValue = "";
                            break;
                        }
                    }
                } else if (objTag == "textarea") {
                    if (objName != null && objName != undefined && objName != "") {
                        objValue = $(f).find("textarea[name='" + objName + "']:not(:disabled)").val();
                    }
                }

                if (objValue == null || objValue == undefined || objValue == "") {
                    flag = false;
                    return false;
                }
            }
        });
    }
    
    if (flag == true) {
        //버튼 활성화
        $(f).find("input[type='submit'],button[type='submit'],input.submit_btn,button.submit_btn").removeAttr("disabled");
    } else {
        //버튼 비활성화
        $(f).find("input[type='submit'],button[type='submit'],input.submit_btn,button.submit_btn").prop("disabled",true);
    }
}


//주문시 배송요청사항 직접입력 항목 보이기/숨기기
function checkDemand() {	
    if($("input[name='request_memo']:checked").val()) {
        $("#demandInputArea").hide();
    } else {
        $("#demandInputArea").show();
    }
}

//주문시 결제수단에 따른 현금영수증 입력 항목 보이기/숨기기
function checkPayment() {
    if($("input[name='payment']:checked").val() == "2") {
        $("#dealproof_container").show();
    } else {
        $("#dealproof_container").hide();
    }
}

//주문시 발급 종류에 따른 현금영수증 입력 항목 보이기/숨기기
function checkDealproof() {
    if($("input[name='dpIssueInput']:checked").val() == "biz") {
        $("#dealproof_cash_num_per").hide();
        $("#dealproof_cash_num_biz").show();
    } else {
        $("#dealproof_cash_num_biz").hide();
        $("#dealproof_cash_num_per").show();
    }
}

//주문시 개인소득공제 종류에 따른 현금영수증 입력 항목 보이기/숨기기
function checkDealptype(type) {
	$("#dealptype_cash_num_mobile").hide();
	$("#dealptype_cash_num_credit").hide();
	$("#dealptype_cash_num_receipt").hide();

	switch (type) {
		case "mobile":
			$("#dealptype_cash_num_mobile").show();
		break;
		case "credit":
			$("#dealptype_cash_num_credit").show();
		break;
		case "receipt":
			$("#dealptype_cash_num_receipt").show();
		break;
	}
}


//회원정보 비밀번호 변경시 새 비밀번호 항목 보이기/숨기기
function checkChgPw(obj) {
	var f = document.modifyForm;
    
	if ($(obj).prop("checked") !== false) {
		f.password.disabled = false;
		f.password.required = true;
		f.password2.disabled = false;
		f.password2.required = true;
		$(".bodyPw").css("display","block");
	} else {
		$(".bodyPw").css("display","none");
		f.password.disabled = true;
		f.password.required = false;
		f.password2.disabled = true;
		f.password2.required = false;
	}

	validFormChk($(f));
}


//submit시 유효성 검사
function submitFormChk(f) {
    var flag = true;
    
    //유효성 검사!!
    
    return flag;
}


//검색시 유효성 검사
function searchSubmit(f) {
    if (f.sword.value == null || f.sword.value == undefined || f.sword.value == "") {
        f.sword.focus();
        return false;
    }
    
    return true;
}


//1:1문의 작성시 유효성 검사
function inquirySubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}


//주문상세 주문정보 변경시 유효성 검사
function orderInfoSubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}


//주문취소&반품신청&교환신청시 유효성 검사
function orderClaimSubmit(f) {
    
}


//관심상품 그룹 선택한 체크박스 값 리스트
function wishGroupChkList() {
    var chkList = "";
    
    $(".mypage_wish .my_wi_list>li .my_wi_list_box .content_chk_area input[type='checkbox']:checked").each(function(i,el) {
        chkList = chkList + $(el).val() + ",";
    });
    
    if (chkList != "") {
        chkList = chkList.substr(0, chkList.length - 1);
    }
    
    return chkList;
}

//관심상품 그룹 장바구니 추가시 유효성 검사
function wishGroupSubmit(f) {
    var chkList = wishGroupChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("장바구니에 추가할 그룹을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}

//관심상품 그룹 선택삭제
function wishGroupDelete() {
    var chkList = wishGroupChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("삭제할 그룹을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}

//관심상품 그룹 선택한 체크박스 개수 
function wishGroupChkCnt() {
    var chkCnt = $(".mypage_wish .my_wi_list>li .my_wi_list_box .content_chk_area input[type='checkbox']:checked").length;
    
    if (chkCnt < 1) {
        alertLayer("수정할 그룹을 선택해주세요.","");
        
        return false;
    } else if (chkCnt > 1) {
        alertLayer("하나의 그룹만 선택해주세요.","");
        
        return false;
    } else {
        openLayer('mod_wish_layer');
        
        return true;
    }
}

//관심상품 그룹 추가시 유효성 검사
function addWishGroupSubmit(f) {
    
}

//관심상품 그룹 수정시 유효성 검사
function modWishGroupSubmit(f) {
    
}


//관심상품 상세 선택한 체크박스 값 리스트
function wishChkList() {
    var chkList = "";
    
    $(".wish_detail .content_goods_list>li .content_goods_img .content_chk_area input[type='checkbox']:checked").each(function(i,el) {
        chkList = chkList + $(el).val() + ",";
    });
    
    if (chkList != "") {
        chkList = chkList.substr(0, chkList.length - 1);
    }
    
    return chkList;
}

//관심상품 상세 장바구니 추가시 유효성 검사
function wishSubmit(f) {
    var chkList = wishChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("장바구니에 추가할 상품을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}

//관심상품 상세 선택삭제
function wishDelete() {
    var chkList = wishChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("삭제할 상품을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}


//최근 본 상품 선택한 체크박스 값 리스트
function todayChkList() {
    var chkList = "";
    
    $(".mypage_today .content_goods_list>li .content_goods_img .content_chk_area input[type='checkbox']:checked").each(function(i,el) {
        chkList = chkList + $(el).val() + ",";
    });
    
    if (chkList != "") {
        chkList = chkList.substr(0, chkList.length - 1);
    }
    
    return chkList;
}

//최근 본 상품 장바구니 추가시 유효성 검사
function todaySubmit(f) {
    var chkList = todayChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("장바구니에 추가할 상품을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}

//최근 본 상품 선택삭제
function todayDelete() {
    var chkList = todayChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("삭제할 상품을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}


//회원정보 수정을 위한 비밀번호 확인시 유효성 검사
function modifyPwSubmit(f) {
    
}


//회원정보 수정시 유효성 검사
function modifySubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}

//사업자 정보 수정시 유효성 검사
function modBusinessSubmit(f) {
    
}


//배송지 추가시 유효성 검사
function addAddressSubmit(f) {
    
}

//배송지 수정시 유효성 검사
function modAddressSubmit(f) {
    
}


//로그인시 유효성 검사
function loginSubmit(f) {
    
}


//아이디 찾기시 유효성 검사
function findIdSubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}


//비밀번호 찾기시 유효성 검사
function findPwSubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}


//비밀번호 찾기 본인인증 방법 선택시 유효성 검사
function findPwTypeSubmit(f) {
    
}


//새로운 비밀번호 설정시 유효성 검사
function changePwSubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}


//회원가입 동의시 유효성 검사
function joinAgreeSubmit(f) {
    
}


//장바구니 선택한 체크박스 값 리스트
function cartChkList() {
    var chkList = "";
    
    $(".order_cart .content_goods_list>li .content_goods_img .content_chk_area input[type='checkbox']:checked").each(function(i,el) {
        chkList = chkList + $(el).val() + ",";
    });
    
    if (chkList != "") {
        chkList = chkList.substr(0, chkList.length - 1);
    }
    
    return chkList;
}

//장바구니 상품 구매시 유효성 검사
function cartSubmit(f) {
    var chkList = cartChkList();
    
    if (chkList == "" || typeof(chkList) == "undefined") {
        alertLayer("구매할 상품을 선택해주세요.","");
        
        return false;
    }
    
    return true;
}


//주문서 작성시 유효성 검사
function orderSubmit(f) {
    var rtnValue = submitFormChk(f);
    
    if (rtnValue == false) {
        return false;
    }
}

//구매할 상품에 쿠폰 적용시 유효성 검사
function orderCouponSubmit(f) {
    
}


//검색 필터 적용시 유효성 검사
function searchFilterSubmit(f) {
    
}


//상품 장바구니에 추가시 유효성 검사
function goodsSubmit(f) {
    
}

//상품 상세에서 관심상품 추가시 유효성 검사
function addFavoriteSubmit(f) {
    
}

