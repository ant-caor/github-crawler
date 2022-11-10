import { Octokit } from "octokit";
import * as dotenv from "dotenv";

dotenv.config();

const blackList = ["[Snyk]", "Bump"];
const pageSize = 100;

// More info about oktokit: https://octokit.github.io/rest.js/v19
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

const getPRS = async (data) => {
  const prs = [];
  let next = true;
  let page = 1;
  console.log(
    `Checking prs (this may take some minutes depending on the total amount of PRs)...`
  );

  while (next) {
    await octokit
      .request(
        `GET /repos/${data.owner}/${data.repo}/pulls?page=${page}&per_page=${pageSize}&state=all`,
        {
          owner: data.owner,
          repo: data.repo,
        }
      )
      .then((result) => {
        result.data.forEach((pr) => {
          const prNumber = pr.number;
          const prTitle = pr.title;
          const prDescription = pr.body;
          // TODO check if we can do a better filtering to avoid saving non interesting or bot comments.
          if (!blackList.some((w) => prTitle.includes(w))) {
            prs.push({
              number: prNumber,
              title: prTitle,
              description: prDescription,
            });
          }
        });
        page++;
        next = result.data.length === pageSize;
      });
  }
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

/**
 * Getter of PR review comments.
 * @param {owner} string: Owner of the repository.
 * @param {repo} string: Specific repository.
 * @param {pr} string: Specific pull request number.
 * @returns PR review comments.
 */
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
          pullRequestReviewId: comment.pull_request_review_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          author: comment.user?.login,
          content: comment.body,
          diff: comment.diff_hunk,
        });
      });
      return comments;
    });
};

/**
 * Getter of PR issue comments.
 * @param {owner} string: Owner of the repository.
 * @param {repo} string: Specific repository.
 * @param {pr} string: Specific pull request number.
 * @returns PR issue comments.
 */
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
          id: comment.id,
          inReplyToId: comment.in_reply_to_id,
          pullRequestReviewId: comment.pull_request_review_id,
          author: comment.user.login,
          content: comment.body,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
        });
      });
      return comments;
    });
};

/**
 * Getter of PR reviews.
 * Please, don't confuse it with review comments.
 * More info at: https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request
 * @param {owner} string: Owner of the repository.
 * @param {repo} string: Specific repository.
 * @param {pr} string: Specific pull request number.
 * @returns PR reviews.
 */
const getPRReviews = async (data) => {
  return octokit
    .request(`GET /repos/${data.owner}/${data.repo}/pulls/${data.pr}/reviews`, {
      owner: data.owner,
      repo: data.repo,
    })
    .then((result) => {
      const reviews = [];
      result.data.forEach((review) => {
        reviews.push({
          id: review.id,
          author: review.user.login,
          content: review.body,
          state: review.state,
          submittedAt: review.submitted_at,
        });
      });
      return reviews;
    });
};

export { getPRComments, getPRHeader, getPRIssueComments, getPRReviews, getPRS };
