# Ok Puter

A framework for executing voice commands.

## Requirements

- requires `node >= v8.x.x`
- requires google chrome for voice recognition to work

At the very basic level, you will need an API running on `localhost` to be able to execute local commands:
- `GET /music/:action` : where `action` is specified in the list of `commands` in `commandParser.js`

## Commands

- start via `npm start`
- test via `npm test`
