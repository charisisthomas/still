import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('src/data/extracted_case_studies.json', 'utf-8'));

for (const caseStudy of data) {
    const slug = caseStudy.slug;
    const images = caseStudy.images;
    
    const filePath = path.join('src/pages/portfolio', `${slug}.astro`);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    let i = 0;
    // We only replace image paths that start with /images/
    content = content.replace(/src="\/images\/[^"]+"/g, (match) => {
        const replacement = images[i % images.length];
        i++;
        return `src="${replacement}"`;
    });
    
    fs.writeFileSync(filePath, content);
}
console.log('Successfully updated portfolio files with v2 mappings.');
