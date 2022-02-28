/*
@author:jiangong.yu
@date:201704      
@use: onfoucs='jm_select()' / onclick='jm_select()'
@format:1:yyyyMM

*/
; !function (w, undefined) {
    d = document,
        e = "createElement",
        f = "getElementById",
        g = "getElementsByTagName",
        c = 'appendChild';


    if (!document.getElementById('jm_style')) {


        var jm_link = document.createElement('link');
        jm_link.rel = "stylesheet";
        jm_link.id = "jm_style";
        jm_link.href = (function () {
            var jm_a = document.scripts;
            var jm_c = jm_a[jm_a.length - 1].src;
            var jm_path;
            return jm_path ? jm_path : jm_c.substring(0, jm_c.lastIndexOf("/") + 1)
        })() + "jg_month.css";

        document.getElementsByTagName('head')[0].appendChild(jm_link);
    }

    w.jm_select = function (v) {
        var val = v || "m";
        var thisEvent = w.event || jm_select.caller.arguments[0];
        console.log(jm_select.caller);
        var para = (function (obj, e) {
            var t = obj.offsetTop;
            var l = obj.offsetLeft;
            var w = obj.clientWidth;
            var h = obj.clientHeight;
            while (obj = obj.offsetParent) {
                t += obj.offsetTop;
                l += obj.offsetLeft;
            }
            return {
                'top': t,
                'left': l,
                'width': w,
                'height': h,
                'x': e.clientX - l,
                'y': e.clientY - t
            };
        })(thisEvent.target, thisEvent);
        var jm_box = document.createElement('div');
        jm_box.setAttribute('class', 'jm_box');
        jm_box.style.left = para['left'] + 'px';
        jm_box.style.top = (para['top'] + para['height'] + 4) + 'px';

        jm_box.innerHTML = "<input class='jm_but jm_reduce'id='jm_reduce' type=button value='-' /><input class='jm_but jm_year' id='jm_year' value='" +

            (function () {
                return (new Date()).getFullYear()
            })() + "' /><input class='jm_but jm_add' id='jm_add' type=button value='+' />" +
            (function () {
                var ret = "";
                if (val == "m") {
                    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    for (ms in months) {
                        ret += "<input class='jm_ms' name='jm_ms' ind='" + (Number(ms) + 1) + "' value='" + months[ms] + "' type=button />";
                    }
                } else if (val == "w") {
                    for (var ii = 1; ii < 53; ii++) {
                        ret += "<input class='jm_ms' name='jm_ms' ind='" + ("0" + ii).slice(-2) + "' value='WW" + ("0" + ii).slice(-2) + "' type=button />";
                    }
                }
                return ret + "<a class='jm_lnk' href='javascript:;'>Close</a><a class='jm_lnk' href='javascript:;'>Clear</a>"
            })();


        document.body.appendChild(jm_box);

        jm_box.addEventListener("click", function (event) {
            var target = event.target;

            if (target == document.getElementById('jm_reduce')) {
                var yyyy = document.getElementById('jm_year').value;
                yyyy > 1 ? document.getElementById('jm_year').value = Number(yyyy) - 1 : 1;
            }
            if (target == document.getElementById('jm_add')) {
                var yyyy = document.getElementById('jm_year').value;
                yyyy < 9999 ? document.getElementById('jm_year').value = Number(yyyy) + 1 : 1;
            }
            if (target.className.indexOf('jm_ms') > -1) {
                var sel_month = document.getElementById('jm_year').value + ('0' + target.getAttribute('ind')).substr(-2, 2);
                //console.log(sel_month);
                thisEvent.target.value = sel_month;

                setTimeout(function () { document.body.removeChild(jm_box); }, 100);
            }
            if (target.className.indexOf('jm_lnk') > -1) {
                target.innerHTML === 'Close' ? setTimeout(function () { document.body.removeChild(jm_box); }, 100) : 1;
                target.innerHTML === 'Clear' ? setTimeout(function () { thisEvent.target.value = ''; document.body.removeChild(jm_box); }, 100) : 1;
            }

        });

    };

}(window);



      