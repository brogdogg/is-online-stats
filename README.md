# IS-ONLINE-STATS

## Overview
Used to check the availability of the internet over a period of time and keeping track of the data.

## Running

```sh
$ node index.js --help

  Continually checks to see online, reporting stats for availability

  Usage
    $ is-online-stats <input>

  Options
    --wait, -w Number of minutes to wait between checks (Default: 10 minutes)
    --iterations, -i Number of iterations (Default: infinite)
    --timeout, -t Timeout in seconds to wait for a server to respond (Default: 2
 seconds)

$ node index.js --iterations 1
100% up-time

$ cat log.txt
iteration,online
1,1
```
