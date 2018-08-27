//@charset "utf-8";

function Layernative(item){
    var _$ = typeof $ === 'function' && $.constructor === Function ? $ : false;
    var _body = query('body')[0];

    var alertBox,
        cover,
        tt,
        content,
        container,
        btnarea,
        isShow = {
            num: 0,
            addNum: function() {
                this.num++;
            },
            reduceNum: function(limit) {
                var _limit = limit ? limit : 0;
                this.num--;
                if (this.num < _limit) {
                    this.num = _limit;
                }
            }
        },
        preventMove = {
            scroll: false,
            status: false,
            startY: 0,
            init: function(box, content) {
                this.box = box;
                this.content = content;
                this.addEvent();
            },
            fun: function(e) {
                var _event = e || event,
                    _this = preventMove;

                if (_this.scroll && _this.status) {
                    var _py = e.targetTouches[0].pageY,
                        _ch = _this.content.clientHeight,
                        _sh = _this.content.scrollHeight,
                        _st = _this.content.scrollTop;

                    if (_st === 0 && _py > _this.startY) {
                        _event.preventDefault();
                        return;
                    } else if (_ch + _st >= _sh && _py < _this.startY) {
                        _event.preventDefault();
                        return;
                    }
                } else {
                    _event.preventDefault();
                    return;
                }

            },
            addEvent: function() {
                addEvent(this.content, 'touchstart', function(e) {
                    var _event = e || event;
                    preventMove.status = true;
                    preventMove.startY = _event.targetTouches[0].pageY;
                });
                addEvent(this.content, 'touchend', function() {
                    preventMove.status = false;
                });
                addEvent(this.box, 'touchmove', this.fun);
            },
            isAddScroll: function() {
                if (this.content.scrollHeight > this.content.clientHeight) {
                    this.scroll = true;
                } else {
                    this.scroll = false;
                }
            }
        };

    function render() {
        alertBox = document.createElement('div');
        alertBox.className = 'layer';
        var _html = 
            '<div class="layer_cover">&nbsp;</div>' +
            '<div class="layer_container">' +
                '<div class="layer_tt">&nbsp;</div>' +
                '<div class="layer_content">&nbsp;</div>' +
                '<div class="layer_btnarea">&nbsp;</div>' +
            '</div>';
        alertBox.innerHTML += _html;
        _body.appendChild(alertBox);

        tt = query('.layer_tt', alertBox)[0];
        content = query('.layer_content', alertBox)[0];
        container = query('.layer_container', alertBox)[0];
        btnarea = query('.layer_btnarea', alertBox)[0];
        cover = query('.layer_cover', alertBox)[0];
        preventMove.init(alertBox, content);
    }

    function addEffect(effect, time) {
        if (_$) {
            $.extend($.fn, {
                layerEffectIn: function(time, callback) {
                    if (effect === 'fade') {
                        $(this).fadeIn(time, callback);
                    } else {
                        $(this).show(time, callback);
                    }
                    return this;
                },
                LayerEffectOut: function(time, callback) {
                    if (effect === 'fade') {
                        $(this).fadeOut(time, callback);
                    } else {
                        $(this).hide(time, callback);
                    }
                    return this;
                }
            });
        }
    }

    function query(e, fa) {
        if (_$) {
            if (!fa) {
                return $(e);
            } else {
                return $(e, fa);
            }
        } else {
            var _fa = fa;
            if (!fa) {
                _fa = document;
            }
            return _fa.querySelectorAll(e);
        }
    }

    function addEvent(el, event, fun) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, fun);
        } else if (el.addEventListener) {
            el.addEventListener(event, fun, false);
        }
    }

    function removeEvent(el, event, fun) {
        if (el.attachEvent) {
            el.detachEvent("on" + event, fun);
        } else if (el.addEventListener) {
            el.removeEventListener(event, fun, false);
        }
    }

    function findParent(dom, parent) {
        var _parent = dom.parentNode;
        if (_parent != document.body && _parent != document.documentElement) {
            if (_parent != parent) {
                return findParent(_parent, parent);
            } else {
                return true;
            }
        }
        return false;
    }

    

    var obj = {
        // 点击背景cover区域弹框是否会消失
        coverHidden: false,
        // 动画时间
        time: 25e1,
        // 动画效果
        effect: 'fade',
        // 当只有一个按钮时的按钮的class
        singleBtnClass: 'layer_btn-red',
        init: function(item) {
            var _this = this;

            if (item) {
                for (var i in item) {
                    this[i] = item[i];
                }
            }
            if (this.effect === 'show') {
                this.time = 0;
            }
            addEffect(this.effect, this.time);
            render();

            if (this.coverHidden) {
                addEvent(cover, 'click', function() {
                    isShow.num = 1;
                    _this.hide();
                });
            }
        },
        alert: function(title, word, btn, style) {
            var _this = this;

            tt.innerHTML = title ? title : '';
            content.innerHTML = word ? word : '';
            

            if ( !btn ) {
                btn = [1];
            }
            btnarea.innerHTML = '';

            var _btnLen = btn.length;
            for ( var i = 0; i < _btnLen; i++ ) {
                var _word = btn[i].word ? btn[i].word : '我知道了',
                    _btn = document.createElement('div'),
                    _callback = btn[i].callback;

                    _btn.className = 'layer_btn';
                if (_btnLen === 1 && _this.singleBtnClass) {
                    _btn.className += ' ' + _this.singleBtnClass;
                }
                _btn.innerHTML = _word;
                addBtnFun(_btn, _callback, btn[i].callbackHidden);
            }

            _this.show(style);

            preventMove.isAddScroll();
           
            function addBtnFun($btn, callback, callbackHidden) {
                addEvent($btn, 'click', function() {
                    if (callback) {
                        callback();
                        if ( callbackHidden ) {
                            _this.hide();
                        } else {
                            isShow.reduceNum(1);
                        }
                    } else {
                        _this.hide();
                    }
                });
                btnarea.appendChild($btn);
            }
        },
        show: function(style) {
            this.addStyle(style);
            isShow.addNum();

            $(container).layerEffectIn(this.time);
            $(cover).layerEffectIn(this.time);
        },
        hide: function() {
            isShow.reduceNum();
            if (!isShow.num) {
               $(container).LayerEffectOut(this.time, function(){
                   content.innerHTML = '';
                   tt.innerHTML = '';
               });
               $(cover).LayerEffectOut(this.time); 
            }
        },
        clearStyle: function() {
            var _style = $(container).attr('style'),
                _reg = /display:(\s)?.+?($|;)/;
                
            if (_reg.test(_style)) {
                _style = _style.match(_reg)[0];
                $(container).attr('style', _style);
            }
            alertBox.className = 'layer';
        },
        addStyle: function(style) {
            this.clearStyle();

            if (!style) {
                return;
            }

            if (typeof style === 'object') {
                for (var i in style) {
                    $(container).css(i, style[i]);
                }
            } else if (typeof style === 'string') {
                alertBox.className = 'layer ' + style;
            }
        },
        destroy: function() {
            $(container).LayerEffectOut(this.time, function(){
                alertBox.parentNode.removeChild(alertBox);
            });
        }
    };
    obj.init(item);

    return obj;
}