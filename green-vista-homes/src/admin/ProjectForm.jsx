import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, Plus, X, Loader2 } from "lucide-react";

const input =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-base sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-ring";
const label = "text-xs font-medium text-muted-foreground";
const card = "rounded-2xl border border-border/60 bg-background p-5 shadow-[var(--shadow-card)] sm:p-6";

export default function ProjectForm({
    title,
    subtitle,
    submitLabel,
    submitting,
    project,
    onChange,
    featureInput,
    setFeatureInput,
    onAddFeature,
    onRemoveFeature,
    onImageChange,
    imagePreviews,
    onRemoveImage,
    existingImages = [],
    onRemoveExisting,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="min-h-screen bg-secondary/30 text-foreground">
            <div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8 sm:pt-12">
                <Link
                    to="/admin/projects"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to projects
                </Link>

                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

                <form onSubmit={onSubmit} className="mt-6 space-y-5 sm:mt-8">
                    {/* Details */}
                    <section className={card}>
                        <h2 className="font-semibold">Details</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className={label}>Project title</label>
                                <input name="name" value={project.name} onChange={onChange} placeholder="e.g. Diamond Court 1" className={input} required />
                            </div>
                            <div>
                                <label className={label}>Location</label>
                                <input name="location" value={project.location} onChange={onChange} placeholder="e.g. Omachi, Rivers State" className={input} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={label}>Bedrooms</label>
                                    <input name="beds" type="number" inputMode="numeric" min="0" value={project.beds} onChange={onChange} className={input} required />
                                </div>
                                <div>
                                    <label className={label}>Bathrooms</label>
                                    <input name="baths" type="number" inputMode="numeric" min="0" value={project.baths} onChange={onChange} className={input} required />
                                </div>
                            </div>
                            <div>
                                <label className={label}>Description</label>
                                <textarea name="description" rows="5" value={project.description} onChange={onChange} placeholder="Describe the property" className={`${input} resize-none`} required />
                            </div>
                        </div>
                    </section>

                    {/* Images */}
                    <section className={card}>
                        <h2 className="font-semibold">Images</h2>

                        <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-8 text-center transition hover:border-primary/50 hover:bg-primary/5">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                                <ImagePlus className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-medium">Tap to choose images</span>
                            <span className="text-xs text-muted-foreground">JPG, PNG or WEBP. You can pick several at once.</span>
                            <input type="file" multiple accept="image/*" onChange={onImageChange} className="sr-only" />
                        </label>

                        {imagePreviews.length > 0 && (
                            <div className="mt-5">
                                <p className="text-xs font-medium text-muted-foreground">New images ({imagePreviews.length})</p>
                                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative overflow-hidden rounded-xl border border-border/60">
                                            <img src={preview} alt={`New ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => onRemoveImage(index)}
                                                aria-label="Remove image"
                                                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition active:scale-90 hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {existingImages.length > 0 && (
                            <div className="mt-5">
                                <p className="text-xs font-medium text-muted-foreground">Current images ({existingImages.length})</p>
                                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="relative overflow-hidden rounded-xl border border-border/60">
                                            <img src={image} alt={`Current ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => onRemoveExisting(index)}
                                                aria-label="Remove image"
                                                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition active:scale-90 hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Features */}
                    <section className={card}>
                        <h2 className="font-semibold">Features</h2>
                        <p className="mt-1 text-xs text-muted-foreground">Press Enter or tap Add after each one.</p>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        onAddFeature();
                                    }
                                }}
                                placeholder="e.g. Swimming pool"
                                className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button
                                type="button"
                                onClick={onAddFeature}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <Plus className="h-4 w-4" /> Add
                            </button>
                        </div>

                        {project.features && project.features.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {project.features.map((feature, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 rounded-full bg-secondary py-1.5 pl-4 pr-1.5 text-sm">
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => onRemoveFeature(index)}
                                            aria-label={`Remove ${feature}`}
                                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-red-100 hover:text-red-600 active:scale-90"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Publish toggle */}
                    <label className={`${card} flex cursor-pointer items-center justify-between gap-4`}>
                        <div>
                            <p className="font-semibold">Publish on website</p>
                            <p className="text-xs text-muted-foreground">Featured projects are shown to visitors.</p>
                        </div>
                        <input type="checkbox" name="featured" checked={project.featured} onChange={onChange} className="peer sr-only" />
                        <span className="relative h-7 w-12 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
                    </label>

                    {/* Actions: sticky on phones */}
                    <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pb-12 sm:backdrop-blur-none">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:flex-none sm:px-8"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {submitting ? "Saving..." : submitLabel}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-secondary active:scale-95"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}