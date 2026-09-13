// Notify Bing (and other IndexNow engines) that pages changed, so they recrawl now
// instead of whenever they next get round to it. Google does not use IndexNow.
//
//   node scripts/indexnow.mjs                 -> submits every URL in the live sitemap
//   node scripts/indexnow.mjs /best-loupes    -> submits just the given paths
//
// The key is public by design: it must be served at /<key>.txt (see public/) so the
// search engine can confirm the request comes from the site owner.
const HOST = 'heliosxvision.com'
const KEY = 'c91571f27ff8f5b39a95694d0a12823e'

const paths = process.argv.slice(2)
let urlList
if (paths.length) {
  urlList = paths.map((p) => new URL(p, `https://${HOST}`).href)
} else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
  urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())
}
if (!urlList.length) throw new Error('No URLs to submit')

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
// 200 = accepted, 202 = accepted pending key check; anything else is a failure.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`)
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text())
  process.exit(1)
}
