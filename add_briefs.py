import os

brief_template = """    <!-- The Brief Section -->
    <section class="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
      <div class="md:col-span-4 sticky top-32 animate-on-scroll">
        <h2 class="text-3xl font-headline text-primary border-l-2 border-primary-container pl-6 py-2">The Brief</h2>
        <div class="mt-8 flex flex-col gap-4">
          <div>
            <span class="block text-[10px] uppercase tracking-widest text-secondary mb-1">Location</span>
            <span class="text-sm font-medium">{location}</span>
          </div>
          <div>
            <span class="block text-[10px] uppercase tracking-widest text-secondary mb-1">Scope</span>
            <span class="text-sm font-medium">{scope}</span>
          </div>
          <div>
            <span class="block text-[10px] uppercase tracking-widest text-secondary mb-1">Guests</span>
            <span class="text-sm font-medium">{guests}</span>
          </div>
        </div>
      </div>
      <div class="md:col-span-8 animate-on-scroll" style="transition-delay: 200ms;">
        <p class="text-2xl md:text-3xl font-headline leading-relaxed text-on-surface-variant">
          {narrative_lead}
        </p>
        <p class="mt-12 text-lg text-secondary leading-loose max-w-2xl font-body">
          {narrative_body}
        </p>
      </div>
    </section>
"""

pages = {
    "the-amalfi-grandeur.astro": {
        "location": "Amalfi Coast, Italy",
        "scope": "Complex Multi-Day Logistics",
        "guests": "150+ Guests",
        "narrative_lead": "Managing an exclusive Italian getaway requires more than just aesthetics. The challenge was orchestrating global guest logistics seamlessly.",
        "narrative_body": "With guests flying in from three continents, the digital experience needed to serve as a 24/7 concierge—translating the complexity of coastal transport into a seamless, high-end editorial journey.",
        "replace_section": "<!-- Experience Section -->"
    },
    "the-stockholm-summer.astro": {
        "location": "Stockholm, Sweden",
        "scope": "Bilingual Paperless Portal",
        "guests": "Intimate Celebration",
        "narrative_lead": "For Astrid and Nils, luxury was defined not by excess, but by intention. Their vision was a celebration that honored the Swedish landscape without leaving a trace.",
        "narrative_body": "We approached this project with a digital-first philosophy, replacing traditional heavy-stock paper invites with a sophisticated \"Paperless Portal\" and dynamic mobile-optimized itineraries.",
        "replace_section": "<!-- Manifesto Section -->"
    },
    "the-parisian-elope.astro": {
        "location": "Paris, France",
        "scope": "Private Password-Protected Portal",
        "guests": "20 Guests",
        "narrative_lead": "For Sophie and Marc, Paris wasn't just a destination; it was a character in their story.",
        "narrative_body": "We designed a bespoke digital invitation system that mirrored the city's effortless style—minimalist layouts, high-contrast typography, and interactive RSVPs that felt like unfolding a personal letter in a Marais café.",
        "replace_section": "<!-- Feature 01 -->"
    },
    "the-modern-minimalist.astro": {
        "location": "Florence, Italy",
        "scope": "Mobile-First UI & Gallery",
        "guests": "80 Guests",
        "narrative_lead": "For Elena and James, the wedding was an exercise in restraint and purposeful beauty.",
        "narrative_body": "Our goal was to translate their high-fashion aesthetic into a digital platform that felt as tactile as their letterpress invitations.",
        "replace_section": "<!-- Hero Content Overlay -->" # Or wherever makes sense
    },
    "the-santorini-serenity.astro": {
        "location": "Oia, Santorini",
        "scope": "Offline-First Guest Experience",
        "guests": "Destination Gathering",
        "narrative_lead": "\"We wanted our guests to feel the salt in the air before they even boarded their flights.\"",
        "narrative_body": "Still transformed a minimalist aesthetic into a digital platform that managed every detail while feeling like a luxury editorial piece, countering low-connectivity environments on the island.",
        "replace_section": "<!-- The Vision -->"
    }
}

for page, data in pages.items():
    path = os.path.join('/Users/thomascharisis/Downloads/ProjectP/Still/src/pages/portfolio', page)
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
            
        brief = brief_template.format(
            location=data['location'],
            scope=data['scope'],
            guests=data['guests'],
            narrative_lead=data['narrative_lead'],
            narrative_body=data['narrative_body']
        )
        
        # Simple hack to inject after Hero Section
        parts = content.split('</section>')
        if len(parts) > 1:
            # Reconstruct content with Brief injected after first section (Hero)
            new_content = parts[0] + '</section>\n' + brief + '</section>'.join(parts[1:])
            
            with open(path, 'w') as f:
                f.write(new_content)
                print(f"Updated {page}")

