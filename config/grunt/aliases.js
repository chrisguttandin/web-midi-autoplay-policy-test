module.exports = {
    'build:development': ['clean', 'htmlmin', 'webpack:development'],
    'build:production': ['clean', 'htmlmin', 'webpack:production'],
    'deploy': ['build:production', 'gh-pages:deploy'],
    'lint': ['sh:lint-config', 'sh:lint-src'],
    'monitor': ['build:development', 'connect', 'watch:development'],
    'preview': ['build:production', 'connect', 'watch:production'],
    'smoke': ['sh:hyperlink']
};
