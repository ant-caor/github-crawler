import fs from "fs";
import chalk from "chalk";

const log = console.log;

const savePRFile = (
  data,
  header,
  comments,
  issueComments,
  reviews,
  dir = "prs"
) => {
  const file = `${dir}/${data.owner}/${data.repo}/${data.pr}.json`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(`${dir}`);
  }

  if (!fs.existsSync(`${dir}/${data.owner}`)) {
    fs.mkdirSync(`${dir}/${data.owner}`);
  }

  if (!fs.existsSync(`${dir}/${data.owner}/${data.repo}`)) {
    fs.mkdirSync(`${dir}/${data.owner}/${data.repo}`);
  }

  var writeStream = fs.createWriteStream(file.toLowerCase(), "utf8");

  const pr = {
    header: header,
    comments: comments,
    issueComments: issueComments,
    reviews: reviews,
  };

  writeStream.write(JSON.stringify(pr));
  writeStream.end();

  log(
    chalk.bold.yellow(
      `\nPR info file created successfully at: ${file.toLowerCase()}\n`
    )
  );
};

const readPRsDir = (dir = "prs") => {
  const prs = [];

  fs.readdirSync(dir).forEach((owner) => {
    fs.readdirSync(`${dir}/${owner}`).forEach((repo) => {
      fs.readdirSync(`${dir}/${owner}/${repo}`).forEach((pr_file) => {
        const content = fs.readFileSync(`${dir}/${owner}/${repo}/${pr_file}`, {
          encoding: "utf-8",
        });
        const pr = JSON.parse(content, null, 2);
        prs.push({ owner, repo, data: pr });
        console.log("Reading pr with number: ", pr.header.number);
        console.log("Reading pr with title: ", pr.header.title);
        console.log(`This pr has: ${pr.comments.length} comments`);
        console.log(`This pr has: ${pr.issueComments.length} issue comments`);
        console.log(`This pr has: ${pr.reviews.length} reviews\n`);
      });
    });
  });

  return prs;
};

export { savePRFile, readPRsDir };
