import { setInterval } from 'node:timers';

export const startMemoryMonitor = (): void => {
    setInterval(() => {
        const memory = process.memoryUsage();

        console.log('\n========== MEMORY USAGE ==========');

        console.log({
            rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`,
            arrayBuffers: `${(memory.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
        });

        console.log('==================================\n');
    }, 10000).unref();
};
