module.exports = {
    apps: [{
        name: "stockr-deno",
        cwd: "./StockR2",
        script: "deno",
        args: "task start",
        interpreter: "bash",
        interpreter_args: "run --allow-env --allow-read --allow-net",
        env: {
            PORT: 8000
        }
    }]
};
