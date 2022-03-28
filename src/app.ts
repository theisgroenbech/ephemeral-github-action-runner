import crypto from "crypto";
import { ChildProcess, exec } from "child_process";
import util from "util";
import {
  configureRunner,
  fetchMacOsRunner,
  removeRunner,
  startRunner,
} from "./runnerManager";
const execAsync = util.promisify(exec);

const random = crypto.randomBytes(4).toString("hex");
const path = `/tmp/egar/${random}`;
const token = "***";

let runnerProcess: ChildProcess;

const createFolder = async (path: string) => {
  await execAsync(`mkdir /tmp/egar/ || true`);
  await execAsync(`mkdir ${path}`);
};

const deleteFolder = async (path: string) => {
  await execAsync(`rm -r ${path}`);
};

async function run(url: string, token: string) {
  const name = `ephemeral-runner-${random}`;
  await createFolder(path);
  await fetchMacOsRunner(path);
  await configureRunner(path, url, token, name);
  runnerProcess = await startRunner(path);
}

const onExit = async () => {
  runnerProcess.kill("SIGINT");
  await removeRunner(path, token).catch(console.error);
  await deleteFolder(path);
  process.exit(0);
};

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);

run("https://github.com/***", token);
