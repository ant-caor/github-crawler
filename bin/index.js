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
    headers.forEach(async (header) => {
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
    // TODO Sort nested comments by inReplyToId.
  }

  savePRFile(data, header, comments, issueComments);
};

getPRInfo(await queryParams());
