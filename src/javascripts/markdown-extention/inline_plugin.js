'use strict';

// markdown usage: @@ad_id@@
// e.g. @@1234@@
// code reference: https://github.com/markdown-it/markdown-it-sup

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

var reverse_str = function (str) {
    var ret = '';

    for (var i = str.length - 1; i >= 0; i -= 1) {
        ret += str.charAt(i);
    }

    return ret;
};

var extend = function (new_one, old_one) {
    for (var key in old_one) {
        if (old_one.hasOwnProperty(key)) {
            new_one[key] = old_one[key];
        }
    }

    return new_one;
};

module.exports = function inline_plugin_factory(name, delimeter, render, options) {
    var opts = extend({
            rule_after: 'emphasis',
            more_token_range: function (content) {
                return null;
            }
        }, options),
        rule = function rule(state, silent) {
            var found,
                content,
                token,
                content_start_pos,
                content_end_pos,
                max             = state.posMax,
                start           = state.pos,
                dlen            = delimeter.length,
                prefix          = delimeter,
                postfix         = reverse_str(prefix),
                check_delimeter = function (str, state) {
                    return str === state.src.slice(state.pos, state.pos + dlen);
                };

            if (silent)                     { return false; }
            if (max - start <= dlen * 2)    { return false; }
            if (!check_delimeter(prefix, state))    { return false; }

            state.pos += dlen;
            content_start_pos = state.pos;

            while (state.pos < max) {
                if (check_delimeter(postfix, state)) {
                    found = true;
                    break;
                }

                state.md.inline.skipToken(state);
            }

            if (!found || start + dlen === state.pos) {
                state.pos = start;
                return false;
            }

            content = state.src.slice(start + dlen, state.pos);

            // don't allow unescaped newlines inside
            if (content.match(/(^|[^\\])(\\\\)*\n/)) {
                state.pos = start;
                return false;
            }

            // found!
            content_end_pos = state.pos;
            state.posMax = state.pos;
            state.pos = start + dlen;

            var token_range = opts.more_token_range(content);

            if (token_range && token_range.start && token_range.end) {
                token         = state.push(name + '_open', name, 1);
                token.meta    = content.substr(0, token_range.start).replace(UNESCAPE_RE, '$1').trim();

                state.pos    = content_start_pos + token_range.start;
                state.posMax = content_start_pos + token_range.end;
                state.md.inline.tokenize(state);

                token         = state.push(name + '_close', name, -1);
            } else {
                token         = state.push(name + '_open', name, 0);
                token.meta    = content.replace(UNESCAPE_RE, '$1').trim();
            }

            state.pos     = content_end_pos + dlen;
            state.posMax  = max;

            return true;
        },
        default_render = function default_render(tokens, index, options, self) {
            return '<div class="' + name + '">' + tokens[index].meta + '</div>';
        };

    return function inline_plugin(md) {
        md.inline.ruler.after(opts.rule_after, name, rule);
        md.renderer.rules[name + '_open'] = render || default_render;
        md.renderer.rules[name + '_close'] = render || default_render;
    };
};

