# xml-bundle-uploader


This is a simple CLI tool to upload xml fhir bundles.

## Installation:
```sh
cd my/directory/somewhere
git clone https://github.com/smart-on-fhir/xml-bundle-uploader.git
cd xml-bundle-uploader
npm i
```

## Usage:
```sh
# cd into the project directory and run:
node . -d ../my/generated/sample/data -s http://my.target.server
# or:
node . -d ../my/generated/sample/data -s http://my.target.server -p http://my.proxy/url
```

## Authorization:
If you upload data to an endpoint that is protected with HTTP basic auth you can
provide the username as `-u` or `--user` parameter and the password as `-P` or
`--password`. Alternatively you can make them part of the url like so 
`'http://' + username + ':' + password + '@some.server.com'` but that is not considered a good practice. For other auth types you might prefer the `-a/--auth`
option which will be the value of the `Authorization` header. For example
`-a "Bearer 142yf3hgf25"` will add `Authorization: Bearer 142yf3hgf25` to the request headers. 