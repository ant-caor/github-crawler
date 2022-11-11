import fs from "fs";
import chalk from "chalk";

const log = console.log;

const savePRFile = (data, header, comments, issueComments, reviews) => {
  const file = `prs/${data.owner}/${data.repo}/${data.pr}.json`;

  if (!fs.existsSync(`prs/${data.owner}/${data.repo}`)) {
    fs.mkdirSync("prs");
    fs.mkdirSync(`prs/${data.owner}`);
    fs.mkdirSync(`prs/${data.owner}/${data.repo}`);
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

const readPRsDir = () => {
  const dir = "prs";

  fs.readdirSync(dir).forEach((owner) => {
    fs.readdirSync(`${dir}/${owner}`).forEach((repo) => {
      fs.readdirSync(`${dir}/${owner}/${repo}`).forEach((pr_file) => {
        const content = fs.readFileSync(`${dir}/${owner}/${repo}/${pr_file}`, {
          encoding: "utf-8",
        });
        const pr = JSON.parse(content, null, 2);

        console.log("Reading pr with number: ", pr.header.number);
        console.log("Reading pr with title: ", pr.header.title);
        console.log(`This pr has: ${pr.comments.length} comments`);
        console.log(`This pr has: ${pr.issueComments.length} issue comments`);
        console.log(`This pr has: ${pr.reviews.length} reviews\n`);
      });
    });
  });

  /*

  */
};

export { savePRFile, readPRsDir };
