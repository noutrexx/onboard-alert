export const mapModes = [
  {
    id: 'dark',
    label: 'Dark',
    description: 'Gece haber masası görünümü',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Temiz editoryal görünüm',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: 'standard',
    label: 'OSM',
    description: 'Klasik sokak haritası',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'topo',
    label: 'Topo',
    description: 'Arazi ve şehir yoğunluğu',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  {
    id: 'satellite',
    label: 'Uydu',
    description: 'Uydu görüntüsü',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
]

export const defaultMapModeId = 'dark'

export function getMapMode(modeId) {
  return mapModes.find((mode) => mode.id === modeId) ?? mapModes[0]
}
