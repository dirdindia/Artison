















const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const products = [
{ id: "1", title: "Crimson Bloom", artist: "Ananya Verma", artistId: "a1", category: "Painting", price: 18500, image: img("photo-1579546929518-9e396f3cc809"), medium: "Oil on canvas", size: "60 x 90 cm", year: 2024, description: "A vivid bloom of crimson and ochre, hand-painted in layered oils." },
{ id: "2", title: "Neon Geisha", artist: "Riya Kapoor", artistId: "a2", category: "3D Art", price: 9200, image: img("photo-1578926375605-eaf7559b1458"), medium: "3D render, limited edition", size: "Digital, 4K", year: 2025, description: "Cyberpunk-inspired 3D portrait, signed limited print." },
{ id: "3", title: "Monsoon Street", artist: "Karan Mehta", artistId: "a3", category: "Painting", price: 24000, image: img("photo-1579783902614-a3fb3927b6a5"), medium: "Acrylic on canvas", size: "75 x 100 cm", year: 2023, description: "Rainy Mumbai lanes captured in dripping acrylic strokes." },
{ id: "4", title: "Quiet Mountain", artist: "Ishaan Roy", artistId: "a4", category: "Digital Art", price: 4500, image: img("photo-1578321272176-b7bbc0679853"), medium: "Digital illustration", size: "A2 print", year: 2024, description: "Minimal Himalayan landscape, printed on archival paper." },
{ id: "5", title: "Bronze Dancer", artist: "Meera Pillai", artistId: "a5", category: "Sculpture", price: 56000, image: img("photo-1542281286-9e0a16bb7366"), medium: "Cast bronze", size: "32 cm tall", year: 2022, description: "Hand-cast bronze sculpture of a classical dancer mid-spin." },
{ id: "6", title: "Saffron Saint", artist: "Ananya Verma", artistId: "a1", category: "Painting", price: 32000, image: img("photo-1577720580479-7d839d829c73"), medium: "Mixed media", size: "80 x 120 cm", year: 2024, description: "Devotional portrait in saffron and indigo washes." },
{ id: "7", title: "Floating City", artist: "Riya Kapoor", artistId: "a2", category: "3D Art", price: 12500, image: img("photo-1618005182384-a83a8bd57fbe"), medium: "3D render", size: "Digital, 6K", year: 2025, description: "A surreal floating metropolis rendered in golden hour light." },
{ id: "8", title: "Forest Whisper", artist: "Ishaan Roy", artistId: "a4", category: "Digital Art", price: 3800, image: img("photo-1541680670548-88e8cd23c0f4"), medium: "Digital painting", size: "A3 print", year: 2024, description: "Soft, dreamy forest scene with diffused light." }];


export const categories = [
{ name: "Painting", icon: "🎨" },
{ name: "3D Art", icon: "🧊" },
{ name: "Digital Art", icon: "🖼️" },
{ name: "Sculpture", icon: "🗿" }];


export const artists = [
{ id: "a1", name: "Ananya Verma", avatar: img("photo-1494790108377-be9c29b29330"), works: 24, followers: "12.4k" },
{ id: "a2", name: "Riya Kapoor", avatar: img("photo-1438761681033-6461ffad8d80"), works: 18, followers: "8.9k" },
{ id: "a3", name: "Karan Mehta", avatar: img("photo-1500648767791-00dcc994a43e"), works: 31, followers: "15.2k" },
{ id: "a4", name: "Ishaan Roy", avatar: img("photo-1472099645785-5658abf4ff4e"), works: 12, followers: "5.6k" },
{ id: "a5", name: "Meera Pillai", avatar: img("photo-1531123897727-8f129e1688ce"), works: 9, followers: "21k" }];


export const formatPrice = (n) => `₹${n.toLocaleString("en-IN")}`;