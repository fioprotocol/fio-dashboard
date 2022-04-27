module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "react-app",
    "eslint:recommended",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier",
    "react",
    "jsx-a11y",
    "flowtype",
    "import"
  ],
  settings: {
    react: { "version": "detect" },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
      }
    }
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "all",
        "printWidth": 80,
        "singleQuote": true
      }
    ],
    "react/jsx-curly-brace-presence": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/display-name": "warn",
    "react/no-array-index-key": "error",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-unreachable": "warn",
    "no-underscore-dangle": 0,
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "no-console": "warn",
    "no-useless-escape": "warn",
    "require-await": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/unbound-method": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/prefer-regexp-exec": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-unsafe-argument": "off",
    "import/order": ["error", {
      alphabetize: {
        order: 'ignore',
        caseInsensitive: true
      },
      "newlines-between": "always-and-inside-groups",
      groups: [
        'builtin',
        'external',
        'internal',
        ['sibling', 'parent'],
        'index',
        'object',
        'type'
      ]}],
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  root: true
};
