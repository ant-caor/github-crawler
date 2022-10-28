import { Octokit } from "octokit";
import * as dotenv from "dotenv";

dotenv.config();

// More info about oktokit: https://octokit.github.io/rest.js/v19
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

const getPRHeader = async (data) => {
  return octokit
    .request(`GET /repos/${data.owner}/${data.repo}/pulls/${data.pr}`, {
      owner: data.owner,
      repo: data.repo,
    })
    .then((result) => {
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
        comments.push({
          author: comment.user.login,
          content: comment.body,
          diff: comment.diff_hunk,
        });
      });
      return comments;
    });
};

const getPRIssueComments = async (data) => {
  return octokit
    .request(
      `GET /repos/${data.owner}/${data.repo}/issues/${data.pr}/comments`,
      {
        owner: data.owner,
        repo: data.repo,
      }
    )
    .then((result) => {
      const comments = [];
      result.data.forEach((comment) => {
        comments.push({
          author: comment.user.login,
          content: comment.body,
        });
      });
      return comments;
    });
};

export { getPRComments, getPRHeader, getPRIssueComments };
