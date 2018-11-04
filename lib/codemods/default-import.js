/**
 * Transforms default imports to named import
 * @example
 * import preact from "preact";
 * preact.createElement();
 * =>
 * import { createElement } from "preact";
 * createElement();
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const identifiersToImport = new Set();
  const root = jsc(file.source);

  let defaultImports = [];
  root.find(jsc.Literal, { value: "preact" }).forEach(child => {
    const importDeclaration = child.parentPath.node
    if (importDeclaration.type === 'ImportDeclaration') {
   		defaultImports.push(importDeclaration.specifiers.find(node => node.type === 'ImportDefaultSpecifier'));
    }
  });

  defaultImports.filter(Boolean).forEach(defaultImport => {
    if (defaultImport && defaultImport.local.name) {
      const defaultImportIdentifier = defaultImport.local.name;

      // get all functions from the preact namespace and track them inside identifiersToImport
      root.find(jsc.Identifier, { name: defaultImportIdentifier }).forEach(child => {
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

      // replace all preact.<func> into regular <func>
      root.find(jsc.Identifier, { name: defaultImportIdentifier }).forEach(child => {
        if (child.parentPath.node.type === 'MemberExpression') {
          child.parentPath.replace(child.parentPath.node.property.name);
        }
      });

      // replace all jsx pragma comments that uses the preact namespace
      root.find(jsc.Program).get('body').each(child => {
        if (child.node.comments) {
          child.node.comments = child.node.comments.map(comment => {
            if (comment.value.includes(`* @jsx ${defaultImportIdentifier}.`)) {
              comment.value = comment.value.replace(`* @jsx ${defaultImportIdentifier}.`, '* @jsx ');
            }

            return comment;
          });
        }
      });

      // map all captured identifiers into an importSpecifier
      const specifiers = Array.from(identifiersToImport).sort().map(identifier => jsc.importSpecifier(jsc.identifier(identifier), jsc.identifier(identifier)));

      // create a preact import with all the necessary specifiers
      root.find(jsc.Program).get('body', 0).insertBefore(jsc.importDeclaration(specifiers, jsc.literal("preact")));
    }
  });

  return root.toSource();
}

module.exports = transformer;
module.exports.parser = 'babylon';
