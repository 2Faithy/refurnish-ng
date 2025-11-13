'use client';

import React, { useState, useMemo } from 'react';

// --- ICON COMPONENTS ---
const Icon = ({ children, className, title }) => (
    <span className={className} title={title}>{children}</span>
);

const FaHeart = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></Icon>
);
const FaShoppingCart = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M2.5 2.5h2.43L6 14h14l-1.5-8H6"/></svg></Icon>
);
const FaTag = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44A2 2 0 0 0 9 3.22L4.76 7.46A2 2 0 0 0 4 8.79V19a2 2 0 0 0 2 2h11.21a2 2 0 0 0 1.37-.58l5.44-5.44a2 2 0 0 0 0-2.83L14.07 3.22A2 2 0 0 0 12.22 2z"/><path d="M15 9h.01"/></svg></Icon>
);
const FaMapMarkerAlt = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.7C17.3 17 22 13 22 10A10 10 0 0 0 12 0 10 10 0 0 0 2 10c0 3 4.7 7 10 11.7z"/><circle cx="12" cy="10" r="3"/></svg></Icon>
);
const FaStar = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></Icon>
);
const FaChevronLeft = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></Icon>
);
const FaChevronRight = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></Icon>
);
const FaChevronDown = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></Icon>
);
const FaRegCheckCircle = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></Icon>
);
const FaUserCircle = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></Icon>
);
const FaShareAlt = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 4.88"/><path d="m15.41 6.49-6.83 4.88"/></svg></Icon>
);
const FaPlus = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg></Icon>
);
const FaMinus = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg></Icon>
);
const FaTruck = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M10 18h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.95"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg></Icon>
);
const FaMoneyBillWave = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></Icon>
);
const FaShieldAlt = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></Icon>
);
const FaPhone = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></Icon>
);
const FaWhatsapp = (props) => (
    <Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></Icon>
);

// --- CONSTANTS ---
const PRIMARY_COLOR = '#775522'; // Rich Brown
const SECONDARY_COLOR = '#E8CEB0'; // Warm Beige
const ACCENT_COLOR = '#9933BB'; // Vibrant Purple
const ACTION_COLOR = '#66BB44'; // Fresh Green
const BACKGROUND_COLOR = '#FDFBF7'; // Warm Light Background
const TEXT_COLOR = '#5F7161'; // Muted Green
const TEXT_DARK = '#110000'; // Near Black

// Lagos Areas for Delivery
const LAGOS_AREAS = [
    "Ikeja", "Lekki", "Victoria Island", "Ajah", "Yaba", "Surulere", "Ikoyi", 
    "Maryland", "Ojota", "Oshodi", "Gbagada", "Ikorodu", "Festac", "Agege"
];

// --- MOCK DATA STRUCTURES ---
interface Seller {
    name: string;
    rating: number;
    sales: number;
    positiveRating: number;
    phone: string;
    responseTime: string;
    memberSince: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    features: string[];
    price: number;
    oldPrice?: number;
    images: string[];
    category: string;
    location: string;
    condition: string;
    seller: Seller;
    colorHex?: string;
    warranty?: string;
    deliveryAreas: string[];
    assemblyRequired: boolean;
}

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Modern Scandinavian Coffee Table with Storage',
        description: "Elevate your living space with this exquisite Scandinavian coffee table crafted from premium solid oak. Features a hidden storage compartment perfect for magazines, remote controls, and living room essentials. The natural wood finish and clean lines create a timeless centerpiece for any contemporary home.\n\n• Solid oak construction for durability\n• Smooth push-to-open mechanism\n• Water-resistant natural finish\n• Perfect for small spaces",
        features: [
            "Solid Oak Wood Construction",
            "Hidden Push-to-Open Storage",
            "Water-Resistant Natural Finish",
            "Dimensions: 120cm L x 60cm W x 45cm H",
            "Easy Assembly Required (30 minutes)"
        ],
        price: 85000,
        oldPrice: 105000,
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=800&h=600&fit=crop",
        ],
        category: 'Living Room Furniture',
        location: 'Lekki, Lagos',
        condition: 'Brand New',
        seller: {
            name: 'Elite Furniture Lagos',
            rating: 4.8,
            sales: 342,
            positiveRating: 98,
            phone: '+2348012345678',
            responseTime: 'Within 1 hour',
            memberSince: '2022'
        },
        colorHex: '#C6A37F',
        warranty: '2 Year Manufacturer Warranty',
        deliveryAreas: ["Lekki", "Victoria Island", "Ikoyi", "Ajah", "Ikeja"],
        assemblyRequired: true
    },
    {
        id: '2',
        name: 'Ergonomic Executive Office Chair - High Back',
        description: "Experience premium comfort with our high-back executive office chair. Upholstered in genuine leather with advanced lumbar support and synchro-tilt mechanism. Perfect for long working hours with its breathable mesh backing and polished chrome base.",
        features: [
            "Genuine Leather Upholstery",
            "Adjustable Lumbar Support",
            "Heavy-Duty Chrome Base",
            "150kg Weight Capacity",
            "360-degree Swivel"
        ],
        price: 65000,
        images: [
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=800&h=600&fit=crop",
        ],
        category: 'Office Furniture',
        location: 'Ikeja, Lagos',
        condition: 'Tokunbo (Foreign Used)',
        seller: {
            name: 'OfficeComfort NG',
            rating: 4.5,
            sales: 189,
            positiveRating: 95,
            phone: '+2348098765432',
            responseTime: 'Within 2 hours',
            memberSince: '2021'
        },
        colorHex: '#2C2C2C',
        warranty: '6 Month Seller Warranty',
        deliveryAreas: ["Ikeja", "Maryland", "Ojota", "Gbagada", "Surulere"],
        assemblyRequired: false
    }
];

