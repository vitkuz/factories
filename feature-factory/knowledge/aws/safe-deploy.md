# Safe deploy in a shared AWS account

The account holds stacks of many projects. A deploy with a clashing name once deleted another project's table, bucket and secret. These rules have no exceptions.

## Before a deploy

1. List every stack: `aws cloudformation describe-stacks --profile <awsProfile> --region <awsRegion> --query "Stacks[].[StackName,StackStatus]" --output table`.
2. This project owns only stacks named `<tenant>-<project>-*` (the `tenant` and `project` params; the project map lists them). A stack you are about to create that already exists, but that this project did not create, is DANGER.
3. For a new stack, also check that the physical names it creates (buckets are global, secrets, tables, queues, log groups) are free.
4. `npm run build && npx cdk diff <stack> --profile <awsProfile>` for each stack you will deploy. Any `[-]` (delete) or a replacement of a stateful resource (table, bucket, secret, queue) is DANGER.
5. Write down, per stack: exists or new, what is added, changed, removed, and whether anything is DANGER.

## Deploying

- On `dev`, deploy without asking: features are built there. Any other env needs a human's yes first. Never run `cdk bootstrap`.
- DANGER always stops a deploy, on every env: deploy nothing and report it.
- Follow `docs/context/12-deploy-order.md`: a stack that reads an SSM param deploys after the stack that writes it; when the project has a search index (the project map says), its `create-index` script runs before anything writes a searchable item.
- Deploy one stack at a time with `--exclusively` so no dependency is redeployed by surprise: `npx cdk deploy <stack> --exclusively --profile <awsProfile> --require-approval never`.
- A stack whose SSM-param inputs changed but whose template did not needs `--force`, or CloudFormation keeps the old value.
- Never delete a stack, never touch a stack outside `<tenant>-<project>-*`, never create, change or delete a shared resource the project map marks as shared (an OpenSearch domain, for example). Only indexes named `<tenant>-<project>-*` are ours.
- After a deploy, run `npm run docs-values` in `repos/tools`.

## When a deploy fails

Read the CloudFormation events of the failed stack, write the first failing resource and its reason, and stop. Do not retry blindly, and never delete a stack to "start clean".
