/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'https://strapi-project-b3l7.onrender.com',
      'res.cloudinary.com', 
    ],
  },
  // Add any other configs you need
};

module.exports = nextConfig;