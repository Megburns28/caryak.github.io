# CarYak Client

This project is a React application built using TypeScript, SWC, Vite, and primarily Material UI for the UI components. It includes development, build, linting, and formatting scripts to streamline the workflow.

## Prerequisites

1. `nvm`
2. Node.js (*latest*)
3. `npm` (*latest*)

### `nvm` (Node Version Manager)

#### Linux

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Then, source your profile:

```bash
source ~/.bashrc
```

#### Windows

Download and install `nvm-windows` from the [official release page](https://github.com/coreybutler/nvm-windows/releases).

### Node.js and `npm` (Node Package Manager)

   ```bash
   nvm install node --latest-npm --default
   ```

## Installation
Clone the project and install dependencies:

   ```bash
   git clone https://github.com/Megburns28/CarYak.git 
   cd CarYak
   npm install
   ```

## `npm` Scripts

The project includes several npm scripts to facilitate development and maintain code quality.

| Script         | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `npm run dev`  | Starts the development server using Vite. Open `http://localhost:3000` to view the app. |
| `npm run build`| Builds the app for production. Output files are generated in the `dist` directory. |
| `npm run preview` | Previews the production build locally.                     |
| `npm run lint` | Lints the codebase using ESLint for `.ts`, `.tsx` files.      |
| `npm run format` | Formats the codebase using Prettier.                       |
| `npm run type-check` | Checks the codebase for TypeScript type errors.         |
| `npm start`    | Alias for `npm run dev`.                                      |

## Development

1. Run the development server:

   ```bash
   npm run dev
   ```

2. Open your browser to [`http://localhost:5173`](http://localhost:5173) to view the app.

## Build

To build the project for production:

```bash
npm run build
```

## Linting and Formatting

You can lint the project using ESLint:

```bash
npm run lint
```

To format your code:

```bash
npm run format
```

## Type Checking

Check for any TypeScript type errors:

```bash
npm run type-check
```

## License

This project is licensed under the MIT License.

