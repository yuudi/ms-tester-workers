# graph tester

## how to use

1. create a cloudflare workers
1. create a cloudflare KV
1. create a record in the KV, the key is `refresh_token`, the value is your graph api refresh_token
1. link your workers with your KV, set the namespace to `GRAPH_TEST`
1. deploy the code to workers
1. edit the code, fill the consts in the first three lines
1. if you like, create a cron job to trigger the workers
