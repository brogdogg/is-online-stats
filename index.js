const meow = require('meow');
const isonline = require('is-online');
const readline = require('readline');
const fs = require('fs');


// Current iteration count
let iteration = 0;
// Number of times successfully connected to internet
let connectedTries = 0;

const cli = meow(`
    Usage
        $ is-online-stats <input>

    Options
        --wait, -w Number of minutes to wait between checks (Default: 10 minutes)
        --iterations, -i Number of iterations (Default: infinite)
        --timeout, -t Timeout in seconds to wait for a server to respond (Default: 2 seconds)
`, {
    flags : {
        wait: {
            type: 'integer',
            alias: 'w',
            default: 10
        },
        iterations: {
            type: 'integer',
            alias: 'i',
            default: -1
        },
        timeout: {
            type: 'integer',
            alias: 't',
            default: 2
        },
        file: {
            type: 'string',
            alias: 'f',
            default: 'log.txt'
        }
    }
});


// Number of iterations to try, -1 will cause it to continually run
const iterations = cli.flags.iterations;
// Amount of time to wait between checks
const waitTimeout = cli.flags.wait * 1000 * 60;
// Logfile for keeping track
let logFile = -1;

function next() {
    iteration++;
    // Check to see if we are online or not
    isonline({
        timeout: cli.flags.timeout * 1000
    }).then(online => {
        // Keep track of successful connections and log percentage to console
        connectedTries += online ? 1 : 0;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(( (connectedTries / iteration) * 100 ) + '% up-time')
        // And keep track of each in file
        fs.write(logFile, iteration + "," + (online ? 1 : 0) + "\n");
        // If we are not done, will call the next one on the wait timeout
        if(iterations == -1 || iteration < iterations) {
            setTimeout(next, waitTimeout);
        } else {
            fs.close(logFile); 
            return;
        }
    });
}

try {
    logFile = fs.openSync(cli.flags.file, 'w');
    fs.writeSync(logFile, "iteration,online\n");
    next();
} catch(err) {
    console.log("Failed due to err: %s", err);
    if(logFile) {
        fs.close(logFile);
    }
}