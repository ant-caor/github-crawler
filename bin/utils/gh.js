import { Octokit } from "octokit";
import chalk from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

// More info about oktokit: https://octokit.github.io/rest.js/v19
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

const log = console.log;

const getPRHeader = async (data) => {
  return octokit
    .request(`GET /repos/${data.owner}/${data.repo}/pulls/${data.pr}`, {
      owner: data.owner,
      repo: data.repo,
    })
    .then((result) => {
      log(chalk.bold.red("PR Title: "), result.data.title);
      log(chalk.bold.red("PR Description: \n"), result.data.body);
      return {
        title: result.data.title,
        description: result.data.body,
        commentCount: result.data.comments,
        reviewCommentCount: result.data.review_comments,
      };
    });
};

const getPRComments = async (data) => {
  return octokit
    .request(
      `GET /repos/${data.owner}/${data.repo}/pulls/${data.pr}/comments`,
      {
        owner: data.owner,
        repo: data.repo,
      }
    )
    .then((result) => {
      const comments = [];
      result.data.forEach((comment) => {
        log(chalk.bold.green.inverse("\n------ Comment ------\n"));
        log(chalk.bold.red("Author: "), comment.user.login, "\n");
        log(comment.body);
        comments.push({
          author: comment.user.login,
          content: comment.body,
        });
      });
      return comments;
    });
};

export { getPRComments, getPRHeader };
