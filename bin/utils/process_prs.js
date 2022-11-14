/**
 *  Method to sort and nest replies of comments, issue comments and reviews.
 * @param {PR} pr data.
 * @returns
 */
function sortComments(pr) {
  let processedPr = pr;
  // TODO
  /*

  PR {
    header {}
    comments {
      comment 1 {}
      comment 2 {} <- This is a reply to comment 1
      comment ... {}
      comment n {}
    }
  }

  PR {
    header {}
    review n {
      comments {
      comment 1 {
        ++ reply 1 {} <-- This is comment 2
        reply ... {}
        reply n {}
      }
      -- comment 2 {}
      comment ... {}
      comment n {}
    }
    }
  }

  Useful info:
   - Each comment has an id
   - When a comment is a reply has a inReplyToId
  */

  const prComments = pr.data.comments;
  const auxComments = [];
  const auxReviews = pr.data.reviews;

  // First we add parent comments to auxComments.
  prComments.forEach((comment) => {
    if (!comment.inReplyToId) {
      // This is a root comment
      auxComments.push(comment);
    }
  });

  // Then we add replies to parent comments.
  prComments.forEach((comment) => {
    if (comment.inReplyToId) {
      auxComments.forEach((parentComment) => {
        if (parentComment.id === comment.inReplyToId) {
          if (parentComment.replies === undefined) {
            parentComment.replies = [];
          }
          // this is a nested comment
          parentComment.replies.push(comment);
        }
      });
    }
  });

  // This auxComments only has the parent comments with replies if exists.
  // As all comments are relative to a pr review, we are going to nest them into the corresponding review.
  auxComments.forEach((comment) => {
    auxReviews.forEach((review) => {
      if (comment.pullRequestReviewId === review.id) {
        if (review.comments === undefined) {
          review.comments = [];
        }
        // this is a comment on the review
        review.comments.push(comment);
      }
    });
  });

  return {
    owner: pr.owner,
    repo: pr.repo,
    data: {
      header: pr.data.header,
      issueComments: pr.data.issueComments,
      reviews: auxReviews,
    },
  };
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
