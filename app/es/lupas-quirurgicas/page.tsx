import IntlPage, { intlMetadata } from '@/components/intl/IntlPage'
import { wave2Pages } from '@/lib/intl/pages-wave2'

export const metadata = intlMetadata(wave2Pages.esSurgical)

export default function Page() {
  return <IntlPage content={wave2Pages.esSurgical} />
}
