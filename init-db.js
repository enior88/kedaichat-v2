const { execSync } = require('child_process');

try {
    console.log('Running prisma generate...');
    execSync('npx prisma generate', {
        stdio: 'pipe',
        cwd: __dirname,
        shell: true
    });

    console.log('Running prisma db push...');
    execSync('npx prisma db push --accept-data-loss', {
        stdio: 'pipe',
        cwd: __dirname,
        shell: true
    });

    console.log('Database initialized successfully!');
} catch (error) {
    console.error('Failed to initialize database');
    if (error.stdout) console.log('STDOUT:', error.stdout.toString());
    if (error.stderr) console.log('STDERR:', error.stderr.toString());
    console.error('Error message:', error.message);
    process.exit(1);
}
