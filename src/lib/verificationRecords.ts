import { INITIAL_PRODUCTS, type Product } from "./catalogData";

export interface NorthstarVerificationRecord {
  verificationId: string;
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  sku: string;
  priceCents: number;
  inspectorName: string;
  inspectionDate: string;
  conditionGrade: string;
  physicalInspectionStatus: "Completed";
  materialsAndStitchingStatus: "Checked";
  hardwareAndDetailsStatus: "Checked";
  conditionReport: string;
  accessoriesRecorded: string;
  inspectionPhotos: { url: string; alt: string }[];
}

const INSPECTORS = [
  "Elena Vance · Senior Leather & Hardware Specialist",
  "Marcus Chen · Footwear & Ready-to-Wear Specialist",
  "Claire Laurent · Archival Canvas & Serial Auditor",
];

function extractNumericId(sku: string, fallbackIndex: number): string {
  const match = sku.match(/(\d{3})$/);
  const num = match ? match[1] : String(fallbackIndex + 1).padStart(3, "0");
  return `NS-2026-${num}`;
}

function getAccessoriesForProduct(product: Product): string {
  const nameLower = product.name.toLowerCase();
  if (product.categoryId === "660000000000000000000002" || nameLower.includes("loafer") || nameLower.includes("sneaker") || nameLower.includes("slipper")) {
    return "Original designer box, twin cotton dust bags, care booklet, and serialized Northstar inspection tag.";
  }
  if (product.categoryId === "660000000000000000000001" || nameLower.includes("jacket") || nameLower.includes("coat") || nameLower.includes("shirt") || nameLower.includes("hoodie")) {
    return "Original boutique garment tags, protective storage cover, and serialized Northstar inspection tag.";
  }
  if (nameLower.includes("belt")) {
    return "Original designer presentation box, protective flannel pouch, care card, and serialized Northstar inspection tag.";
  }
  if (nameLower.includes("wallet") || nameLower.includes("card") || nameLower.includes("pouch") || nameLower.includes("scarf")) {
    return "Original boutique box, designer dust sleeve, care documentation, and serialized Northstar inspection tag.";
  }
  return "Original house dust bag, retail presentation box, care booklet, and serialized Northstar inspection tag.";
}

function getConditionReportForProduct(product: Product): string {
  if (product.condition === "PRE_OWNED") {
    return "Pre-owned archival condition. Surfaces, corners, hardware, and interior lining examined under calibrated lighting; no structural wear or unrecorded flaws.";
  }
  return `New / unworn boutique condition for ${product.brand} ${product.name}. Materials, edge glazing, stitching alignment, hardware markings, and internal serial/NFC references inspected prior to listing.`;
}

function buildRecord(product: Product, index: number): NorthstarVerificationRecord {
  const verificationId = extractNumericId(product.sku, index);
  const inspectorName = INSPECTORS[index % INSPECTORS.length];
  const day = String(1 + (index % 14)).padStart(2, "0");
  const inspectionDate = `2026-11-${day}`;
  const conditionGrade =
    product.condition === "PRE_OWNED" ? "Archival Mint (Grade A)" : "New / Unworn (Grade A+)";

  const photos =
    product.images && product.images.length > 0
      ? product.images.map((img) => ({ url: img.url, alt: img.alt || product.name }))
      : [{ url: "/images/editorial_collection_curation.jpg", alt: product.name }];

  return {
    verificationId,
    productId: product._id,
    productSlug: product.slug,
    productName: product.name,
    brand: product.brand,
    sku: product.sku,
    priceCents: product.priceCents,
    inspectorName,
    inspectionDate,
    conditionGrade,
    physicalInspectionStatus: "Completed",
    materialsAndStitchingStatus: "Checked",
    hardwareAndDetailsStatus: "Checked",
    conditionReport: getConditionReportForProduct(product),
    accessoriesRecorded: getAccessoriesForProduct(product),
    inspectionPhotos: photos,
  };
}

const ALL_RECORDS: NorthstarVerificationRecord[] = INITIAL_PRODUCTS.map((prod, idx) =>
  buildRecord(prod, idx)
);

export function getVerificationRecordByProduct(productOrSlug: {
  _id?: string;
  slug?: string;
}): NorthstarVerificationRecord | undefined {
  return ALL_RECORDS.find(
    (r) =>
      (productOrSlug._id && r.productId === productOrSlug._id) ||
      (productOrSlug.slug && r.productSlug === productOrSlug.slug)
  );
}

export function getVerificationRecordById(
  verificationId: string
): NorthstarVerificationRecord | undefined {
  const clean = verificationId.trim().toUpperCase();
  return ALL_RECORDS.find(
    (r) => r.verificationId.toUpperCase() === clean || r.sku.toUpperCase() === clean
  );
}

export function listAllVerificationRecords(): NorthstarVerificationRecord[] {
  return ALL_RECORDS;
}
