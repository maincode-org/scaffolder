# Scaffolder
A scaffolding tool to generate React and Express boilerplate code, as by the Maincode standard.

Use `npm i -g @markido/scaffolder` to install it globally for use in any project.

Use `scaff` or `scaff generate` or `scaff gen` to start a new file creation.

The `template` refers to the snippets found in the [Maincode snippets repository](https://github.com/maincode-org/code-snippets).

The *default output directory* differs depending on the template. The custom output directory will generate all sub-directories specified.
For example, entity `MyComponent` of template `React.js Component` at custom output directory `path/to/new/comp`, generated from the project root will make
`./path/to/new/comp/MyComponent.tsx` and all sub-folders not already present. Scaffolder can be run from any directory and paths are always relative to the invocation directory.