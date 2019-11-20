[thumbnail-creation](https://github.com/DanielMuller/thumbnail-creation) is another alternative using API Gateway instead of Lambda@Edge.

# Lambda@Edge Image resizer

Resize images on Lambda@Edge. Images are hosted on S3, and served via Cloudfront.

The resized image will be generated as _webp_ or _jpeg_ depening on the browsers _Accept_ header.

Resized images are stored back in S3, for faster subsequent requests.

Two Lambda@Edge functions are needed:
* *Viewer Request*: Rewrite request to path including size and format.
* *Origin Response*: Resize original image. Serve and store the resized version.

Dimensions are constraints to the nearest multiple of 100.

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

## Usage
`https://xxxx.cloudfront.net/foo/bar/image.jpg?d=200x300` will generate an image of 200px width and 300px height from _s3://my_bucket/foo/bar/image.jpg_.

The generated image will be stored in S3: _s3://my_bucket/foo/bar/200x300/webp/image.jpg_. Subsequent request to the same size, won't need a resize.

## Local testing
Edit `events/origin-response.json` (or create a new event)

```
sls invoke local -f Origin-response -p events/origin-response.json
```

## Known issues

Resized images bigger than 1MB can't be served on the first request. But will be served on subsequent requests.
