const config = require('@4s1/changelog-config')

var cfg = config('https://gitlab.com/4s1/snow-white-rest-api')
cfg.releaseCommitMessageFormat = cfg.releaseCommitMessageFormat.replace('[skip ci]', '').trim()
module.exports = cfg
