export interface UnclassifiedInterpreterOpts {
  __brand: never
}

export const unclassified = (
  opts: UnclassifiedInterpreterOpts = {} as UnclassifiedInterpreterOpts
) => {
  return {
    type: 'unclassified',
  }
}
