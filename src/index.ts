#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from './generator.js';

const program = new Command();

generateCommand(program).then(() => console.log('Thank you for using Scaffolder! ʘ‿ʘ'));
