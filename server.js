const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require("groq-sdk");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// HYBRID API INITIALIZATION
// ==========================================
// Upgraded to Gemini 2.5 Flash for Advanced Tool Use & Reasoning
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Groq handles Instant Vision Processing for zero-latency Onboarding
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ==========================================
// MODULE A: SHOP CREATOR (GROQ POWERED)
// Ontology-Agnostic Taxonomy Generator
// ==========================================
app.post('/api/setup-store', upload.array('images', 3), async (req, res) => {
    try {
        console.log(`\n[Onboarding] Starting Zero-Shot Vision Analysis via Groq...`);
        
        const imageFile = req.files[0];
        if (!imageFile) return res.status(400).json({error: "Signboard image is required."});
        
        const base64Url = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

        console.log(`[Agent 1] Executing Agnostic Environmental Extraction...`);
        
        // BIAS REMOVED: No more mentions of specific business types.
       const prompt = `
        You are a domain-agnostic enterprise data extraction agent. Scan this storefront image.
        
        CRITICAL BOUNDARY AND FOCUS RULES:
        1. SPATIAL BOUNDARY: Identify the SINGLE PRIMARY, CENTRAL business. IGNORE neighboring stalls, adjacent menus, or unrelated signs on the edges.
        2. DEPTH BOUNDARY: You MUST strictly IGNORE any text printed on temporary physical items (e.g., cardboard boxes, packaging materials, stacked inventory, floor items). 
        3. PERMANENT SIGNAGE ONLY: Extract text ONLY from the permanent main signboard and fixed menu boards attached to the shop structure.
        
        EXTRACTION & TAXONOMY RULES:
        1. CONTACT & ADDRESS: Extract the exact shop name, phone numbers, and address exactly as written. Do not guess missing digits.
        SHOP NAME NORMALIZATION:
            - Preserve the business name exactly as written.
            - If stylized English letters appear (e.g., "S", "K", "M"), preserve them instead of converting them phonetically into Hindi words.
            - Do not expand abbreviations or infer missing words.
        2. ZERO HALLUCINATION: You must ONLY use data explicitly written on the permanent signage. Translate regional fonts accurately to English.
        
        3. DEEP DESCRIPTION (NO SUMMARIZING): Write a comprehensive, highly detailed paragraph (minimum 3-4 sentences). You MUST explicitly mention the specific styles, materials, flavors, or services written on the board. Do not write a brief, generic summary.
            Generate a customer-facing business profile.

            Imagine this description will appear on Google Maps, an ecommerce marketplace, or a shopping application.
            DO NOT describe the signboard, its colors, fonts, layout, or image.
            Instead describe:
                • what the business sells
                • what it specializes in
                • who the target customers are
                • where it is located
                • why customers would visit
            Write 3–4 natural sentences.
        
        4. EXHAUSTIVE DYNAMIC TAXONOMY: 
           - You MUST extract EVERY SINGLE individual item, variation, and type written on the boards (e.g., if a menu lists 8 different flavors of a dish, you must list all 8. If a sign lists 5 types of fabric, list all 5). DO NOT skip or summarize items.
           - Group these specific items into logical Parent Categories based on the visual data.
           - ANTI-LAZY RULE: DO NOT use generic, top-level Parent Categories like "Food", "Snacks", "Apparel", "Fashion", "Products", "Items", or "Specific Products". 
           - Parent Categories must be descriptive (e.g., use the base item as the parent, and its variations as the sub-categories).
        Each Parent Category must represent one logical product family.
        Never mix unrelated products under the same parent category.

        Example:
        Clothing
        ├── Shirts
        ├── T-Shirts

        Footwear
        ├── Sandals
        ├── Shoes

        Grocery
        ├── Rice
        ├── Pulses
        Return ONLY valid JSON matching this exact schema:
        {
            "shopName": "string",
            "description": "string",
            "contactNumbers":[
            "...",
            "..."
            ]
            
            "address": "string",
            "taxonomy": [
                {
                    "parentCategory": "string",
                    "subCategories": ["string", "string"]
                }
            ]
        }`;

       const groqResult = await groq.chat.completions.create({
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: base64Url } }
            ]
        }
    ],
    model: "qwen/qwen3.6-27b",
    // REMOVE response_format
    temperature: 0.1,
    reasoning_effort: "none"
});

