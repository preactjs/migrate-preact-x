/**
 * Transforms jsx pragma comments from h to createElement
 */
function transformer(file, api) {
  const jsc = api.jscodeshift;
  const root = jsc(file.source);

  // replace all jsx pragma comments related to h to createElement
  root.find(jsc.Program).get('body').each(child => {
    if (child.node.comments) {
      child.node.comments = child.node.comments.map(comment => {
        if (comment.value === '* @jsx h ' || comment.value === '* @jsx preact.h ') {
          comment.value = '* @jsx createElement ';
        }

        return comment;
      });
    }
  });

  return root.toSource();
}

module.exports = transformer;
module.exports.parser = 'babylon';
