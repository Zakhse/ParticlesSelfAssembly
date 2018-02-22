// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    env: {
        browser: true,
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ['plugin:vue/essential', 'airbnb-base'],
    // required to lint *.vue files
    plugins: [
        'vue',
    ],
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.base.conf.js',
            },
        },
    },
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never',
        }],
        'indent': [
            'error',
            4, {
                'SwitchCase': 1,
            },
        ],
        'max-len': [
            'error',
            {
                'code': 120,
                'tabWidth': 4,
                'ignoreComments': true,
                'ignoreUrls': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
                'ignoreRegExpLiterals': true,
            },
        ],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-restricted-syntax': 'off',
        'no-console': 'off',
        'comma-dangle': [2, 'always-multiline'],
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-shadow': 'off',
        'no-prototype-builtins': 'off',
        'no-continue': 'off',
        'quote-props': ['error', 'as-needed', { 'unnecessary': true }],
        'func-names': ['warn', 'as-needed'],
        'guard-for-in': 'off',
        'import/no-extraneous-dependencies': 'off',
        'vue/require-v-for-key': 'warn',
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': [],
        }],
        'vue/max-attributes-per-line': [2, {
            'singleline': 1,
            'multiline': {
                'max': 1,
                'allowFirstLine': true,
            },
        }],
        'vue/order-in-components': ['error', {
            'order': [
                'el',
                'name',
                ['template', 'render'],
                'parent',
                'functional',
                ['delimiters', 'comments'],
                'extends',
                'mixins',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'data',
                'computed',
                'methods',
                'LIFECYCLE_HOOKS',
                'watch',
                'renderError',
                ['components', 'directives', 'filters'],
            ],
        }],
    },
    globals: {
        '_': false,
    },
};
