const documentConfig = require('../htmlhint/document');

// eslint-disable-next-line padding-line-between-statements
const convertConfig = (config) => Object
    .entries(config)
    .map(([ key, value ]) => (typeof value === 'string') ? `${ key }=${ value }` : key)
    .join(',');

module.exports = {
    hyperlink: {
        cmd: 'hyperlink https://chrisguttandin.github.io/web-midi-autoplay-policy-test'
    },
    lint: {
        cmd: `htmlhint --rules ${ convertConfig(documentConfig) } 'src/**/index.html'`
    }
};
