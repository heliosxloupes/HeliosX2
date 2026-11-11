import IntlPage, { intlMetadata } from '@/components/intl/IntlPage'
import { intlPages } from '@/lib/intl/pages'

export const metadata = intlMetadata(intlPages.esDental)

export default function Page() {
  return <IntlPage content={intlPages.esDental} />
}
