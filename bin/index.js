#!/usr/bin/env node
import {
  getPRHeader,
  getPRComments,
  getPRIssueComments,
  getPRS,
  getPRReviews,
} from "./utils/gh.js";
import { savePRFile, readPRsDir } from "./utils/fs.js";
import { queryAction, querySavePRParams } from "./utils/prompt.js";
import { processPRs } from "./utils/process_prs.js";

const getPRInfo = async (data) => {
  if (data.pr === "all") {
    const headers = await getPRS(data);
    headers.forEach(async (header, index) => {
      // Here we download all the comments for all PRs in the repo.
      const params = { owner: data.owner, repo: data.repo, pr: header.number };
      const comments = await getPRComments(params);
      const issueComments = await getPRIssueComments(params);
      const reviews = await getPRReviews(params);
      console.log(`Normal comments: ${comments?.length}`);
      console.log(`Issue comments: ${issueComments?.length}`);
      console.log(`Reviews: ${reviews?.length}`);
      console.log(
        `Saving PRs ${parseInt(
          100 - ((headers.length - index) / headers.length) * 100
        )}%`
      );
      savePRFile(params, header, comments, issueComments, reviews);
    });
  } else {
    // Here we download all the comments for a specific PR in the repo.
    const header = await getPRHeader(data);
    const comments = await getPRComments(data);
    const issueComments = await getPRIssueComments(data);
    const reviews = await getPRReviews(data);
    savePRFile(data, header, comments, issueComments, reviews);
  }
};

const params = await queryAction();
switch (params.action) {
  case "process":
    const prs = readPRsDir();
    // This prs array contains pr elements with the following fields: owner, repo and data (with the json data)
    const processedPRs = processPRs(prs);
    processedPRs.forEach((pr) => {
      savePRFile(
        { owner: pr.owner, repo: pr.repo, pr: pr.data.header.number },
        pr.data.header,
        pr.data.comments,
        pr.data.issueComments,
        pr.data.reviews,
        "processed_prs"
      );
    });
    break;
  case "save":
    getPRInfo(await querySavePRParams());
    break;
}
