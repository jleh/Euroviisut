module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "comma-dangle": ["error", "never"],
        "max-len": ["error", 120]
    }
};
