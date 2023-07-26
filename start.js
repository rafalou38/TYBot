const { spawn } = require("child_process");

const commandToRun = "npm run start";

const childProcess = spawn(commandToRun, {
	stdio: "inherit",
	shell: true,
});
