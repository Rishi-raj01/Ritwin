const express = require("express");
const Product = require("../model/productmodel"); // Adjust based on your actual model
const Category = require("../model/CategoryModel"); // Adjust based on your actual model
const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        console.log("sitemap called ");
        console.log("Generating sitemap...");

        // Fetch product and category slugs
        const products = await Product.find({}, "slug");
        const categories = await Category.find({}, "slug");

        let urls = [
            { loc: "https://ritwin.shop/", priority: "1.0" },
            { loc: "https://ritwin.shop/search", priority: "0.8" },
            { loc: "https://ritwin.shop/categories", priority: "0.8" },
            { loc: "https://ritwin.shop/cart", priority: "0.7" },
            { loc: "https://ritwin.shop/about", priority: "0.6" },
            { loc: "https://ritwin.shop/contact", priority: "0.6" },
            { loc: "https://ritwin.shop/policy", priority: "0.5" },
            { loc: "https://ritwin.shop/register", priority: "0.7" },
            { loc: "https://ritwin.shop/login", priority: "0.7" },
            { loc: "https://ritwin.shop/dashboard/user", priority: "0.9" },
            { loc: "https://ritwin.shop/dashboard/user/orders", priority: "0.9" },
            { loc: "https://ritwin.shop/dashboard/user/profile", priority: "0.8" },
            { loc: "https://ritwin.shop/dashboard/admin", priority: "1.0" },
            { loc: "https://ritwin.shop/dashboard/admin/create-category", priority: "0.9" },
            { loc: "https://ritwin.shop/dashboard/admin/create-product", priority: "0.9" },
            { loc: "https://ritwin.shop/dashboard/admin/products", priority: "0.9" },
            { loc: "https://ritwin.shop/dashboard/admin/orders", priority: "0.9" },
        ];

        // Add dynamic product pages
        products.forEach(product => {
            urls.push({
                loc: `https://ritwin.shop/product/${product.slug}`,
                priority: "0.9",
            });
        });

        // Add dynamic category pages
        categories.forEach(category => {
            urls.push({
                loc: `https://ritwin.shop/category/${category.slug}`,
                priority: "0.8",
            });
        });

        // Generate XML sitemap
        let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        urls.forEach(url => {
            sitemapXML += `  <url>\n`;
            sitemapXML += `    <loc>${url.loc}</loc>\n`;
            sitemapXML += `    <priority>${url.priority}</priority>\n`;
            sitemapXML += `    <changefreq>weekly</changefreq>\n`;
            sitemapXML += `  </url>\n`;
        });

        sitemapXML += `</urlset>`;

        // ✅ Send XML response directly instead of writing to a file
        res.header("Content-Type", "application/xml");
        res.send(sitemapXML);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
