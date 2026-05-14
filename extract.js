import fs from 'fs';
import path from 'path';

const stitchDir = '/Users/thomascharisis/Downloads/ProjectP/stitch_wedding_agency-1';
const caseStudies = [
  { slug: 'the-amalfi-grandeur', dir: 'case_study_amalfi_grandeur' },
  { slug: 'the-santorini-serenity', dir: 'case_study_santorini_serenity' },
  { slug: 'the-stockholm-summer', dir: 'case_study_stockholm_summer' },
  { slug: 'the-cairo-tradition', dir: 'case_study_the_cairo_tradition' },
  { slug: 'the-parisian-elope', dir: 'case_study_the_parisian_elope' }
];

const results = [];

for (const cs of caseStudies) {
  const htmlPath = path.join(stitchDir, cs.dir, 'code.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Extract images using a regex
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    let match;
    const images = [];
    while ((match = imgRegex.exec(html)) !== null) {
      if(match[1].startsWith('http')) {
        images.push(match[1]);
      }
    }

    // Extract quote
    const quoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i;
    const quoteMatch = quoteRegex.exec(html);
    const quote = quoteMatch ? quoteMatch[1].trim().replace(/<[^>]*>?/gm, '') : '';

    // Extract paragraph text (roughly, for intro text)
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    const paragraphs = [];
    while ((match = pRegex.exec(html)) !== null) {
      const text = match[1].trim().replace(/<[^>]*>?/gm, '');
      if (text.length > 20) paragraphs.push(text);
    }

    results.push({
      slug: cs.slug,
      images,
      quote,
      paragraphs
    });
  }
}

fs.writeFileSync('/Users/thomascharisis/Downloads/ProjectP/Still/src/data/extracted_case_studies.json', JSON.stringify(results, null, 2));
console.log('Extracted', results.length, 'case studies.');
