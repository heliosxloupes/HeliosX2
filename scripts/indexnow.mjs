// Notify Bing (and other IndexNow engines) that pages changed, so they recrawl now
// instead of whenever they next get round to it. Google does not use IndexNow.
//
//   node scripts/indexnow.mjs                 -> submits every URL in the live sitemap
//   node scripts/indexnow.mjs best-loupes     -> submits just the given pages
// (Pass page names without a leading slash: Git Bash on Windows rewrites "/best-loupes"
//  into a local file path before Node sees it.)
//
// The key is public by design: it must be served at /<key>.txt (see public/) so the
// search engine can confirm the request comes from the site owner.
const HOST = 'heliosxvision.com'
const KEY = 'c91571f27ff8f5b39a95694d0a12823e'

const paths = process.argv.slice(2)
let urlList
if (paths.length) {
  urlList = paths.map((p) => new URL(p.replace(/^\/+/, ''), `https://${HOST}/`).href)
  const foreign = urlList.filter((u) => new URL(u).host !== HOST)
  if (foreign.length) throw new Error(`Not ${HOST} URLs (shell-mangled path?): ${foreign.join(', ')}`)
} else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
  urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())
}
if (!urlList.length) throw new Error('No URLs to submit')

// No keyLocation: the key file sits at the root, where engines look by default, and
// sending keyLocation made both Bing and api.indexnow.org answer 422 ("not related to
// your verified domain") for this site. IndexNow engines share submissions with each other.
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, urlList }),
})
// 200 = accepted, 202 = accepted pending key check; anything else is a failure.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`)
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text())
  process.exit(1)
}
