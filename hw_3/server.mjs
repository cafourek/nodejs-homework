import http from 'http';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const PORT = 3000;
const COUNTER_FILE = 'counter.txt';

// --- Utility: Load counter file or create it ---
async function readCounter() {
    if (!existsSync(COUNTER_FILE)) {
        await writeFile(COUNTER_FILE, '0');
        return 0;
    }

    const data = await readFile(COUNTER_FILE, 'utf-8');
    const value = parseInt(data.trim(), 10);
    return isNaN(value) ? 0 : value;
}

// --- Utility: Save new value ---
async function writeCounter(value) {
    await writeFile(COUNTER_FILE, value.toString());
}

// --- Shared logic for /increase and /decrease ---
async function handleUpdate(modifierFn, res) {
    try {
        const current = await readCounter();
        const updated = modifierFn(current);
        await writeCounter(updated);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
    }
}

// --- Route definitions ---
const routes = {
    '/increase': res => handleUpdate(val => val + 1, res),
    '/decrease': res => handleUpdate(val => val - 1, res),
    '/read': async res => {
        try {
            const value = await readCounter();
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(value.toString());
        } catch {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading value');
        }
    },
};

// --- Create and start the server ---
const server = http.createServer(async (req, res) => {
    const routeHandler = routes[req.url];
    if (routeHandler) {
        await routeHandler(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
