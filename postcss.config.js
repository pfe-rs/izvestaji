const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        autoprefixer(),
        purgecss({
            content: [
                './layouts/**/*.html',
                './content/**/*.md',
                './assets/js/*.js'
            ],
            safelist: [
                'blockquote',
                'dl',
                'dt',
                'dd',
                'table',
                'thead',
                'tbody',
                'tr',
                'th',
                'td',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6'
            ]
        })
    ]
};
