import { existsSync, readFileSync } from 'node:fs';

// Release notes are the version's CHANGELOG.md section, followed by links to
// every package published at it.
const CHANGELOG = 'CHANGELOG.md';
const PACKAGES = ['@neuralfog/flow'];

const version = process.argv[2];
if (!version) {
    console.error('usage: node scripts/release-notes.mjs <version>');
    process.exit(1);
}

// Pull the body under `## [version]`, up to the next `## ` heading.
const section = (text, v) => {
    const lines = text.split('\n');
    const start = lines.findIndex((l) => l.startsWith(`## [${v}]`));
    if (start === -1) return null;
    const rest = lines.slice(start + 1);
    const end = rest.findIndex((l) => l.startsWith('## '));
    return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
};

const npmLink = (npm) => `https://www.npmjs.com/package/${npm}/v/${version}`;

if (!existsSync(CHANGELOG)) {
    console.error(`missing changelog: ${CHANGELOG}`);
    process.exit(1);
}

const isPrerelease = version.includes('-');
let body = section(readFileSync(CHANGELOG, 'utf8'), version);
if (!body) {
    if (!isPrerelease) {
        console.error(`no changelog entry found for ${version}`);
        process.exit(1);
    }
    body = `Pre-release build \`${version}\`.`;
}

const links = PACKAGES.map((npm) => `- [\`${npm}\`](${npmLink(npm)})`).join('\n');

process.stdout.write(`${body}\n\n### Packages\n\n${links}\n`);
