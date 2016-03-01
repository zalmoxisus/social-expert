import React from 'react';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import GoPullRequest from 'react-icons/lib/go/git-pull-request';
import GoCommit from 'react-icons/lib/go/git-commit';
import GoTag from 'react-icons/lib/go/tag';
import GoQuestion from 'react-icons/lib/go/question';

export default function getIcon(type) {
  switch (type) {
    case 'Issue':
      return <GoIssueOpened/>;
    case 'PullRequest':
      return <GoPullRequest/>;
    case 'Commit':
      return <GoCommit/>;
    case 'Release':
      return <GoTag/>;
    default:
      return <GoQuestion/>;
  }
}
