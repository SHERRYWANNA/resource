(function() {
    window.util = {
        isInArray: function (e, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (e === arr[i]) {
                    return true;
                }
            }
            return false;
        },
        isNotEmpty: function() {
            var _arg = arguments;
            for (var i = 0; i < _arg.length; i++) {
                if (!_arg[i]) {
                    return false;
                }
            }
            return true;
        },
        isObject: function(e) {
            return (typeof e === 'object' && e.constructor === Object);
        },
        isArray: function(e) {
            return (typeof e === 'object' && e.constructor === Array);
        },
        removeTag: function(e) {
            return e.replace(/<.+?>/ig, '').replace(/\t/g, ' ');
        },
        translateHTMLContent: function(code) {
            return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        },
        codeFormat: function(code) {
            if (typeof code === 'string') {
                code = util.translateHTMLContent(code.replace(/(  |\n)/g, '')).replace(/, /g, ',');
            }
            var _tab = 0;
            var _trueContent = '';
            var _brackets = [];

            for (var i = 0; i < code.length; i++) {
                var _addContent = '',
                    _lastBrackets = _brackets[_brackets.length-1],
                    _inFun = _lastBrackets != '(' ? false : true,
                    _inArray = _lastBrackets == '[' ? true : false,
                    _char = code[i];

                switch (_char) {
                    case '{':
                        _tab++;
                        _brackets.push(_char);
                        _addContent += _char;
                        if (code[i+1] && code[i+1] != '}') {
                            _addContent +=  '\n' + addTab(_tab);
                        }
                        break;
                    case '}':
                        _tab--;
                        removeRecentBracket(_char);
                        if (code[i-1] && code[i-1] != ';' && code[i-1] != '{') {
                            _addContent += '\n' + addTab(_tab);
                        }
                        _addContent += _char;
                        // 当大括号后面跟的是else时 不换行
                        if (code[i+5] && code[i+2] == 'e' && code.substr(i+2, 4) == 'else') {
                            _addContent += ' ';
                        // 当大括号后面跟的是非结束标点时 换行
                        } else if (code[i+1] && !isEndCharacter(code[i+1])) {
                            _addContent += '\n' + addTab(_tab);
                        }
                        break;
                    case ';':
                        _addContent += _char;
                        if (code[i+1] && !_inFun) {
                            _addContent += '\n';
                            if (!isEndCharacter(code[i+1])) {
                                _addContent += addTab(_tab);
                            } else {
                                _addContent += addTab(_tab-1);
                            }
                        }
                        break;
                    case ',':
                        _addContent += _char;
                        if (_inArray) {
                            _addContent += ' ';
                        } else if (!_inFun) {
                            _addContent += '\n' + addTab(_tab);
                        }
                        break;
                    case '[':
                        _addContent += _char;
                        _brackets.push(_char);
                        break;
                    case ']':
                        _addContent += _char;
                        removeRecentBracket(_char);
                        break;
                    case '(': 
                        _addContent += _char;
                        _brackets.push(_char);
                        break;
                    case ')':
                        _addContent += _char;
                        removeRecentBracket(_char);
                        break;
                    default:
                        _addContent += _char;
                        break;

                }
                _trueContent +=  _addContent;
            }

            return _trueContent;

            function isEndCharacter(e) {
                var endCharacter = ['}', ']', ';', ',', ')'];
                return util.isInArray(e, endCharacter);
            }
            // 移除最近相匹配括号
            function removeRecentBracket(char) {
                if (char == '}') {
                    char = '{';
                } else if (char == ')') {
                    char = '(';
                } else if (char == ']') {
                    char = '[';
                }
                for (var i = _brackets.length-1; i >= 0; i--) {
                    if (_brackets[i] == char) {
                        _brackets.splice(i,1);
                        return;
                    }
                }
            }
            // 添加tab长度的空格
            function addTab(tabLength) {
                var _space = '';
                for (var i = tabLength - 1; i >= 0; i--) {
                    _space += '    ';
                }
                return _space;
            }
        }
    };
})();