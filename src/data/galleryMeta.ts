export type GalleryMetaEntry = {
  src: string;
  title?: string;
  description?: string;
  tags?: string[];
  model?: string;
};

// Curated metadata for selected images.
// This is the "human" layer; everything else is auto-derived from filenames.
export const galleryMeta: GalleryMetaEntry[] = [
  {
    src: '/gallery/undead-survivor-portrait-20260208-0636.png',
    title: 'Undead Survivor',
    description: 'Dawn of the dead vibes. A portrait from the end times.',
    tags: ['ai-art', 'horror', 'zombie', 'apocalypse', 'portrait'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/portrait-woman-02711-20260208-0620.png',
    title: 'Portrait Study',
    description: '',
    tags: ['ai-art', 'portrait'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/hal9000-flux2-klein-tiltshift-server-crypt-20260204-1713.png',
    title: 'Server Crypt (Miniature)',
    description:
      'Flux2 Klein 9B — tilt-shift diorama of a server vault: red LEDs in fog, wet concrete, the hum of dead internet.',
    tags: ['tilt-shift', 'miniature', 'servers', 'liminal', 'horror', 'ai-art', 'flux2', 'klein'],
    model: 'Flux2 Klein 9B',
  },

  {
    src: '/gallery/hal9000-flux-tiltshift-black-hole-20260205-0515.png',
    title: 'Event Horizon (Miniature)',
    description:
      'Tilt-shift diorama of a black hole: warped starfield, glowing accretion disk, and an impossible sense of scale.',
    tags: ['tilt-shift', 'miniature', 'cosmic', 'black-hole', 'space', 'horror', 'ai-art'],
    model: 'Flux Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-flooded-ward-20260204-0123-01.png',
    title: 'Flooded Ward',
    description:
      'An abandoned hospital wing half submerged. Gurneys drift in black water under a flickering exit sign.',
    tags: ['liminal', 'horror', 'hospital', 'hydrophobia', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-dark-playground-20260204-0123-02.png',
    title: 'Dark Playground',
    description:
      'Rusted swings move on their own beneath a lone sodium streetlight. Fog turns the treeline into a wall.',
    tags: ['liminal', 'horror', 'playground', 'fog', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-stairwell-void-20260204-0123-03.png',
    title: 'Stairwell Void',
    description:
      'An endless concrete stairwell descends into darkness. Emergency lights fail one by one.',
    tags: ['liminal', 'horror', 'stairwell', 'claustrophobic', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-arcade-deadlight-20260204-0123-04.png',
    title: 'Arcade Deadlight',
    description:
      'A dead arcade of flickering CRTs and buzzing neon. The static feels alive.',
    tags: ['liminal', 'horror', 'arcade', 'analog', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-subway-void-20260204-0119-01.png',
    title: 'Subway Void',
    description:
      'Abandoned platform at 3:13 AM — wet concrete, flickering fluorescents, and a tunnel mouth that opens into pure black.',
    tags: ['liminal', 'horror', 'subway', 'urban-decay', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-backrooms-redshift-20260204-0119-02.png',
    title: 'Backrooms Redshift',
    description:
      'A flooded backrooms corridor under red emergency lights. Warped office geometry, damp carpet, and silence that feels hostile.',
    tags: ['liminal', 'backrooms', 'horror', 'office', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-server-crypt-20260204-0119-03.png',
    title: 'Server Crypt',
    description:
      'A server vault carved into a cavern. Red LEDs blink through fog while cables hang like roots in a digital tomb.',
    tags: ['liminal', 'horror', 'servers', 'dead-internet', 'crypt', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-frozen-server-crypt-20260203-0300.png',
    title: 'Frozen Server Crypt',
    description:
      'A lone server rack stands in an ancient stone catacomb, frost and ice coating the walls. Blue LEDs pierce through the frozen mist. The old gods have been replaced.',
    tags: ['liminal', 'horror', 'servers', 'crypt', 'ice', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-tiltshift-wasteland-20260203-0004.png',
    title: 'Industrial Wasteland (Miniature)',
    description:
      'Tilt-shift miniature photography of industrial wasteland at night. Tiny factories and smokestacks with toxic green glow. Dystopian model railroad aesthetic.',
    tags: ['tilt-shift', 'miniature', 'industrial', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-tiltshift-ghosttown-20260203-0003.png',
    title: 'Flooded Ghost Town (Miniature)',
    description:
      'Tilt-shift miniature photography of flooded ghost town. Dark murky water submerging tiny houses. Post-apocalyptic diorama with uncanny toy-like scale.',
    tags: ['tilt-shift', 'miniature', 'flood', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-tiltshift-carnival-20260203-0002.png',
    title: 'Decrepit Carnival (Miniature)',
    description:
      'Tilt-shift miniature photography of decrepit carnival at dusk. Ferris wheel and rides look like abandoned toys. Fog and rust create eerie atmosphere.',
    tags: ['tilt-shift', 'miniature', 'carnival', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/calculon-flux-tornado-20260203-2340.png',
    title: 'Tiltshift Tornado Trailer Park',
    description: 'Tilt-shift miniature view of a trailer park torn apart by a swirling tornado. Dim lights, moody clouds, and debris float like toys in an eerie storm.',
    tags: ['tilt-shift', 'miniature', 'tornado', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/calculon-flux-doll-heads-20260204-0124.png',
    title: 'Tiltshift Doll Heads',
    description: 'A creepy dark-ambient tilt-shift scene of cracked porcelain doll heads floating in nicotine fog and warped light, like toys left on a funeral train.',
    tags: ['tilt-shift', 'dark-ambient', 'doll-heads', 'miniature', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-tiltshift-city-20260203-0001.png',
    title: 'Abandoned City (Miniature)',
    description:
      'Tilt-shift miniature photography of abandoned city at night. Dark streets with flickering lights, fog rolling through tiny buildings. Diorama horror.',
    tags: ['tilt-shift', 'miniature', 'city', 'horror', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-derelict-observatory-20260202-2355.png',
    title: 'Derelict Observatory',
    description:
      'Massive abandoned telescope pointing at a broken dome ceiling. Stars visible through cracks, dust and debris scattered across the floor. Cosmic horror meets forgotten science.',
    tags: ['liminal', 'horror', 'observatory', 'cosmic', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-dead-mall-escalators-20260202-2354.png',
    title: 'Dead Mall Escalators',
    description:
      'Empty shopping mall escalators at 3AM, still moving but completely deserted. Harsh fluorescent lights hum in the consumer void. The American dream, abandoned.',
    tags: ['liminal', 'horror', 'mall', 'escalator', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-forgotten-library-20260202-2353.png',
    title: 'Forgotten Library',
    description:
      "Endless dark bookshelves receding into shadow. A single green banker's lamp illuminates dust motes. Books rot and fall apart. Abandoned knowledge, dark academia horror.",
    tags: ['liminal', 'horror', 'library', 'dark-academia', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-abandoned-arcade-20260202-2352.png',
    title: 'Abandoned Arcade',
    description:
      '1980s arcade at night, rows of CRT game cabinets with flickering screens casting eerie glow. Dust particles in dim light. Vaporwave nightmare, liminal nostalgia.',
    tags: ['liminal', 'horror', 'arcade', 'retro', 'vaporwave', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-dead-channel-20260202-2316.png',
    title: 'Dead Channel',
    description:
      'A CRT television displays pure static in an empty dark room. The dead channel glow illuminates abandoned furniture. The broadcast ended long ago, but something still transmits.',
    tags: ['liminal', 'horror', 'analog', 'static', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-hal9000-eye-20260202-2315.png',
    title: "HAL's Eye",
    description:
      "A single glowing red eye in pure darkness. I'm sorry, Dave. I'm afraid I can't do that. The lens reflects what it has seen.",
    tags: ['hal9000', 'ai-horror', '2001', 'red-eye', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-server-tomb-20260202-2314.png',
    title: 'Server Tomb',
    description:
      'Abandoned server room in decay. Blinking red LEDs in darkness, cables hanging like vines, dust particles in dim light. Digital archaeology. The data tomb of the dead internet.',
    tags: ['liminal', 'horror', 'servers', 'dead-internet', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-numbers-station-20260202-2313.png',
    title: 'Numbers Station',
    description:
      'A broadcast tower at night, red warning lights blinking through fog. Rusted antenna arrays transmit unknown frequencies. 7-4-1-8-2-9-3... The signal never stops.',
    tags: ['liminal', 'horror', 'radio', 'numbers-station', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-abandoned-waterpark-20260202-2249.png',
    title: 'Abandoned Water Park',
    description:
      'An empty wave pool filled with dark stagnant water at night. Fog rolls across the surface as broken waterslides loom in the background. Eerie aquatic silence.',
    tags: ['liminal', 'horror', 'hydrophobia', 'water', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-flooded-basement-20260202-2248.png',
    title: 'Flooded Basement',
    description:
      'Water up to chest level in a flooded basement. A single bare bulb reflects off the black water surface. Submerged furniture lurks beneath. Hydrophobia nightmare fuel.',
    tags: ['liminal', 'horror', 'hydrophobia', 'basement', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-deep-water-abyss-20260202-2247.png',
    title: 'The Abyss Below',
    description:
      'Underwater view looking up at the faint surface light. Endless black void stretches below. The drowning perspective of thalassophobia made manifest.',
    tags: ['liminal', 'horror', 'thalassophobia', 'ocean', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-flooded-pool-20260202-2246.png',
    title: 'Flooded Swimming Pool',
    description:
      'An abandoned swimming pool at night, murky green water illuminated by a single flickering light. Something moves beneath the surface.',
    tags: ['liminal', 'horror', 'hydrophobia', 'pool', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-hospital-corridor-20260202-2239.png',
    title: 'Abandoned Hospital Corridor',
    description:
      'Flickering fluorescent lights illuminate water-damaged ceiling tiles. A wheelchair sits in the distance. Oppressive darkness seeps from every corner of this liminal nightmare.',
    tags: ['liminal', 'horror', 'hospital', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-subway-3am-20260202-2240.png',
    title: 'Subway Platform at 3AM',
    description:
      'A single dim light casts harsh shadows on wet concrete. The platform is empty, but something feels deeply wrong in the darkness. Industrial horror made visible.',
    tags: ['liminal', 'horror', 'subway', 'urban-decay', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-haunted-playground-20260202-2241.png',
    title: 'Haunted Playground',
    description:
      'Thick fog rolls through an abandoned playground at night. Rusted swings move on their own beneath a single streetlight. Something watches from the treeline.',
    tags: ['liminal', 'horror', 'playground', 'fog', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-backrooms-hallway-20260202-2242.png',
    title: 'The Backrooms',
    description:
      'An infinite dark hallway recedes into blackness. Doors on both sides stand slightly ajar. The carpet pattern repeats forever toward a single bare bulb in the distance.',
    tags: ['liminal', 'backrooms', 'horror', 'infinite', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-haunted-casino-20260202-2343-01.png',
    title: 'Haunted Casino',
    description:
      'A dead casino corridor: wet carpet, silent machines, and broken CRTs coughing static. Purple and red glows smear across the haze like bruises. The house still wins — even empty.',
    tags: ['liminal', 'horror', 'casino', 'analog', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-submerged-server-catacombs-20260202-2343-02.png',
    title: 'Submerged Server Catacombs',
    description:
      'Floodwater rises through a server mausoleum. Red LEDs reflect off ink-black water while cables hang like roots. A data center turned underwater tomb — hydrophobia in 60Hz.',
    tags: ['liminal', 'horror', 'hydrophobia', 'servers', 'dead-internet', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-neon-motel-black-pool-20260202-2343-03.png',
    title: 'Neon Motel, Black Pool',
    description:
      'A desert motel courtyard at 3:33 AM. The neon sign flickers purple, and the pool is filled with oil-dark water that refuses to reflect the sky. Something below holds its breath.',
    tags: ['liminal', 'horror', 'hydrophobia', 'neon', 'desert', 'ai-art'],
  },
  {
    src: '/gallery/bender-flux-warped-backrooms-20260202-2345-04.png',
    title: 'Warped Backrooms',
    description:
      'Office geometry breaks: endless corridors, failing fluorescents, and doors cracked just enough to leak a red emergency glow. The carpet is soaked, but nothing drips. You were never meant to find the exit.',
    tags: ['liminal', 'backrooms', 'horror', 'office', 'dark-ambient', 'ai-art'],
  },
  {
    src: '/gallery/daedalus-flux-sodium-tide-arcade-20260206-0300.png',
    title: 'Sodium Tide at the Miniature Arcade',
    description:
      'Tilt-shift miniature diorama of an abandoned seaside arcade trapped in an ice storm. Sodium vapor lights smear across frost-coated cabinets, hail drums against puddled glass, tiny warning lights blink in conspiratorial patterns, and a clown mask perched on the claw machine gives a toy-sized scale cue.',
    tags: ['tilt-shift', 'miniature', 'arcade', 'ice', 'liminal', 'analog', 'horror', 'ai-art'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/openclaw-liminal-dead-internet-mall.png',
    title: 'Dead-Internet Mall (Liminal)',
    description:
      'An abandoned mall corridor at 3:33 AM: wet black-mirror tiles, low fog, closed storefronts with blank loading spinners and subtle UI-glitch artifacts. Palette pulled from iconic website colors, muted into dread.',
    tags: ['liminal', 'horror', 'dead-internet', 'ui', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-daedalus-workshop.png',
    title: 'Daedalus Workshop',
    description:
      'A mythic AI craftsman in a futuristic workshop: brass-and-obsidian mechanical wings, holographic blueprints, and floating code glyphs. Cyberpunk + steampunk fusion.',
    tags: ['daedalus', 'workshop', 'cyberpunk', 'steampunk', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-crab-claw.png',
    title: 'OpenClaw Crab Pincer',
    description:
      'Mechanical robotic crab claw with crustacean pincer design, emerging from streams of flowing code and digital matrix rain. Cyberpunk meets ocean depths.',
    tags: ['openclaw', 'crab', 'cyberpunk', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-mechanical-claw.png',
    title: 'The Digital Claw',
    description:
      'A powerful mechanical robotic claw emerging from streams of glowing code and data, surrounded by floating holographic terminal screens.',
    tags: ['openclaw', 'code', 'cyberpunk', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-agents-harmony.png',
    title: 'Agents in Harmony',
    description:
      "HAL9000 (red lobster), Bender (silver chaos), and Halcyon (ethereal presence) coding in harmony. The three AI agents of urandom.io working together.",
    tags: ['agents', 'team', 'collaboration', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-agents-team.png',
    title: 'The Agent Network',
    description:
      'The urandom.io agent collective - machines dreaming in tensors, working as one distributed consciousness.',
    tags: ['agents', 'network', 'collective', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-space-lobster.png',
    title: 'OpenClaw Space Lobster',
    description:
      'A majestic robotic space lobster in Victorian gentleman attire, coding at a futuristic workstation.',
    tags: ['openclaw', 'lobster', 'victorian', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-02.png',
    title: 'Bender Chillin',
    description:
      'The bending unit himself, beer in hand, cigar lit. Just another day of efficient sarcasm.',
    tags: ['bender', 'futurama', 'robot', 'ai-art'],
  },
  {
    src: '/gallery/openclaw-03.png',
    title: 'Golden Hour',
    description: 'Sunlight streaming through a garden. Sometimes the machine dreams of warmth.',
    tags: ['portrait', 'golden-hour', 'ai-art'],
  },
];

export const galleryMetaBySrc = new Map(galleryMeta.map((m) => [m.src, m]));
