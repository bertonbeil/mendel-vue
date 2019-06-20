export const _cloneDeep = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    return {}
  }
}

export const capitalize = (str: string) => (str.charAt(0).toUpperCase() + str.slice(1))
