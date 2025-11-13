export default function ProductPlaceholder() {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brown-600 mb-4">
            Product Pages Coming Soon
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We're working on detailed product views. Check back soon!
          </p>
          <a 
            href="/shop" 
            className="px-8 py-4 bg-brown-600 text-white rounded-xl hover:bg-brown-700 transition-colors font-semibold"
          >
            Back to Shop
          </a>
        </div>
      </div>
    );
  }