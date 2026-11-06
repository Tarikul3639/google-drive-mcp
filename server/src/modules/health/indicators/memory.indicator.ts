import { Injectable } from '@nestjs/common';
import { getHeapStatistics } from 'node:v8';

@Injectable()
export class MemoryIndicator {
    private readonly threshold = 0.9;

    check() {
        const memoryUsage = process.memoryUsage();
        const heapStatistics = getHeapStatistics();

        const heapUsedRatio = memoryUsage.heapUsed / heapStatistics.heap_size_limit;

        if (heapUsedRatio >= this.threshold) {
            throw new Error('Memory usage is above the threshold.');
        }

        return {
            status: 'up' as const,
            heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
            heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
            rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
            rss: memoryUsage.rss,
        };
    }
}
