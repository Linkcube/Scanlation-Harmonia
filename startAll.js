const { execFile } = require('child_process');
const { join } = require('path');
const kill = require('tree-kill');
const process = require('process');
const open = require('open');


const backEnd = execFile('node', [join(__dirname, "lib/index.js")]);
backEnd.stdout.on('data', (data) => console.log(data));
backEnd.stderr.on('data', (data) => console.log(data));

const frontEnd = execFile('node', [join(__dirname, "public/serve.js")]);
frontEnd.stdout.on('data', (data) => console.log(data));
frontEnd.stderr.on('data', (data) => console.log(data));

open("http://localhost:5000");

process.on("beforeExit", (code) => {
    console.log(`Ending program on code: ${code}`);
    kill(backEnd.pid);
    kill(frontEnd);
})