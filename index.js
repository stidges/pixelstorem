const postcss = require('postcss');

module.exports = (options = {}) => {
    return {
        postcssPlugin: 'postcss-pixels-to-rem',
        Once: (css) => {
            const base = options.base ? options.base : 16;
            const mediaQueries = options.mediaQueries === undefined ? true: options.mediaQueries;
            const exclude = options.exclude || [];

            const findMatches = (el) => {
                return el.match(/(convert-r?em\([\d.]+\)|[\d.]+px)/ig, '');
            };

            const convertValues = (matches) => {
                return matches.map((el, i) => {
                    const regExVal = new RegExp(/[\d.]+/, 'g');
                    const regExType = new RegExp(/(convert-r?em|px)/, 'ig');
                    const unit = regExType.exec(el)[0].toString().replace(/^convert-/, '');
                    const measureType = options.unit ? options.unit : unit !== 'px' ? unit : 'rem';
                    return convertedVal = regExVal.exec(el) / base + measureType;
                });
            }

            const replaceItem = (item, convertedValues, matches) => {
                let revisedParam = item;
                convertedValues.map((el, i) => {
                    revisedParam = revisedParam.replace(matches[i], el);
                });
                return revisedParam
            }

            css.walkRules((rule) => {
                const ruleParent = rule.parent;

                if (ruleParent.type === "atrule" && ruleParent.name === "media" && mediaQueries) {
                    const matches = findMatches(ruleParent.params) || false;
                    const convertedVal = matches ? convertedVal = convertValues(matches) : false;

                    if (convertedVal) {
                        rule.parent.params = replaceItem(rule.parent.params, convertedVal, matches);
                    }
                }

                rule.walkDecls((decl, i) => {
                    const excludedTest = exclude.some((el, i) => decl.prop === el);
                    const matches = findMatches(decl.value);

                    if (matches && !excludedTest) {
                        decl.value = replaceItem(decl.value, convertValues(matches), matches);
                    }
                });
            });
        }
    };
};

module.exports.postcss = true;

