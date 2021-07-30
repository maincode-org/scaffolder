#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';

const program = new Command();

enum ETemplates {
  'component' = 'component',
  'screen' = 'screen',
}

type ITemplateConfig = {
  type: ETemplates;
  downloadURL: string;
  defaultOutDir: string;
};

/** <template, file-url> */
const templates = new Map<ETemplates, ITemplateConfig>([
  [ETemplates.component, { type: ETemplates.component, downloadURL: '', defaultOutDir: '/src/components' }],
  [ETemplates.screen, { type: ETemplates.screen, downloadURL: '', defaultOutDir: '/src/screens' }],
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
if (!options.generate) process.exit();

/** Identify the correct template. */
const template = templates.get(options.template);
if (!template) {
  console.log(`Template not found: "${options.template.type}". Use -l to list available templates.`);
  process.exit(1);
}

/** Create the correct folders if needed. */
// TODO: Make file-name dash-cased, remove ext and include a folder for it (only when component).
const outDir = `${options.outdir ?? template.defaultOutDir}`;
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
  console.log(`Directory did no exist - successfully created: ${outDir}`);
}

// TODO: Write the correct template file (from github download)

// TODO: Modify it to the given params/name
