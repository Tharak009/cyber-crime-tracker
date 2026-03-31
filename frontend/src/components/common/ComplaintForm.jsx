import { useEffect, useMemo, useState } from "react";
import { crimeTypes } from "../../utils/constants";
import api from "../../services/api";

const initialState = {
  categoryId: "",
  crimeType: crimeTypes[0],
  title: "",
  description: "",
  incidentDate: "",
  incidentLocation: "",
  suspectReference: "",
  amountLost: "",
  contactDetails: ""
};

export default function ComplaintForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === String(form.categoryId)) || null,
    [categories, form.categoryId]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const items = Array.isArray(data.data) ? data.data : [];
        setCategories(items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaint categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const matchingCategory = categories.find(
      (category) => category.name?.trim().toLowerCase() === form.crimeType.trim().toLowerCase()
    );

    if (matchingCategory && String(matchingCategory.id) !== String(form.categoryId)) {
      setForm((prev) => ({ ...prev, categoryId: String(matchingCategory.id) }));
      return;
    }

    if (!matchingCategory && !form.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: String(categories[0].id) }));
    }
  }, [categories, form.categoryId, form.crimeType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      className="card grid gap-4 p-6 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        if (!form.categoryId) {
          setError("Category could not be resolved for the selected crime type");
          return;
        }
        try {
          await onSubmit({
            ...form,
            categoryId: Number(form.categoryId),
            amountLost: form.amountLost ? Number(form.amountLost) : null
          });
          setForm(initialState);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to submit complaint");
        }
      }}
    >
      {error && <p className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="crimeType">Crime Type</label>
        <select className="input" id="crimeType" name="crimeType" value={form.crimeType} onChange={handleChange}>
          {crimeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="categoryName">Category</label>
        <input
          className="input bg-slate-50"
          id="categoryName"
          value={loadingCategories ? "Loading categories..." : selectedCategory?.name || "Auto-selected from crime type"}
          readOnly
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">Title</label>
        <input className="input" id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Detailed Description</label>
        <textarea className="input min-h-32" id="description" name="description" value={form.description} onChange={handleChange} required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="incidentDate">Incident Date</label>
        <input className="input" id="incidentDate" type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange} required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="incidentLocation">Incident Location</label>
        <input className="input" id="incidentLocation" name="incidentLocation" value={form.incidentLocation} onChange={handleChange} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="suspectReference">Suspected Website / Email / Phone</label>
        <input className="input" id="suspectReference" name="suspectReference" value={form.suspectReference} onChange={handleChange} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="amountLost">Amount Lost</label>
        <input className="input" id="amountLost" type="number" name="amountLost" value={form.amountLost} onChange={handleChange} />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="contactDetails">Contact Details</label>
        <input className="input" id="contactDetails" name="contactDetails" value={form.contactDetails} onChange={handleChange} />
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary" type="submit">
          Submit Complaint
        </button>
      </div>
    </form>
  );
}
