import fs from 'fs/promises';

const FILES_DIRECTORY = "files"

async function main() {
    try {
        const data = await fs.readFile('instrukce.txt', 'utf-8');
        const count = parseInt(data.trim(), 10);

        const tasks = [];
        for (let i = 0; i <= count; i++) {
            const content = `Soubor ${i}`;
            tasks.push(fs.writeFile(`${FILES_DIRECTORY}/${i}.txt`, content));
        }

        await Promise.all(tasks);

        console.log(`Všechny ${count + 1} soubory byly úspěšně vytvořeny (paralelně).`);
    } catch (err) {
        console.error('Chyba:', err.message);
    }
}

main();
