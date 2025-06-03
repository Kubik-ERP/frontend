import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Chalk
import chalk from 'chalk';

try {
  // List of files to wait for
  const generatedFiles = [
    path.join('src', 'auto-imports.d.ts'),
    path.join('src', 'components.d.ts'),
    path.join('./', '.eslintrc-auto-import.json'),
  ];

  // First of all, we need to remove current generated files if they exist
  generatedFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(chalk.yellow(`Removing existing generated file: ${filePath}`));
      fs.unlinkSync(filePath);
    }
  });

  // Start vite --host in the background
  console.log(chalk.green('Eslint passed. Starting vite to generate files...'));
  const viteProcess = spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true });

  // Wait for all files to exist
  const waitForFiles = (files, timeout = 20000, interval = 500) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const allExist = files.every(f => fs.existsSync(f));
        if (allExist) return resolve();
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for generated files.'));
        setTimeout(check, interval);
      };
      check();
    });
  };

  waitForFiles(generatedFiles)
    .then(() => {
      console.log(chalk.blue('Generated files detected. Stopping vite...'));
      viteProcess.kill();
      // Wait a moment for process to exit
      setTimeout(() => {
        // Run build
        console.log(chalk.blue('Running build script...'));
        execSync('npx vue-tsc && npx vite build', { stdio: 'inherit' });
        console.log(chalk.green('Build completed successfully.'));
        process.exit(0);
      }, 1500);
    })
    .catch(err => {
      viteProcess.kill();
      console.error(chalk.red(err.message));
      process.exit(1);
    });
} catch {
  console.error(chalk.red('Eslint failed. Please fix the issues before starting the app.'));
  process.exit(1);
}
