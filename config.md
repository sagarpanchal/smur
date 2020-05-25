## Additional Configuration

- Additional configurations are stored in [`./config`](https://github.com/lorenwest/node-config/wiki/Configuration-Files), and can be overridden and extended by [environment variables](https://github.com/lorenwest/node-config/wiki/Environment-Variables),
  [command line parameters](https://github.com/lorenwest/node-config/wiki/Command-Line-Overrides), or [external sources](https://github.com/lorenwest/node-config/wiki/Configuring-from-an-External-Source).

* See [node-config](https://github.com/lorenwest/node-config/blob/master/README.md) for more info.

### Configuration variables

| Name        | Description                                             |
| ----------- | ------------------------------------------------------- |
| "port"      | Server Port                                             |
| "publicUrl" | Base-url for front-end                                  |
| "redis"     | Redis params                                            |
| "mongodb"   | MongoDB params                                          |
| "mongoose"  | Mongoose params                                         |
| "apiDocs"   | Render rest api documentation                           |
| "logger"    | Winston transport ('json', 'database')                  |
| "mailFrom"  | Email ID                                                |
| "mailer"    | Nodemailer configuration (except username and password) |
| "oAuth2"    | Passport OAuth2 credentials                             |
| "aws"       | AWS credentials                                         |

### Override Example

> `./config/development.js`

```js
module.exports = {
  port: 3000,
  publicUrl: 'https://localhost',
  logger: ['database'],
}
```

> See `config/default.json` for more info.
