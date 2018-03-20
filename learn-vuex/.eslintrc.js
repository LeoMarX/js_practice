module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "html",
        "vue"
    ],
    "rules": {
        "indent": [
            "off",
            "space"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "off",
            "always"
        ],
        "no-console": [
            "warn"
        ],
        "no-unused-vars": [
            "warn"
        ]
    }
};