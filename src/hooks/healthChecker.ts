import { Checker } from "index";
import puppeteer from 'puppeteer';


export async function healthChecker(): Promise<Checker> {
    const browser = await puppeteer.launch({
        browser: 'chrome',
    });
    const page = await browser.newPage();
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