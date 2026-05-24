# Google Search Console Setup

HeliosX is ready for Search Console verification, but the final verification step must be done from the Google account that owns the property.

## Recommended Property

Use a Domain property:

```txt
heliosxloupes.com
```

Domain verification is best because it covers:

- `https://heliosxloupes.com`
- `https://www.heliosxloupes.com`
- future subdomains

## Verification Options

### Option A: DNS TXT record

1. Open Google Search Console.
2. Add a Domain property for `heliosxloupes.com`.
3. Copy the TXT record Google provides.
4. Add it in the domain DNS provider.
5. Click Verify in Search Console.

### Option B: Meta tag

If using a URL-prefix property, set this environment variable in Vercel:

```txt
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<google verification token>
```

The site metadata helper will emit the Google verification meta tag automatically.

## Submit These After Verification

```txt
https://heliosxloupes.com/sitemap.xml
https://heliosxloupes.com/llms.txt
```

## First Inspection URLs

- `https://heliosxloupes.com/`
- `https://heliosxloupes.com/surgical-loupes`
- `https://heliosxloupes.com/dental-loupes`
- `https://heliosxloupes.com/prismatic-loupes`
- `https://heliosxloupes.com/ergonomic-loupes`
- `https://heliosxloupes.com/measurements`
- `https://heliosxloupes.com/heliosx-vs-lumadent`
- `https://heliosxloupes.com/heliosx-vs-orascoptic`
