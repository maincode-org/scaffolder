#!/usr/bin/env node
import { Command } from 'commander';
console.log("hi!");
const program = new Command();

program
    .option('-n, --number <numbers...>', 'specify numbers')
    .option('-l, --letter [letters...]', 'specify letters');

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);