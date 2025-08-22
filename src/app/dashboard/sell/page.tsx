"use client";

import { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import {
  FaCamera,
  FaTrash,
  FaPlus,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaHome,
  FaRulerCombined,
  FaCouch,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTags,
  FaInfoCircle,
  FaEye,
  FaStar,
  FaClock,
  FaShieldAlt,
  FaHeart,
} from "react-icons/fa";

// Define types for our data structures
interface ImageData {
  id: number;
  url: string | ArrayBuffer | null;
  file: File;
  name: string;
}

interface Dimensions {
  length: string;
  width: string;
  height: string;
  weight: string;
}

interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  landmark: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  preferredTime: string;
}

interface Delivery {
  pickup: boolean;
  delivery: boolean;
  meetup: boolean;
  deliveryFee: string;
  deliveryAreas: string[];
}

interface FormData {
  title: string;
  category: string;
  subCategory: string;
  brand: string;
  model: string;
  condition: string;
  age: string;
  color: string;
  material: string;
  dimensions: Dimensions;
  description: string;
  features: string[];
  defects: string;
  originalPrice: string;
  sellingPrice: string;
  negotiable: boolean;
  reason: string;
  availability: string;
  urgency: string;
  address: Address;
  contact: Contact;
  delivery: Delivery;
}

