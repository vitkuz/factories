# Well-Architected Pillar: Security

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Decision-quality review, not a compliance audit. It does not replace a formal security or compliance assessment for regulated workloads. Tie each finding to a component and a driver (sensitivity, compliance, authentication, data residency).

## Design principles
- Implement a strong identity foundation; least privilege; centralize identity.
- Maintain traceability: log and audit actions and changes.
- Apply security at all layers, not only the edge.
- Automate security best practices.
- Protect data in transit and at rest; classify data by sensitivity.
- Keep people away from data; prefer automated access paths.
- Prepare for security events.

## Key review questions
| Area | Ask |
|---|---|
| Trust boundaries | Where does untrusted input enter? Where is authentication enforced? |
| AuthN / AuthZ | Is every public entry point authenticated? Is authorization checked per resource, not only per route? |
| IAM | Is each role scoped to specific actions and resources? What is the blast radius if one role leaks? |
| Secrets | Where do secrets live (Secrets Manager, Parameter Store)? Are any in code, env files or logs? |
| Encryption | At rest (KMS keys, who administers them) and in transit (TLS everywhere, including internal hops)? |
| Network | Which resources are public? Are private subnets, VPC endpoints or security groups used where relevant? |
| Data | Where is PII or sensitive data stored, logged, replicated or exported? Retention and deletion? |
| Audit | CloudTrail, access logs and data-event logging: enough to reconstruct an incident? |
| Abuse | Rate limits, WAF, quotas, input validation, upload size/type limits? |

## Common AWS anti-patterns
- `Action: *` or `Resource: *` in IAM policies; one shared role for many functions.
- Public S3 buckets or unauthenticated API routes by accident.
- Long-lived access keys instead of roles.
- Secrets in environment variables committed to source, or printed in logs.
- Service-to-service calls with no authorization (trusting the network).
- Customer data in logs.
- Single KMS key and single administrator for every environment.
- Unvalidated user input reaching S3 keys, queries or shell commands.

## What a high risk looks like
- Missing authentication boundary on an entry point that reaches data or side effects.
- IAM that lets one compromised component read or destroy all persistent state.
- Sensitive data stored or transmitted unencrypted, or exposed publicly.
- Credentials exposed in code, logs or client bundles.
- A compliance driver with no mapped control.

Medium: broad but not wildcard permissions, missing WAF on a low-sensitivity API, partial audit logging.

## Reviewer reminders
- Compare protections to the stated sensitivity and compliance drivers.
- If a needed driver (data classification, auth model) is unknown, report it as a finding that needs a human decision rather than assuming.
