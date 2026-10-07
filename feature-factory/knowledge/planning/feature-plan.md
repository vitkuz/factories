# Planning a feature

The back is built, deployed and tested first; the front is built afterwards against the API as it was really built. The planned API contract is what the back is built and tested from, so it must be complete enough to test against.

## The plan file

1. **Goal** — one paragraph in the user's words.
2. **Decisions** — every answer the user gave, and every choice you made, each with one line of why.
3. **Spec changes** — which `docs/context/` files change and how (entities in 02-dynamodb first, routes in 05-route-patterns, file fields in 06-s3, tasks in 07-async-task, stacks in 01-microservice-stacks).
4. **Back** — stacks touched, new or changed Lambdas, usecases, services, clients, IAM, SSM params. Follow the coding style: handler → usecase → service → client, factories, no classes, Zod schemas next to controllers.
5. **Front** — routes, screens, components, API calls.
6. **Deploy** — which stacks change, in which order (from `12-deploy-order.md`), and any tools script to run (e.g. `create-index`, `reindex`).
7. **Tests** — what the back tests prove (routes, status codes, edge cases) and what the browser test proves (screens, flows).
8. **Risks** — anything that could delete data, change a stateful resource or touch a shared resource.

## The API contract file

One row per new or changed route: `POST /v1/<entity>/<handler>`, public or admin, the permission key, the body (with types and limits), the answer, and the error codes. Plus every new or changed entity type as TypeScript. The back tests record the contract as built; the front builds against that record, not against this plan.

## Rules

- Smallest change that delivers the feature. Reuse the existing entity service, controller factory and clients.
- No new DynamoDB table, ever; no new GSI unless the access pattern needs it (it costs one deploy per index).
- Every new Lambda gets `createAlertedLogGroup`.
- When the user sent the plan back, their note is the brief for the new version: address every point in it.
