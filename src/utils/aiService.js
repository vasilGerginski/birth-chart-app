const interpretations = {
  sunSigns: {
    Aries: "bold and pioneering spirit, natural leadership abilities, and passionate approach to life",
    Taurus: "grounded nature, appreciation for beauty and comfort, and steadfast determination",
    Gemini: "quick wit, versatile mind, and exceptional communication skills",
    Cancer: "deep emotional intelligence, nurturing nature, and strong intuitive abilities",
    Leo: "creative expression, natural charisma, and generous heart",
    Virgo: "analytical mind, attention to detail, and desire to serve others",
    Libra: "diplomatic nature, aesthetic sensibility, and quest for balance",
    Scorpio: "intense emotional depth, transformative power, and magnetic presence",
    Sagittarius: "adventurous spirit, philosophical mind, and optimistic outlook",
    Capricorn: "ambitious nature, practical wisdom, and strong sense of responsibility",
    Aquarius: "innovative thinking, humanitarian ideals, and unique perspective",
    Pisces: "compassionate nature, artistic soul, and deep spiritual connection"
  },
  elements: {
    Fire: "passion, creativity, and dynamic energy",
    Earth: "stability, practicality, and material wisdom",
    Air: "intellectual curiosity, communication, and social connection",
    Water: "emotional depth, intuition, and psychic sensitivity"
  },
  aspects: [
    "Your journey reveals a profound connection between your inner world and outer expression.",
    "The cosmic energies suggest a time of significant personal transformation ahead.",
    "Your chart indicates exceptional potential for spiritual growth and self-discovery.",
    "The planetary alignments reveal hidden talents waiting to be awakened.",
    "Your unique cosmic blueprint shows a soul destined for meaningful connections."
  ]
}

export async function getAIInterpretation(chartData) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const sunSignDesc = interpretations.sunSigns[chartData.sunSign.name]
  const moonSignDesc = interpretations.sunSigns[chartData.moonSign.name]
  const ascendantDesc = interpretations.sunSigns[chartData.ascendant.name]
  
  const dominantElement = Object.entries(chartData.elements)
    .sort(([,a], [,b]) => b - a)[0][0]
  const elementDesc = interpretations.elements[dominantElement.charAt(0).toUpperCase() + dominantElement.slice(1)]
  
  const randomAspect = interpretations.aspects[Math.floor(Math.random() * interpretations.aspects.length)]
  
  const interpretation = `
    Dear ${chartData.name}, your cosmic blueprint reveals a fascinating celestial story...

    ✨ Your Sun in ${chartData.sunSign.name} ${chartData.sunSign.symbol} illuminates your ${sunSignDesc}. This placement forms the core of your identity and drives your fundamental life purpose.

    🌙 With your Moon in ${chartData.moonSign.name} ${chartData.moonSign.symbol}, your emotional landscape is colored by ${moonSignDesc}. This lunar placement reveals how you process feelings and connect with your inner self.

    ⬆️ Your ${chartData.ascendant.name} ${chartData.ascendant.symbol} Ascendant creates a first impression of ${ascendantDesc}. This is the mask you wear and how others initially perceive your energy.

    🌟 With a dominant ${dominantElement} element in your chart, you embody ${elementDesc}. This elemental balance shapes your approach to life's challenges and opportunities.

    ${randomAspect}

    🔮 Key Planetary Influences:
    ${Object.values(chartData.planetaryPositions).slice(0, 5).map(planet => 
      `${planet.symbol} ${planet.name} in ${planet.sign.name}: ${planet.meaning}`
    ).join('\n    ')}

    Your birth chart is a unique cosmic fingerprint, revealing the potential written in the stars at the moment of your birth. Remember, while the stars incline, they do not compel - you are the author of your own destiny.
  `
  
  return interpretation
}