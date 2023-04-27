#! /usr/bin/env node
import * as dotenv from "dotenv";
import inquirer from "inquirer";
import chalk from "chalk";
import Mautic from "./mautic/index.mjs";
import * as Roles from "./roles/index.mjs";

dotenv.config();

const questions = [
  {
    type: "input",
    name: "baseUrl",
    message: "Enter client URL",
    default: process.env.MAUTIC_URL || "",
    validate: (ans) => {
      if (ans.length === 0) {
        return "Please enter a URL";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "clientId",
    message: "Enter client ID",
    default: process.env.CLIENT_ID || "",
    validate: (ans) => {
      if (ans.length === 0) {
        return "Please enter a client ID";
      }
      return true;
    },
  },
  {
    type: "password",
    name: "clientSecret",
    message: "Enter client secret",
    default: process.env.CLIENT_SECRET || "",
    validate: (ans) => {
      if (ans.length === 0) {
        return "Please enter a client secret";
      }
      return true;
    },
  },
];

try {
  console.log(
    chalk.blue.bgGreen.bold(
      "This is a basic tool to seed default roles into a new Mautic instance."
    )
  );
  const { baseUrl, clientId, clientSecret } = await inquirer.prompt(questions);

  console.table({
    "Client ID": clientId,
    "Client Secret": `*******${clientSecret.slice(-5)}`,
    "Mautic URL:": baseUrl,
  });
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `Confirm you want to create default roles using the entered credentials`,
      default: false,
    },
  ]);
  if (!confirmed) {
    throw new Error("You must confirm to proceed");
  }

  let mautic = new Mautic({ baseUrl, clientId, clientSecret });

  await mautic.authorize();

  const roles = await mautic.listRoles();

  let shouldDeleteAllRoles = false;
  if (roles.length > 1) {
    console.log(
      chalk.bgYellow.white(
        `
********** WARNING ******************************************************************
*   Excluding the Default Administrator Role,There are already roles in the system. *
*************************************************************************************`
      )
    );
    const { confirmedRoleDeletion } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmedRoleDeletion",
        message: `Do you want to delete them? (default role will not be deleted)`,
        default: false,
      },
    ]);
    shouldDeleteAllRoles = confirmedRoleDeletion;
  }
  if (shouldDeleteAllRoles) {
    await mautic.deleteAllRoles();
  }

  for (const role of Object.values(Roles)) {
    await mautic.createRole({
      ...role,
    });
  }
  console.log(chalk.blue.bgGreen.bold("Completed. All roles seeded"));
} catch (error) {
  console.log(chalk.red(error));
}
