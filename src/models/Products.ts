import { Schema, model, models } from "mongoose";


const CertificationSchema = new Schema({
  alt: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});


const VariantSchema = new Schema({
  flavor: { type: String, required: true },
  images: { type: [String], required: true },
  stock: { type: Number, required: true },
  form: { type: String, enum: ["tablet", "powder", "liquid"], required: true },
  netQuantity: { type: String, required: true },
  nutritionFacts: { type: [String], required: true }, // E.g., ["Calories: 150", "Protein: 30g"]
  allergens: { type: [String], required: false }, // E.g., ["Peanuts", "Soy"]
  servingSize: { type: String, required: true }, // E.g., "30g scoop"
});

const FaqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const AdditionalInfoSchema = new Schema({
  manufacturedBy: { type: String, required: true, default: "Ecowell" },
  countryOfOrigin: { type: String, required: true, default: "India" },
  phone: { type: String, required: true, default: "7065937377" },
  email: { type: String, required: true, default: "contact@ecowellonline.com" },
});

// new feilds schema
const HeroBannerSchema = new Schema({
  title: { type: String, required: false },
  subtitle: { type: String, required: false },
  description: { type: String, required: false },
  backgroundImage: { type: String, required: false },
});

const DailyRitualSchema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  lifestyleImage: { type: String, required: false },
});

const IngredientHighlightSchema = new Schema({
  name: { type: String, required: false },
  description: { type: String, required: false },
  image: { type: String, required: false },
});

const StoryTextSchema = new Schema({
  theStoriesTitle: { type: String, required: false },
  theInspireUsPrefix: { type: String, required: false },
  theInspireUsWord: { type: String, required: false },
  theInspireUsSuffix: { type: String, required: false },
  stories: [
    {
      content: { type: String, required: false },
      image: { type: String, required: false },
      name: { type: String, required: false },
      location: { type: String, required: false },
    }
  ],
});

const PurposeAndTrust = new Schema({
    prefix1: { type: String, default: "Built with" },
    prefix2: { type: String, default: "Backed by" },
    italicWord1: { type: String, default: "Purpose" },
    italicWord2: { type: String, default: "Trust" },
    features: [
      {
        title: { type: String, required: false }, // Optional for flexibility
        description: { type: String, required: false },
        icon: { type: String, required: false },
        alt: { type: String, required: false },
      },
    ],
  });


const ProductSchema = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    new: { type: Boolean, default: false },
    description: { type: String, required: true },
    category: {
      title: { type: String, required: true },
      slug: { type: String, required: true },
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    discount: { type: Number, required: false },
    sell_on_google_quantity: { type: Number, required: true },
    isSingleVariantProduct: { type: Boolean, required: true, default: false },
    variants: [VariantSchema],
    directions: { type: [String], required: true },
    ingredients: { type: [String], required: true },
    benefits: { type: [String], required: true },
    faqs: [FaqSchema],
    additionalInfo: AdditionalInfoSchema,
    ratings: { type: Number, default: 0 },
    reviews_number: { type: Number, default: 0 },

    bestBefore: { type: Date, required: true },

    // new fields
    heroBanner: HeroBannerSchema,
    dailyRitual: DailyRitualSchema,
    ingredientHighlights: [IngredientHighlightSchema],
    // ingredientHighlights: IngredientHighlightSchema,
    bannerImage1: { type: String, required: false },
    bannerImage2: { type: String, required: false },
    bannerImage3: { type: String, required: false },
    productStories: StoryTextSchema,
    whyItWorksTitle: { type: String, required: false },
    theSecretInsideTitle: { type: String, required: false },
    theSecretInsideSubtitle: { type: String, required: false },
    theSecretInsideSuffix: { type: String, required: false },
    whatMakesStandOutPrefix: { type: String, required: false },
    whatMakesStandOutSuffix: { type: String, required: false },
    letsUnveilPrefix: { type: String, required: false },
    letsUnveilSuffix: { type: String, required: false },
    everyScoopPrefix: { type: String, required: false },
    nothingButTheBestText: { type: String, required: false },
    certifications: [CertificationSchema],
    draft: { type: Boolean, default: false },
    created_by: { type: Schema.Types.ObjectId, ref: "Admin" },
    purposeAndTrust: PurposeAndTrust,
  },
  { timestamps: true }
);

const Product = models.Products || model("Products", ProductSchema);

export default Product;

// import { Schema, model, models } from 'mongoose';

// const VariantSchema = new Schema({
//   flavor: { type: String, required: true },
//   images: { type: [String], required: true },
//   stock: { type: Number, required: true },
//   form: { type: String, enum: ['tablet', 'powder', 'liquid'], required: true },
//   netQuantity: { type: String, required: true },
//   nutritionFacts: { type: [String], required: true }, // E.g., ["Calories: 150", "Protein: 30g"]
//   allergens: { type: [String], required: false }, // E.g., ["Peanuts", "Soy"]
//   servingSize: { type: String, required: true }, // E.g., "30g scoop"
// });

// const FaqSchema = new Schema({
//   question: { type: String, required: true },
//   answer: { type: String, required: true },
// });

// const AdditionalInfoSchema = new Schema({
//   manufacturedBy: { type: String, required: true },
//   countryOfOrigin: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
// });

// const ProductSchema = new Schema({
//   sku: { type: String, required: true },
//   title: { type: String, required: true },
//   new: { type: Boolean, default: false },
//   description: { type: String, required: true },
//   category: {
//     title: { type: String, required: true },
//     slug: { type: String, required: true }
//   },
//   brand: { type: String, required: true },
//   price: { type: Number, required: true },
//   salePrice: { type: Number, required: true },
//   discount: { type: Number, required: false },
//   sell_on_google_quantity: { type: Number, required: true },
//   variants: [VariantSchema],
//   bestBefore: { type: Date, required: true },
//   directions: { type: [String], required: true },
//   ingredients: { type: [String], required: true },
//   benefits: { type: [String], required: true },
//   faqs: [FaqSchema],
//   additionalInfo: AdditionalInfoSchema,
//   ratings: { type: Number, default: 0 },
//   reviews_number: { type: Number, default: 0 },
// }, { timestamps: true });

// const Product = models.Products || model("Products", ProductSchema);

// export default Product;
