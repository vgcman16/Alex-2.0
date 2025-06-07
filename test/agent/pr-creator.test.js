const { expect } = require('chai');
const { createPullRequest } = require('../../agent/pr-creator');

describe('createPullRequest', () => {
  it('pushes branch and creates PR', () => {
    const calls = [];
    const exec = (cmd, args, repo) => {
      calls.push([cmd, args, repo]);
      if (cmd === 'git' && args[0] === 'rev-parse') {
        return 'feature/test';
      }
      return '';
    };
    createPullRequest({ repo: 'repo', title: 'title', body: 'desc', exec });
    expect(calls).to.deep.equal([
      ['git', ['rev-parse', '--abbrev-ref', 'HEAD'], 'repo'],
      ['git', ['push', '--set-upstream', 'origin', 'feature/test'], 'repo'],
      [
        'gh',
        [
          'pr',
          'create',
          '--title',
          'title',
          '--body',
          'desc',
          '--base',
          'main',
        ],
        'repo',
      ],
    ]);
  });

  it('throws when title missing', () => {
    let err;
    try {
      createPullRequest({ exec: () => '' });
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
    expect(err.message).to.equal('title is required');
  });
});
