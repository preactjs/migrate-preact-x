module.exports = (codemods) => {
  return (file, api, options) => {
    let src = file.source;
    codemods.forEach(codemod => {
      if (typeof src === 'undefined') {
        return;
      }

      const nextSrc = codemod({ ...file,
        source: src
      }, api, options);

      if (nextSrc) {
        src = nextSrc;
      }
    });

    return src;
  }
};
