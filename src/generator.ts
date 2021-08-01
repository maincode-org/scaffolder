/** Command for generating code files. */
import { ETemplates, ITemplateConfig, templateConfigs } from './template-configs.js';
import { Command } from 'commander';
import prompts from 'prompts';
import fs from 'fs';
import https from 'https';
import pkg from 'mkdirp';

const { sync } = pkg;

export const generateCommand = async (program: Command) => {
  program.command('generate').alias('gen').parse();

  /** Prompt the user for template, options and entity name. */
  const answers = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Choose a code template',
      choices: [
        { title: 'React.js Component', value: ETemplates.component },
        { title: 'Ionic screen', value: ETemplates.screen },
      ],
      instructions: false,
    },
    {
      type: (prev) => (prev === ETemplates.component ? 'confirm' : null),
      name: 'includeCSS',
      message: 'Include a CSS module?',
      initial: 'y',
    },
    {
      type: 'text',
      name: 'entityName',
      message: 'Enter entity name. Eg. "MyComponent". Remember correct casing, but leave out the extension as it is automatically added.',
    },
    {
      type: 'text',
      name: 'outDir',
      initial: '',
      message: 'Custom output directory overwrite.',
    },
  ]);

  /** Identify the correct template. */
  const template: ITemplateConfig | undefined = templateConfigs.get(answers.template);
  if (!template) throw 'Template not found.';

  /** For components, append a sub-folder with the component name in dash-case. */
  let dashCasedFilename = answers.entityName.replace(/[A-Z]/g, (m: string) => '-' + m.toLowerCase()).substring(1);
  const defaultOutDir = template.type === ETemplates.component ? `${template.defaultOutDir}/${dashCasedFilename}` : template.defaultOutDir;

  /** Create the correct folders if needed. (remove ./ prefix when supplied from the user). */
  const outDir = `./${answers.outDir?.replace('./', '') ?? defaultOutDir}`;
  sync(outDir);

  // TODO add CSS module.

  /** Creates the file in the output directory, with the correct extension (user given extensions are stripped by regex). */
  const fileStream = fs.createWriteStream(`${outDir}/${answers.entityName.replace(/\.[^/.]+$/, '')}.${template.fileExtension}`);

  /** Writes the correct template file (from github download). */
  https.get(template.downloadURL, (response) => {
    response.pipe(fileStream);

    /** Replace the keyword "BoilerPlate" with the entity name in the file. */
    fs.readFile(fileStream.path, 'utf8', function (err, data) {
      if (err) return console.log(err);

      let result = data.replace(/BoilerPlate/g, answers.entityName);

      fs.writeFile(fileStream.path, result, 'utf8', (err) => (err ? console.log(err) : null));
    });
  });
};
