/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.framethebeat.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/private/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.framethebeat.com/server-sitemap.xml',
    ],
  },
}

export default config