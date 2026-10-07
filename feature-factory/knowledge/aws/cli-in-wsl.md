# AWS CLI on this WSL machine

- Always `export AWS_PAGER=""`. Without it a CLI call can wait on a pager forever.
- Always add `--cli-connect-timeout 2`. IPv6 has no route here; the CLI tries every IPv6 address of a dual-stack endpoint (Secrets Manager, Lambda…) with a 60 s timeout before IPv4. With 2 s it reaches IPv4 in about 15 s.
- Wrap long CLI calls in `timeout <seconds>` so a hang cannot stall the run.
- "Signature expired" means the WSL clock fell behind (after sleep). Stop and report it; the fix is `wsl --shutdown` on the Windows side.
- Node (AWS SDK, CDK) is not affected by either problem.
- Always pass `--profile <awsProfile> --region <awsRegion>` (the params of this run). Never rely on an implicit profile.
