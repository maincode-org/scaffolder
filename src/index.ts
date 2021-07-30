#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as https from 'https';
import pkg from 'mkdirp';
const { sync } = pkg;

const program = new Command();

enum ETemplates {
  'component' = 'component',
  'screen' = 'screen',
}

type ITemplateConfig = {
  type: ETemplates;
  fileName: string;
  downloadURL: string;
  defaultOutDir: string;
};

/** <template, file-url> */
const templates = new Map<ETemplates, ITemplateConfig>([
  [
    ETemplates.component,
    {
      type: ETemplates.component,
      fileName: 'component-boilerplate.tsx',
      defaultOutDir: '/src/components',
      downloadURL: 'https://raw.githubusercontent.com/maincode-org/code-snippets/main/frontend/component-boilerplate.tsx',
    },
  ],
  [ETemplates.screen, { type: ETemplates.screen, fileName: '', defaultOutDir: '/src/screens', downloadURL: '' }],
]);

program
  .option('-l, --list', 'lists available templates')
  .option('-g, --generate', 'generate mode')
  .option('-t, --template <template>', 'specify template')
  .option('-o, --outdir <outdir>', 'relative path to output dir');

program.parse();
const options = program.opts();
const fileName = program.args; // The "rest" of the arguments given. "command [options] filename".

if (options.list) {
  console.log('--- Templates -----');
  Array.from(templates.keys()).forEach((template) => console.log(`> ${template}`));
  console.log('-------------------');
  process.exit();
}

/** Early return when generate is not specified. */
if (!options.generate || !options.template || !program.args?.[0]) {
  if (!options.list) console.log('Missing required params: -g -t <template> <filename> or simply -l to list templates.');
  process.exit();
}

/** Identify the correct template. */
const template: ITemplateConfig | undefined = templates.get(options.template);
if (!template) {
  console.log(`Template not found: "${options.template}". Use -l to list available templates.`);
  process.exit(1);
}

/** Create the correct folders if needed. */
// TODO: Make file-name dash-cased, remove ext and include a folder for it (only when component).
// TODO: if outdir starts with ./, strip ./ from outdir.
const outDir = `./${options.outdir ?? template.defaultOutDir}`;
sync(outDir);

// TODO: Write the correct template file (from github download)
// TODO: if not filename ends on the same as the template filename ends, append it.
const file = fs.createWriteStream(`${outDir}/${fileName}`);
const request = https.get(template.downloadURL, function (response) {
  response.pipe(file);
  console.log('Yay, boilerplate code written! ;)');
});

// TODO: Modify it to the given params/name
