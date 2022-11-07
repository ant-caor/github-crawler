#!/usr/bin/env node
import {
  getPRHeader,
  getPRComments,
  getPRIssueComments,
  getPRS,
} from "./utils/gh.js";
import { savePRFile, readPRsDir } from "./utils/fs.js";
import { queryAction, querySavePRParams } from "./utils/prompt.js";

const getPRInfo = async (data) => {
  if (data.pr === "all") {
    const headers = await getPRS(data);
    headers.forEach(async (header, index) => {
      const comments = await getPRComments({
        owner: data.owner,
        repo: data.repo,
        pr: header.number,
      });
      const issueComments = await getPRIssueComments({
        owner: data.owner,
        repo: data.repo,
        pr: header.number,
      });
      console.log(
        `Saving PRs ${parseInt(
          100 - ((headers.length - index) / headers.length) * 100
        )}%`
      );
      savePRFile(
        { owner: data.owner, repo: data.repo, pr: header.number },
        header,
        comments,
        issueComments
      );
    });
  } else {
    const header = await getPRHeader(data);
    const comments = await getPRComments(data);
    const issueComments = await getPRIssueComments(data);
    savePRFile(data, header, comments, issueComments);
  }
};

const params = await queryAction();
console.log("Executing: ", params.action);
switch (params.action) {
  case "process":
    /*
    todo: 
      1 - Read the PRs folder and parse JSONs into POJOs. (Here we have almost 2000 prs)
      2 - Filter prs without comments. +
      3 - Sort nested comments by inReplyToId. ++++
      4 - Save processed POJOs into processed_prs. (There should be only the most interested ones)
    */
    readPRsDir();
    break;
  case "save":
    getPRInfo(await querySavePRParams());
    break;
}
