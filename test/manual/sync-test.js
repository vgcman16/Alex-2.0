const { spawn } = require('child_process');

function runPeer(name, init) {
  const args = ['./peer.js', name];
  if (init) args.push(init);
  return spawn('node', args, { cwd: __dirname });
}

const peerA = runPeer('room-demo', 'hello');
const peerB = runPeer('room-demo');

peerA.stdout.on('data', (data) =>
  console.log('peerA:', data.toString().trim())
);
peerB.stdout.on('data', (data) =>
  console.log('peerB:', data.toString().trim())
);

peerA.on('close', () => peerB.kill());
peerB.on('close', () => {});

setTimeout(() => {
  peerA.kill();
  peerB.kill();
  process.exit(0);
}, 15000);
