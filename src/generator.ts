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
      name: 'includeChildren',
      message: 'Include rendered children?',
      initial: 'n',
    },
    {
      type: 'confirm',
      name: 'includeCSS',
      message: 'Include a CSS module?',
      initial: 'y',
    },
    {
      type: 'text',
      name: 'entityName',
      message: 'Enter entity name. Eg. "MyComponent".\nRemember correct casing, but leave out the extension as it is automatically added.\n',
    },
    {
      type: 'text',
      name: 'outDir',
      initial: '',
      message: 'Custom output directory overwrite. (empty for default:recommended)',
    },
  ]);

  /** Identify the correct template. */
  const template: ITemplateConfig | undefined = templateConfigs.get(answers.template);
  if (!template) throw 'Template not found.';

  /** For components, append a sub-folder with the component name in dash-case. */
  let dashCasedFilename = answers.entityName.replace(/[A-Z]/g, (m: string) => '-' + m.toLowerCase()).substring(1);
  const defaultOutDir = `${template.defaultOutDir}/${dashCasedFilename}`;

  /** Create the correct folders if needed. (remove ./ prefix when supplied from the user). */
  const outDir = `./${answers.outDir?.length > 0 ? answers.outDir?.replace('./', '') : defaultOutDir}`;
  sync(outDir);

  /** Creates the file in the output directory, with the correct extension (user given extensions are stripped by regex). */
  const fileStream = fs.createWriteStream(`${outDir}/${answers.entityName.replace(/\.[^/.]+$/, '')}.${template.fileExtension}`);

  /** Writes the correct template file (from github download). */
  https.get(template.downloadURL, (response) => {
    response.pipe(fileStream);

    /** Replace the keyword "BoilerPlate" with the entity name in the file. */
    fs.readFile(fileStream.path, 'utf8', function (err, data) {
      if (err) return console.log(err);

      let modifiedContent = data.replace(/BoilerPlate/g, answers.entityName);

      /** Remove "children" prop if opted-out. */
      if (!answers.includeChildren) {
        modifiedContent = modifiedContent.replace(/, children/g, '');
        modifiedContent = modifiedContent.replace(/{children}/g, '');
      }

      /** Adds a CSS Module if opted in. */
      if (answers.includeCSS) {
        fs.createWriteStream(`${outDir}/${dashCasedFilename}.module.css`);
        modifiedContent = `import styles from './${dashCasedFilename}.module.css';\n${modifiedContent}`;
      }

      fs.writeFile(fileStream.path, modifiedContent, 'utf8', (err) => (err ? console.log(err) : null));
    });
  });
};
