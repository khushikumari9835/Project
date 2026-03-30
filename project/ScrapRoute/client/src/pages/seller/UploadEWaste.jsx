import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItem } from "../../utils/localDb";
<<<<<<< HEAD
import { getAiInsightsForUpload } from "../../utils/mlApi";

function makeId() {
=======

function makeId() {
  // readable local ID like ITEM-AB12CD
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ITEM-${part}`;
}

<<<<<<< HEAD
function riskBadgeClass(risk) {
  if (risk === "high") return "badge-error";
  if (risk === "medium") return "badge-warning";
  return "badge-success";
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select a JPG/PNG image."));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("Please upload an image smaller than 2MB."));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function UploadSlot({ label, preview, onChange }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-3">
      <div className="font-extrabold">{label} View</div>

      <label className="border-2 border-dashed border-base-300 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:bg-base-200 transition">
        <span className="text-3xl">📷</span>
        <div>
          <div className="font-extrabold">Browse Image</div>
          <div className="text-sm opacity-70">JPG / PNG supported</div>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>

      {preview ? (
        <img
          src={preview}
          alt={`${label} preview`}
          className="rounded-2xl border border-base-300 max-h-56 object-cover w-full"
        />
      ) : (
        <div className="rounded-2xl border border-base-300 bg-base-200/40 p-6 text-sm opacity-60 text-center">
          No {label.toLowerCase()} image selected
        </div>
      )}
    </div>
  );
}

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
export default function UploadEWaste() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    model: "",
    year: "",
    condition: "Good",
    pickupAddress: "",
    description: "",
  });

<<<<<<< HEAD
  const [imageViews, setImageViews] = useState({
    front: "",
    rear: "",
    back: "",
  });

  const [previewViews, setPreviewViews] = useState({
    front: "",
    rear: "",
    back: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
=======
  const [preview, setPreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

<<<<<<< HEAD
  const handlePick = async (viewKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await readImageFile(file);

      setImageViews((prev) => ({
        ...prev,
        [viewKey]: base64,
      }));

      setPreviewViews((prev) => ({
        ...prev,
        [viewKey]: URL.createObjectURL(file),
      }));
    } catch (error) {
      alert(error.message || "Invalid image.");
    }
  };

  const handleCheckAi = async () => {
    if (!form.category || !form.model || !form.year || !form.description) {
      return alert("Please fill category, model, year and description first.");
    }

    setAiLoading(true);
    try {
      const result = await getAiInsightsForUpload(form, imageViews);
      setAiPreview(result);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!imageViews.front && !imageViews.rear && !imageViews.back) {
      return alert("Please upload at least one image view.");
    }

=======
  const handlePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a JPG/PNG image.");
      return;
    }

    // optional size limit to keep storage safe
    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    if (!imageBase64) return alert("Please upload an image.");
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    if (!form.category || !form.model || !form.year || !form.description) {
      return alert("Please fill all fields.");
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      let aiResult = aiPreview;

      if (!aiResult) {
        aiResult = await getAiInsightsForUpload(form, imageViews);
      }

=======
      // local item object
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      const item = {
        id: makeId(),
        title: `${form.category} - ${form.model}`,
        category: form.category,
        model: form.model,
        year: form.year,
        condition: form.condition,
        pickupAddress: form.pickupAddress,
        description: form.description,
<<<<<<< HEAD

        image: imageViews.front || imageViews.rear || imageViews.back || "",
        images: {
          front: imageViews.front || "",
          rear: imageViews.rear || "",
          back: imageViews.back || "",
        },

        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        mlInput: aiResult?.payload || null,

        aiEstimatedPricePerKg: aiResult?.prediction?.available
          ? aiResult.prediction.predictedPricePerKg
          : null,
        aiEstimatedTotal: aiResult?.prediction?.available
          ? aiResult.prediction.totalEstimatedPrice
          : null,
        anomalyScore: aiResult?.anomaly?.available
          ? aiResult.anomaly.score
          : null,
        anomalyRisk: aiResult?.anomaly?.available
          ? aiResult.anomaly.riskLevel
          : null,
        anomalyReasons: aiResult?.anomaly?.available
          ? aiResult.anomaly.reasons
          : [],
      };

      addItem(item);

      alert(`Upload successful ✅\nItem ID: ${item.id}`);
=======
        image: imageBase64,
        status: "Pending", // local status flow
        createdAt: new Date().toISOString(),
      };

      
      addItem(item);

      alert(`Upload successful ✅\nItem ID: ${item.id}`);

      // go to My Listings
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      navigate("/seller/listings", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
<<<<<<< HEAD
      <div className="max-w-5xl mx-auto p-4 md:p-8">
=======
      <div className="max-w-4xl mx-auto p-4 md:p-8">
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body space-y-4">
            <div className="card-title">Upload E-Waste</div>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Category</option>
              <option>TV</option>
              <option>Laptop</option>
              <option>Charger</option>
              <option>Mobile Phone</option>
              <option>Battery</option>
              <option>Mouse</option>
              <option>Keyboard</option>
            </select>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Model"
              />

              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                type="number"
                className="input input-bordered w-full"
                placeholder="Year of Purchase"
              />
            </div>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option>Good</option>
              <option>Poor</option>
              <option>Very Poor</option>
            </select>
<<<<<<< HEAD

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            <input
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Pickup Address (e.g., Kaloor, Kochi, Kerala)"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Description"
            />

<<<<<<< HEAD
            <div className="grid md:grid-cols-3 gap-4">
              <UploadSlot
                label="Front"
                preview={previewViews.front}
                onChange={(e) => handlePick("front", e)}
              />
              <UploadSlot
                label="Rear"
                preview={previewViews.rear}
                onChange={(e) => handlePick("rear", e)}
              />
              <UploadSlot
                label="Back"
                preview={previewViews.back}
                onChange={(e) => handlePick("back", e)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                className="btn btn-outline"
                onClick={handleCheckAi}
                disabled={aiLoading}
                type="button"
              >
                {aiLoading ? "Checking AI..." : "Check AI Insights"}
              </button>

              <button
                className="btn btn-success w-full"
                onClick={handleSubmit}
                disabled={loading}
                type="button"
              >
                {loading ? "Saving..." : "Add Item"}
              </button>
            </div>

            {aiPreview && (
              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 space-y-3">
                <div className="font-extrabold">AI Insights Preview</div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-base-100 p-3 border border-base-300">
                    <div className="text-xs opacity-70">Predicted Price / Kg</div>
                    <div className="text-lg font-bold">
                      {aiPreview.prediction?.available
                        ? `₹${aiPreview.prediction.predictedPricePerKg}`
                        : "Unavailable"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-base-100 p-3 border border-base-300">
                    <div className="text-xs opacity-70">Estimated Total</div>
                    <div className="text-lg font-bold">
                      {aiPreview.prediction?.available
                        ? `₹${aiPreview.prediction.totalEstimatedPrice}`
                        : "Unavailable"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-base-100 p-3 border border-base-300">
                    <div className="text-xs opacity-70">Risk Level</div>
                    <div className="mt-1">
                      <span
                        className={`badge ${riskBadgeClass(
                          aiPreview.anomaly?.riskLevel || "low"
                        )}`}
                      >
                        {aiPreview.anomaly?.available
                          ? aiPreview.anomaly.riskLevel
                          : "unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {aiPreview.prediction?.available && aiPreview.prediction?.factors && (
                  <div className="text-xs opacity-70">
                    Dynamic factors applied:
                    {" "}
                    weight {aiPreview.prediction.factors.weightFactor},
                    {" "}
                    distance {aiPreview.prediction.factors.distanceFactor},
                    {" "}
                    demand {aiPreview.prediction.factors.demandFactor},
                    {" "}
                    rating {aiPreview.prediction.factors.ratingFactor},
                    {" "}
                    age {aiPreview.prediction.factors.ageFactor},
                    {" "}
                    image {aiPreview.prediction.factors.imageFactor}
                  </div>
                )}

                {aiPreview.anomaly?.available && (
                  <div>
                    <div className="text-sm font-semibold mb-1">Risk Reasons</div>
                    <ul className="text-sm opacity-80 list-disc pl-5">
                      {(aiPreview.anomaly.reasons || []).map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
=======
            <label className="border-2 border-dashed border-base-300 rounded-2xl p-5 flex gap-4 items-center cursor-pointer hover:bg-base-200 transition">
              <span className="text-3xl">📷</span>
              <div>
                <div className="font-extrabold">Browse Image</div>
                <div className="text-sm opacity-70">JPG / PNG supported</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePick} />
            </label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="rounded-2xl border border-base-300 max-h-72 object-cover w-full"
              />
            )}

            <button
              className="btn btn-success w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Item"}
            </button>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          </div>
        </div>

        <div className="mt-10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} ScrapRoute · Built for E-Waste Management
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
