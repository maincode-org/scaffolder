export enum ETemplates {
  'component' = 'component',
  'screen' = 'screen',
}

export type ITemplateConfig = {
  type: ETemplates;
  fileExtension: string;
  defaultOutDir: string;
  downloadURL: string;
};

export const templateConfigs = new Map<ETemplates, ITemplateConfig>([
  [
    ETemplates.component,
    {
      type: ETemplates.component,
      fileExtension: 'tsx',
      defaultOutDir: '/src/components',
      downloadURL: 'https://raw.githubusercontent.com/maincode-org/code-snippets/main/frontend/component-boilerplate.tsx',
    },
  ],
  [ETemplates.screen, { type: ETemplates.screen, fileExtension: 'tsx', defaultOutDir: '/src/screens', downloadURL: '' }],
]);

export const listTemplates = () => {
  console.log('--- Templates -----');
  Array.from(templateConfigs.keys()).forEach((template) => console.log(`> ${template}`));
  console.log('-------------------');
};