export default function StartSellingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<ImageData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    title: "",
    category: "",
    subCategory: "",
    brand: "",
    model: "",

    // Physical Details
    condition: "",
    age: "",
    color: "",
    material: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
      weight: "",
    },

    // Features & Description
    description: "",
    features: [],
    defects: "",

    // Pricing & Availability
    originalPrice: "",
    sellingPrice: "",
    negotiable: false,
    reason: "",
    availability: "",
    urgency: "",

    // Location & Contact
    address: {
      street: "",
      area: "",
      city: "",
      state: "Lagos",
      landmark: "",
    },
    contact: {
      name: "",
      phone: "",
      email: "",
      whatsapp: "",
      preferredTime: "",
    },

    // Delivery Options
    delivery: {
      pickup: false,
      delivery: false,
      meetup: false,
      deliveryFee: "",
      deliveryAreas: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 7;

  const furnitureCategories: Record<string, string[]> = {
    "Living Room": [
      "Sofa",
      "Coffee Table",
      "TV Stand",
      "Center Table",
      "Bookshelf",
      "Side Table",
      "Ottoman",
      "Recliner",
    ],
    Bedroom: [
      "Bed Frame",
      "Mattress",
      "Wardrobe",
      "Dresser",
      "Nightstand",
      "Mirror",
      "Chest of Drawers",
    ],
    "Dining Room": [
      "Dining Table",
      "Dining Chairs",
      "Bar Stool",
      "Buffet",
      "China Cabinet",
      "Bar Cart",
    ],
    Office: [
      "Office Desk",
      "Office Chair",
      "Filing Cabinet",
      "Bookcase",
      "Computer Table",
      "Conference Table",
    ],
    Kitchen: [
      "Kitchen Island",
      "Bar Stool",
      "Kitchen Cabinet",
      "Pantry",
      "Kitchen Cart",
    ],
    Outdoor: [
      "Garden Chair",
      "Outdoor Table",
      "Swing",
      "Garden Bench",
      "Parasol",
      "Outdoor Storage",
    ],
  };

  const conditionOptions = [
    {
      value: "brand-new",
      label: "Brand New",
      desc: "Never used, with original packaging",
    },
    {
      value: "very-good",
      label: "Very Good",
      desc: "Minor wear, fully functional",
    },
    {
      value: "fair",
      label: "Fair",
      desc: "Noticeable wear but still functional",
    },
    {
      value: "needs-repair",
      label: "Needs Repair",
      desc: "Requires fixing before use",
    },
  ];

  const materials = [
    "Wood",
    "Metal",
    "Plastic",
    "Glass",
    "Leather",
    "Fabric",
    "Rattan",
    "Bamboo",
    "Mixed Materials",
  ];
  const colors = [
    "Brown",
    "Black",
    "White",
    "Gray",
    "Beige",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Multi-color",
  ];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file && images.length < 10) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: event.target?.result || null,
              file: file,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

 const updateFormData = (field: string, value: any) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".");

    setFormData((prev) => {
      // Create a new object with the updated nested property
      const updated = { ...prev };

      // Handle different parent types with type safety
      if (parent === "dimensions") {
        updated.dimensions = {
          ...updated.dimensions,
          [child]: value,
        };
      } else if (parent === "address") {
        updated.address = {
          ...updated.address,
          [child]: value,
        };
      } else if (parent === "contact") {
        updated.contact = {
          ...updated.contact,
          [child]: value,
        };
      } else if (parent === "delivery") {
        updated.delivery = {
          ...updated.delivery,
          [child]: value,
        };
      } else {
        console.warn(`Unknown parent field: ${parent}`);
      }

      return updated;
    });
  } else {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
};

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitListing = async () => {
    // Handle form submission
    console.log("Submitting listing:", formData, images);
    alert(
      "Listing submitted successfully! It will be reviewed and published within 24 hours."
    );
  };

  const stepTitles = [
    "Photos & Basic Info",
    "Category & Details",
    "Condition & Specifications",
    "Description & Features",
    "Pricing & Availability",
    "Location & Contact",
    "Review & Submit",
  ];

  const ProgressBar = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Step {currentStep} of {totalSteps}
        </h2>
        <span className="text-sm text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {stepTitles.map((title, index) => (
            <div key={index} className="text-xs text-center flex-1">
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold
                ${
                  index + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : index + 1 === currentStep
                    ? "bg-[#775522] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1 < currentStep ? <FaCheck /> : index + 1}
              </div>
              <span
                className={`${
                  index + 1 === currentStep
                    ? "text-[#775522] font-medium"
                    : "text-gray-500"
                }`}
              >
                {title}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-[#775522] to-[#8B6635] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCamera className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Upload Photos
                </h3>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                  Required
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                Add up to 10 high-quality photos. The first photo will be your
                main image.
              </p>
              <ul className="text-red-900 text-sm space-y-4">
                <li>
                  Lack of clear and high quality can make the listing rejected.
                </li>
              </ul>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url as string}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-[#775522] text-white px-2 py-1 rounded text-xs font-bold">
                        Main
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#775522] hover:text-[#775522] transition-colors"
                  >
                    <FaPlus className="text-2xl mb-2" />
                    <span className="text-sm">Add Photo</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Photo Tips:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Use good lighting and take clear, focused photos</li>
                  <li>• Show the item from multiple angles</li>
                  <li>• Include close-ups of any defects or wear</li>
                  <li>• Take photos in the actual room/setting if possible</li>
                </ul>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaInfoCircle className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="e.g., Luxury 3-Seater Leather Sofa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => updateFormData("brand", e.target.value)}
                    placeholder="e.g., IKEA, Ashley, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model/Series (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => updateFormData("model", e.target.value)}
                    placeholder="Model number or series name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaTags className="text-[#775522] text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">
                Category & Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Furniture Category <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {Object.keys(furnitureCategories).map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={formData.category === category}
                        onChange={(e) => {
                          updateFormData("category", e.target.value);
                          updateFormData("subCategory", "");
                        }}
                        className="text-[#775522] focus:ring-[#775522] mr-3"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Specific Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {furnitureCategories[formData.category].map((subCat) => (
                      <label key={subCat} className="flex items-center">
                        <input
                          type="radio"
                          name="subCategory"
                          value={subCat}
                          checked={formData.subCategory === subCat}
                          onChange={(e) =>
                            updateFormData("subCategory", e.target.value)
                          }
                          className="text-[#775522] focus:ring-[#775522] mr-3"
                        />
                        <span className="text-gray-700">{subCat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Condition */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaStar className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Condition
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditionOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.condition === option.value
                        ? "border-[#775522] bg-[#775522]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={formData.condition === option.value}
                      onChange={(e) =>
                        updateFormData("condition", e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {option.label}
                      </span>
                      {formData.condition === option.value && (
                        <FaCheck className="text-[#775522]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Physical Specifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaRulerCombined className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Physical Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select age</option>
                    <option value="brand-new">Brand New</option>
                    <option value="less-than-1-year">Less than 1 year</option>
                    <option value="1-2-years">1-2 years</option>
                    <option value="2-5-years">2-5 years</option>
                    <option value="5-10-years">5-10 years</option>
                    <option value="more-than 10-years">
                      More than 10 years
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => updateFormData("color", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select color</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => updateFormData("material", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select material</option>
                    {materials.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">
                  Dimensions (Optional)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) =>
                        updateFormData("dimensions.length", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) =>
                        updateFormData("dimensions.width", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) =>
                        updateFormData("dimensions.height", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.weight}
                      onChange={(e) =>
                        updateFormData("dimensions.weight", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCouch className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  rows={6}
                  placeholder="Describe your furniture in detail. Include style, comfort, functionality, and why you're selling it..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522] resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any Defects or Issues (Optional)
                </label>
                <textarea
                  value={formData.defects}
                  onChange={(e) => updateFormData("defects", e.target.value)}
                  rows={3}
                  placeholder="Be honest about any scratches, stains, or functional issues..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522] resize-none"
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaHeart className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Special Features
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Features
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      id="feature-input"
                      placeholder="e.g., Reclining, Storage, Convertible"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                      onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addFeature(target.value);
                          target.value = "";
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          "feature-input"
                        ) as HTMLInputElement;
                        addFeature(input.value);
                        input.value = "";
                      }}
                      className="px-4 py-2 bg-[#775522] text-white rounded-lg hover:bg-[#5E441B] transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 bg-[#775522]/10 text-[#775522] px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                          <button
                            onClick={() => removeFeature(feature)}
                            className="text-[#775522] hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Common Features to Consider:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    {[
                      "Reclining",
                      "Storage",
                      "Convertible",
                      "Memory Foam",
                      "Adjustable",
                      "Swivel",
                      "Foldable",
                      "Assembly Required",
                      "Washable Covers",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addFeature(suggestion)}
                        className="text-left hover:text-[#775522] transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMoneyBillWave className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Pricing</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Purchase Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        updateFormData("originalPrice", e.target.value)
                      }
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        updateFormData("sellingPrice", e.target.value)
                      }
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) =>
                      updateFormData("negotiable", e.target.checked)
                    }
                    className="text-[#775522] focus:ring-[#775522] mr-3"
                  />
                  <span className="text-gray-700">Price is negotiable</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Selling (Optional)
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => updateFormData("reason", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                >
                  <option value="">Select reason</option>
                  <option value="moving">Moving/Relocating</option>
                  <option value="upgrading">Upgrading to new furniture</option>
                  <option value="downsizing">Downsizing home</option>
                  <option value="style-change">Changing interior style</option>
                  <option value="space">Need more space</option>
                  <option value="unused">No longer needed</option>
                  <option value="financial">Financial reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCalendarAlt className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Availability
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When can buyers view/collect?
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      updateFormData("availability", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select availability</option>
                    <option value="immediately">Immediately</option>
                    <option value="weekends">Weekends only</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="evenings">Evenings after 6pm</option>
                    <option value="flexible">Flexible - by appointment</option>
                    <option value="specific-date">After a specific date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How urgent is the sale?
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => updateFormData("urgency", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select urgency</option>
                    <option value="no-rush">No rush</option>
                    <option value="few-weeks">Within a few weeks</option>
                    <option value="this-month">This month</option>
                    <option value="urgent">Urgent - ASAP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Location Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) =>
                      updateFormData("address.street", e.target.value)
                    }
                    placeholder="e.g., 123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.area}
                    onChange={(e) =>
                      updateFormData("address.area", e.target.value)
                    }
                    placeholder="e.g., GRA, Mile 3, Eliozu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      updateFormData("address.city", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      updateFormData("address.state", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.address.landmark}
                    onChange={(e) =>
                      updateFormData("address.landmark", e.target.value)
                    }
                    placeholder="e.g., Near Shoprite, Behind Police Station"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact.name}
                    onChange={(e) =>
                      updateFormData("contact.name", e.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      updateFormData("contact.phone", e.target.value)
                    }
                    placeholder="08012345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      updateFormData("contact.email", e.target.value)
                    }
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.whatsapp}
                    onChange={(e) =>
                      updateFormData("contact.whatsapp", e.target.value)
                    }
                    placeholder="08012345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time to Call
                  </label>
                  <select
                    value={formData.contact.preferredTime}
                    onChange={(e) =>
                      updateFormData("contact.preferredTime", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (8am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="evening">Evening (5pm - 8pm)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaHome className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Delivery & Pickup Options
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#775522] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.delivery.pickup}
                      onChange={(e) =>
                        updateFormData("delivery.pickup", e.target.checked)
                      }
                      className="text-[#775522] focus:ring-[#775522] mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        Buyer Pickup
                      </span>
                      <p className="text-sm text-gray-600">
                        Buyer collects from your location
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#775522] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.delivery.delivery}
                      onChange={(e) =>
                        updateFormData("delivery.delivery", e.target.checked)
                      }
                      className="text-[#775522] focus:ring-[#775522] mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        I Can Deliver
                      </span>
                      <p className="text-sm text-gray-600">
                        You deliver to buyer's location
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#775522] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.delivery.meetup}
                      onChange={(e) =>
                        updateFormData("delivery.meetup", e.target.checked)
                      }
                      className="text-[#775522] focus:ring-[#775522] mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        Meet Halfway
                      </span>
                      <p className="text-sm text-gray-600">
                        Meet at a convenient location
                      </p>
                    </div>
                  </label>
                </div>

                {formData.delivery.delivery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₦
                        </span>
                        <input
                          type="number"
                          value={formData.delivery.deliveryFee}
                          onChange={(e) =>
                            updateFormData(
                              "delivery.deliveryFee",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Areas
                      </label>
                      <input
                        type="text"
                        value={formData.delivery.deliveryAreas.join(", ")}
                        onChange={(e) =>
                          updateFormData(
                            "delivery.deliveryAreas",
                            e.target.value
                              .split(", ")
                              .filter((area) => area.trim())
                          )
                        }
                        placeholder="e.g., GRA, Mile 3, Eliozu"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaEye className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Listing Preview
                </h3>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex gap-4 mb-4">
                  {images.length > 0 && (
                    <img
                      src={images[0].url as string}
                      alt="Main"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {formData.title || "Untitled Listing"}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.category} • {formData.subCategory}
                    </p>
                    <p className="text-xl font-bold text-[#775522]">
                      ₦
                      {formData.sellingPrice
                        ? parseInt(formData.sellingPrice).toLocaleString()
                        : "0"}
                      {formData.negotiable && (
                        <span className="text-sm font-normal text-gray-600 ml-1">
                          (Negotiable)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <FaMapMarkerAlt className="inline mr-1" />
                      {formData.address.area}, {formData.address.city}
                    </p>
                  </div>
                </div>

                {formData.description && (
                  <p className="text-gray-700 text-sm mb-3">
                    {formData.description.substring(0, 150)}...
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {formData.condition && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {
                        conditionOptions.find(
                          (c) => c.value === formData.condition
                        )?.label
                      }
                    </span>
                  )}
                  {formData.age && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {formData.age.replace("-", " ")}
                    </span>
                  )}
                  {formData.material && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {formData.material}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaShieldAlt className="text-[#775522] text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Listing Summary
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Basic Information
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Title: {formData.title || "Not provided"}</li>
                    <li>
                      Category: {formData.category} - {formData.subCategory}
                    </li>
                    <li>Brand: {formData.brand || "Not specified"}</li>
                    <li>
                      Condition:{" "}
                      {conditionOptions.find(
                        (c) => c.value === formData.condition
                      )?.label || "Not specified"}
                    </li>
                    <li>Photos: {images.length} uploaded</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Pricing & Contact
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>
                      Price: ₦
                      {formData.sellingPrice
                        ? parseInt(formData.sellingPrice).toLocaleString()
                        : "Not set"}
                    </li>
                    <li>Negotiable: {formData.negotiable ? "Yes" : "No"}</li>
                    <li>Contact: {formData.contact.name || "Not provided"}</li>
                    <li>Phone: {formData.contact.phone || "Not provided"}</li>
                    <li>Location: {formData.address.area || "Not provided"}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms & Submission */}
            <div className="bg-gradient-to-r from-[#775522]/5 to-[#E8CEB0]/20 rounded-xl p-6 border border-[#775522]/20">
              <div className="flex items-start gap-3 mb-4">
                <FaClock className="text-[#775522] text-xl mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Before You Submit
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      • Your listing will be reviewed and published within 24
                      hours
                    </p>
                    <p>
                      • All information provided should be accurate and truthful
                    </p>
                    <p>• You'll receive email notifications about inquiries</p>
                    <p>• Listing will be active for 60 days (renewable)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="text-[#775522] focus:ring-[#775522]"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-[#775522] underline">
                    Terms of Service
                  </a>{" "}
                  and confirm that all information is accurate
                </label>
              </div>

              <button
                onClick={submitListing}
                className="w-full bg-gradient-to-r from-[#775522] to-[#8B6635] hover:from-[#5E441B] hover:to-[#775522] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3"
              >
                <FaCheck />
                Submit Listing for Review
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Start Selling Your Furniture
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a detailed listing to reach potential buyers in Lagos. Follow
            our step-by-step process to showcase your furniture effectively.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaArrowLeft />
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#775522] to-[#8B6635] hover:from-[#5E441B] hover:to-[#775522] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Next Step
                <FaArrowRight />
              </button>
            ) : (
              <div className="text-sm text-gray-500">Ready to submit!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
