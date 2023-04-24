## Readme File for Mautic Role Seeding Tool

This tool is a Node.js command-line application for seeding default roles into a new Mautic instance. It uses the Mautic REST API to create roles.

### Prerequisites

- Node.js version 14 or higher
- A Mautic instance with a valid URL, client ID, and client secret. These must be provided during the execution of the tool or stored in a `.env` file in the root directory of the project.

### Installation

1. Clone this repository or download the source code.
2. Navigate to the root directory of the project in your terminal.
3. Run `npm install` to install the required dependencies.

### Usage

To run the tool, execute the following command in your terminal:

```bash
node index.mjs
```

The tool will prompt you to enter the Mautic URL, client ID, and client secret. If you have stored these values in a `.env` file, they will be loaded automatically. You will also be prompted to confirm that you want to create the default roles. If you confirm, the tool will delete all existing roles (except the default administrator role) and seed the new roles.

### License

This tool is released under the MIT License. See the `LICENSE` file for more information.
