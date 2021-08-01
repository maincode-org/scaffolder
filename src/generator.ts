/** Command for generating code files. */
import { ETemplates, ITemplateConfig, templateConfigs } from './template-configs.js';
import { Command } from 'commander';
import prompts from 'prompts';
import fs from 'fs';
import https from 'https';
import pkg from 'mkdirp';

const { sync } = pkg;


export const generateCommand = async (program: Command) => {

  program.command('generate').alias('gen')
    .option('-o, --outdir <outdir>', 'relative path to output dir');

  program.parse();
  const options = program.opts();
  const fileName = program.args; // The "rest" of the arguments given. "command [options] filename".

  /** Identify the correct template. */
  const templateChoice = await prompts([
    {
    type: 'select',
    name: 'template',
    message: 'Choose a code template',
    choices: [
      { title: 'React.js Component', value: ETemplates.component },
      { title: 'Ionic screen', value: ETemplates.screen },
    ],
    instructions: false
  },
    {
      type: prev => prev === ETemplates.component ? 'confirm' : null,
      name: 'includeCSS',
      message: 'Include a CSS module?',
      initial: 'y'
    }
  ]);

  const template: ITemplateConfig | undefined = templateConfigs.get(templateChoice.template);
  console.log(templateChoice);
  console.log(template);

  /** Create the correct folders if needed. */
// TODO: Make file-name dash-cased, remove ext and include a folder for it (only when component).
// TODO: if outdir starts with ./, strip ./ from outdir.
  /*
  const outDir = `./${options.outdir ?? template.defaultOutDir}`;
  sync(outDir);

// TODO: Write the correct template file (from github download).
// TODO: if not filename ends on the same as the template filename ends, append it.
  const file = fs.createWriteStream(`${outDir}/${fileName}`);
  const request = https.get(template.downloadURL, function (response) {
    response.pipe(file);
    console.log('Yay, boilerplate code written! ;)');
  });
*/
// TODO: Modify it to the given params/name
}