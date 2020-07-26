# Sync files with s3-publish

[s3-publish](https://adamjarret.github.io/s3-publish) GitHub action

| _Keep files in sync_ | **To Local** | **To S3** |
| -------------------: | :----------: | :-------: |
|       **From Local** |   &#10003;   | &#10003;  |
|          **From S3** |   &#10003;   | &#10003;  |

## Usage

```yaml
name: sync files

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: publish
        uses: adamjarret/s3-publish-action@v2
        with:
          origin: './public'
          originIgnore: '[".*/"]'
          target: 's3://s3p-test'
          delete: '1'
```

## Inputs

Options usually specified as [s3p CLI args](https://adamjarret.github.io/s3-publish/interfaces/_s3_publish_cli.args.html) may be specified as action inputs.

> Note: The camelCase option name must be used (aliases are not supported as action input names).

The action will also load options from a [config file](https://adamjarret.github.io/s3-publish/interfaces/_s3_publish_cli.configfile.html) if one is defined in the CWD.

> Note: GitHub action inputs override options set in a config file.

s3-publish also supports [loading glob patterns used to ignore files from a .gitignore-style file](https://adamjarret.github.io/s3-publish/pages/guides/ignore.html).

### Differences from CLI

- GitHub action inputs only support strings, so:
  - multi value inputs like `originIgnore` and `targetIgnore` should be defined as JSON-stringified arrays of strings (ex. `'[".*"]'`)
  - boolean inputs like `change`, `delete`, etc should be either `'0'` or `'1'` (non-zero values are considered true, non-numerical values are considered false)
  - numeric inputs like `limitCompares` and `limitRequests` should be quoted (ex. `'10'`, non-numerical values are ignored)
- The `go` input defaults to `'1'`. Perform a dry run by setting `go` to `'0'`. The only way to set `go` is via input; value set in config file has no effect on the action.
- The `result` output has the same properties as the `sync:result` log message with the addition of an `operations` property that contains an array of [`MessageSyncOperationResult`](https://adamjarret.github.io/s3-publish/modules/_s3_publish_loggers.html#messagesyncoperationresult) objects.

## Outputs

### `plan` _string_

JSON stringified object containing planned operations

```ts
{
  type: 'sync:plan:result';
  operations: LoggableOperation[];
  ignored: Record<string, FileIgnored[]>;
  ignoredCount: number;
  skipped: FileSkipped[];
  skippedCount: number;
}
```

See [`MessageSyncPlanResult`](https://adamjarret.github.io/s3-publish/modules/_s3_publish_loggers.html#messagesyncplanresult) for details.

### `result` _string_

JSON stringified object containing operation results (will not be set if `go` is `'0'`)

```ts
{
  type: 'sync:result';
  operations: MessageSyncOperationResult[];
  duration: number;
}
```

See [`MessageSyncResult`](https://adamjarret.github.io/s3-publish/modules/_s3_publish_loggers.html#messagesyncresult) and [`MessageSyncOperationResult`](https://adamjarret.github.io/s3-publish/modules/_s3_publish_loggers.html#messagesyncoperationresult) for details.

## Documentation

See [API documentation](https://adamjarret.github.io/s3-publish/globals.html)

## License

[MIT](https://github.com/adamjarret/s3-publish/tree/master/LICENSE.txt)

## Author

[Adam Jarret](https://atj.me)
