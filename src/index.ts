#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

console.log("hi!");

/** <template, file-url> */
const templates = new Map<string, string>([
    ["component", "https://-component-boiler-plate"],
    ["page", "https://-page-boiler-plate"]
]);

program
    .option('-g, --generate', 'generate mode')
    .option('-l, --list', 'lists available templates')
    .option('-t, --template <template>', 'specify template')
    .option('-o, --outdir <outdir>', 'relative path to output dir');

program.parse();
const options = program.opts();
const fileName = program.args; // The "rest" of the arguments given. "command [options] filename".

console.log(options);
if(options.list) {
    console.log(Array.from(templates.keys()))
}


// TODO: Identify the correct template

// TODO: Create the correct folders if needed

// TODO: Write the correct template file (from github download)

// TODO: Modify it to the given params/name

console.log('Options: ', program.opts());
console.log('Filename: ', fileName);