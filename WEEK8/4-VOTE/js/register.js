let registerRender = (function ($) {
    let $userName = $('#userName'),
        $spanName = $('#spanName'),
        $userPhone = $('#userPhone'),
        $spanPhone = $('#spanPhone'),
        $userPass = $('#userPass'),
        $spanPass = $('#spanPass'),
        $userPassConfirm = $('#userPassConfirm'),
        $spanPassConfirm = $('#spanPassConfirm'),
        $userBio = $('#userBio'),
        $spanBio = $('#spanBio'),
        $man = $('#man'),
        $woman = $('#woman'),
        $submit = $('#submit');

    let $plan = $.Callbacks();

    //=>用户名验证
    let checkUserName = ()=> {
        let reg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10})?$/;
        let value = $userName.val().trim();
        if (value.length === 0) {
            $spanName.html('用户名不能为空!').addClass('error');
            return false;
        }
        if (!reg.test(value)) {
            $spanName.html('请输入真实姓名（需要是中文汉字）!').addClass('error');
            return false;
        }
        $spanName.html('').removeClass('error');
        return true;
    };

    //=>手机号码验证
    let checkPhone = ()=> {
        let reg = /^1\d{10}$/,
            value = $userPhone.val().trim();
        if (value.length === 0) {
            $spanPhone.html('手机号码不能为空!').addClass('error');
            return false;
        }
        if (!reg.test(value)) {
            $spanPhone.html('请输入正确的手机号（11位有效数字）!').addClass('error');
            return false;
        }
        //=>是否重复验证
        let code = 0;
        $.ajax({
            url: '/checkPhone',
            dataType: 'json',
            cache: false,
            data: {phone: value},
            async: false,
            success: result=> {
                code = result.code;
            }
        });
        if (code == 1) {
            $spanPhone.html('当前手机号码已经被注册！').addClass('error');
            return false;
        }
        $spanPhone.html('').removeClass('error');
        return true;
    };

    return {
        init: function () {
            $userName.on('blur', checkUserName);
            $userPhone.on('blur', checkPhone);

            //=>提交注册信息
            $submit.tap(function () {
                //->把表单验证重新执行一遍
                if (checkUserName() && checkPhone()) {
                    $.ajax({
                        url: '/register',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            name: $userName.val().trim(),
                            password: hex_md5($userPass.val().trim()),
                            phone: $userPhone.val().trim(),
                            bio: $userBio.val().trim(),
                            sex: $man[0].checked ? 0 : 1
                        },
                        success: result=> {
                            let {code, data}=result;
                            if (code == 0) {

                                return;
                            }
                            Dialog.show('很遗憾，注册失败了，请刷新后再试试吧！', {
                                callBack: ()=> {
                                    let nowUrl = location.href;
                                    location.href = nowUrl;
                                }
                            });
                        }
                    });
                }
            });
        }
    }
})(Zepto);
registerRender.init();
