# Migrate Preact X
A collection of codemods to update your compatibility of preact to version X.

## List of codemods

- [x] convert default imports into named imports
- [x] convert h pragma into createElement
- [x] Convert attributes & nodeName into props (we only change the ones we are 100% certain of)

## Usage
```
npm i -g preact-migrate-x
preact-migrate-x [PATH_TO_SOURCE_DIR]
```

You can also use npx to run preact-migrate-x
```
npx preact-migrate-x [PATH_TO_SOURCE_DIR]
```

## Notes
- Once you run all the migrations check the diff and make sure that everything looks as expected. These fixers cover almost all cases we know of, but it's possible that some manual fixes can be required.
- Although the migration will format your source code, it's likely that that the style is not consistent with the rest of your project. To make sure that everything is properly following your project's style guide, we recommend you apply a formatter such as prettier or clang-format after the edits are made.

## License
MIT
