import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Investment Memory Schema
const investmentMemorySchema = new mongoose.Schema({
    originalId: { type: String, required: true, unique: true },
    assetId: { type: String },
    token: { type: String },
    symbol: { type: String },
    logo: { type: String },
    logoMark: { type: String },
    mobileLogo: { type: String },
    altText: { type: String },
    title: { type: String, required: true },
    slug: { type: String },
    publisher: { type: String },
    publisherUrl: { type: String },
    readTime: { type: Number },
    publishedAt: { type: Date },
    content: { type: String },
    contentSnippet: { type: String },
    takeaways: { type: String },
    takeawaysSnippet: { type: String },
    trending: { type: Boolean, default: false },
    bookmark: { type: Boolean, default: false }
}, { timestamps: true });

const InvestmentMemory = mongoose.model('InvestmentMemory', investmentMemorySchema);

// Your JSON data - paste the complete array here
const investmentData = [
    {
        "id": "31940282-6f5b-4243-b897-989572a20bc2",
        "asset_id": "0b8effd2-72b5-4838-ae8d-79a66e7062e8",
        "token": "INE808K01017",
        "symbol": "Arohan Financial Services",
        "logo": "https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo/INE808K01017/logo_v1762004059198.png",
        "logo_mark": "https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE808K01017/logo_mark_v1762004059902.png",
        "mobile_logo": "https://d1f4abmpnfzs14.cloudfront.net/pe/asset/mobile_logo/INE808K01017/mobile_logo_v1762004060560.png",
        "alt_text": null,
        "title": "Arohan Financial Services – Plans ₹1,500 Crore IPO in Q2 FY27",
        "slug": "arohan-financial-services-plans-1500-crore-ipo-in-q2-fy27",
        "publisher": "Money Control",
        "publisher_url": "https://www.moneycontrol.com/news/business/ipo/arohan-financial-services-plans-to-hit-capital-market-during-middle-of-2026-27-with-rs-1-500-crore-ipo-13782334.html",
        "read_time": 2,
        "published_at": "2026-01-21T12:15:00.000Z",
        "content": "<p>Expert Analysis:</p><ul class=\"list-disc\"><li><p>NBFC-MFI Arohan Financial Services plans a ₹1,500 crore IPO in the second quarter of next financial year (Q2 FY27), split equally between ₹750 crore fresh issue and ₹750 crore offer for sale (OFS) by existing investors such as Tano Capital and the Michael and Susan Dell Foundation; promoters will not sell any stake.</p></li><li><p>The company has appointed merchant bankers and targets DRHP filing with SEBI within the next two months, with IPO proceeds earmarked to strengthen the capital base, support portfolio growth, and reinforce management and board governance.</p></li><li><p>Management highlights improving sector tailwinds: microfinance collection efficiency ratio (CER) has risen on the back of good harvests and GST rationalisation, with Arohan's CER at 99.7 percent, aided by use of AI tools for collections and recoveries.</p></li><li><p>Arohan is targeting an outstanding portfolio of about ₹7,000 crore by end of the current financial year and ₹20,000 crore by 2030, alongside a planned product diversification into secured offerings such as gold loans and loans against property to balance risk and smooth earnings.</p></li></ul>",
        "content_snippet": "Expert Analysis:NBFC-MFI Arohan Financial Services plans a ₹1,500 crore IPO in the second quarter of next financial year (Q2 FY27), split equally between ₹750 crore fresh issue and ₹750 crore offer fo",
        "takeaways": "<p>Arohan's planned ₹1,500 crore IPO in Q2 FY27 combines growth capital with partial investor exit while riding a cyclical upturn in microfinance fundamentals; successful execution, high CER, and a pivot towards secured products will be critical to support the targeted balance-sheet scale-up from ₹7,000 crore to ₹20,000 crore by 2030.</p>",
        "takeaways_snippet": "Arohan's planned ₹1,500 crore IPO in Q2 FY27 combines growth capital with partial investor exit while riding a cyclical upturn in microfinance fundamentals; successful execution, high CER, and a pivot",
        "trending": true,
        "bookmark": false,
        "created_at": "2026-01-23T06:09:30.058Z",
        "updated_at": "2026-01-23T06:09:30.058Z"
    }
    // Add all your other items here...
];

// Main migration function
async function migrateData() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        await mongoose.connect(mongoUri);

        console.log('✅ Connected to MongoDB');
        console.log(`📦 Starting migration of ${investmentData.length} items...\n`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const item of investmentData) {
            try {
                // Check if already exists
                const exists = await InvestmentMemory.findOne({ originalId: item.id });

                if (exists) {
                    skippedCount++;
                    console.log(`⏭️  Skipped (already exists): ${item.title.substring(0, 50)}...`);
                    continue;
                }

                // Create new document
                const document = new InvestmentMemory({
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
                    publishedAt: new Date(item.published_at),
                    content: item.content,
                    contentSnippet: item.content_snippet,
                    takeaways: item.takeaways,
                    takeawaysSnippet: item.takeaways_snippet,
                    trending: item.trending,
                    bookmark: item.bookmark
                });

                await document.save();

                successCount++;
                console.log(`✅ Migrated: ${item.title.substring(0, 50)}...`);

            } catch (error) {
                errorCount++;
                console.error(`❌ Error migrating ${item.title}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log('='.repeat(60));
        console.log(`   ✅ Successfully migrated: ${successCount}`);
        console.log(`   ⏭️  Skipped (duplicates):  ${skippedCount}`);
        console.log(`   ❌ Errors:                ${errorCount}`);
        console.log(`   📝 Total records:         ${investmentData.length}`);
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Webhook handler for continuous data ingestion
export async function handleWebhookData(webhookPayload) {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        await mongoose.connect(mongoUri);

        const items = Array.isArray(webhookPayload) ? webhookPayload : [webhookPayload];
        const results = [];

        for (const item of items) {
            try {
                const document = await InvestmentMemory.findOneAndUpdate(
                    { originalId: item.id },
                    {
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
                        publishedAt: new Date(item.published_at),
                        content: item.content,
                        contentSnippet: item.content_snippet,
                        takeaways: item.takeaways,
                        takeawaysSnippet: item.takeaways_snippet,
                        trending: item.trending,
                        bookmark: item.bookmark
                    },
                    { upsert: true, new: true }
                );

                results.push({ success: true, id: item.id, title: item.title });
            } catch (error) {
                results.push({ success: false, id: item.id, error: error.message });
            }
        }

        await mongoose.connection.close();

        return {
            success: true,
            total: items.length,
            results
        };

    } catch (error) {
        console.error('Webhook handler error:', error);
        throw error;
    }
}

// Run migration if executed directly
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const entryFile = process.argv[1];

// Normalize paths for comparison (handle Windows backslashes and casing)
const currentPath = path.resolve(__filename);
const entryPath = path.resolve(entryFile);

if (currentPath === entryPath) {
    migrateData();
}

export { InvestmentMemory, migrateData };