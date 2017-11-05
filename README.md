# Ok Puter

A framework for executing voice commands.

## Requirements

- requires `node >= v8.x.x`
- requires google chrome for voice recognition to work

At the very basic level, you will need an API running on `localhost` or whatever to be able to excute local commands. An API is already provided at `https://api.ok-puter.tech/` with the following end-points (check the url for a full API specification):
- `GET /timeline/:userScreenName` : returns the latest 20 tweets for a given user in json format

## Commands

- start via `npm start`
- test via `npm test`
