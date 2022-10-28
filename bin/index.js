#!/usr/bin/env node
import { getPRHeader, getPRComments, getPRIssueComments } from "./utils/gh.js";
import { savePRFile } from "./utils/fs.js";
import { queryParams } from "./utils/prompt.js";

const getPRInfo = async (data) => {
  let header;
  let comments;
  let issueComments;

  if (data.pr === "all") {
    // TODO get all pr numbers
    // TODO filter interesting prs
    // TODO get interesting prs metadata
  } else {
    header = await getPRHeader(data);
    comments = await getPRComments(data);
    issueComments = await getPRIssueComments(data);
  }

  savePRFile(data, header, comments, issueComments);
};

getPRInfo(await queryParams());
