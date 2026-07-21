import {
  execFileSync as nodeExecFileSync,
  spawn as nodeSpawn,
  spawnSync as nodeSpawnSync
} from 'node:child_process';

export function hiddenProcessOptions(options = {}, platform = process.platform) {
  if (platform !== 'win32') return options;
  return { ...options, windowsHide: true };
}

export function createProcessLaunchers({
  platform = process.platform,
  spawnImpl = nodeSpawn,
  spawnSyncImpl = nodeSpawnSync,
  execFileSyncImpl = nodeExecFileSync
} = {}) {
  return {
    spawn(command, args, options) {
      return spawnImpl(command, args, hiddenProcessOptions(options, platform));
    },
    spawnSync(command, args, options) {
      return spawnSyncImpl(command, args, hiddenProcessOptions(options, platform));
    },
    execFileSync(file, args, options) {
      return execFileSyncImpl(file, args, hiddenProcessOptions(options, platform));
    }
  };
}

const launchers = createProcessLaunchers();

export const spawn = launchers.spawn;
export const spawnSync = launchers.spawnSync;
export const execFileSync = launchers.execFileSync;
