#!/usr/bin/env node
import {
  getPRHeader,
  getPRComments,
  getPRIssueComments,
  getPRS,
} from "./utils/gh.js";
import { savePRFile } from "./utils/fs.js";
import { queryParams } from "./utils/prompt.js";

const getPRInfo = async (data) => {
  let header;
  let comments;
  let issueComments;

  if (data.pr === "all") {
    const headers = await getPRS(data);
    headers.forEach(async (header, index) => {
      comments = await getPRComments({
        owner: data.owner,
        repo: data.repo,
        pr: header.number,
      });
      issueComments = await getPRIssueComments({
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
    header = await getPRHeader(data);
    comments = await getPRComments(data);
    issueComments = await getPRIssueComments(data);
    savePRFile(data, header, comments, issueComments);
    // TODO Sort nested comments by inReplyToId.
  }
};

getPRInfo(await queryParams());
