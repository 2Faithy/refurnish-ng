interface ValidationResult {
  valid: boolean;
  message?: string;
}

const REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: "itemTitle", label: "Item title" },
  { key: "category", label: "Category" },
  { key: "age", label: "Age" },
  { key: "color", label: "Color" },
  { key: "material", label: "Material" },
  { key: "condition", label: "Condition" },
  { key: "description", label: "Description" },
  { key: "sellingPrice", label: "Selling price" },
  { key: "address", label: "Address" },
  { key: "state", label: "State" },
];

export function validateListingPayload(body: any): ValidationResult {
  for (const field of REQUIRED_FIELDS) {
    const value = body[field.key];
    if (value === undefined || value === null || String(value).trim() === "") {
      return { valid: false, message: `${field.label} is required.` };
    }
  }

  if (!Array.isArray(body.photos) || body.photos.length === 0) {
    return { valid: false, message: "At least one photo is required." };
  }

  if (typeof body.description === "string" && body.description.trim().length < 20) {
    return { valid: false, message: "Description must be at least 20 characters." };
  }

  if (isNaN(Number(body.sellingPrice)) || Number(body.sellingPrice) <= 0) {
    return { valid: false, message: "Selling price must be a valid number greater than 0." };
  }

  return { valid: true };
}