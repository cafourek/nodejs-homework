import fs from 'fs/promises';

async function copyFile() {
    try {
        const instructions = await fs.readFile('instrukce.txt', 'utf8');

        const [sourceFile, targetFile] = instructions
            .trim()
            .split(/\s+/); // Split on one or more whitespace characters

        if (!sourceFile || !targetFile) {
            throw new Error('Soubor instrukce.txt nemá správný formát!');
        }

        try {
            await fs.access(sourceFile);
        } catch {
            throw new Error(`Zdrojový soubor "${sourceFile}" neexistuje!`);
        }

        const content = await fs.readFile(sourceFile, 'utf8');

        await fs.writeFile(targetFile, content, 'utf8');

        console.log(`Soubor "${sourceFile}" byl úspěšně zkopírován do "${targetFile}".`);
    } catch (error) {
        console.error('Chyba:', error.message);
    }
}

copyFile();
