class RateLimiter {
    static async seconds(seconds: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}

export { RateLimiter}