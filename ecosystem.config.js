module.exports = {
    apps: [{
        name: "stockr-deno",
        script: "deno",
        args: "task start",
        interpreter: "bash",
        interpreter_args: "run --allow-env --allow-read --allow-net",
        env: {
            PORT: 8000
        }
    }]
};
