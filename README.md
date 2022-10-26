## Github crawler

Library to transform PR comments into txt files.

This library saves two kind of comments:
  - Comments: Comments on the pr conversation.
  - Review comments: Comment on a code diff hunk.

In order to accomplish that we need to do 3 requests:

1. For the PR title, description and author.
2. For the PR comments.
3. For the PR review comments.

Is important to remember that oktokit has a rate limit of 5000 request per hour.
