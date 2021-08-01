#!/usr/bin/env node
import { Command } from 'commander';
import { listTemplates } from './template-configs.js';
import { generateCommand } from './generator.js';

const program = new Command();

program.command('list').alias('ls').description('List all templates').action(() => listTemplates());

generateCommand(program).then(() => console.log("Thank you for using Scaffolder! ʘ‿ʘ"));