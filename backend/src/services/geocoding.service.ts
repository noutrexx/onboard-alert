const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  adana: { lat: 37.0000, lng: 35.3213 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  antalya: { lat: 36.8969, lng: 30.7133 },
  bursa: { lat: 40.1885, lng: 29.0610 },
  gaziantep: { lat: 37.0662, lng: 37.3833 },
  istanbul: { lat: 41.0082, lng: 28.9784 },
  izmir: { lat: 38.4237, lng: 27.1428 },
  konya: { lat: 37.8746, lng: 32.4932 },
  trabzon: { lat: 41.0027, lng: 39.7168 },
}

export interface GeocodeResult {
  lat: number
  lng: number
  matchedText: string
}

export async function geocodeLocationText(locationText: string): Promise<GeocodeResult | null> {
  const normalizedLocation = locationText
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const match = Object.entries(cityCoordinates).find(([city]) =>
    normalizedLocation.includes(city),
  )

  if (!match) return null

  const [matchedText, coordinates] = match
  return { ...coordinates, matchedText }
}
