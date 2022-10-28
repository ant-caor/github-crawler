import fs from "fs";
import chalk from "chalk";

const log = console.log;

const savePRFile = (data, header, comments, issueComments) => {
  const file = `prs/${data.owner}_${data.repo}_${data.pr}.json`;

  if (!fs.existsSync("prs")) {
    fs.mkdirSync("prs");
  }

  var writeStream = fs.createWriteStream(file.toLowerCase(), "utf8");

  const pr = {
    header: header,
    comments: comments,
    issueComments: issueComments,
  };

  writeStream.write(JSON.stringify(pr));
  writeStream.end();

  log(
    chalk.bold.yellow(
      `\n\n\nPR info file created successfully at: ${file.toLowerCase()}\n`
    )
  );
};

export { savePRFile };
