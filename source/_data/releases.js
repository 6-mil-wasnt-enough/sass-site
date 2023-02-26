const { spawn: nodeSpawn } = require('node:child_process');
const fs = require('node:fs/promises');

const deepEqual = require('deep-equal');
const chalk = require('kleur');

const VERSION_CACHE_PATH = './source/_data/versionCache.json';

// Promise version of `spawn` to avoid blocking the main thread while waiting
// for the child processes
function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(cmd, args, options);
    const stderr = [];
    const stdout = [];
    child.stdout.on('data', (data) => {
      stdout.push(data.toString());
    });
    child.on('error', (e) => {
      stderr.push(e.toString());
    });
    child.on('close', () => {
      if (stderr.length) reject(stderr.join(''));
      else resolve(stdout.join(''));
    });
  });
}

async function getCacheFile() {
  if (process.env.NETLIFY || process.env.REBUILD_VERSION_CACHE) return {};
  let versionCache;
  try {
    versionCache = JSON.parse(await fs.readFile(VERSION_CACHE_PATH));
  } catch (err) {
    if (err.code === 'ENOENT') {
      versionCache = {}; // Cache is missing and needs to be created
    } else {
      throw err;
    }
  }
  return versionCache;
}

async function writeCacheFile(cache) {
  // eslint-disable-next-line no-console
  console.info(chalk.green(`[11ty] Writing version cache file...`));
  await fs.writeFile(VERSION_CACHE_PATH, JSON.stringify(cache));
}

// Retrieve the highest stable version of `repo`, based on its git tags
async function getLatestVersion(repo) {
  // eslint-disable-next-line no-console
  console.info(chalk.cyan(`[11ty] Fetching version information for ${repo}`));
  const { parseSemVer, compareSemVer } = await import('semver-parser');
  let stdout;
  try {
    stdout = await spawn(
      'git',
      ['ls-remote', '--tags', '--refs', `https://github.com/${repo}`],
      { env: { ...process.env, GIT_TERMINAL_PROMPT: 0 } },
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`[11ty] Failed to fetch git tags for ${repo}`));
    throw err;
  }
  const isNotPreRelease = (version) => {
    const parsed = parseSemVer(version);
    return parsed.matches && !parsed.pre;
  };
  const version = stdout
    .split('\n')
    .map((line) => line.split('refs/tags/').at(-1))
    .filter(isNotPreRelease)
    .sort(compareSemVer)
    .at(-1);

  return version;
}

module.exports = async () => {
  const repos = ['sass/libsass', 'sass/dart-sass', 'sass/migrator'];
  const cache = await getCacheFile();

  const versions = await Promise.all(
    repos.map(async (repo) => [
      repo,
      cache[repo] ?? (await getLatestVersion(repo)),
    ]),
  );
  const data = Object.fromEntries(
    versions.map(([repo, version]) => [
      repo.replace('sass/', ''),
      { version, url: `https://github.com/${repo}/releases/tag/${version}` },
    ]),
  );

  const nextCache = Object.fromEntries(versions);
  if (!deepEqual(cache, nextCache)) await writeCacheFile(nextCache);

  return data;
};
