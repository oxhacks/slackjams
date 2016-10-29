# slackjams
## Pull jams from your #music channel
Slackjams attempts to provide functionality to quickly visualize media shared in a given Slack channel, useful for creating a quick playlist of what your coworkers are jamming.

### Installation
#### Meteor
Slackjams uses Meteor 1.4.

| OS | |
| --- | --- |
| Linux/macOS | `curl https://install.meteor.com/ | sh` |
| Windows | `https://www.meteor.com/install` |

#### Mongo
Meteor bundles a Mongo installation with it, and the collection used is in-memory only (as of right now).

### Configuration
Use the provided `settings-template.json` to create a configuration that works for your environment.

#### Private
These settings are stored in the Meteor private configuration section to keep them from spilling.

| Key | Description |
| --- | --- |
| env | _boolean_ - use the config settings or the `STOKEN` and `SCHANNEL` variables in the environment. |
| slack.token | _string_ - the Slack API token to use | 
| slack.channel_name | _string_ - the name of the channel to parse |
| mongo.collection | _string_ - the name of the collection. |

**Note**: Providing `null` for `mongo.collection` utilizes an in-memory Minimongo in Meteor.

#### Public
These settings are shared by the server and the client.

| Key | Description |
| --- | --- |
| blacklist | _array_ - domains that should be stripped from the final result set. |


### Usage
In the top level project directory.
```bash
meteor --settings <yoursettings>.json
```

### Contribution
Pull requests and issues are welcome!