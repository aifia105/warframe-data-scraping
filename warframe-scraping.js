import puppeteer from "puppeteer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extractWarframeDetails = async (page) => {
    return await page.evaluate(() => {
        const getData = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        };

        // Description
        const description = document.querySelector('div[data-source="Description"] .pi-data-value')?.textContent.trim();

        // Passive
        const passive = document.querySelector('div[data-source="Passive"] .pi-data-value')?.textContent.trim();

        // Abilities
        const abilities = [];
        for (let i = 1; i <= 4; i++) {
            const abilitySelector = `div[data-source="Ability${i}"] .pi-data-value span[style="border-bottom:2px dotted; color:;"]`;
            const ability = document.querySelector(abilitySelector)?.textContent.trim();
            if (ability) abilities.push(ability);
        }

        // General Information
        const generalInfo = {
            sex: getData('[data-source="Sex"] .pi-data-value'),
            masteryRank: getData('[data-source="Mastery"] .pi-data-value'),
            health: getData('[data-source="Health"] .pi-data-value'),
            shields: getData('[data-source="Shield"] .pi-data-value'),
            armor: getData('[data-source="Armor"] .pi-data-value'),
            energy: getData('[data-source="Energy"] .pi-data-value'),
            startingEnergy: getData('[data-source="InitialEnergy"] .pi-data-value'),
            sprintSpeed: getData('[data-source="Sprint"] .pi-data-value'),
            introduced: getData('[data-source="Introduced"] .pi-data-value'),
            themes: getData('[data-source="Themes"] .pi-data-value'),
            progenitorElement: getData('[data-source="Progenitor"] .pi-data-value span a span'),
            SubsumedAbilities: getData('[data-source="Subsumed"] .pi-data-value span a span'),
            TacticalAbilities: getData('[data-source="Tactical"] .pi-data-value span a span'),
            SellPrice: getData('[data-source="SellPrice"] .pi-data-value'),
        };

        return {
            description,
            passive,
            abilities,
            generalInfo
        };
    });
};

const frameWikiScraping = async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null,
    });
    const page = await browser.newPage();
    

    try {
        await page.goto("https://warframe.fandom.com/wiki/WARFRAME_Wiki", {
            waitUntil: "domcontentloaded",
        });

        await page.goto("https://warframe.fandom.com/wiki/Warframes", {
            waitUntil: "domcontentloaded",
        });

        const frameLinks = await page.evaluate(() => {
            const container = document.querySelector('.flex-container');
            const boxDivs = container.querySelectorAll('.WarframeNavBox');
            
            return Array.from(boxDivs).map(box => {
                const linkSpan = box.querySelector('span a');
                return linkSpan ? linkSpan.href : null;
            }).filter(link => link !== null);
        });

        const framesData = [];
        let count = 0;

        for(const link of frameLinks) {
            try {
                await page.goto(link, {
                    waitUntil: "domcontentloaded",
                });

                const frameName = await page.evaluate(() => {
                    const name = document.querySelector('.pi-title');
                    return name ? name.textContent.trim() : null;
                });

                const details = await extractWarframeDetails(page);
                const frameInfo = {
                    count: count++,
                    name: frameName,
                    ...details
                };

                framesData.push(frameInfo);
                console.log(`Processed: ${frameName}`);
                
                
            } catch (error) {
                console.error(`Error processing ${link}: ${error.message}`);
                continue; 
            }
        }

        // Save to a JSON file 
        const fs = await import('fs/promises');
        const outputPath = join(__dirname, 'warframes-data.json');
        await fs.writeFile(
            outputPath,
            JSON.stringify(framesData, null, 2)
        );

    } catch (error) {
        console.error('Main error:', error);
    } finally {
        await browser.close();
    }
};

frameWikiScraping();