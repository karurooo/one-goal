import raw from './office.json'
import { officeContentSchema } from './schema'

// A bad edit fails the build and the tests, not the live site.
export const content = officeContentSchema.parse(raw)
