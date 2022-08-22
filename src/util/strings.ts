export const hashCode = (str: string): number => {
  let hash: number = 0
  for (let i = 0; i < str.length; i++) {
    const character = str.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
