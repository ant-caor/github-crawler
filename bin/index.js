#!/usr/bin/env node
import { getPRHeader, getPRComments } from "./utils/gh.js";
import { savePRFile } from "./utils/fs.js";
import { queryParams } from "./utils/prompt.js";

const getPRInfo = async (data) => {
  const header = await getPRHeader(data);
  const comments = await getPRComments(data);

  savePRFile(data, header, comments);
};

getPRInfo(await queryParams());
