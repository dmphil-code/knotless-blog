/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'your-strapi-app.onrender.com',
      'res.cloudinary.com', // Add Cloudinary domain
    ],
  },
  // Add any other configs you need
};

module.exports = nextConfig;