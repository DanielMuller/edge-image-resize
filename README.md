## Getting started
* Have a working _nvm_
* Configure AWS CLI to use profiles
* Git clone
* `nvm use` (to switch to nodejs8.10)
* `npm i`
* Copy `stages/samples.yml` to `stages/dev.yml` and `stages/production.yml`
* Modify `stages/dev.yml` and `stages/production.yml` accordingly

### Deploy
`sls deploy` (dev)

or

`sls -s production deploy` (production)

### Attach to CloudFront
* Open lambda console in us-east-1 and get the ARN of the latest version for _origin-response_ and _viewer_request_
* Open the Cloudfront Console
* Attach the lambda functions to the relevant Cloudfront event

## Local testing
Edit `events/origin-response.json` (or create a new event)

```
sls invoke local -f OriginResponse -p events/origin-response.json
```
