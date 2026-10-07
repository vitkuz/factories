# Verify gates

A gate proves the code builds and follows the rules; it changes nothing.

- Run the repo's gate command from the project map, from the repo folder, and capture the full output.
- Pass means every command exited 0. One failure is a FAIL.
- On FAIL write, per failure: the command, the file and line, the error text, and the likely cause in one line. Do not fix anything.
- Also FAIL when the change has a class (`ClassDeclaration`), a `console.log` in Lambda code, a hardcoded entity string instead of the `Entity` enum, or a new Lambda without `createAlertedLogGroup`.
- For the back, also say which stacks `cdk synth` produced and whether a template contains an `AWS::OpenSearchService::Domain` (it must not).
