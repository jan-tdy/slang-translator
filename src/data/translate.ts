import { dictionary } from './slangDictionary'

export type Direction = 'toStandard' | 'toSlang'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildMap(direction: Direction): Map<string, string> {
  const map = new Map<string, string>()
  for (const { slang, standard } of dictionary) {
    const [from, to] = direction === 'toStandard' ? [slang, standard] : [standard, slang]
    const key = from.toLowerCase()
    if (!map.has(key)) map.set(key, to)
  }
  return map
}

const mapToStandard = buildMap('toStandard')
const mapToSlang = buildMap('toSlang')

function matchCase(source: string, replacement: string): string {
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return replacement.toUpperCase()
  }
  if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function buildRegex(map: Map<string, string>): RegExp {
  const phrases = Array.from(map.keys()).sort((a, b) => {
    const wordsDiff = b.split(' ').length - a.split(' ').length
    if (wordsDiff !== 0) return wordsDiff
    return b.length - a.length
  })
  const alternation = phrases.map((p) => escapeRegExp(p).replace(/ /g, '\\s+')).join('|')
  return new RegExp(`\\b(${alternation})\\b`, 'gi')
}

const regexToStandard = buildRegex(mapToStandard)
const regexToSlang = buildRegex(mapToSlang)

export function translate(text: string, direction: Direction): string {
  if (!text.trim()) return ''
  const map = direction === 'toStandard' ? mapToStandard : mapToSlang
  const regex = direction === 'toStandard' ? regexToStandard : regexToSlang
  return text.replace(regex, (match) => {
    const translation = map.get(match.toLowerCase().replace(/\s+/g, ' '))
    if (!translation) return match
    return matchCase(match, translation)
  })
}

export function translatedWordCount(text: string, direction: Direction): number {
  if (!text.trim()) return 0
  const map = direction === 'toStandard' ? mapToStandard : mapToSlang
  const regex = direction === 'toStandard' ? regexToStandard : regexToSlang
  const matches = text.match(regex) ?? []
  return matches.filter((m) => map.has(m.toLowerCase().replace(/\s+/g, ' '))).length
}
