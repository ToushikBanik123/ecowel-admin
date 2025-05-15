import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { revalidatePath } from "next/cache";

// const generateUniqueSlug = async (slug: string) => {
//     let uniqueSlug = slug;
//     let slugExists = await Products.findOne({ "category.slug": uniqueSlug });

//     let counter = 1;
//     while (slugExists) {
//       uniqueSlug = `${slug}-${counter}`;
//       slugExists = await Products.findOne({ "category.slug": uniqueSlug });
//       counter;
//     }

//     return uniqueSlug;
//   };
// PUT: Update a product by SKU
export const PUT = async (
  request: NextRequest,
  { params }: { params: { sku: string } }
) => {
  const { sku } = params;
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      discount,
      isNew,
      variants,
      bestBefore,
      directions,
      ingredients,
      benefits,
      faqs,
      additionalInfo,
      isSingleVariantProduct,
      heroBanner,
      dailyRitual,
      ingredientHighlights,
      oldSku,
      sku: newSku,
      bannerImage1,
      bannerImage2,
      bannerImage3,
      productStories,
      certifications,
      whyItWorksTitle,
      theSecretInsideTitle,
      theSecretInsideSubtitle,
      theSecretInsideSuffix,
      whatMakesStandOutPrefix,
      whatMakesStandOutSuffix,
      letsUnveilPrefix,
      letsUnveilSuffix,
      everyScoopPrefix,
      nothingButTheBestText,
      draft,
      purposeAndTrust,
    }: {
      oldSku?: string;
      sku?: string;
      title?: string;
      description?: string;
      category?: { title: string; slug: string };
      brand?: string;
      price?: number;
      salePrice?: number;
      discount?: number;
      isNew?: boolean;
      variants?: [
        {
          flavor: string;
          images: string[];
          stock: number;
          form: "tablet" | "powder" | "liquid";
          netQuantity: string;
          nutritionFacts: string[];
          allergens?: string[];
          servingSize: string;
        }
      ];
      bestBefore?: Date;
      directions?: string[];
      ingredients?: string[];
      benefits?: string[];
      faqs?: { question: string; answer: string }[];
      additionalInfo?: {
        manufacturedBy: string;
        countryOfOrigin: string;
        phone: string;
        email: string;
      };
      isSingleVariantProduct?: boolean;

      heroBanner?: {
        title?: string;
        subtitle?: string;
        description?: string;
        backgroundImage?: string;
      };
      dailyRitual?: {
        title?: string;
        description?: string;
        lifestyleImage?: string;
      };
      ingredientHighlights?: {
        name?: string;
        description?: string;
        image?: string;
      }[];
      bannerImage1?: string;
      bannerImage2?: string;
      bannerImage3?: string;
      productStories?: {
        theStoriesTitle?: string;
        theInspireUsPrefix?: string;
        theInspireUsWord?: string;
        theInspireUsSuffix?: string;
        stories: {
          content?: string;
          image?: string;
          name?: string;
          location?: string;
        }[];
      };
      certifications?: {
        alt: string;
        img: string;
      }[];
      whyItWorksTitle?: string;
      theSecretInsideTitle?: string;
      theSecretInsideSubtitle?: string;
      theSecretInsideSuffix?: string;
      whatMakesStandOutPrefix?: string;
      whatMakesStandOutSuffix?: string;
      letsUnveilPrefix?: string;
      letsUnveilSuffix?: string;
      everyScoopPrefix?: string;
      nothingButTheBestText?: string;
      draft?: boolean;
      purposeAndTrust?: {
        prefix1?: string;
        prefix2?: string;
        italicWord1?: string;
        italicWord2?: string;
        features?: {
          title?: string;
          description?: string;
          icon?: string;
          alt?: string;
        }[];
      };
    } = await request.json();

    await connectToMongoDB();

    // Check if new SKU already exists (if SKU is being changed)
    if (newSku && newSku !== oldSku) {
      const existingProduct = await Products.findOne({ sku: newSku });
      if (existingProduct) {
        return NextResponse.json(
          { error: "Product with this SKU already exists", success: false },
          { status: 400 }
        );
      }
    }

    const product = await Products.findOne({ sku: oldSku });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Update SKU if provided
    if (newSku && newSku !== oldSku) {
      product.sku = newSku;
    }

    if (variants) {
      const sell_on_google_quantity = variants.reduce(
        (acc, variant) => acc + Number(variant.stock),
        0
      );
      product.sell_on_google_quantity = sell_on_google_quantity;
    }
    if (title) product.title = title;
    if (description) product.description = description;
    if (brand) product.brand = brand;
    if (price) product.price = price;
    if (salePrice) product.salePrice = salePrice;
    if (discount) product.discount = discount;
    if (isNew !== undefined) product.new = isNew;
    if (variants) product.variants = variants;
    if (bestBefore) product.bestBefore = bestBefore;
    if (directions) product.directions = directions;
    if (ingredients) product.ingredients = ingredients;
    if (benefits) product.benefits = benefits;
    if (faqs) product.faqs = faqs;
    if (additionalInfo) product.additionalInfo = additionalInfo;
    if (category) {
      product.category.slug = category.slug;
      product.category.title = category.title;
    }
    if (isSingleVariantProduct !== undefined) {
      product.isSingleVariantProduct = isSingleVariantProduct;
    }
    console.log("Category: ", category);
    console.log("updated category: ", product.category);

    // Update new fields
    if (heroBanner) {
      product.heroBanner = {
        title: heroBanner.title || product.heroBanner?.title,
        subtitle: heroBanner.subtitle || product.heroBanner?.subtitle,
        description: heroBanner.description || product.heroBanner?.description,
        backgroundImage:
          heroBanner.backgroundImage || product.heroBanner?.backgroundImage,
      };
    }

    if (dailyRitual) {
      product.dailyRitual = {
        title: dailyRitual.title || product.dailyRitual?.title,
        description:
          dailyRitual.description || product.dailyRitual?.description,
        lifestyleImage:
          dailyRitual.lifestyleImage || product.dailyRitual?.lifestyleImage,
      };
    }

    if (ingredientHighlights) {
      product.ingredientHighlights = ingredientHighlights;
    }

    if (bannerImage1 !== undefined) product.bannerImage1 = bannerImage1;
    if (bannerImage2 !== undefined) product.bannerImage2 = bannerImage2;
    if (bannerImage3 !== undefined) product.bannerImage3 = bannerImage3;

    if (productStories) {
      product.productStories = productStories;
    }

    if (certifications) {
      product.certifications = certifications;
    }

    if (whyItWorksTitle !== undefined) product.whyItWorksTitle = whyItWorksTitle;
    if (theSecretInsideTitle !== undefined) product.theSecretInsideTitle = theSecretInsideTitle;
    if (theSecretInsideSubtitle !== undefined) product.theSecretInsideSubtitle = theSecretInsideSubtitle;
    if (theSecretInsideSuffix !== undefined) product.theSecretInsideSuffix = theSecretInsideSuffix;

    if (whatMakesStandOutPrefix !== undefined) product.whatMakesStandOutPrefix = whatMakesStandOutPrefix;
    if (whatMakesStandOutSuffix !== undefined) product.whatMakesStandOutSuffix = whatMakesStandOutSuffix;

    if (letsUnveilPrefix !== undefined) product.letsUnveilPrefix = letsUnveilPrefix;
    if (letsUnveilSuffix !== undefined) product.letsUnveilSuffix = letsUnveilSuffix;

    if (everyScoopPrefix !== undefined) product.everyScoopPrefix = everyScoopPrefix;
    if (nothingButTheBestText !== undefined) product.nothingButTheBestText = nothingButTheBestText;

    if (draft !== undefined) product.draft = draft;
    else product.draft = false;

    console.log("purposeAndTrust.features", purposeAndTrust.features)

    if (purposeAndTrust != undefined) {
      product.purposeAndTrust = {
        prefix1: purposeAndTrust.prefix1 || product.purposeAndTrust?.prefix1 || "Built with",
        prefix2: purposeAndTrust.prefix2 || product.purposeAndTrust?.prefix2 || "Backed by",
        italicWord1: purposeAndTrust.italicWord1 || product.purposeAndTrust?.italicWord1 || "Purpose",
        italicWord2: purposeAndTrust.italicWord2 || product.purposeAndTrust?.italicWord2 || "Trust",
        features: purposeAndTrust?.features || product.purposeAndTrust?.features || [],
      };
    } else {
      console.log("Not present in the form body");
    }

    await product.save();

    revalidatePath(request.url);

    return NextResponse.json(
      {
        message: "Product updated successfully!",
        product,
        skuUpdated: newSku && newSku !== oldSku ? true : false,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", success: false },
      { status: 500 }
    );
  }
};
