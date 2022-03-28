import * as util from "util";
import { ChildProcess, exec, spawn } from "child_process";
const execAsync = util.promisify(exec);

const runnerVersion = "2.289.1";

export async function fetchMacOsRunner(path: string) {
    const fileName = `runner-mac-v${runnerVersion}.tar.gz`;
    console.log(`Downloading Github Action runner (v${runnerVersion})`);
    const url = `https://github.com/actions/runner/releases/download/v${runnerVersion}/actions-runner-osx-x64-${runnerVersion}.tar.gz`;
    await execAsync(`cd ${path} && curl -o ${fileName} -L ${url}`);
    console.log(`Unpacking`);
    await execAsync(`cd ${path} && tar xzf ./${fileName}`);
}

export async function configureRunner(
    path: string,
    url: string,
    token: string,
    name: string
) {
    console.log("Configuring runner");
    await execAsync(
        `cd ${path} && ./config.sh --url ${url} --token ${token} --name ${name} --unattended`
    );
}

export async function startRunner(path: string): Promise<ChildProcess> {
    console.log("Starting runner");
    const runner = spawn(`${path}/run.sh`);

    return await new Promise((resolve, reject) => {
        runner.stdout.on("data", (data) => {
            process.stdout.write(data.toString());
            if (data.toString().includes("Listening for Jobs")) resolve(runner);
        });
        runner.stderr.on("data", (data) => {
            console.log("ERR", data);
            reject(data.toString());
        });
        runner.on("exit", (code) => {
            const error = "child process exited with code" + code?.toString();
            reject(error);
        });
    });
}

export async function removeRunner(path: string, token: string) {
    console.log("Removing runner");
    await execAsync(`cd ${path} && ./config.sh remove --token ${token}`);
}