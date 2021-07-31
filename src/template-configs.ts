export enum ETemplates {
  'component' = 'component',
  'screen' = 'screen',
}

export type ITemplateConfig = {
  type: ETemplates;
  fileName: string;
  downloadURL: string;
  defaultOutDir: string;
};

export const templateConfigs = new Map<ETemplates, ITemplateConfig>([
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

export const listTemplates = () => {
  console.log('--- Templates -----');
  Array.from(templateConfigs.keys()).forEach((template) => console.log(`> ${template}`));
  console.log('-------------------');
}