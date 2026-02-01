import { bool } from './bool'
import { phoneNumber } from './phone'
import { unclassified } from './unclassified'

export { infopsy as default } from './infopsy'

export { phoneNumber } from './phone'
export { unclassified } from './unclassified'
export { bool } from './bool'

export const interpreters = {
  bool,
  phoneNumber,
  unclassified,
}
