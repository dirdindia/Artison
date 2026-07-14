import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Shield, Truck, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/data/products"; // keeping formatPrice utility if it exists
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchProductDetails = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
        const res = await api.get(`/products/${id}`);
        if (res.data && res.data.data) {
          setProduct(res.data.data);
          setActiveImage(res.data.data.image || "https://placehold.co/400x500");
          
          // Fetch related products from same category
          if (res.data.data.category && res.data.data.category._id) {
            const relatedRes = await api.get(`/products?category=${res.data.data.category._id}&limit=4`);
            if (relatedRes.data && relatedRes.data.data) {
              const formattedRelated = relatedRes.data.data
                .filter(p => p._id !== id) // exclude current product
                .map(p => ({
                  id: p._id,
                  title: p.name,
                  artist: p.subCategory ? p.subCategory.name : "Unknown Artist",
                  price: p.price,
                  image: p.image || "https://placehold.co/400x500",
                  category: p.category ? p.category.name : "Art"
                }));
              setRelated(formattedRelated);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product details", err);
        setError("Product not found or error loading data.");
      } finally {
        if (showLoader) setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess("Review submitted successfully! It will appear once verified by an admin.");
      setComment("");
      setRating(5);
      // Refresh product details without showing the full page loader
      fetchProductDetails(false);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review. You may have already reviewed this product.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <AppShell title="Loading">
      <div className="p-20 text-center text-muted-foreground">Loading product details...</div>
    </AppShell>
  );
  
  if (error || !product) return (
    <AppShell title="Not Found">
      <div className="p-20 text-center text-destructive">{error || "Product not found."}</div>
    </AppShell>
  );

  const artistName = product.subCategory ? product.subCategory.name : "Unknown Artist";
  const categoryName = product.category ? product.category.name : "Art";

  return (
    <AppShell title={product.name}>
      <div className="px-5 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft hover:bg-accent transition-colors"><Heart className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft hover:bg-accent transition-colors"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-6">
          {/* Left Column: Images */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="overflow-hidden rounded-3xl bg-canvas shadow-card flex items-center justify-center p-4 aspect-square md:aspect-[4/5] lg:aspect-square">
              <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain rounded-2xl transition-all duration-300" />
            </div>
            
            {/* Gallery Thumbnails */}
            {((product.gallery && product.gallery.length > 0) || product.image) && (
              <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button 
                  onClick={() => setActiveImage(product.image)} 
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas border-2 transition-colors ${activeImage === product.image ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img src={product.image} className="h-full w-full object-cover" alt="Thumbnail main" />
                </button>
                {product.gallery && product.gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)} 
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas border-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={img} className="h-full w-full object-cover" alt={`Thumbnail ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div>
              <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground inline-block">
                {categoryName}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        product.rating >= star
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">{product.name}</h1>
              <div className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">₹{product.price?.toLocaleString()}</div>
              
              <button
                onClick={() => addToCart(product)}
                className="mt-8 hidden w-full rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-soft md:block md:max-w-md hover:opacity-90 transition-opacity hover:-translate-y-1">
                Add to cart
              </button>
            </div>

            {product.subCategory && (
              <Link to="#" className="mt-8 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft hover:bg-accent transition-colors md:max-w-md border border-border/40">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-muted text-xl font-bold">
                  {artistName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-bold">{artistName}</div>
                  <div className="text-sm text-muted-foreground">Verified Artist</div>
                </div>
                <button className="shrink-0 rounded-full border border-foreground/20 px-4 py-2 text-xs font-bold hover:bg-foreground hover:text-background transition-colors">Follow</button>
              </Link>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4 text-center md:max-w-md">
              <Spec label="SKU" value={product.sku || "N/A"} />
              <Spec label="Stock" value={product.stock > 0 ? "In Stock" : "Out of Stock"} />
              {product.dimensions && <Spec label="Dimensions" value={product.dimensions} />}
              {product.weight && <Spec label="Weight" value={`${product.weight} kg`} />}
            </div>

            <div className="mt-8 md:max-w-lg">
              <h3 className="font-display text-xl font-bold border-b pb-3 mb-4">About the piece</h3>
              <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">{product.description || "No description provided."}</p>
            </div>

            <div className="mt-8 space-y-4 md:max-w-md">
              <Perk icon={Truck} title="Free worldwide shipping" sub="Insured & tracked delivery" />
              <Perk icon={Shield} title="Authenticity guarantee" sub="Verified original artwork" />
            </div>
          </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-border/40 pt-10">
          <h3 className="mb-6 font-display text-2xl font-bold">Reviews & Feedback</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Reviews List */}
            <div className="space-y-6">
              {product.reviews && product.reviews.filter(r => r.isVerified).length > 0 ? (
                product.reviews.filter(r => r.isVerified).map((review, i) => (
                  <div key={i} className="rounded-2xl bg-card p-5 shadow-soft border border-border/40">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-bold text-foreground">{review.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            review.rating >= star
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-muted p-8 text-center text-muted-foreground">
                  No reviews yet. Be the first to review this artwork!
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <div>
              <div className="rounded-2xl bg-card p-6 shadow-soft border border-border/40">
                <h4 className="font-bold text-lg mb-4">Write a Review</h4>
                {isAuthenticated ? (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            onClick={() => setRating(star)}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              rating >= star
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted hover:text-primary/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Feedback</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="What do you think about this artwork?"
                      ></textarea>
                    </div>
                    {reviewError && <div className="text-sm text-destructive font-medium">{reviewError}</div>}
                    {reviewSuccess && <div className="text-sm text-green-600 font-medium">{reviewSuccess}</div>}
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background hover:bg-foreground/90 disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-xl bg-muted p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">Please log in to share your thoughts.</p>
                    <Link to="/login" className="inline-block rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pb-24 md:pb-16 border-t border-border/40 pt-10">
            <h3 className="mb-6 font-display text-2xl font-bold">More like this</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
    
 

      <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:hidden">
        <button
          onClick={() => addToCart(product)}
          className="w-full rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-card transition active:scale-[0.98]">
          Add to cart · ₹{product.price?.toLocaleString()}
        </button>
      </div>
    </AppShell>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-soft border border-border/40">
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 truncate text-sm font-bold">{value}</div>
    </div>
  );
}

function Perk({ icon: Icon, title, sub }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft border border-border/40">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-base font-bold">{title}</div>
        <div className="truncate text-sm text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
