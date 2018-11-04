/**
 * Transforms h calls into createElement. It also alters the pragma comment
 * @example
 * import { h } from "preact";
 * @jsx h
 * h();
 * =>
 * import { createElement } from "preact";
 * @jsx createElement
 * createElement();
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const root = jsc(file.source);

  // if h is imported as an alias we shouldn't touch it
  // import { h as MyOwnWeirdFunction } from "preact";
  let replaceHReferences = false;

  // replace h references into createElement
  root.find(jsc.Literal, { value: "preact" }).forEach(child => {
    if (child.parentPath.node.type !== 'ImportDeclaration') {
      return;
    }

    jsc(child.parentPath).find(jsc.Identifier).forEach(path => {
      // remove alias for createElement
      if (path.name === 'local' && path.node.name === 'createElement') {
        jsc(path).remove();
      }

      if (path.name === 'local' && path.node.name === 'h') {
        jsc(path).replaceWith('createElement');
        replaceHReferences = true;
      }

      // convert h function into createElement function
      if (path.name === 'imported' && path.node.name === 'h') {
        jsc(path).replaceWith('createElement');
      }
    });
  });

  // replace all jsx pragma comments that include a h reference
  root.find(jsc.Program).get('body').each(child => {
    if (child.node.comments) {
      child.node.comments = child.node.comments.map(comment => {
        if (comment.value === '* @jsx h ') {
          comment.value = '* @jsx createElement ';
        }

        if (comment.value === '* @jsx preact.h ') {
          comment.value = '* @jsx preact.createElement ';
        }

        return comment;
      });
    }
  });

  // replace all h references into createElement
  root.find(jsc.Identifier, { name: 'h' }).forEach(path => {
    if (replaceHReferences && path.parentPath.name === 'expression' || path.parentPath.name === 'callee') {
      jsc(path).replaceWith('createElement');
    }
  });

  return root.toSource();
}

module.exports = transformer;
module.exports.parser = 'babylon';
