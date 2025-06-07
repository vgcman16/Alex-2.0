const { expect } = require('chai');
const { editFiles } = require('../../agent/file-editor');
const fs = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');
const os = require('os');

describe('editFiles', () => {
  it('creates branch and commits changes', () => {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'repo-'));
    execSync('git init', { cwd: dir });
    execSync('git config user.email "test@example.com"', { cwd: dir });
    execSync('git config user.name "Test"', { cwd: dir });
    fs.writeFileSync(join(dir, 'a.txt'), 'a');
    execSync('git add a.txt', { cwd: dir });
    execSync('git commit -m init', { cwd: dir });

    editFiles({
      repo: dir,
      branch: 'feature/test',
      files: { 'a.txt': 'b', 'b.txt': 'c' },
    });

    const head = execSync('git rev-parse --abbrev-ref HEAD', { cwd: dir })
      .toString()
      .trim();
    expect(head).to.equal('feature/test');
    const status = execSync('git status --porcelain', { cwd: dir })
      .toString()
      .trim();
    expect(status).to.equal('');
    const content = fs.readFileSync(join(dir, 'a.txt'), 'utf8');
    expect(content).to.equal('b');
  });
});