// See exactly what Qwen returned
console.log(groqResult.choices[0].message.content);

let text = groqResult.choices[0].message.content;

text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const finalJson = JSON.parse(text);

console.log("[Onboarding] Agnostic taxonomy generated successfully.");
res.json(finalJson);

    } catch (error) {
        console.error("\n❌ [Groq Onboarding Error]:", error.message);
        res.status(500).json({ error: "Server failed to process image via Groq." });
    }
});

// ==========================================
// MODULE B: PRODUCT LISTER (GEMINI 2.5 POWERED)
// Agentic Autonomous Loop (Supervisor/Worker/Critic)
// ==========================================
app.post('/api/analyze-product', upload.fields([{ name: 'frontImage' }, { name: 'backImage' }]), async (req, res) => {
    try {
        const sellingPrice = parseFloat(req.body.sellingPrice);
        const frontImage = req.files['frontImage'] ? req.files['frontImage'][0] : null;
        const backImage = req.files['backImage'] ? req.files['backImage'][0] : null;

        if (!frontImage) return res.status(400).send("Front image is required.");

        const imageParts = [{
            inlineData: { data: frontImage.buffer.toString("base64"), mimeType: frontImage.mimetype }
        }];
        if (backImage) {
            imageParts.push({ inlineData: { data: backImage.buffer.toString("base64"), mimeType: backImage.mimetype } });
        }

        // UPGRADE: Utilizing the state-of-the-art Gemini 2.5 Flash model
        const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --------------------------------------------------
        // WORKER 1: PURE VISION PERCEPTION
        // --------------------------------------------------
        console.log("\n[Worker 1] Zero-Shot Vision Extraction & Confidence Scoring...");
        
        // BIAS REMOVED: Agent is instructed to analyze physical properties universally.
        const visionPrompt = `
        Analyze the images and extract highly specific product details.

        CRITICAL EXTRACTION RULES BASED ON ITEM TYPE:
        1. PRODUCT IDENTITY (CULTURAL/RETAIL): Identify the specific, real-world commercial name of the item. If it is a culturally specific garment (e.g., Saree, Lehenga, Kurti) or regional food, explicitly name it. Do not just describe it vaguely as "fabric" or "food".
        2. IF TEXTILES/APPAREL: If multiple color variants are stacked, focus ONLY on the primary, most fully displayed item. Extract specific details like fabric type, weave pattern, color, design work (e.g., Zari, Embroidery), and list the other visible color variants.
        3. IF PACKAGED GOODS: Read labels carefully. Extract exact brand name, product name, net weight, and key ingredients.
        4. IF UNBRANDED/GENERAL: Describe exact physical characteristics in high detail.

        Return ONLY a JSON object with no markdown.
        {
            "detected_name": "Specific commercial/cultural name and physical description (e.g., Purple Banarasi Saree with Gold Zari and 9 color variants)",
            "visual_category": "Specific retail category (e.g., Sarees, Body Wash)",
            "confidence_score": 0.95 // Rate your confidence from 0.0 to 1.0 based on image clarity
        }`;

        const visionResult = await visionModel.generateContent([visionPrompt, ...imageParts]);
        const visionData = JSON.parse(visionResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim());

        console.log(`[Worker 1] Detected: ${visionData.detected_name} | Confidence: ${visionData.confidence_score}`);

        // --------------------------------------------------
        // SUPERVISOR ORCHESTRATION & CRITIC LOOP
        // --------------------------------------------------
        const maxAttempts = 3;
        let currentAttempt = 1;
        let finalJson = null;
        let criticFeedback = `Initial run. Worker 1 visual confidence is ${visionData.confidence_score}.`;

        while (currentAttempt <= maxAttempts && !finalJson) {
            console.log(`\n[Worker 2] Web Research & Dynamic Schema Generation (Attempt ${currentAttempt})...`);

           const researchPrompt = `
            You are an autonomous e-commerce research agent.
            Visual Context: ${visionData.detected_name}
            Selling Price: ₹${sellingPrice}
            Critic Feedback: ${criticFeedback}

            AGENT PLANNING STRATEGY:
            1. RETAIL MAPPING: Translate the Visual Context into a standard, searchable e-commerce product title and category (e.g., if context says 'woven textile with gold borders', identify it properly as a 'Silk Brocade Saree').
            2. First, search the official brand website for specifications.
            3. If unavailable, search major marketplaces (Flipkart, Amazon, BigBasket).
            4. Extract MRPs from at least 3 different sources to validate the true price.

            Calculate discount: ((MRP - ${sellingPrice}) / MRP) * 100. Round to the nearest whole number.
            
            Return ONLY valid JSON.
            {
                "productName": "Standard E-commerce Title (e.g., Purple Art Silk Zari Work Saree)",
                "category": "Specific Retail Category (e.g., Sarees)",
                "description": "...",
                "pricing": {
                    "mrp": "Median MRP number",
                    "sellingPrice": "${sellingPrice}",
                    "discountPercentage": "Calculated percentage rounded to whole number",
                    "mrp_sources_found": 3
                },
                "specifications": {
                    "dynamic_name_1": "Value",
                    "dynamic_name_2": "Value"
                }
            }
            
            CRITICAL RULE 1: DO NOT use literal strings like "key_1". You must INVENT descriptive specification names based on the item.
            CRITICAL RULE 2: Specification keys MUST be human-readable, Title Case strings with spaces (e.g., "Fabric Composition").
            CRITICAL RULE 3: HYBRID SCHEMA CONSISTENCY. You must balance standardized keys with dynamic keys. 
            - If the item is APPAREL/TEXTILES (e.g., Saree): You MUST always include standard keys exactly named "Fabric" and "Length". 
            - If the item is PACKAGED GOODS (e.g., Soap, Food): You MUST always include standard keys exactly named "Net Quantity" and "Shelf Life". 
            - After including the mandatory standard keys, generate 2 to 3 dynamic keys for the item's unique visual features.`;
            try {
                // WORKER 2: RESEARCH AGENT (GEMINI 2.5 + GOOGLE SEARCH)
                // Removed the JSON generation config so the Search tool works
                const jsonResearchModel = genAI.getGenerativeModel({ 
                    model: "gemini-2.5-flash", 
                    tools: [{ googleSearch: {} }]
                });
                
                const researchResult = await jsonResearchModel.generateContent(researchPrompt);
                
                // Regex added back to clean the markdown before parsing
                const cleanText = researchResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const parsedData = JSON.parse(cleanText);

                // --------------------------------------------------
                // AGENT 3: THE CRITIC (Autonomous Logic Checks)
                // --------------------------------------------------
                console.log(`[Critic Agent] Evaluating Attempt ${currentAttempt}...`);

                // Check 1: Vision Integrity
                if (visionData.confidence_score < 0.6 && currentAttempt === 1) throw new Error("Vision confidence too low. Search wider variants.");
                
                // Check 2: Market Data Validation
                if (!parsedData.pricing || parsedData.pricing.mrp_sources_found < 2) throw new Error("Insufficient pricing data. You must find the MRP on at least 2 different websites.");
                
                // Check 3: Schema Lazy-Generation Guard
                const specKeys = Object.keys(parsedData.specifications);
                if (specKeys.some(k => k.toLowerCase().includes("key_") || k.toLowerCase().includes("dynamic_"))) {
                    throw new Error("You used placeholder keys. Invent real descriptive schema attributes.");
                }

                parsedData.reasoning_summary = `Identity verified with ${Math.round(visionData.confidence_score * 100)}% visual confidence. MRP autonomously cross-referenced across ${parsedData.pricing.mrp_sources_found} web sources.`;
                
                console.log("[Critic Agent] Approved. Dynamic schema meets structural standards.");
                finalJson = parsedData;

            } catch (err) {
                console.log(`[Critic Agent] Rejected: ${err.message}`);
                criticFeedback = err.message;
                
                // Traffic/Rate Limit Failsafe
                if (err.message.includes('503') || err.message.includes('429')) {
                    console.log(`⚠️ API Traffic Spike. Waiting 3s...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
                currentAttempt++;
            }
        }

        if (finalJson) res.json(finalJson);
        else res.status(500).json({ error: "Agentic loop failed to confidently verify product data." });

    } catch (error) {
        console.error("\n❌ [System Error]:", error.message);
        res.status(500).json({ error: "Failed to process product." });
    }
});

app.listen(3000, () => console.log('Multi-Agent Orchestrator running on port 3000'));