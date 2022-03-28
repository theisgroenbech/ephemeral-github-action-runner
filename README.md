# Impatient Action runner

`ephemeral-github-action-runner` is a npm package to start up a temporary Github Action Runner on your local machine.

If your self-hosted runners are overrun / down, or you are strapped for cash, you can use this package to spin a runner, which only lives as long as the script is running (basically until you press Ctrl+C).

## Getting started
`ephemeral-github-action-runner` requires two arguments: URL, TOKEN

| Option           | Description                                                                    | Required |
| ---------------- | ------------------------------------------------------------------------------ | -------- |
| **`URL`**        | Url of the repository.                                                         | `true`   |
| **`TOKEN`**      | Action runner token (found here `REPOSITORY-URL/settings/actions/runners/new`) | `true`   |

Use the following command to start a runner:
```
npx ephemeral-github-action-runner --url URL --TOKEN token
```