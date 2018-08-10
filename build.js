// Libs.
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const tsify = require('tsify');
const userScriptHeader = require('browserify-userscript-header');

// Constantes.
const inputDirectory = './src';
const outputDirectory = './scripts';
const indexFileName = 'index.ts';
const metadataFileName = 'metadata.js';
const userScriptFileNameTemplate = '*.user.js';

const requiredFiles = [indexFileName, metadataFileName];

// Fonctions:
// - Analyse des dossiers de l'arborescence.
const join = path.join;
const listFiles = (dirPath) => fs.readdirSync(dirPath).map(f => ({ name: f, path: join(dirPath, f) }));
const isDirectory = (filePath) => fs.statSync(filePath).isDirectory();
const isValidDirectory = (dirPath) => listFiles(dirPath).map(f => f.name).filter(isRequiredFile).length === 2;
const isRequiredFile = (fileName) => requiredFiles.indexOf(fileName) !== -1;

// - Bundling et écriture.
const bundle = (project) => browserify()
                            .add(project.index)
                            .plugin(tsify)
                            .plugin(userScriptHeader, { file: project.metadata })
                            .bundle();

function writeStream(readable, path) {
    const writeStream = readable.pipe(fs.createWriteStream(path));

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(`${path} written.`))
                   .on('error', (error) => reject(error));
    })
}

// Exécution.
listFiles(inputDirectory)
    .filter(f => isDirectory(f.path))
    .filter(d => isValidDirectory(d.path))
    .map(d => ({
        index: join(d.path, indexFileName),
        metadata: join(d.path, metadataFileName),
        outFile: join(
            outputDirectory, 
            userScriptFileNameTemplate.replace('*', d.name)
        ),
    }))
    .map(p => ({ result: bundle(p), outPath: join(__dirname, p.outFile) }))
    .map(b => writeStream(b.result, b.outPath))
    .map(p => p.then(r => console.log(r)));

