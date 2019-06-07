function camelcase(str) {
  return str && str.replace(/-(.)/g, (m, $1) => `${$1.toUpperCase()}`);
}

function trimDanglingComma(str) {
  return str.replace(/,$/, '');
}

function inlineStyleToObject(style) {
  return style
    .split(';')
    .filter(Boolean)
    .map((declaration) => declaration.split(':'))
    .reduce((acc, [ key, value ]) => {
      acc += `\n${camelcase(key.trim())}: '${value.trim()}',`;
      return acc;
    }, '')
}

/**
 * Transforms styles using string literals to objects
 * @example
 * style="width: 100%; height: 100%"
 * =>
 * style={{
 *   width: 100%,
 *   height: 100%
 * }}
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const root = jsc(file.source);

  return jsc(file.source)
    .find(jsc.JSXAttribute, (node) =>
      (node.name && node.name.name === 'style') && (node.value && node.value.type === 'StringLiteral');
    )
    .forEach(path => {
      jsc(path).replaceWith(
        `${path.node.name.name}={{${trimDanglingComma(inlineStyleToObject(path.node.value.value))}\n}}`
      );
    })
    .toSource();
}

module.exports = transformer;
module.exports.parser = 'babylon';
