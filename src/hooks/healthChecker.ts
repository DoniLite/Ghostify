import { Checker } from "index";


export async function healthChecker(): Promise<Checker> {
    return {
        pass: true,
        services: [
            {
                name: "health",
                endpoint: "/test",
            }
        ]
    }
}