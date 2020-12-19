#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const { program } = require("commander");
const toKebabCase = require("./utils/kebabCase");
const ejs = require("ejs");
const shell = require("shelljs");
const ora = require("ora");

program
  .version("0.0.1")
  .description("IPAgri CLI")
  .command("init <projName>")
  .alias("i")
  .description("init a new project")
  .action(async function (projName) {
    //create project folder
    const projectFolder = path.join(process.cwd(), toKebabCase(projName));
    await fs.ensureDir(projectFolder);
    console.log("Project folder is created");
    //copy back-end scaffold
    await fs.copy(path.join(__dirname, "scaffolds/backend"), projectFolder);
    console.log("Scaffolding completed");
    //generate package.json file
    ejs.renderFile(
      path.join(__dirname, "templates/backend/package.json.ejs"),
      { packageName: toKebabCase(projName) },
      {},
      function (err, str) {
        // str => Rendered HTML string
        if (err) {
          console.error(err);
        }

        //console.log(str)
        fs.ensureFileSync(path.join(projectFolder, "package.json"));
        fs.outputFileSync(path.join(projectFolder, "package.json"), str);
      }
    );

    //install packages
    shell.cd(projectFolder);
    const spinner = ora("Install packages").start();
    shell.exec("npm install");
    spinner.succeed("Packages installed");
    console.log("To start, you must do");
    console.log(`cd ${projectFolder}`);
    console.log("code .");
    console.log("Edit config.js file point to your database");
    console.log("Uncomment lines 43,44 to genenerate root admin account");
    console.log("npm start");
    console.log("Thanks!");
  });

program
  .command("generate <name>")
  .alias("g")
  .description("Generate new file")
  .action(function (name) {
    console.log("Generated");
  });

program.parse(process.argv);
