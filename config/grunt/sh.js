module.exports = (grunt) => {
    const fix = grunt.option('fix') === true;

    return {
        'hyperlink': {
            cmd: 'hyperlink https://chrisguttandin.github.io/web-midi-autoplay-policy-test'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: `eslint --config config/eslint/src.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives src/ && \
                htmlhint --config config/htmlhint/document.json 'src/**/index.html'`
        }
    };
};
