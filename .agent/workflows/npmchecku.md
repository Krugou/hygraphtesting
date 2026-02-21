---
description: Use `npm-check` to identify and update outdated dependencies in the project
---

1. Install `npm-check` globally if you haven't already:

```bash
npm install -g npm-check
```

1. Run `npm-check` in the project directory to see a list of outdated dependencies:

```bash
npm-check
```

1. Review the list of outdated packages. You can choose specific packages or update everything at once. To update all packages, run:

   ```bash
   npm-check -u
   ```

1. Follow the interactive prompts to apply updates. After the process completes, run any available verification commands (e.g. `npm run lint`, `npm run test:queries`) to confirm nothing broke.

1. If you encounter any issues after updating, you can check the changelogs of the updated packages for breaking changes or consider reverting to the previous version if necessary.
1. Remember to commit your changes after updating the dependencies to keep track of the updates in your version control system.
1. Regularly checking for outdated dependencies and keeping them updated is important for maintaining the security and performance of your project.
1. For more advanced usage, you can refer to the `npm-check` documentation for additional options and features.
1. By following these steps, you can ensure that your project stays up-to-date with the latest versions of its dependencies, which can help improve performance, security, and access to new features.
