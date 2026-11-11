import IntlPage, { intlMetadata } from '@/components/intl/IntlPage'
import { intlPages } from '@/lib/intl/pages'

export const metadata = intlMetadata(intlPages.esLanding)

export default function Page() {
  return <IntlPage content={intlPages.esLanding} />
}
