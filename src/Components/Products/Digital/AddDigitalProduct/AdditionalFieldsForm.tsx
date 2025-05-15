import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { uploadNewFile } from "@/lib/actions/fileUploads";
// @ts-ignore
import { Certification, StoryText, StoryItem } from "@/Types/product";

interface Props {
  formState: {
    bannerImage1?: string;
    bannerImage2?: string;
    bannerImage3?: string;
    productStories?: StoryText;
    certifications?: Certification[];
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
  };
  onUpdate: (field: string, value: any) => void;
}

const labelMap: Record<string, string> = {
  bannerImage1: "Banner Image 1",
  bannerImage2: "Banner Image 2",
  bannerImage3: "Banner Image 3",
  whyItWorksTitle: "Why It Works Title",
  theSecretInsideTitle: "Secret Inside - Title",
  theSecretInsideSubtitle: "Secret Inside - Subtitle",
  theSecretInsideSuffix: "Secret Inside - Suffix",
  whatMakesStandOutPrefix: "What Makes It Stand Out (Prefix)",
  whatMakesStandOutSuffix: "What Makes It Stand Out (Suffix)",
  letsUnveilPrefix: "Let’s Unveil (Prefix)",
  letsUnveilSuffix: "Let’s Unveil (Suffix)",
  everyScoopPrefix: "Every Scoop (Prefix)",
  nothingButTheBestText: "Nothing But The Best Text",
};

