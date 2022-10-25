import fs from "fs";
import chalk from "chalk";

const log = console.log;

const savePRFile = (data, header, comments) => {
  const file = `prs/${data.owner}_${data.repo}_${data.pr}.txt`;

  if (!fs.existsSync("prs")) {
    fs.mkdirSync("prs");
  }

  var writeStream = fs.createWriteStream(file.toLowerCase(), "utf8");

  writeStream.write(`PR Title: ${header.title}`);
  writeStream.write("\n");
  writeStream.write(`PR Description:\n ${header.description}`);
  writeStream.write("\n\n\nComments: \n");
  writeStream.write("------------------------------ \n");

  comments.forEach((comment) => {
    writeStream.write(`Author: ${comment.author}`);
    writeStream.write("\n");
    writeStream.write(`Content: ${comment.content}\n`);
    writeStream.write("------------------------------ \n");
  });

  writeStream.end();

  log(
    chalk.bold.yellow(
      `\n\n\nPR info file created successfully at: ${file.toLowerCase()}\n`
    )
  );
};

export { savePRFile };
