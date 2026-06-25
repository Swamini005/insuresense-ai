import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { upsertInvestmentItems } from '../memory/investment.memory.js';

// ES module __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrateInvestmentJsonToDb = async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'investment.json');

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'investment.json not found'
            });
        }

        console.log('Reading investment.json...');

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const investmentData = JSON.parse(rawData);

        if (!Array.isArray(investmentData)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON format (expected array)'
            });
        }

        console.log(`Found ${investmentData.length} records. Upserting into Postgres...`);

        const { results } = await upsertInvestmentItems(investmentData);
        const inserted = results.filter((r) => r.success).length;

        return res.status(200).json({
            success: true,
            total: investmentData.length,
            inserted,
            skipped: results.length - inserted,
            message: 'investment.json migrated to Postgres successfully'
        });

    } catch (error) {
        console.error('Migration error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const fetchAndIngestInvestmentNews = async (req, res) => {
    const url = "https://api-v2.precize.in/v1/pe/open/news/ALL";

    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.5",
        "chace-app-key": "468f0d3b-0493-43c1-8bc8-17135f0776b4",
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "user-agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
        "Referer": "https://www.precize.in/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    try {
        console.log("Fetching investment news from Precize...");

        const response = await axios.get(url, { headers });
        const responseData = response.data;

        const newsItems =
            responseData?.data?.news ||
            responseData?.data ||
            responseData;

        if (!Array.isArray(newsItems)) {
            console.error("Unexpected API response structure:", responseData);
            if (res) {
                return res.status(500).json({
                    success: false,
                    message: "Invalid API response format"
                });
            }
            return;
        }

        console.log(`Fetched ${newsItems.length} news items.`);

        // 📁 Write raw fetched data to investment.json
        const filePath = path.join(__dirname, 'investment.json');
        fs.writeFileSync(filePath, JSON.stringify(newsItems, null, 2), 'utf-8');
        console.log(`Saved ${newsItems.length} records to investment.json`);

        // 💾 Store to Postgres
        console.log("Storing data to Postgres...");
        const dbResult = await upsertInvestmentItems(newsItems);
        const stored = dbResult.results.filter((r) => r.success).length;
        console.log(`\nSuccessfully stored ${stored} items in Postgres.`);

        if (res) {
            return res.status(200).json({
                success: true,
                totalFetched: newsItems.length,
                stored,
                jsonFile: 'investment.json',
                message: "Investment news fetched and saved successfully"
            });
        }
    } catch (error) {
        console.error("Error fetching investment news:", error);
        if (res) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};
