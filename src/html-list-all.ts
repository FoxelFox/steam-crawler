import * as fs from "fs";

async function run() {
    return new Promise((resolve) => {
        let apps = fs.readdirSync("crawled");
        const items = []
        apps.sort((a,b) => parseInt(a) - parseInt(b))
        for (const app of apps) {
            try {

                if (fs.statSync("crawled/" + app + "/header.jpg")["size"] > 1000) {
                    items.push(app)
                }
            } catch {
                // ignore
            }
        }

        resolve(items);
    });
}

run().then((items: string[]) => {

    const start = `
        <!DOCTYPE html>
        <html lang="en" >
        
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="theme-color" content="#161616">
                <title>Steam Graph</title>
                <style>
                    /* remove the border */
                    body {
                        border: 0;
                        background-color: #000;
                        margin: 0;
                    }
                </style>
            </head>
        
            <body>
    `

    const end = `
            </body>
        </html>    
    `

    let list = "";



    for (const item of items) {
        list += `
<a href="https://store.steampowered.com/app/${item}">
    <img loading="lazy" width="460" height="215" src="https://steamcdn-a.akamaihd.net/steam/apps/${item}/header.jpg">
</a>`
    }

    fs.writeFileSync("games.html", start + list + end )
})