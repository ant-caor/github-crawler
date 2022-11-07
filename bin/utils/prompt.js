import inquirer from "inquirer";
import * as dotenv from "dotenv";

dotenv.config();

const owner = process.env.DEFAULT_OWNER;
const repo = process.env.DEFAULT_REPO;
const pr = process.env.DEFAULT_PR;
const action = process.env.DEFAULT_ACTION;

const queryAction = () => {
  const qs = [
    {
      name: "action",
      type: "input",
      message:
        "Which action do you want to execute?\n-Save PRs [save]\n-Process local PRs [process]",
      default: action,
    },
  ];

  return inquirer.prompt(qs);
};

const querySavePRParams = () => {
  const qs = [
    {
      name: "owner",
      type: "input",
      message: "Which is the owner of the GitHub repository?",
      default: owner,
    },
    {
      name: "repo",
      type: "input",
      message: "Which is the name of the Github repository?",
      default: repo,
    },
    {
      name: "pr",
      type: "input",
      message:
        "Which is the pull request number? [Enter 'all' to download all repo prs]",
      default: pr,
    },
  ];

  return inquirer.prompt(qs);
};

export { queryAction, querySavePRParams };
