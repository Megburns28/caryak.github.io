/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: true,
    plugins: ['prettier-plugin-organize-imports'],
};

export default config;
