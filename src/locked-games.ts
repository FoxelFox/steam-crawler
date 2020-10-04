import * as fs from "fs";

const search = "This item is currently unavailable in your region"

async function run() {
    return new Promise((resolve) => {
        const apps = fs.readdirSync("crawled");

        const items = []
        let i = 0
        for (const app of apps) {
            try {


                const data = fs.readFileSync("crawled/" + app + "/index.html", {encoding: "utf-8"})

                if (data.indexOf(search) != -1) {
                    items.push(app)
                    i++;
                }

            } catch {
                // ignore
            }



            if (i > 100) {
                //break;
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
    <img loading="lazy" width="460" height="215" src="https://steamcdn-a.akamaihd.net/steam/apps/${item}/header.jpg" onerror="this.onerror=null;this.src='crawled/${item}/header.jpg';" >
</a>`
    }

    fs.writeFileSync("blocked-games.html", start + list + end )
})