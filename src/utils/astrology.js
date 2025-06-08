const zodiacSigns = [
  { name: 'Aries', symbol: '♈', start: '03-21', end: '04-19', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', start: '04-20', end: '05-20', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', start: '05-21', end: '06-20', element: 'Air' },
  { name: 'Cancer', symbol: '♋', start: '06-21', end: '07-22', element: 'Water' },
  { name: 'Leo', symbol: '♌', start: '07-23', end: '08-22', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', start: '08-23', end: '09-22', element: 'Earth' },
  { name: 'Libra', symbol: '♎', start: '09-23', end: '10-22', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', start: '10-23', end: '11-21', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', start: '11-22', end: '12-21', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', start: '12-22', end: '01-19', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', start: '01-20', end: '02-18', element: 'Air' },
  { name: 'Pisces', symbol: '♓', start: '02-19', end: '03-20', element: 'Water' }
]

const planets = [
  { name: 'Sun', symbol: '☉', meaning: 'Core identity, ego, vitality' },
  { name: 'Moon', symbol: '☽', meaning: 'Emotions, instincts, subconscious' },
  { name: 'Mercury', symbol: '☿', meaning: 'Communication, intellect, reasoning' },
  { name: 'Venus', symbol: '♀', meaning: 'Love, beauty, harmony' },
  { name: 'Mars', symbol: '♂', meaning: 'Action, energy, passion' },
  { name: 'Jupiter', symbol: '♃', meaning: 'Growth, expansion, wisdom' },
  { name: 'Saturn', symbol: '♄', meaning: 'Discipline, responsibility, limitations' },
  { name: 'Uranus', symbol: '♅', meaning: 'Innovation, rebellion, change' },
  { name: 'Neptune', symbol: '♆', meaning: 'Dreams, intuition, spirituality' },
  { name: 'Pluto', symbol: '♇', meaning: 'Transformation, power, rebirth' }
]

const houses = [
  'Self & Identity',
  'Values & Possessions',
  'Communication & Siblings',
  'Home & Family',
  'Creativity & Romance',
  'Health & Service',
  'Partnerships',
  'Transformation & Shared Resources',
  'Philosophy & Travel',
  'Career & Public Image',
  'Friendships & Ideals',
  'Spirituality & Hidden Things'
]

function getZodiacSign(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start.split('-').map(Number)
    const [endMonth, endDay] = sign.end.split('-').map(Number)
    
    if (sign.name === 'Capricorn') {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return sign
      }
    } else if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (month > startMonth && month < endMonth)
    ) {
      return sign
    }
  }
  
  return zodiacSigns[0]
}

function calculateAscendant(birthTime, sunSign) {
  const [hours] = birthTime.split(':').map(Number)
  const ascendantIndex = (zodiacSigns.findIndex(s => s.name === sunSign.name) + Math.floor(hours / 2)) % 12
  return zodiacSigns[ascendantIndex]
}

function calculateMoonSign(birthDate, sunSign) {
  const day = birthDate.getDate()
  const moonIndex = (zodiacSigns.findIndex(s => s.name === sunSign.name) + Math.floor(day / 2.5)) % 12
  return zodiacSigns[moonIndex]
}

function calculatePlanetaryPositions(birthDate, birthTime) {
  const positions = {}
  const date = new Date(birthDate)
  const [hours] = birthTime.split(':').map(Number)
  
  planets.forEach((planet, index) => {
    const signIndex = (date.getMonth() + index + Math.floor(hours / 3)) % 12
    const house = ((index + Math.floor(hours / 2)) % 12) + 1
    positions[planet.name] = {
      ...planet,
      sign: zodiacSigns[signIndex],
      house: house,
      degree: Math.floor(Math.random() * 30)
    }
  })
  
  return positions
}

export function calculateBirthChart(formData) {
  const birthDate = new Date(formData.birthDate)
  const sunSign = getZodiacSign(birthDate)
  const ascendant = calculateAscendant(formData.birthTime, sunSign)
  const moonSign = calculateMoonSign(birthDate, sunSign)
  const planetaryPositions = calculatePlanetaryPositions(formData.birthDate, formData.birthTime)
  
  return {
    name: formData.name,
    birthDate: formData.birthDate,
    birthTime: formData.birthTime,
    birthPlace: formData.birthPlace,
    sunSign,
    moonSign,
    ascendant,
    planetaryPositions,
    elements: {
      fire: Object.values(planetaryPositions).filter(p => p.sign.element === 'Fire').length,
      earth: Object.values(planetaryPositions).filter(p => p.sign.element === 'Earth').length,
      air: Object.values(planetaryPositions).filter(p => p.sign.element === 'Air').length,
      water: Object.values(planetaryPositions).filter(p => p.sign.element === 'Water').length
    }
  }
}