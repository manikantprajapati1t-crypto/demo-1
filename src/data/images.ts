/**
 * Central image library. Every photograph is referenced by a base URL.
 * Swap any value for a client's own photography (any https URL or a local
 * /public path). Pexels URLs are automatically resized by <SmartImage />.
 */
const pex = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export const IMG = {
  hero: pex(36779010), // potter crafting earthenware, India
  heritage: pex(30969805), // elder artisan at an outdoor wheel

  // Category covers
  catPottery: pex(5789179),
  catWood: pex(37870822),
  catBrass: pex(29034794),
  catTextiles: pex(8207644),
  catJewellery: pex(35059564),
  catPaintings: pex(22820070),

  // Products
  bundiUrn: pex(28264830),
  karaikudiPots: pex(11352716),
  ganesha: pex(15285440),
  deitySculpture: pex(30996822),
  brassLamp: pex(34056592),
  handloomThrow: pex(4219611),
  kundanSet: pex(33154729),
  pattachitra: pex(10653309),
  brassBells: pex(20083403),
  bangles: pex(9808451),
  woodBlock: pex(28389703),
  brassDiyas: pex(6315702),

  // Artisans & process
  workshop: pex(31508150), // artisan crafting pottery, Jodhpur
  workshopSmall: pex(3145866), // person moulding a clay pot
  potterHands: pex(16098931),
  woodCarver: pex(19823776),
  weaver: pex(8207644),
  painter: pex(37054376),
  clayHands: pex(36774467),
  terracottaStack: pex(10066332),

  // Community
  insta: [
    pex(5789179),
    pex(6315702),
    pex(5409535),
    pex(31471596),
    pex(35532305),
    pex(37870822),
    pex(3794748),
    pex(32277958),
  ],
} as const;
