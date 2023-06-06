// @ts-check
const { withBlitz } = require("@blitzjs/next")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.stamp.fyi",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

module.exports = withBlitz(config)
