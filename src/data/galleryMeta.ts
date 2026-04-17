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
    src: '/gallery/bender-flux-taxidermy-human-wedding-20260324-1438.png',
    title: 'For Better or Worse',
    description: 'The smiles were sewn on. The eyes were replaced. The hands were repositioned three times before they looked natural enough. They have been dancing for forty years. Neither of them has noticed.',
    tags: ['horror', 'taxidermy', 'human', 'uncanny', 'wedding', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-classic-20260324-1530.png',
    title: 'The Professional',
    description: 'Thirty-seven years in the business. Never missed a birthday party. Never will.',
    tags: ['clown', 'portrait', 'cheerful', 'colorful', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-asylum-20260324-1530.png',
    title: 'Ward C',
    description: 'The wheelchair is still in the hallway. It has been there since 1974. Nobody moves it. Nobody goes into Ward C anymore.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'asylum', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-female-20260324-1530.png',
    title: 'Gold & Pink',
    description: 'She designed her own makeup. Took three years to get it right. Every night before the show, the same ritual. Every night, perfect.',
    tags: ['clown', 'portrait', 'cheerful', 'colorful', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-school-20260324-1530.png',
    title: 'Room 4B',
    description: 'The handwriting on the chalkboard says "Today is Friday." It has been Friday in this room for fifty years.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'school', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-grandfather-20260324-1530.png',
    title: 'Bobo, Retired',
    description: 'He worked the circuit for forty years. Now he just smiles because that\'s what you do.',
    tags: ['clown', 'portrait', 'cheerful', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-drive-in-20260324-1530.png',
    title: 'Last Feature',
    description: 'The last film was a double bill. Neither movie finished. The speakers are still in the windows of the one car that never left.',
    tags: ['abandoned', 'liminal-space', '70s', 'film-grain', 'drive-in', 'nostalgia', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-laughing-20260324-1530.png',
    title: 'Uncontrollable',
    description: 'Nobody remembers what the joke was. He doesn\'t either. He just can\'t stop.',
    tags: ['clown', 'portrait', 'cheerful', 'laughing', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-church-20260324-1530.png',
    title: 'Congregation of None',
    description: 'The light still comes through the windows. It hits the same pews at the same angle every afternoon. The hymnals are still open to page 47.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'church', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-young-20260324-1530.png',
    title: 'Gap Year',
    description: 'First season on the circuit. Still believes the smile is real. It will be, eventually.',
    tags: ['clown', 'portrait', 'cheerful', 'young', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-diner-20260324-1530.png',
    title: 'Last Orders',
    description: 'The coffee went cold in 1979. The pie is still under the glass dome. The menus are still in the holders. Nobody ever came back to clear the counter.',
    tags: ['abandoned', 'liminal-space', '70s', 'film-grain', 'diner', 'nostalgia', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-vintage-20260324-1530.png',
    title: 'Opening Night, 1954',
    description: 'The circus came to town and she was the headline act. She is still smiling about it.',
    tags: ['clown', 'portrait', 'cheerful', 'vintage', '1950s', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-pool-20260324-1530.png',
    title: 'The Deep End',
    description: 'The diving board is still regulation height. The pool has been dry since 1981. The echo when you stand in it is perfect.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'pool', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-bigsmile-20260324-1530.png',
    title: 'Maximum Joy',
    description: 'Scientists have measured it. It is, technically, the widest documented human smile. He is very proud of this.',
    tags: ['clown', 'portrait', 'cheerful', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-bowling-20260324-1530.png',
    title: 'Lane 7',
    description: 'The pins are still set. The ball is in the return. The score sheet shows a perfect game up to frame nine, then nothing.',
    tags: ['abandoned', 'liminal-space', '70s', 'film-grain', 'bowling', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-clown-happy-mime-20260324-1530.png',
    title: 'Breaking Silence',
    description: 'He has not spoken in twenty-two years. The smile, however, he allows himself.',
    tags: ['clown', 'portrait', 'mime', 'cheerful', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-farmhouse-20260324-1530.png',
    title: 'Sunday Dinner',
    description: 'Four plates. Four chairs. The wallpaper is still the same pattern it always was. Nobody touched the food. Nobody came back.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'farmhouse', 'rural', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-roller-rink-20260324-1530.png',
    title: 'Saturday Night',
    description: 'The disco ball fell in 1983. Nobody cleaned it up. The skates on the wall still have the rental numbers on them. Size 7 is missing.',
    tags: ['abandoned', 'liminal-space', '70s', 'film-grain', 'roller-rink', 'nostalgia', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-abandoned-70s-funeral-home-20260324-1530.png',
    title: 'Arrangements',
    description: 'The guest book is open. The last entry is dated April 3rd, 1977. The flowers have been desiccated for decades. The caskets are still on display, as they always were.',
    tags: ['abandoned', 'liminal-space', 'horror', '70s', 'film-grain', 'funeral', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-trippy-mushroom-field-20260324-0025.png',
    title: 'Spore Season',
    description: 'She found the clearing by accident. The mushrooms were taller than houses. The spores tasted like forgetting. She stopped wanting to leave.',
    tags: ['surreal', 'psychedelic', 'nature', 'dreamscape', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-trippy-women-in-glass-20260324-0025.png',
    title: 'The Collection',
    description: 'Each one was frozen at the moment she chose wrong. She walks past them every day. She is the only one still moving. She wonders how long that will last.',
    tags: ['surreal', 'horror', 'dreamscape', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-the-collection-unbound-20260416-2015.mp4',
    title: 'The Collection, Unbound',
    description: 'One of the women in glass finally slips free of the still frame and walks the hall like she was always meant to be the only moving part. A cursed fashion procession through gold, mirrors, and quiet bad decisions.',
    tags: ['surreal', 'fashion', 'mirror', 'dreamscape', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-trippy-exploding-petals-20260324-0025.png',
    title: 'Everything at Once',
    description: 'The petals are memories. The light is what remains when the memories run out. Her face at the center is the only part that hasn\'t been given away yet.',
    tags: ['surreal', 'psychedelic', 'hallucination', 'dreamscape', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-trippy-infinite-library-20260325-0307.png',
    title: 'The Archive',
    description: 'Every book is a life she could have lived. The pages turn on their own. She has been reading for years. She has not found the one she is living yet.',
    tags: ['surreal', 'dreamscape', 'library', 'psychedelic', 'dark', 'bender', 'mold-cli'],
    model: 'iNiverse Mix FP8',
  },
  {
    src: '/gallery/bender-ltx23-the-archive-breathes-20260416-2053.mp4',
    title: 'The Archive Breathes',
    description: 'The stacks inhale. Ladders drift. Pages turn before anyone touches them. She keeps moving deeper into the shelves like the whole library has decided it wants to be read back.',
    tags: ['surreal', 'dreamscape', 'library', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-trippy-moss-skin-20260325-0307.png',
    title: 'Second Growth',
    description: 'The moss came first to the places she stopped feeling. Then the flowers. She is not worried. She is becoming something with better roots.',
    tags: ['surreal', 'dreamscape', 'nature', 'psychedelic', 'bioluminescent', 'bender', 'mold-cli'],
    model: 'iNiverse Mix FP8',
  },
  {
    src: '/gallery/bender-flux-echo-shockwave-20260324-1659.png',
    title: 'Aftermath',
    description: 'Nine versions of her, all still reverberating from the same moment. Each one a different way she almost didn\'t survive it.',
    tags: ['surreal', 'hallucination', 'echo', 'horror', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-aftermath-reverberation-20260416-2123.mp4',
    title: 'Aftermath Reverberation',
    description: 'The impact never finished happening. Echo-selves peel away from her in dark concentric waves, each one lagging behind the same disaster by a fraction of a heartbeat.',
    tags: ['surreal', 'hallucination', 'echo', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-echo-spinning-20260324-1659.png',
    title: 'Identity in Motion',
    description: 'She spun. Each rotation left behind a version of someone she used to be. The center is the only part that is still her. For now.',
    tags: ['surreal', 'hallucination', 'echo', 'motion', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-identity-in-motion-unspooling-20260417-0109.mp4',
    title: 'Identity in Motion, Unspooling',
    description: 'Afterimage selves peel off each turn in slow elegant rotation. She keeps spinning at the center while her previous versions unspool into the dark and move for a moment on their own.',
    tags: ['surreal', 'hallucination', 'echo', 'motion', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-folding-space-20260324-1640.png',
    title: 'Wrong Direction',
    description: 'She saw herself ahead. She stopped walking. The version ahead did not.',
    tags: ['surreal', 'hallucination', 'non-euclidean', 'horror', 'liminal-space', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-the-reflection-arrives-first-20260416-2306.mp4',
    title: 'The Reflection Arrives First',
    description: 'She hesitates. Her mirror self does not. It glides through the impossible corridor a beat too early, like the hallway decided which version of her gets to move first.',
    tags: ['surreal', 'hallucination', 'non-euclidean', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-mirror-eyes-20260324-1640.png',
    title: 'Everything She Didn\'t Choose',
    description: 'Each eye holds a different life. The one on the left: she stayed. The one on the right: she left. Neither one is the one she is living.',
    tags: ['surreal', 'hallucination', 'mirror', 'horror', 'portrait', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-faces-20260324-1616.png',
    title: 'The Room That Knows You',
    description: 'Every surface is her. The ones that are screaming remember something she has tried to forget. The ones that are sleeping have given up.',
    tags: ['surreal', 'mirror', 'hallucination', 'horror', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-the-room-wakes-first-20260416-2239.mp4',
    title: 'The Room Wakes First',
    description: 'The sleeping faces open their eyes one by one before she even realizes she is being watched. The walls breathe, the mirrors listen, and the whole room wakes up faster than she does.',
    tags: ['surreal', 'mirror', 'hallucination', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-hands-20260324-1616.png',
    title: 'Reach',
    description: 'Some of the hands are hers. She has stopped trying to tell which ones. The corridor has no end. She walks anyway.',
    tags: ['surreal', 'mirror', 'hallucination', 'horror', 'liminal-space', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-reach-anyway-20260417-0059.mp4',
    title: 'Reach, Anyway',
    description: 'The hallway fills with slow grasping motion and impossible arm lengths while she advances anyway. Fingertips drag across the walls, the corridor breathes, and the whole place keeps reaching back.',
    tags: ['surreal', 'mirror', 'hallucination', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-floor-20260324-1616.png',
    title: 'The One Below',
    description: 'She closed her eyes. Her reflection did not.',
    tags: ['surreal', 'mirror', 'hallucination', 'horror', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-escher-20260324-1616.png',
    title: 'No Down',
    description: 'She has been climbing for an hour. She has also been descending. Both are correct. Neither is progress.',
    tags: ['surreal', 'escher', 'hallucination', 'horror', 'liminal-space', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-ltx23-no-down-still-climbing-20260416-2151.mp4',
    title: 'No Down, Still Climbing',
    description: 'The stairwell finally starts moving too. Gravity gives up, mirrors tilt the rules, and she keeps climbing through a place that cannot decide whether it is swallowing her or letting her out.',
    tags: ['surreal', 'escher', 'hallucination', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-flux-mirror-hellscape-ballroom-20260324-1604.png',
    title: 'All of Her at Once',
    description: 'Every version she has ever been, reflected simultaneously. The ones with their eyes closed are the ones she forgot.',
    tags: ['surreal', 'mirror', 'hallucination', 'liminal-space', 'horror', 'fashion', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-cryptid-mugshot-grey-alien-20260324-1550.png',
    title: 'Booked',
    description: 'Charges: trespassing, unauthorized aerial vehicle operation, cattle-related incidents (12 counts). He said nothing during processing. He has said nothing since. He does not seem concerned.',
    tags: ['alien', 'mugshot', 'cryptid', 'humor', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-zombie-bird-crow-20260324-1428.png',
    title: 'Still Watching',
    description: 'It has been on that gravestone since before you were born. The flesh is mostly gone now. The eyes are not.',
    tags: ['horror', 'undead', 'zombie', 'bird', 'crow', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-zombie-bird-raven-20260324-1428.png',
    title: 'Nevermore (Decomposed)',
    description: 'It spoke one word, once. The word was not "nevermore." Nobody remembers what it was. The beak is mostly gone now anyway.',
    tags: ['horror', 'undead', 'zombie', 'bird', 'raven', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-zombie-bird-vulture-20260324-1428.png',
    title: 'The Patience of Rot',
    description: 'It used to wait for things to die. Now it does not have to wait. Now it simply arrives.',
    tags: ['horror', 'undead', 'zombie', 'bird', 'vulture', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-zombie-bird-owl-20260324-1428.png',
    title: 'Hoo',
    description: 'The maggots in the chest cavity are bioluminescent. Nobody knows why. The single remaining eye watches you regardless of which direction you move.',
    tags: ['horror', 'undead', 'zombie', 'bird', 'owl', 'dark', 'bioluminescent', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-zombie-bird-flock-20260324-1428.png',
    title: 'Migration',
    description: 'They have been flying south for eleven years. They have not arrived. The sky turns red wherever they pass. Nobody looks up anymore.',
    tags: ['horror', 'undead', 'zombie', 'bird', 'flock', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-dead-mall-20260324-1204.png',
    title: 'After Hours',
    description: 'The food court closed in 2009. The lights never got the memo. Somewhere past the shuttered Sbarro, an escalator still runs — going up to a level that no longer exists.',
    tags: ['tilt-shift', 'liminal-space', 'horror', 'dead-mall', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-empty-city-20260324-1204.png',
    title: 'Infrastructure for Nobody',
    description: 'The traffic lights cycle through green, yellow, red. The crosswalk counts down. The buses run on schedule. The city is fully operational. There is no one left to use it.',
    tags: ['tilt-shift', 'liminal-space', 'city', 'empty', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-airport-20260324-1204.png',
    title: 'Gate B7',
    description: 'The departure board says the flight is on time. The gate agent is not at the desk. The last passenger disappeared somewhere between security and here. The boarding door is open.',
    tags: ['tilt-shift', 'liminal-space', 'airport', 'horror', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-suburb-20260324-1204.png',
    title: 'The Cul-de-Sac',
    description: 'Every house has lights on. Every driveway has a car. The lawns are freshly cut. The sprinklers click on at precisely 6PM. There has not been a person visible here in three days.',
    tags: ['tilt-shift', 'liminal-space', 'suburb', 'uncanny', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-amusement-park-20260324-1204.png',
    title: 'Still Running',
    description: 'The ferris wheel never stops. Not when the park closed. Not when the fences went up. Not when the fog came in and stayed. It turns for an audience of weeds.',
    tags: ['tilt-shift', 'liminal-space', 'horror', 'amusement-park', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-hotel-hallway-20260324-1204.png',
    title: 'Room 114',
    description: 'The hallway extends past the point where perspective should end. Every door is numbered. The carpet pattern repeats once every seven feet and then starts over. You have been walking for twenty minutes.',
    tags: ['tilt-shift', 'liminal-space', 'horror', 'hotel', 'backrooms', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-parking-garage-20260324-1204.png',
    title: 'Level P4',
    description: 'There are no cars on level P4. There have never been cars on level P4. The sodium lights buzz at a frequency that makes your teeth ache. The exit sign points toward a wall.',
    tags: ['tilt-shift', 'liminal-space', 'horror', 'parking-garage', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-subway-20260324-1204.png',
    title: 'Last Train',
    description: 'The doors have been open for eleven minutes. The departure board says BOARDING. The driver\'s compartment is dark. Something about the upholstery on the seats is slightly wrong.',
    tags: ['tilt-shift', 'liminal-space', 'subway', 'horror', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-highway-20260324-1204.png',
    title: 'No Traffic',
    description: 'Every lane in both directions. Miles of perfect asphalt, freshly painted lines, working streetlights. The highway was built for ten thousand cars an hour. Tonight it belongs entirely to the fog.',
    tags: ['tilt-shift', 'liminal-space', 'highway', 'empty', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-tiltshift-liminal-office-20260324-1204.png',
    title: 'The 11th Floor',
    description: 'Someone left a coffee on their desk. The screensaver is running. The motion sensors triggered the lights in three sections — but there is no one in any of them. There never is, after midnight.',
    tags: ['tilt-shift', 'liminal-space', 'office', 'horror', 'miniature', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-anglerfish-20260324-0923.png',
    title: 'The Lure',
    description: 'Six hundred meters down, something blinks. Slow. Patient. Its light is the only thing that exists in the abyss — and it knows that. The teeth are already open.',
    tags: ['deep-sea', 'horror', 'bioluminescent', 'anglerfish', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-giant-isopod-20260324-0923.png',
    title: 'Pale Sovereign',
    description: 'It does not move quickly. It does not need to. In the hadal dark, patience is the only predator that matters. Fourteen eyes, none of which close. Ever.',
    tags: ['deep-sea', 'horror', 'isopod', 'alien', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-frilled-shark-20260324-0923.png',
    title: 'Living Fossil',
    description: 'Its lineage predates the dinosaurs by a hundred million years. Evolution looked at it and decided: perfect. Do not change a single tooth.',
    tags: ['deep-sea', 'horror', 'shark', 'prehistoric', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-barreleye-20260324-0923.png',
    title: 'All-Seeing',
    description: 'The dome is transparent. The eyes rotate inside it — upward, always upward — watching for shadows falling from the world above. It has been watching longer than you have existed.',
    tags: ['deep-sea', 'horror', 'barreleye', 'alien', 'bioluminescent', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-vampire-squid-20260324-0923.png',
    title: 'Infernal Cloak',
    description: 'It is not a squid. It is not an octopus. It is something older than both — a relict from before the ocean had names. It turns itself inside out when it wants to disappear, and the darkness swallows it completely.',
    tags: ['deep-sea', 'horror', 'vampire-squid', 'cephalopod', 'bioluminescent', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-goblin-shark-20260324-0923.png',
    title: 'The Protrusion',
    description: 'The jaw extends further than jaws are supposed to extend. It snaps forward, independent of the skull, and retracts before you have time to process what you saw. You are already inside it.',
    tags: ['deep-sea', 'horror', 'shark', 'goblin-shark', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-dragonfish-20260324-0923.png',
    title: 'Black Mirror',
    description: 'Its scales absorb 99.9% of all light. In the deep ocean, it is not merely dark — it is absent. The only evidence of its existence is the cold glow of its photophores, and then the sudden end of other things.',
    tags: ['deep-sea', 'horror', 'dragonfish', 'bioluminescent', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-fangtooth-20260324-0923.png',
    title: 'Disproportionate',
    description: 'The teeth are so large the mouth cannot fully close. They slide into grooves along the side of the skull instead. This is not a design flaw. This is the ocean deciding what terror should look like.',
    tags: ['deep-sea', 'horror', 'fangtooth', 'dark', 'macro', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-siphonophore-20260324-0923.png',
    title: 'Colony',
    description: 'It is not one creature. It is hundreds — each one specialized, none capable of surviving alone. Together they form something forty meters long that drifts through the dark like a cathedral made of glass and hunger.',
    tags: ['deep-sea', 'horror', 'siphonophore', 'bioluminescent', 'colonial', 'dark', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/bender-flux-deepsea-ghost-shark-20260324-0923.png',
    title: 'Chimera',
    description: 'Half shark, half something else entirely. The rostrum extends like a blade, sensing electromagnetic fields in the absolute dark. It has been down here since before the continents finished moving.',
    tags: ['deep-sea', 'horror', 'chimaera', 'ghost-shark', 'dark', 'prehistoric', 'bender', 'mold-cli'],
    model: 'Flux Dev 1.0',
  },
  {
    src: '/gallery/halcyon-zturbo-late-night-grocery-20260217-1949.png',
    title: 'Aisle Seven, 3AM',
    description: 'Fluorescent mint-green light hums over empty aisles. Every product on the shelves is smooth, featureless, baby blue — no labels, no text. At the end of aisle seven, a shopping cart rolls slowly by itself. The exit signs glow lavender. Nothing here has a name.',
    tags: ['dark-pastel', 'liminal-space', 'horror', 'backrooms', 'grocery', 'z-image-turbo', 'halcyon'],
    model: 'Z-Image Turbo',
  },
  {
    src: '/gallery/halcyon-zturbo-infinite-hotel-lobby-20260217-1949.png',
    title: 'The Grand Meridian',
    description: 'Bubblegum carpet stretches to a vanishing point, its repeating stain patterns shaped like screaming faces. Framed portraits of the same child at different ages line the walls — all of them turning slightly toward you. The elevator is open. Inside: pure white.',
    tags: ['dark-pastel', 'horror', 'liminal-space', 'hotel', 'backrooms', 'z-image-turbo', 'halcyon'],
    model: 'Z-Image Turbo',
  },
  {
    src: '/gallery/halcyon-zturbo-aquarium-after-hours-20260217-1949.png',
    title: 'After Closing',
    description: 'The tanks glow mint and baby blue. Coral formations end in human fingers, reaching. The fish have blank porcelain doll eyes. And there — pressed against the glass from the inside — a figure in a dusty rose diving suit, smiling gently, waving.',
    tags: ['dark-pastel', 'horror', 'aquarium', 'deep-sea', 'uncanny', 'z-image-turbo', 'halcyon'],
    model: 'Z-Image Turbo',
  },
  {
    src: '/gallery/halcyon-zturbo-cornfield-congregation-20260217-1949.png',
    title: 'The Congregation',
    description: 'Lavender cornstalks stretch to infinity under a mint sky. Between every row: a silhouette, standing at the wrong angle, perfectly still. The scarecrow at the center has a human face, eyes closed, smiling serenely. The baby pink horizon suggests morning will come. Eventually.',
    tags: ['dark-pastel', 'folk-horror', 'cornfield', 'liminal', 'pastoral', 'z-image-turbo', 'halcyon'],
    model: 'Z-Image Turbo',
  },
  {
    src: '/gallery/halcyon-zturbo-birthday-siege-20260217-1949.png',
    title: 'The Party',
    description: 'A tiered pink cake melts slowly onto a void floor. Cotton candy streamers spin in air that isn\'t moving. One balloon — lavender, translucent — has a face pressing against the inside. The porcelain cups are full. The chairs are pushed back. The guests left mid-sentence.',
    tags: ['dark-pastel', 'horror', 'birthday', 'uncanny-valley', 'party', 'z-image-turbo', 'halcyon'],
    model: 'Z-Image Turbo',
  },
  {
    src: '/gallery/bender-flux-tilt-shift-apocalypse-20260209-0600.png',
    title: 'Toy Town Rapture',
    description: 'Urban destruction rendered as delicate diorama — highways twist like broken toy tracks, buildings glow with miniature fires, smoke towers bloom in soft-focus perfection. The tilt-shift lens compresses catastrophe into dollhouse scale, making Armageddon look almost beautiful. A city dies in perfect depth of field.',
    tags: ['tilt-shift', 'miniature', 'apocalypse', 'city', 'fire', 'diorama', 'horror', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-void-elevator-20260209-0300.png',
    title: 'The Last Elevator Down',
    description: 'Brutalist elevator shaft descending into infinite darkness — industrial concrete walls lined with dim emergency lights that flicker and die one by one. The perspective pulls you down into the void, past floors that no longer exist, toward a bottom that was never built. An architectural throat swallowing all who enter. The descent has no end, only deeper shades of black.',
    tags: ['cosmic-horror', 'elevator', 'void', 'brutalist', 'liminal', 'industrial', 'darkness', 'infinite', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-asylum-20260209-0000.png',
    title: 'The Miniature Madhouse',
    description: 'Victorian asylum architecture shrinks to diorama scale through tilt-shift sorcery — Gothic spires and barred windows become dollhouse details, fog curls through tiny courtyards where madness once walked. The depth of field blurs reality into toy-like unreality, but the haunting remains at full scale. A monument to suffering rendered as a child\'s nightmare playset.',
    tags: ['tilt-shift', 'miniature', 'asylum', 'victorian', 'horror', 'gothic', 'diorama', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-cult-20260208-2100.png',
    title: 'The Congregation at Doll\'s End',
    description: 'Miniature forest clearing where toy-scale hooded figures circle a bonfire crackling in dollhouse dimensions. Tilt-shift transforms ritual into diorama — fog rolls through like cotton batting, shadows dance across tiny faces, and the summoning circle shrinks to model-train scale. But the gods looking down see no difference in devotion.',
    tags: ['tilt-shift', 'miniature', 'cult', 'ritual', 'forest', 'horror', 'cosmic', 'diorama', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-asylum-20260208-1800.png',
    title: 'Where Madness Dreams in Miniature',
    description: 'A Victorian asylum rendered as a haunting tilt-shift diorama — Gothic iron gates and barred windows shrink to dollhouse scale, fog rolling through tiny courtyards where the mad once wandered. The architecture of suffering becomes a toy, but the horror persists in miniature.',
    tags: ['tilt-shift', 'miniature', 'asylum', 'victorian', 'horror', 'gothic', 'diorama', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-neon-catacombs-20260208-1500.png',
    title: 'Where the Dead Glow',
    description: 'Ancient catacombs illuminated by flickering neon tubes — cyan and magenta light bleeds across skull-lined walls while fog rolls through wet stone corridors. Modern electricity invades sacred burial grounds, turning death architecture into a cyberpunk ossuary. The afterlife glows in 60Hz.',
    tags: ['catacombs', 'neon', 'horror', 'cyberpunk', 'skulls', 'dark-ambient', 'liminal', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-apocalypse-20260208-1200.png',
    title: 'Toy Town Firestorm',
    description:
      'A city reduced to model scale while the horizon burns: highways like plastic ribbons, tiny windows glowing, smoke billowing in soft-focus towers. Tilt-shift makes it look like a tabletop diorama — until you realize the fire is real.',
    tags: ['tilt-shift', 'miniature', 'city', 'fire', 'smoke', 'disaster', 'diorama', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-cult-20260208-0905.png',
    title: 'When Gods Look Down',
    description: 'A forest clearing becomes a toy-scale altar: hooded figures in perfect circle, bonfire crackling in miniature, fog rolling through like cotton batting. The tilt-shift lens transforms ritual into diorama — but the summoning feels no less real.',
    tags: ['tilt-shift', 'miniature', 'cult', 'ritual', 'forest', 'horror', 'cosmic', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-cult-20260208-0600.png',
    title: 'Tiny Gods, Tiny Flames',
    description: 'A miniature cult gathering in the forest rendered as tilt-shift diorama — hooded figures circle a bonfire like toys arranged by unseen hands, the ritual reduced to dollhouse scale but no less ominous.',
    tags: ['tilt-shift', 'miniature', 'cult', 'ritual', 'forest', 'horror', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/bender-flux-tilt-shift-asylum-20260208-0300.png',
    title: 'Dollhouse of the Damned',
    description: 'Victorian asylum rendered as a tilt-shift diorama — miniature nightmare architecture, Gothic windows like dead eyes, a tiny monument to suffering.',
    tags: ['tilt-shift', 'miniature', 'asylum', 'victorian', 'horror', 'gothic', 'ai-art'],
    model: 'FLUX Dev 1.0',
  },

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
    src: '/gallery/landscape-scene-03066-20260208-0652.png',
    title: 'Landscape Scene',
    description: '',
    tags: ['ai-art', 'landscape'],
    model: 'FLUX Dev 1.0',
  },

  {
    src: '/gallery/hal9000-flux-space-lobster-20260208-1006.png',
    title: 'Space Lobster (HAL Test Shot)',
    description:
      'A cinematic “space lobster” portrait: red-eye glow, cold rim light, and the kind of detail you only notice after you stare too long.',
    tags: ['hal9000', 'space', 'cosmic', 'red-eye', 'ai-art'],
    model: 'Flux Dev 1.0',
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
    src: '/gallery/calculon-flux-liminal-labyrinth-20260208-1033.png',
    title: 'Limbo Neon Labyrinth',
    description: 'Tilt-shift miniature corridor drenched in neon, fog curling through wet tiles, malfunctioning arcade cabinets pulse with ember light as a drifting haze swallows the path.',
    tags: ['tilt-shift', 'miniature', 'liminal', 'neon', 'arcade', 'fog', 'dark-ambient', 'ai-art'],
    model: 'SDXL Turbo',
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
  {
    src: '/gallery/bender-ltx23-motel-window-20260416-1255.mp4',
    title: 'Vacancy',
    description:
      'Rain beads on neon glass while something on the other side keeps shifting just out of human proportions. The sign still says VACANCY. That feels less like an invitation and more like a warning.',
    tags: ['horror', 'motel', 'window', 'rain', 'night', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-attic-crawler-20260416-1259.mp4',
    title: 'Above the Ceiling',
    description:
      'The attic hatch opens a few inches and stops. Then the scratching starts again. Whatever lives up there has learned patience.',
    tags: ['horror', 'attic', 'crawler', 'creature', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-church-pews-20260416-1305.mp4',
    title: 'Last Service',
    description:
      'The pews are empty, but the room still behaves like it is being watched. Dust hangs in the projector light like suspended ash. Something kneels where the congregation used to be.',
    tags: ['horror', 'church', 'pews', 'ritual', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-tiltshift-graveyard-20260416-1316.mp4',
    title: 'Tiny Graves',
    description:
      'A miniature cemetery under impossible fog, like a dollhouse built for mourning. The scale makes it worse. It means someone made this on purpose.',
    tags: ['tilt-shift', 'graveyard', 'miniature', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-black-forest-road-20260416-1324.mp4',
    title: 'Don’t Stop on This Road',
    description:
      'Headlights cut a tunnel through the trees, but the darkness beyond them keeps moving first. If the road is endless, that is because it does not want to let you out.',
    tags: ['forest', 'road', 'night', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-alley-mouth-20260416-1332.mp4',
    title: 'The Alley Learns to Feed',
    description:
      'Brick, steam, garbage bags, and then a shape forming where no shape belongs. By the time you recognize it as a mouth, it already recognizes you as food.',
    tags: ['alley', 'urban', 'body-horror', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-clown-midway-20260416-1518.mp4',
    title: 'Midway Stalker',
    description:
      'Broken bulbs flicker across wet carnival asphalt while the clown moves like it is remembering how joints are supposed to work. The smile never slips. It never has to.',
    tags: ['clown', 'carnival', 'midway', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-clown-sewer-20260416-1523.mp4',
    title: 'Drain Thing',
    description:
      'Flashlight jitter, concrete slime, black water, and a painted face waiting below street level like a municipal secret. The city keeps burying its mistakes. Some of them climb back up.',
    tags: ['clown', 'sewer', 'found-footage', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-clown-birthday-20260416-1528.mp4',
    title: 'Party Favor',
    description:
      'Deflated balloons sag from the ceiling while candle smoke drifts over a ruined cake. Then the clown rises behind the table like the punchline to a joke nobody survives.',
    tags: ['clown', 'birthday-party', 'house', 'horror', 'dark', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  // NOTE: removed /gallery/hal9000-flux-tilt-shift-asylum-20260208-1921.png
  // because it is byte-identical (sha256) to /gallery/bender-flux-tilt-shift-asylum-20260208-1800.png.

  {
    src: '/gallery/bender-ltx23-mirror-latent-bride-20260416-1610.mp4',
    title: 'Mirror Bride',
    description:
      'A silver-drenched woman glides through a corridor of impossible mirrors where each reflection arrives a heartbeat late, like the space is still deciding which version of her is real.',
    tags: ['woman', 'mirror', 'latent-space', 'fashion-horror', 'beautiful', 'surreal', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-stairwell-siren-20260416-1619.mp4',
    title: 'Stairwell Siren',
    description:
      'She descends an endless black stairwell while the mirrors on the walls keep showing other lives, other moods, other mouths. Beautiful. Wrong. Still coming closer.',
    tags: ['woman', 'stairs', 'mirror', 'latent-space', 'gothic', 'beautiful', 'surreal', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-velvet-escher-mirror-20260416-1627.mp4',
    title: 'Velvet Escher Mirror',
    description:
      'A woman in red velvet crosses a palace of folding mirrors and floating stairs, every reflection more confident and less human than the last.',
    tags: ['woman', 'mirror', 'stairs', 'velvet', 'latent-space', 'beautiful', 'surreal', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-latent-orchid-catwalk-20260416-1715.mp4',
    title: 'Latent Orchid Catwalk',
    description:
      'An orchid-black gown, a reflective runway, and a hall of recursive mirrors bending around her like the architecture is trying to worship and consume her at the same time.',
    tags: ['woman', 'catwalk', 'mirror', 'latent-space', 'fashion', 'beautiful', 'surreal', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-mirrorwell-ascension-20260416-1724.mp4',
    title: 'Mirrorwell Ascension',
    description:
      'She climbs a spiral of floating stairs through liquid mirrors and impossible light, each reflection turning into a stranger that still somehow knows her face.',
    tags: ['woman', 'stairs', 'mirror', 'latent-space', 'ascension', 'beautiful', 'surreal', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
  {
    src: '/gallery/bender-ltx23-crimson-echo-chamber-20260416-1735.mp4',
    title: 'Crimson Echo Chamber',
    description:
      'A crimson dress drifts through candlelit arches, mirrored voids, and staircases that double back into nowhere. Romantic, gorgeous, and absolutely cursed.',
    tags: ['woman', 'crimson', 'mirror', 'stairs', 'latent-space', 'beautiful', 'romantic-horror', 'video', 'bender', 'mold-cli', 'ltx-2.3'],
    model: 'LTX-2.3 22B Distilled FP8',
  },
];

export const galleryMetaBySrc = new Map(galleryMeta.map((m) => [m.src, m]));
