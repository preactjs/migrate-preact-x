const apiMap = {
  'h': 'createElement',
};

/**
 * Transforms old preact api to new api
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const identifiersToImport = new Set();
  const root = jsc(file.source);

  // get all functions from the preact namespace and track them inside identifiersToImport
  root.find(jsc.Identifier, { name: "preact" }).forEach(child => {
    if (child.parentPath.node.type === 'MemberExpression') {
      const identifier = child.parentPath.node.property.name;
      identifiersToImport.add(identifier);
    }
  });

  // find all import declarations from "preact". Track them inside identifiersToImport
  // and remove them.
  root.find(jsc.Literal, { value: "preact" }).forEach(child => {
    if (child.parentPath.node.type === 'ImportDeclaration') {
      child.parentPath.node.specifiers.map(specifierNode => {
        if (specifierNode.type === 'ImportSpecifier') {
          const identifier = specifierNode.imported.name;
          identifiersToImport.add(identifier);
        }
      });

      // remove imports
      child.parentPath.replace(null);
    }
  });

  // convert old api functions to new api functions
  Array.from(identifiersToImport).forEach(identifier => {
    if (apiMap[identifier]) {
      root.find(jsc.Identifier, { name: identifier }).forEach(child => {
        if (child.parentPath.node.type === 'CallExpression' || child.parentPath.node.type === 'MemberExpression') {
          child.replace(jsc.identifier(apiMap[identifier]))
        }
      });
    }
  });

  // replace all preact.<func> into regular <func>
  root.find(jsc.Identifier, { name: "preact" }).forEach(child => {
    if (child.parentPath.node.type === 'MemberExpression') {
      child.parentPath.replace(child.parentPath.node.property.name);
    }
  });

  // convert old api imports to new api imports
  const updatedIdentifiersToImport = new Set();
  Array.from(identifiersToImport).forEach(identifier => {
    updatedIdentifiersToImport.add(apiMap[identifier] ? apiMap[identifier] : identifier);
  });
  // map all captured identifiers into an importSpecifier
  const specifiers = Array.from(updatedIdentifiersToImport).sort().map(identifier => jsc.importSpecifier(jsc.identifier(identifier), jsc.identifier(identifier)));

  // create a preact import with all the necessary specifiers
  root.find(jsc.Program).get('body', 0).insertBefore(jsc.importDeclaration(specifiers, jsc.literal("preact")));

  return root.toSource();
}

module.exports = transformer;
module.exports.parser = 'babylon';
