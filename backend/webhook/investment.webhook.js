import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleWebhookData, InvestmentMemory } from '../memory/investment.memory.js';

export const migrateInvestmentJsonToMongo = async (req, res) => {
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

        console.log(`Found ${investmentData.length} records. Migrating...`);

        let inserted = 0;
        let skipped = 0;

        for (const item of investmentData) {
            if (!item.id) {
                skipped++;
                continue;
            }

            const exists = await InvestmentMemory.findOne({ originalId: item.id });
            if (exists) {
                skipped++;
                continue;
            }

            // Map snake_case JSON to camelCase Schema
            await InvestmentMemory.create({
                originalId: item.id,
                assetId: item.asset_id,
                token: item.token,
                symbol: item.symbol,
                logo: item.logo,
                logoMark: item.logo_mark,
                mobileLogo: item.mobile_logo,
                altText: item.alt_text,
                title: item.title,
                slug: item.slug,
                publisher: item.publisher,
                publisherUrl: item.publisher_url,
                readTime: item.read_time,
                publishedAt: item.published_at,
                content: item.content,
                contentSnippet: item.content_snippet,
                takeaways: item.takeaways,
                takeawaysSnippet: item.takeaways_snippet,
                trending: item.trending,
                bookmark: item.bookmark
            });
            inserted++;
        }

        console.log('Migration complete.');

        return res.status(200).json({
            success: true,
            total: investmentData.length,
            inserted,
            skipped,
            message: 'investment.json migrated to MongoDB successfully'
        });

    } catch (error) {
        console.error('Migration error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Needed for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        fs.writeFileSync(
            filePath,
            JSON.stringify(newsItems, null, 2),
            'utf-8'
        );
        console.log(`Saved ${newsItems.length} records to investment.json`);

        // 💾 Store to MongoDB
        console.log("Storing data to MongoDB...");
        const dbResult = await handleWebhookData(newsItems);
        console.log(`\nSuccessfully stored ${dbResult.results.filter(r => r.success).length} items in MongoDB.`);

        if (res) {
            return res.status(200).json({
                success: true,
                totalFetched: newsItems.length,
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
