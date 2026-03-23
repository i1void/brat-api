export const texts = [
  '360', 'club classics', 'sympathy is a knife',
  'i might say something stupid', 'talk talk', 'von dutch',
  'everything is romantic', 'rewind', 'so i', 'girl, so confusing',
  'apple', 'b2b', 'mean girls', 'i think about it all the time',
  '365', 'hello goodbye', 'guess', 'spring breakers',
  'the girl, so confusing version with lorde',
  'the 360 remix with robyn and yung lean',
  'the von dutch remix with skream and benga',
  'the von dutch remix with addison rae and a.g. cook',
];

export function randomText() {
  return texts[Math.floor(Math.random() * texts.length)];
}
