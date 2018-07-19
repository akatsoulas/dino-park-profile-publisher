# DinoPark Profile Publisher Service

The profile publisher service is part of the DinoPark project. It is the broker
between DinoPark services like the search service, orgchart service and mozillians
and the CIS stack.

## APIs

### User Updates

`/userupdate` is an endoint used by mozillinas to publish profil updates to CIS.

Posting a profile update to this endpoint will trigger the following flow:

1. Profile gets posited to the CIS endpoint, which will return an `updateId`
   (this will most likely be a Kinesis stream number).
2. Poll the CIS status endpoint until the update was processed. This will 
   return the `user_id` of the published profile.
3. Get the updated profile from the person API and return it to mozillians.

### External Updates

`/externalupdate` is an endpoint used by CIS to trigger profile updates for the
DinoPark services.

Posting a an update event to this endpoint will trigger the following flow:

1. Get the updated profile from the person API.
2. Publish the updated profile to the search service.
3. Publish the updated profile to the orgchart service.

## Configuraion

Setting can be changed via `config.js`:

```json
{
  "port": 8080,
  "cisUpdateUrl": "http://localhost:8888/cisUpdate",
  "cisStatusUrl": "http://localhost:8888/cisStatus/",
  "cisStatusTimeout": 10,
  "cisStatusRetryCount": 3,
  "personApiUrl": "http://localhost:8888/personApi/"
}
```

## Development

- We use `esm` as module system and encourage the use of ES2017.
- We enforce `prettier/recommended` with double quotes.

### Run the Tests

```
npm install
npm test
npm run-script coverage
```

### Run as a Dev Server

```
npm install
npm run dev
```