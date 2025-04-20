import { basicAuth } from "hono/basic-auth";

const setUpAuthMiddlewares = () => {

    const serverAuthUsername = Deno.env.get("SERVER_AUTH_USERNAME");
    const serverAuthPassword = Deno.env.get("SERVER_AUTH_PASSWORD");
    const clientAuthUsername = Deno.env.get("CLIENT_AUTH_USERNAME");
    const clientAuthPassword = Deno.env.get("CLIENT_AUTH_PASSWORD");

    if (!serverAuthUsername || !serverAuthPassword) {
        throw new Error("Missing required environment variables for server authentication.");
    }

    if (!clientAuthUsername || !clientAuthPassword) {
        throw new Error("Missing required environment variables for client authentication.");
    }


    const authServer = basicAuth({
        username: serverAuthUsername,
        password: serverAuthPassword,
    });

    const authClient = basicAuth({
        username: clientAuthUsername,
        password: clientAuthPassword,
    });

    console.log("Auth middlewares set up successfully.");

    return { authServer, authClient };
}

export { setUpAuthMiddlewares };