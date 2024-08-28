import { spawn } from "child_process";
import { ipcMain } from "electron";
import { handlers } from "./ipcHandlers";

const runningProcesses = {};
const processLogs = {};

export const setupNpmUtils = () => {
  ipcMain.on('run-npm-command', (event, outputEventName, command, directory) => {
    console.log(`Running "${command}" in directory: ${directory}`);

    const npmProcess = spawn('npm', [command], {
      shell: true,
      cwd: directory, // Specify the directory where the command should be executed
      env: { ...process.env, FORCE_COLOR: 'true' }, // Add this line
    });

    // Store the process by output event name or command name (unique identifier)
    runningProcesses[outputEventName] = npmProcess;
    processLogs[outputEventName] = []; // Initialize an empty array to store logs

    npmProcess.stdout.on('data', (data) => {
      const log = data.toString();
      // console.log(JSON.stringify(data));
      processLogs[outputEventName].push(log); // Save the log to memory
      event.sender.send(outputEventName, log);
    });

    npmProcess.stderr.on('data', (data) => {
      const log = data.toString();
      processLogs[outputEventName].push(log); // Save the log to memory
      event.sender.send(outputEventName, log);
    });

    npmProcess.on('close', (code) => {
      const log = `Process exited with code ${code}`;
      processLogs[outputEventName].push(log); // Save the log to memory
      event.sender.send(outputEventName, log, true);
      delete runningProcesses[outputEventName]; // Clean up after the process exits
    });

    npmProcess.on('error', (error) => {
      const log = `Failed to start process: ${error.message}`;
      processLogs[outputEventName].push(log); // Save the log to memory
      event.sender.send(outputEventName, log);
      delete runningProcesses[outputEventName]; // Clean up on error
    });
  });

  // Event to stop the npm script
  ipcMain.on('stop-npm-command', (event, outputEventName) => {
    const npmProcess = runningProcesses[outputEventName];

    if (npmProcess) {
      npmProcess.kill(); // Terminate the process
      event.sender.send(outputEventName, 'Process terminated by user');
      delete runningProcesses[outputEventName]; // Clean up after termination
    } else {
      event.sender.send(outputEventName, 'No running process found to terminate');
    }
  });

  // Event to retrieve existing logs
  ipcMain.on('npm-command-logs', (event, outputEventName) => {
    const logs = processLogs[outputEventName] || [];
    event.sender.send(outputEventName, logs.join('\n'), !runningProcesses[outputEventName]); // Send all logs as a single message
  });
};
