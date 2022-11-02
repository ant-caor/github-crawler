import { Octokit } from "octokit";
import * as dotenv from "dotenv";

dotenv.config();

const blackList = ["[Snyk]", "Bump"];

// More info about oktokit: https://octokit.github.io/rest.js/v19
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

const getPRS = async (data) => {
  const prs = [];
  let next = true;
  let page = 1;

  while (next) {
    await octokit
      .request(
        `GET /repos/${data.owner}/${data.repo}/pulls?page=${page}&state=all`,
        {
          owner: data.owner,
          repo: data.repo,
        }
      )
      .then((result) => {
        console.log(`Getting page: ${page}...`);
        result.data.forEach((pr) => {
          const prNumber = pr.number;
          const prTitle = pr.title;
          const prDescription = pr.body;
          const prCommentCount = pr.comments;
          const prReviewCommentCount = pr.review_comments;
          const prTotalComments = prCommentCount + prReviewCommentCount;
          // TODO check if we can do a better filtering to avoid saving non interesting or bot comments.
          if (prTotalComments >= 1) {
            prs.push({
              number: prNumber,
              title: prTitle,
              description: prDescription,
              commentCount: prCommentCount,
              reviewCommentCount: prReviewCommentCount,
            });
          }
        });
        page++;
        next = result.data.length === 30;
      });
  }

  console.log("Interesting prs count: ", prs.length);
  return prs;
};

const getPRHeader = async (data) => {
  return octokit
    .request(`GET /repos/${data.owner}/${data.repo}/pulls/${data.pr}`, {
      owner: data.owner,
      repo: data.repo,
    })
    .then((result) => {
      return {
        number: result.data.number,
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
          id: comment.id,
          inReplyToId: comment.in_reply_to_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
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

export { getPRComments, getPRHeader, getPRIssueComments, getPRS };
