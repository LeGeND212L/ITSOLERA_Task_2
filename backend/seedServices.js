import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';
import Service from './models/Service.js';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Fix DNS for MongoDB Atlas
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Service.deleteMany({});

        // Find or create a provider user
        let provider = await User.findOne({ role: 'provider', isApproved: true });

        if (!provider) {
            console.log('📝 Creating sample provider...');
            provider = await User.create({
                name: 'Tech Solutions Pro',
                email: 'provider@example.com',
                password: 'Provider123',
                role: 'provider',
                phone: '03001234567',
                isApproved: true
            });
        }

        console.log('✨ Creating sample services...');

        const services = [
            {
                title: 'Professional Website Development',
                description: 'Custom website development with modern technologies like React, Vue, or Angular. Includes responsive design, SEO optimization, and fast loading speeds.',
                category: 'web-development',
                price: 999,
                duration: 120,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Mobile App Development - iOS & Android',
                description: 'Native or cross-platform mobile app development using React Native or Flutter. Full-featured apps with backend integration.',
                category: 'mobile-development',
                price: 1499,
                duration: 180,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'UI/UX Design for Web & Mobile',
                description: 'Professional UI/UX design services including wireframing, prototyping, and high-fidelity designs. User-centered approach with modern design principles.',
                category: 'ui-ux-design',
                price: 799,
                duration: 90,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Cloud Migration & Setup - AWS/Azure',
                description: 'Migrate your applications to the cloud with AWS or Azure. Includes server setup, database migration, and optimization.',
                category: 'cloud-services',
                price: 1299,
                duration: 150,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Data Analytics & Business Intelligence',
                description: 'Transform your data into actionable insights. Data visualization, dashboard creation, and predictive analytics using modern tools.',
                category: 'data-analytics',
                price: 899,
                duration: 120,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Cybersecurity Audit & Consultation',
                description: 'Comprehensive security audit of your systems. Vulnerability assessment, penetration testing, and security recommendations.',
                category: 'cybersecurity',
                price: 1599,
                duration: 180,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'AI Chatbot Development',
                description: 'Custom AI-powered chatbot development for customer service. Natural language processing and integration with your existing systems.',
                category: 'ai-ml',
                price: 1199,
                duration: 150,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'IT Consulting & Strategy',
                description: 'Expert IT consulting services to help you make strategic technology decisions. Technology roadmap, vendor selection, and implementation planning.',
                category: 'consulting',
                price: 699,
                duration: 90,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Website Maintenance & Support',
                description: '24/7 website maintenance and support services. Regular updates, bug fixes, performance monitoring, and security patches.',
                category: 'maintenance',
                price: 499,
                duration: 60,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'E-commerce Store Development',
                description: 'Full-featured e-commerce store with payment gateway integration, inventory management, and order tracking. Built with Shopify, WooCommerce, or custom.',
                category: 'web-development',
                price: 1799,
                duration: 200,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'API Development & Integration',
                description: 'RESTful API development and third-party API integration services. Secure, scalable, and well-documented APIs.',
                category: 'web-development',
                price: 899,
                duration: 120,
                providerId: provider._id,
                isAvailable: true
            },
            {
                title: 'Database Design & Optimization',
                description: 'Database architecture design and performance optimization. MySQL, PostgreSQL, MongoDB expertise with query optimization.',
                category: 'consulting',
                price: 799,
                duration: 90,
                providerId: provider._id,
                isAvailable: true
            }
        ];

        await Service.insertMany(services);

        console.log('✅ Database seeded successfully!');
        console.log(`📦 Created ${services.length} sample services`);
        console.log(`👤 Provider: ${provider.email} (Password: Provider123)`);
        console.log('\n🚀 You can now browse services at http://localhost:5173/services');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
