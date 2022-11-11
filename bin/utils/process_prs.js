/**
 *  Method to sort and nest replies of comments, issue comments and reviews.
 * @param {PR} pr data.
 * @returns
 */
function sortComments(pr) {
  let processedPr = pr;
  // TODO
  return processedPr;
}

/**
 * Method to process an array of PRs (filtering, and transforming)
 * @param {Array} prs: Array of PRs to process.
 */
function processPRs(prs) {
  const processedPrs = [];

  prs.forEach((pr) => {
    let reviewWithComments = 0;

    pr.data.reviews.forEach((review) => {
      if (review.content !== "") {
        reviewWithComments++;
      }
    });
    const totalComments =
      pr.data.comments.length +
      pr.data.issueComments.length +
      reviewWithComments;

    if (totalComments > 0) {
      processedPrs.push(sortComments(pr));
    }
  });

  return processedPrs;
}

export { processPRs };
