import Product from './models/Product.js'

// WhatsApp and other link previews do not run JavaScript, so React cannot
// set these tags for them. The server writes them into index.html instead.

const SITE_NAME = 'Tribe Green'
const DEFAULT_DESCRIPTION =
  'Corporate gifts for welcome kits, festive gifting, client gifts and branded merchandise.'

const PAGES = {
  '/': { title: `Corporate Gift Catalogue | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION },
  '/enquiry': {
    title: `Send an Enquiry | ${SITE_NAME}`,
    description: 'Tell us what you need and the Tribe Green team will get back to you with a quote.',
  },
  '/thank-you': {
    title: `Thank You | ${SITE_NAME}`,
    description: 'We have received your enquiry and will be in touch soon.',
  },
  '/admin': { title: `Enquiries | ${SITE_NAME} Admin`, description: 'Tribe Green admin page.' },
  '/admin/login': { title: `Admin Login | ${SITE_NAME}`, description: 'Tribe Green admin login.' },
}

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

async function getMeta(path) {
  if (path.startsWith('/products/')) {
    const slug = path.replace('/products/', '')
    const product = await Product.findOne({ slug })
    if (product) {
      return {
        title: `${product.name} | ${SITE_NAME}`,
        description: product.description,
        image: product.image,
      }
    }
  }

  return PAGES[path] || PAGES['/']
}

// Swaps the block between the meta comments in index.html for the right tags
export async function addMetaTags(html, path, siteUrl) {
  const meta = await getMeta(path)
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const image = siteUrl + (meta.image || '/images/share.jpg')

  const tags = `<title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${siteUrl}${path}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />`

  return html.replace(/<!-- meta:start -->[\s\S]*<!-- meta:end -->/, () => tags)
}
