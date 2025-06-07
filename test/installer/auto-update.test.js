const { expect } = require('chai');
const { checkForUpdates } = require('../../installer/auto-update');

function makeRelease(tag) {
  return {
    tag_name: tag,
    assets: [
      { name: 'Alex.exe', browser_download_url: 'http://example.com/Alex.exe' },
    ],
  };
}

describe('checkForUpdates', () => {
  it('downloads when newer version available', async () => {
    let url = null;
    const getRelease = async () => makeRelease('v1.1.0');
    await checkForUpdates({
      version: '1.0.0',
      getRelease,
      download: (u) => {
        url = u;
      },
    });
    expect(url).to.equal('http://example.com/Alex.exe');
  });

  it('does nothing when up to date', async () => {
    let called = false;
    const getRelease = async () => makeRelease('v1.0.0');
    await checkForUpdates({
      version: '1.0.0',
      getRelease,
      download: () => {
        called = true;
      },
    });
    expect(called).to.equal(false);
  });
});
