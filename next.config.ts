const { withClerk } = require("@clerk/nextjs/withClerk");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withClerk(nextConfig);
