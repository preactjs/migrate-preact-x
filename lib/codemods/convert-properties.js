const { EOL } = require('os');
const path = require('path');
const { codeFrameColumns } = require('@babel/code-frame');
const codeFrameOptions = {
  forceColor: true,
  highlightCode: true,
};

const varsToConvert = new Map([
  ['attributes', 'props'],
  ['nodeName', 'type'],
]);

/**
 * Transforms attributes & nodeName into the new values
 * @example
 * vnode.attributes
 * vnode.nodeName
 * =>
 * vnode.props
 * vnode.type
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const root = jsc(file.source);

  // we need to get the correct createELement pragma
  let createElementAlias = 'createElement';
  const createElementImport = root
    .find(jsc.ImportSpecifier, {
      imported: { name: createElementAlias }
    })
    .paths();

  if (createElementImport.length) {
    // set the alias
    createElementAlias = createElementImport[0].node.local.name;
  }

  const vNodeIdentifiers = [];
  // get all known vnodes from the source
  root
    .find(jsc.VariableDeclarator, {
      init: {
        callee: { name: createElementAlias }
      }
    })
    .forEach(child => {
      vNodeIdentifiers.push(child.node.id.name);
    });

  // find all properties inside an expression
  const possibleAttributeReplacements = [];
  for (let [search, replacement] of varsToConvert) {
    root
    .find(jsc.MemberExpression, {
      property: { name: search }
    })
    .forEach(expression => {
      const identifier = expression.node.object.name;
      if (!vNodeIdentifiers.includes(identifier)) {
        const bindings = expression.scope.getBindings();
        // when the delcaration is inside the same function we know this isn't a vnode
        if (
          bindings[identifier] &&
          bindings[identifier][0].parent.node.type === "VariableDeclarator"
        ) {
          return;
        }

        possibleAttributeReplacements.push(expression);
        return;
      }

      jsc(expression)
        .find(jsc.Identifier, { name: search })
        .replaceWith(jsc.identifier(replacement));
    });
  }

  // show codeframe for all possible values
  possibleAttributeReplacements.forEach(replacement => {
    const property = replacement.node.property;
    process.stdout.write(`${path.relative(process.cwd(), file.path)}${EOL}${EOL}`);
    process.stdout.write(codeFrame(root.toSource(), property));
    process.stdout.write(`${EOL}${EOL}`);
  });

  return root.toSource();
}

function codeFrame(source, node) {
  const message = `Possible vnode property ${node.name} can be replaced into ${varsToConvert.get(node.name)}`;
  return codeFrameColumns(
    source,
    node.loc,
    Object.assign({}, codeFrameOptions, { message })
  );
}

module.exports = transformer;
module.exports.parser = 'babylon';
