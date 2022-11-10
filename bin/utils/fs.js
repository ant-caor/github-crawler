import fs from "fs";
import chalk from "chalk";

const log = console.log;

const savePRFile = (data, header, comments, issueComments, reviews) => {
  const file = `prs/${data.owner}_${data.repo}_${data.pr}.json`;

  if (!fs.existsSync("prs")) {
    fs.mkdirSync("prs");
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
  console.log("Reading PRs dir...");
  const dir = "prs";

  fs.readdir(dir, (err, files) => {
    if (err) throw error;

    files.forEach((file) => {
      const content = fs.readFileSync(`${dir}/${file}`, { encoding: "utf-8" });
      const pr = JSON.parse(content, null, 2);

      console.log("Reading pr with number: ", pr.header.number);
      console.log("Reading pr with title: ", pr.header.title);
      console.log(`This pr has: ${pr.comments.length} comments`);
      console.log(`This pr has: ${pr.issueComments.length} issue comments`);
    });
  });
};

export { savePRFile, readPRsDir };
