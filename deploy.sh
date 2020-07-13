#!/bin/bash

npm run lint
#npm run test
npm run build
npm version patch
npm publish
git push --follow-tags
