// Script to test the date logic
const storeCreatedAt = new Date('2024-03-15T08:00:00.000Z'); // Joined March 15th
const now = new Date('2024-06-10T12:00:00.000Z'); // Current date is June 10th

console.log('Store Registered:', storeCreatedAt.toISOString());
console.log('Current Date Simulated:', now.toISOString());

let cycleStart = new Date(storeCreatedAt);
cycleStart.setFullYear(now.getFullYear());
cycleStart.setMonth(now.getMonth());

if (now < cycleStart) {
    cycleStart.setMonth(cycleStart.getMonth() - 1);
}

console.log('---');
console.log('Expected Cycle Start: 2024-05-15T08:00:00.000Z (Because June 15th hasn\\'t happened yet)');
console.log('Actual Cycle Start:', cycleStart.toISOString());
console.log('---');

const now2 = new Date('2024-06-18T12:00:00.000Z'); // Current date is June 18th
console.log('Current Date Simulated 2:', now2.toISOString());

let cycleStart2 = new Date(storeCreatedAt);
cycleStart2.setFullYear(now2.getFullYear());
cycleStart2.setMonth(now2.getMonth());

if (now2 < cycleStart2) {
    cycleStart2.setMonth(cycleStart2.getMonth() - 1);
}

console.log('Expected Cycle Start 2: 2024-06-15T08:00:00.000Z (Because June 15th passed)');
console.log('Actual Cycle Start 2:', cycleStart2.toISOString());