const AdditionalFieldsForm: React.FC<Props> = ({ formState, onUpdate }) => {
  const [uploading, setUploading] = useState<Set<string>>(new Set());

  const handleImageUpload = useCallback(
    async (field: string) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading((prev) => new Set(prev).add(field));
        try {
          const fd = new FormData();
          fd.append("file", file);
          const url = (await uploadNewFile(fd)) as string;
          onUpdate(field, url);
        } catch {
          toast.error("Image upload failed. Please try again.");
        } finally {
          setUploading((prev) => {
            const next = new Set(prev);
            next.delete(field);
            return next;
          });
        }
      };
      input.click();
    },
    [onUpdate]
  );

  const handleCertImageUpload = useCallback(
    async (index: number) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading((prev) => new Set(prev).add(`cert_${index}`));
        try {
          const fd = new FormData();
          fd.append("file", file);
          const url = (await uploadNewFile(fd)) as string;
          const updated = [...(formState.certifications || [])];
          updated[index] = { ...updated[index], img: url };
          onUpdate("certifications", updated);
        } catch {
          toast.error("Certification image upload failed.");
        } finally {
          setUploading((prev) => {
            const next = new Set(prev);
            next.delete(`cert_${index}`);
            return next;
          });
        }
      };
      input.click();
    },
    [formState.certifications, onUpdate]
  );

  const handleFeatureImageUpload = useCallback(
  async (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading((prev) => new Set(prev).add(`feature_${index}`));
      try {
        const fd = new FormData();
        fd.append("file", file);
        const url = (await uploadNewFile(fd)) as string;
        const updatedFeatures = [...(formState.purposeAndTrust?.features || [])];
        updatedFeatures[index] = { ...updatedFeatures[index], icon: url };
        onUpdate("purposeAndTrust", {
          ...formState.purposeAndTrust,
          features: updatedFeatures,
        });
      } catch {
        toast.error("Feature image upload failed.");
      } finally {
        setUploading((prev) => {
          const next = new Set(prev);
          next.delete(`feature_${index}`);
          return next;
        });
      }
    };
    input.click();
  },
  [formState.purposeAndTrust, onUpdate, uploadNewFile]
);

  const handleStoryImageUpload = useCallback(
    async (index: number) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading((prev) => new Set(prev).add(`story_${index}`));
        try {
          const fd = new FormData();
          fd.append("file", file);
          const url = (await uploadNewFile(fd)) as string;
          const updatedStories = [...(formState.productStories?.stories || [])];
          updatedStories[index] = { ...updatedStories[index], image: url };
          onUpdate("productStories", { ...formState.productStories, stories: updatedStories });
        } catch {
          toast.error("Story image upload failed.");
        } finally {
          setUploading((prev) => {
            const next = new Set(prev);
            next.delete(`story_${index}`);
            return next;
          });
        }
      };
      input.click();
    },
    [formState.productStories, onUpdate]
  );

  const handleCertAltChange = (index: number, alt: string) => {
    const updated = [...(formState.certifications || [])];
    updated[index] = { ...updated[index], alt };
    onUpdate("certifications", updated);
  };

  const removeCertification = (index: number) => {
    const updated = (formState?.certifications || []).filter((_, i) => i !== index);
    onUpdate("certifications", updated);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Additional Product Details</h5>
      </div>
      <div className="card-body">

           {/* Certifications */}
        <div>
          <h6>Certifications & Awards</h6>
          {(formState.certifications || []).map((cert, i) => (
            <div key={i} className="d-flex align-items-center mb-3">
              <input
                className="form-control me-2"
                style={{ maxWidth: 200 }}
                placeholder="Alt text"
                value={cert.alt}
                onChange={(e) => handleCertAltChange(i, e.target.value)}
              />
              {cert.img && (
                <img
                  src={cert.img}
                  alt={cert.alt}
                  style={{ height: 40, borderRadius: 4, marginRight: 8 }}
                />
              )}
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => handleCertImageUpload(i)}
                disabled={uploading.has(`cert_${i}`)}
              >
                {uploading.has(`cert_${i}`) ? "Uploading..." : "Upload Image"}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeCertification(i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onUpdate('certifications', [...(formState.certifications || []), { alt: '', img: '' }])}
          >
            + Add Certification
          </button>
        </div>


        {/* Banner Images */}
        <h6>Banner Images</h6>
        {['bannerImage1', 'bannerImage2', 'bannerImage3'].map((field) => (
          <div key={field} className="mb-3">
            <label className="form-label">{labelMap[field] || field}</label>
            <div className="d-flex align-items-center">
              {formState[field] && (
                <img
                  src={formState[field]!}
                  alt={labelMap[field]}
                  className="me-3"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleImageUpload(field)}
                disabled={uploading.has(field)}
              >
                {uploading.has(field) ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        ))}

        {/* Text Fields */}
        <h6>Text Sections</h6>
        {Object.keys(labelMap)
          .filter((key) => key !== 'bannerImage1' && key !== 'bannerImage2' && key !== 'bannerImage3')
          .map((field) => (
            <div key={field} className="mb-3">
              <label className="form-label">{labelMap[field] || field}</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder={`Enter ${labelMap[field]}`}
                value={(formState as any)[field] || ''}
                onChange={(e) => onUpdate(field, e.target.value)}
              />
            </div>
          ))}

        {/* Product Stories */}
        <div className="mb-4">
          <h6>Customer Stories</h6>
          {/* Stories Section Title */}
          <input
            className="form-control mb-2"
            placeholder="Stories Section Title"
            value={formState?.productStories?.theStoriesTitle || ''}
            onChange={(e) => onUpdate('productStories', { ...formState.productStories, theStoriesTitle: e.target.value })}
          />
          {/* Stories List */}
          {(formState?.productStories?.stories || []).map((story, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded">
              {/* Story Content */}
              <input
                className="form-control mb-1"
                placeholder="Story Content"
                value={story.content}
                onChange={(e) => {
                  const updatedStories = [...(formState.productStories?.stories || [])];
                  updatedStories[idx].content = e.target.value;
                  onUpdate('productStories', { ...formState.productStories, stories: updatedStories });
                }}
              />
              {/* Story Name */}
              <input
                className="form-control mb-1"
                placeholder="Name"
                value={story.name}
                onChange={(e) => {
                  const updatedStories = [...(formState.productStories?.stories || [])];
                  updatedStories[idx].name = e.target.value;
                  onUpdate('productStories', { ...formState.productStories, stories: updatedStories });
                }}
              />
              {/* Story Location */}
              <input
                className="form-control mb-1"
                placeholder="Location"
                value={story.location}
                onChange={(e) => {
                  const updatedStories = [...(formState.productStories?.stories || [])];
                  updatedStories[idx].location = e.target.value;
                  onUpdate('productStories', { ...formState.productStories, stories: updatedStories });
                }}
              />
              {/* Image Preview */}
              {story.image && (
                <img
                  src={story.image}
                  alt={`Story image for ${story.name}`}
                  style={{ height: 60, borderRadius: 4, marginTop: 8, marginRight: 10 }}
                />
              )}
              {/* Upload Image Button */}
              <button
                className="btn btn-sm btn-primary mt-2 "
                onClick={() => handleStoryImageUpload(idx)}
                disabled={uploading.has(`story_${idx}`)}
              >
                {uploading.has(`story_${idx}`) ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          ))}
          {/* Add Story Button */}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              const existing = formState.productStories?.stories || [];
              onUpdate('productStories', {
                ...formState.productStories,
                stories: [...existing, { content: '', image: '', name: '', location: '' }],
              });
            }}
          >
            + Add Story
          </button>
        </div>

     


        <div className="mb-4">
          <h6>Purpose and Trust</h6>
          {/* Prefix 1 */}
          <input
            className="form-control mb-2"
            placeholder="Prefix 1"
            value={formState?.purposeAndTrust?.prefix1 || "Built with"}
            onChange={(e) =>
              onUpdate("purposeAndTrust", {
                ...formState.purposeAndTrust,
                prefix1: e.target.value,
              })
            }
          />
          {/* Italic Word 1 */}
          <input
            className="form-control mb-2"
            placeholder="Italic Word 1"
            value={formState?.purposeAndTrust?.italicWord1 || "Purpose"}
            onChange={(e) =>
              onUpdate("purposeAndTrust", {
                ...formState.purposeAndTrust,
                italicWord1: e.target.value,
              })
            }
          />
          {/* Prefix 2 */}
          <input
            className="form-control mb-2"
            placeholder="Prefix 2"
            value={formState?.purposeAndTrust?.prefix2 || "Backed by"}
            onChange={(e) =>
              onUpdate("purposeAndTrust", {
                ...formState.purposeAndTrust,
                prefix2: e.target.value,
              })
            }
          />
          {/* Italic Word 2 */}
          <input
            className="form-control mb-2"
            placeholder="Italic Word 2"
            value={formState?.purposeAndTrust?.italicWord2 || "Trust"}
            onChange={(e) =>
              onUpdate("purposeAndTrust", {
                ...formState.purposeAndTrust,
                italicWord2: e.target.value,
              })
            }
          />
          {/* Features List */}
          <h6 className="mt-4">Features</h6>
          {(formState?.purposeAndTrust?.features || []).map((feature, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded">
              {/* Feature Title */}
              <input
                className="form-control mb-1"
                placeholder="Feature Title"
                value={feature.title || ""}
                onChange={(e) => {
                  const updatedFeatures = [...(formState.purposeAndTrust?.features || [])];
                  updatedFeatures[idx].title = e.target.value;
                  onUpdate("purposeAndTrust", {
                    ...formState.purposeAndTrust,
                    features: updatedFeatures,
                  });
                }}
              />
              {/* Feature Description */}
              <input className="form-control mb-1"
                placeholder="Feature Description"
                value={feature.description || ""}
                onChange={(e) => {
                  const updatedFeatures = [...(formState.purposeAndTrust?.features || [])];
                  updatedFeatures[idx].description = e.target.value;
                  onUpdate("purposeAndTrust", {
                    ...formState.purposeAndTrust,
                    features: updatedFeatures,
                  });
                }}
              />
              {/* Feature Alt Text */}
              <input
                className="form-control mb-1"
                placeholder="Image Alt Text"
                value={feature.alt || ""}
                onChange={(e) => {
                  const updatedFeatures = [...(formState.purposeAndTrust?.features || [])];
                  updatedFeatures[idx].alt = e.target.value;
                  onUpdate("purposeAndTrust", {
                    ...formState.purposeAndTrust,
                    features: updatedFeatures,
                  });
                }}
              />
              {/* Image Preview */}
              {feature.icon && (
                <img
                  src={feature.icon}
                  alt={feature.alt || `Feature image ${idx + 1}`}
                  style={{ height: 60, borderRadius: 4, marginTop: 8, marginRight: 10 }}
                />
              )}
              {/* Upload Image Button */}
              <button
                className="btn btn-primary mt-2 mr-2"
                onClick={() => handleFeatureImageUpload(idx)}
                disabled={uploading.has(`feature_${idx}`)}
              >
                {uploading.has(`feature_${idx}`) ? "Uploading..." : "Upload Image"}
              </button>
              {/* Remove Feature Button */}
              <button
                style={{marginLeft: 10}}
                className="btn btn-outline-danger mt-2 ml-5"
                onClick={() => {
                  const updatedFeatures = (formState.purposeAndTrust?.features || []).filter(
                    (_, i) => i !== idx
                  );
                  onUpdate("purposeAndTrust", {
                    ...formState.purposeAndTrust,
                    features: updatedFeatures,
                  });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {/* Add Feature Button */}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              const existing = formState.purposeAndTrust?.features || [];
              onUpdate("purposeAndTrust", {
                ...formState?.purposeAndTrust,
                features: [...existing, { title: "", description: "", icon: "", alt: "" }],
              });
            }}
          >
            + Add Feature
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdditionalFieldsForm;
