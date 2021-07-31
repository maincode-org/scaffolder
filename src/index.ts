#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as https from 'https';
import * as inquirer from 'inquirer';
import * as pad from 'pad';

import pkg from 'mkdirp';
import { ITemplateConfig, templateConfigs } from './template-configs';
const { sync } = pkg;


const program = new Command();

program.command('list').alias('ls').description('List all templates');


program.command('generate')
  .option('-t, --template <template>', 'specify template')
  .option('-o, --outdir <outdir>', 'relative path to output dir');

program.parse();
const options = program.opts();
const fileName = program.args; // The "rest" of the arguments given. "command [options] filename".

if (options.list) {
  console.log('--- Templates -----');
  Array.from(templateConfigs.keys()).forEach((template) => console.log(`> ${template}`));
  console.log('-------------------');
}

/** Early return when generate is not specified. */
if (!options.generate || !options.template || !program.args?.[0]) {
  if (!options.list) console.log('Missing required params: -g -t <template> <filename> or simply -l to list templates.');
  process.exit();
}

/** Identify the correct template. */
const template: ITemplateConfig | undefined = templateConfigs.get(options.template);
if (!template) {
  console.log(`Template not found: "${options.template}". Use -l to list available templates.`);
  process.exit(1);
}

/** Create the correct folders if needed. */
// TODO: Make file-name dash-cased, remove ext and include a folder for it (only when component).
// TODO: if outdir starts with ./, strip ./ from outdir.
const outDir = `./${options.outdir ?? template.defaultOutDir}`;
sync(outDir);

// TODO: Write the correct template file (from github download).
// TODO: if not filename ends on the same as the template filename ends, append it.
const file = fs.createWriteStream(`${outDir}/${fileName}`);
const request = https.get(template.downloadURL, function (response) {
  response.pipe(file);
  console.log('Yay, boilerplate code written! ;)');
});

// TODO: Modify it to the given params/name