const getProductById = (id: string): Product | undefined => {
    return mockProducts.find(p => p.id === id);
};

// --- COMPONENTS ---
const ImageGallery: React.FC<{ product: Product }> = ({ product }) => {
    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <div className="w-full space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden border-2 border-beige-200 shadow-lg group">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        isWishlisted 
                            ? 'bg-red-500 text-white shadow-lg' 
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                >
                    <FaHeart className="text-xl" />
                </button>
                
                {product.oldPrice && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg">
                        {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setMainImage(image)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            mainImage === image 
                                ? 'border-green-500 ring-2 ring-green-200' 
                                : 'border-beige-200 hover:border-purple-300'
                        }`}
                    >
                        <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

const LogisticsAndProtection: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-beige-200 space-y-6">
        {/* Seller Info */}
        <div className="flex items-center justify-between pb-4 border-b border-beige-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brown-100 rounded-full flex items-center justify-center">
                    <FaUserCircle className="text-2xl text-brown-600" />
                </div>
                <div>
                    <h3 className="font-bold text-dark flex items-center gap-2">
                        {product.seller.name}
                        <span className="text-green-500 text-sm">✓ Verified</span>
                    </h3>
                    <p className="text-sm text-gray-600">{product.seller.responseTime} response</p>
                </div>
            </div>
            <span className="text-green-600 font-bold text-lg">
                {product.seller.positiveRating}% Positive
            </span>
        </div>

        {/* Contact Seller */}
        <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
                <FaWhatsapp className="text-lg" />
                Chat
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                <FaPhone className="text-lg" />
                Inquiries
            </button>
        </div>

        {/* Delivery in Lagos */}
        <div className="space-y-3">
            <h4 className="font-bold text-brown-600 flex items-center gap-2">
                <FaTruck className="text-green-500" /> 
                Delivery within Lagos
            </h4>
            <div className="bg-beige-50 p-4 rounded-lg">
                <p className="text-sm text-dark font-medium mb-2">Available Areas:</p>
                <div className="flex flex-wrap gap-2">
                    {product.deliveryAreas.map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-beige-200 rounded-full text-xs text-dark">
                            {area}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-green-600 font-medium mt-3">
                    ₦2,500 - ₦5,000 • 1-3 days delivery
                </p>
            </div>
        </div>

        {/* Buyer Protection */}
        <div className="pt-4 border-t border-beige-200 space-y-3">
            <h4 className="font-bold text-brown-600 flex items-center gap-2">
                <FaShieldAlt className="text-red-500" /> 
                Buyer Protection
            </h4>
            <div className="space-y-2 text-sm text-dark">
                <div className="flex justify-between">
                    <span>Returns:</span>
                    <span className="font-medium">7 Days Return Policy</span>
                </div>
                <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="font-medium">{product.warranty || 'No Warranty'}</span>
                </div>
                <div className="flex justify-between">
                    <span>Assembly:</span>
                    <span className="font-medium">{product.assemblyRequired ? 'Required' : 'Not Required'}</span>
                </div>
            </div>
        </div>
    </div>
);

const ProductRatingsAndReviews: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-beige-200">
        <h3 className="text-xl font-bold text-brown-600 mb-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xl ${i < Math.floor(product.seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
            Customer Reviews
        </h3>
        
        <div className="flex items-baseline gap-4 mb-4">
            <span className="text-5xl font-bold text-brown-600">{product.seller.rating.toFixed(1)}</span>
            <div>
                <p className="text-lg text-dark font-medium">Excellent</p>
                <p className="text-gray-600">Based on {product.seller.sales} reviews</p>
            </div>
        </div>

        <button className="w-full py-3 bg-brown-600 text-white rounded-xl font-semibold hover:bg-brown-700 transition-colors">
            Read All Reviews
        </button>
    </div>
);

// --- MAIN COMPONENT ---
interface ProductDetailPageProps {
    params: {
        id: string;
    };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const productId = String(params.id);
    const product = useMemo(() => getProductById(productId), [productId]);
    const recommendedProducts = useMemo(() => mockProducts.filter(p => p.id !== productId).slice(0, 3), [productId]);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="min-h-screen bg-beige-50 flex flex-col justify-center items-center p-8">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Product Not Found</h1>
                <p className="text-lg text-gray-600 mb-8">
                    The item you are looking for does not exist or has been sold out.
                </p>
                <a href="/shop" className="px-8 py-4 bg-brown-600 text-white rounded-xl hover:bg-brown-700 transition-colors font-semibold text-lg">
                    Back to Shop
                </a>
            </div>
        );
    }

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-beige-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center text-sm text-gray-600">
                    <a href="/" className="hover:text-brown-600 transition-colors">Home</a>
                    <span className="mx-3">/</span>
                    <a href="/shop" className="hover:text-brown-600 transition-colors">Shop</a>
                    <span className="mx-3">/</span>
                    <a href={`/shop?category=${product.category}`} className="hover:text-brown-600 transition-colors">{product.category}</a>
                    <span className="mx-3">/</span>
                    <span className="font-semibold text-brown-600 truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <ImageGallery product={product} />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {product.category}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-green-600">
                                    <FaRegCheckCircle /> {product.condition}
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-dark leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={`text-yellow-400 ${i < Math.floor(product.seller.rating) ? '' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span>{product.seller.rating.toFixed(1)}</span>
                                <span>({product.seller.sales} sales)</span>
                                <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-sm" /> {product.location}
                                </span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-brown-600">
                                ₦{product.price.toLocaleString()}
                            </span>
                            {product.oldPrice && (
                                <span className="text-xl text-gray-500 line-through">
                                    ₦{product.oldPrice.toLocaleString()}
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                                    Save {discount}%
                                </span>
                            )}
                        </div>

                        {/* Color Option */}
                        {product.colorHex && (
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-dark">Color:</span>
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                                    style={{ backgroundColor: product.colorHex }}
                                ></div>
                                <span className="text-gray-600">Natural Oak</span>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-green-500 rounded-xl overflow-hidden bg-white">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="p-4 text-gray-600 hover:bg-beige-100 transition-colors"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="px-6 text-lg font-bold text-dark min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="p-4 text-gray-600 hover:bg-beige-100 transition-colors"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <span className="text-gray-600">Only 5 left in stock</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-4 bg-beige-200 text-brown-600 rounded-xl font-bold hover:bg-brown-600 hover:text-white transition-all duration-300 shadow-md">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all duration-300 shadow-md">
                                    Buy Now
                                </button>
                            </div>

                            <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-dark text-dark rounded-xl font-semibold hover:bg-dark hover:text-white transition-colors">
                                <FaShareAlt /> Share Product
                            </button>
                        </div>

                        {/* Logistics & Protection */}
                        <LogisticsAndProtection product={product} />

                        {/* Key Features */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-beige-200">
                            <h3 className="text-xl font-bold text-brown-600 mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 text-dark">
                                        <FaRegCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Description & Reviews */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-beige-200">
                            <h2 className="text-2xl font-bold text-brown-600 mb-6">Product Description</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <ProductRatingsAndReviews product={product} />
                    </div>
                </div>

                {/* Related Products */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-brown-600 mb-8 text-center">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedProducts.map(recProduct => (
                                <a 
                                    key={recProduct.id} 
                                    href={`/product/${recProduct.id}`}
                                    className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-beige-200"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={recProduct.images[0]}
                                            alt={recProduct.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-dark group-hover:text-brown-600 transition-colors line-clamp-2 mb-2">
                                            {recProduct.name}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-brown-600">
                                                ₦{recProduct.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-600">{recProduct.location}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for color variables */}
            <style jsx global>{`
                :root {
                    --primary-brown: #775522;
                    --secondary-beige: #E8CEB0;
                    --accent-purple: #9933BB;
                    --action-green: #66BB44;
                    --background-beige: #FDFBF7;
                    --text-green: #5F7161;
                    --text-dark: #110000;
                }
                
                .bg-beige-50 { background-color: var(--background-beige); }
                .bg-beige-100 { background-color: #f5f0e8; }
                .bg-beige-200 { background-color: var(--secondary-beige); }
                .bg-brown-100 { background-color: #f0e6d6; }
                .bg-brown-600 { background-color: var(--primary-brown); }
                .bg-brown-700 { background-color: #5a3f19; }
                .text-brown-600 { color: var(--primary-brown); }
                .text-dark { color: var(--text-dark); }
                .border-beige-200 { border-color: var(--secondary-beige); }
            `}</style>
        </div>
    );
}