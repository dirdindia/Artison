import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Phone, Loader2, Link2, Instagram, Paintbrush, FileText, Camera, Upload, CheckCircle2, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { toast } from "sonner";

export default function ArtistSignup() {
  const [step, setStep] = useState(1);
  
  // Step 1: Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Step 2: Artist Details
  const [bio, setBio] = useState("");
  const [artCategory, setArtCategory] = useState("");
  const [artSubcategory, setArtSubcategory] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  
  // Step 3: Profile Picture
  const [avatar, setAvatar] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  // Categories state
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, subcatRes] = await Promise.all([
          api.get('/categories?limit=100'),
          api.get('/subcategories?limit=500')
        ]);
        if (catRes.data.success) {
          setCategories(catRes.data.data.categories || catRes.data.data); // depending on backend structure
        }
        if (subcatRes.data.success) {
          setSubCategories(subcatRes.data.data.subCategories || subcatRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (artCategory && subCategories.length > 0) {
      // Find subcategories where subcat.category === artCategory (or subcat.category._id === artCategory)
      const filtered = subCategories.filter(
        sub => sub.category === artCategory || sub.category?._id === artCategory
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [artCategory, subCategories]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setAvatar(data.data.url);
        toast.success('Profile picture uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 3) return;

    setLoading(true);
    try {
      await signup(name, email, password, phone, "artist", {
        bio,
        artCategory,
        artSubcategory,
        portfolioUrl,
        instagramHandle,
        avatar
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-canvas">
        <img 
          src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80" 
          alt="Artist Workspace" 
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-10 left-10 text-primary-foreground max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">Turn your passion into a business.</h2>
          <p className="mt-4 text-primary-foreground/80">Join Kalakosh to showcase and sell your extraordinary original artwork to the world.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 relative">
          
          {/* Back to Home / Back Step */}
          {step === 1 ? (
            <Link to="/" className="absolute -top-6 -left-2 sm:-left-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          ) : (
            <button onClick={handleBack} className="absolute -top-6 -left-2 sm:-left-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to previous step
            </button>
          )}

          <div className="space-y-2 text-center lg:text-left mt-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Become an Artist</h1>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            
            {/* STEP 1 */}
            <div className={`space-y-4 ${step !== 1 ? 'hidden' : 'animate-in fade-in slide-in-from-right-4'}`}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Full Name / Brand Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    required={step === 1}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="Jane Doe or Jane's Art" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    required={step === 1}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="tel" 
                    required={step === 1}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    required={step === 1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="Create a strong password" 
                  />
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={`space-y-4 ${step !== 2 ? 'hidden' : 'animate-in fade-in slide-in-from-right-4'}`}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Art Category</label>
                <div className="relative">
                  <Paintbrush className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select 
                    required={step === 2}
                    value={artCategory}
                    onChange={(e) => {
                      setArtCategory(e.target.value);
                      setArtSubcategory(""); // Reset subcategory when category changes
                    }}
                    className="flex h-10 w-full appearance-none rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                  >
                    <option value="" disabled>Select a Category</option>
                    {(categories || []).map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Art Subcategory (Optional)</label>
                <div className="relative">
                  <Paintbrush className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select 
                    value={artSubcategory}
                    onChange={(e) => setArtSubcategory(e.target.value)}
                    disabled={!artCategory}
                    className="flex h-10 w-full appearance-none rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a Subcategory (Optional)</option>
                    {filteredSubCategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Artist Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea 
                    value={bio}
                    required={step === 2}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="flex w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow resize-none"
                    placeholder="Tell us a little about your art and background..." 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Portfolio Website (Optional)</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="url" 
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="https://yourwebsite.com" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Instagram Handle (Optional)</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                    placeholder="@yourart" 
                  />
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className={`space-y-6 flex flex-col items-center justify-center py-4 ${step !== 3 ? 'hidden' : 'animate-in fade-in slide-in-from-right-4'}`}>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">Add a photo so collectors can recognize you.</p>
              </div>

              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${avatar ? 'border-primary' : 'border-muted-foreground/30 group-hover:border-primary/50'}`}>
                  {uploadingImage ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Camera className="h-8 w-8 mb-1" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  )}
                </div>
                {avatar && !uploadingImage && (
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>

              {!avatar && !uploadingImage && (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Upload className="w-4 h-4" /> Select an Image
                </button>
              )}
            </div>

            <div className="pt-2">
              {step < 3 ? (
                <button 
                  type="submit" 
                  className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading || uploadingImage}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an artist account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
          
          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Looking to buy art?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">
                Join as a User
              </Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
