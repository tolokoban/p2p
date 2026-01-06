// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

export default tseslint.config({
    files: ["**/*.ts"],
    extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        eslintPluginUnicorn.configs.recommended,
    ],
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrors: "none",
                caughtErrorsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: true,
            },
        ],
        "unicorn/no-null": "off",
        "unicorn/switch-case-braces": ["error", "avoid"],
        "unicorn/numeric-separators-style": [
            "error",
            { onlyIfContainsSeparator: true },
        ],
        "unicorn/number-literal-case": "off",
        "unicorn/no-array-push-push": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/prevent-abbreviations": "warn",
        "prefer-single-call": "off",
    },
})
