import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogOut, Upload, Save, Plus, Trash2, Image, FileText, Settings, Briefcase, LayoutGrid,
} from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"hero" | "resume" | "about" | "work" | "behance">("hero");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user || !isAdmin) return null;

  const tabs = [
    { id: "hero" as const, label: "Hero", icon: Image },
    { id: "resume" as const, label: "Resume", icon: FileText },
    { id: "about" as const, label: "About", icon: Settings },
    { id: "work" as const, label: "Work", icon: Briefcase },
    { id: "behance" as const, label: "Behance", icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/SY-Logo.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="font-heading text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/admin/login"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-heading text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "hero" && <HeroSettings />}
        {activeTab === "resume" && <ResumeSettings />}
        {activeTab === "about" && <AboutSettings />}
        {activeTab === "work" && <ProjectsManager section="work" />}
        {activeTab === "behance" && <ProjectsManager section="behance" />}
      </div>
    </div>
  );
};

// ─── Setting Hook ───
function useSetting(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();
      return data;
    },
  });
}

function useSaveSetting(key: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (value: any) => {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value })
          .eq("key", key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ key, value });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings", key] });
      toast({ title: "Saved!", description: `${key} settings updated.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ─── File Upload Helper ───
async function uploadFile(file: File, path: string) {
  const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}

// ─── Hero Settings ───
function HeroSettings() {
  const { data: setting, isLoading } = useSetting("hero");
  const save = useSaveSetting("hero");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (setting?.value) {
      const v = setting.value as any;
      setName(v.name || "");
      setSubtitle(v.subtitle || "");
      setDescription(v.description || "");
      setHeroImageUrl(v.hero_image_url || "");
    }
  }, [setting]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `hero/${Date.now()}-${file.name}`);
      setHeroImageUrl(url);
    } catch (err: any) {
      alert(err.message);
    }
    setUploading(false);
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-heading text-2xl font-bold">Hero Section</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border/50" placeholder="Saurav Yadav" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Subtitle</label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-secondary border-border/50" placeholder="Creative Designer & Developer" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border/50 resize-none" rows={3} placeholder="A passionate designer..." />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-sm text-muted-foreground mb-1 block">Hero Image</label>
          {heroImageUrl && (
            <img src={heroImageUrl} alt="Hero preview" className="w-48 h-48 object-cover rounded-xl border border-border" />
          )}
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
      <Button
        onClick={() => save.mutate({ name, subtitle, description, hero_image_url: heroImageUrl })}
        disabled={save.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold gap-2"
      >
        <Save className="w-4 h-4" />
        {save.isPending ? "Saving..." : "Save Hero Settings"}
      </Button>
    </div>
  );
}

// ─── Resume Settings ───
function ResumeSettings() {
  const { data: setting, isLoading } = useSetting("resume");
  const save = useSaveSetting("resume");
  const [pdfUrl, setPdfUrl] = useState("");
  const [docxUrl, setDocxUrl] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (setting?.value) {
      const v = setting.value as any;
      setPdfUrl(v.pdf_url || "");
      setDocxUrl(v.docx_url || "");
    }
  }, [setting]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "docx") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(type);
    try {
      const url = await uploadFile(file, `resume/${type}-${Date.now()}-${file.name}`);
      if (type === "pdf") setPdfUrl(url);
      else setDocxUrl(url);
    } catch (err: any) {
      alert(err.message);
    }
    setUploading(null);
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-heading text-2xl font-bold">Resume Files</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground block">PDF Resume</label>
          {pdfUrl && <p className="text-xs text-primary truncate">{pdfUrl}</p>}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            {uploading === "pdf" ? "Uploading..." : "Upload PDF"}
            <input type="file" accept=".pdf" onChange={(e) => handleUpload(e, "pdf")} className="hidden" />
          </label>
        </div>
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground block">DOCX Resume</label>
          {docxUrl && <p className="text-xs text-primary truncate">{docxUrl}</p>}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            {uploading === "docx" ? "Uploading..." : "Upload DOCX"}
            <input type="file" accept=".docx" onChange={(e) => handleUpload(e, "docx")} className="hidden" />
          </label>
        </div>
      </div>
      <Button
        onClick={() => save.mutate({ pdf_url: pdfUrl, docx_url: docxUrl })}
        disabled={save.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold gap-2"
      >
        <Save className="w-4 h-4" />
        {save.isPending ? "Saving..." : "Save Resume Settings"}
      </Button>
    </div>
  );
}

// ─── About Settings ───
function AboutSettings() {
  const { data: setting, isLoading } = useSetting("about");
  const save = useSaveSetting("about");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [projectsDone, setProjectsDone] = useState("");
  const [happyClients, setHappyClients] = useState("");

  useEffect(() => {
    if (setting?.value) {
      const v = setting.value as any;
      setName(v.name || "");
      setRole(v.role || "");
      setLocation(v.location || "");
      setEmail(v.email || "");
      setBio(v.bio || "");
      setSkills((v.skills || []).join(", "));
      setYearsExp(v.years_exp || "");
      setProjectsDone(v.projects_done || "");
      setHappyClients(v.happy_clients || "");
    }
  }, [setting]);

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-heading text-2xl font-bold">About Section</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border/50" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Role</label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} className="bg-secondary border-border/50" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-secondary border-border/50" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border/50" />
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Bio</label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-secondary border-border/50 resize-none" rows={3} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Skills (comma-separated)</label>
        <Input value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-secondary border-border/50" placeholder="React, TypeScript, Figma" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Years Experience</label>
          <Input value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="bg-secondary border-border/50" placeholder="5+" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Projects Done</label>
          <Input value={projectsDone} onChange={(e) => setProjectsDone(e.target.value)} className="bg-secondary border-border/50" placeholder="50+" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Happy Clients</label>
          <Input value={happyClients} onChange={(e) => setHappyClients(e.target.value)} className="bg-secondary border-border/50" placeholder="30+" />
        </div>
      </div>
      <Button
        onClick={() =>
          save.mutate({
            name, role, location, email, bio,
            skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
            years_exp: yearsExp, projects_done: projectsDone, happy_clients: happyClients,
          })
        }
        disabled={save.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold gap-2"
      >
        <Save className="w-4 h-4" />
        {save.isPending ? "Saving..." : "Save About Settings"}
      </Button>
    </div>
  );
}

// ─── Projects Manager (Work & Behance) ───
function ProjectsManager({ section }: { section: "work" | "behance" }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("section", section)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "", description: "", link: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({ title: "", category: "", description: "", link: "", image_url: "" });
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `projects/${Date.now()}-${file.name}`);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err: any) {
      alert(err.message);
    }
    setUploading(false);
  };

  const saveProject = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from("projects").update({ ...form }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert({
          ...form,
          section,
          sort_order: projects.length,
        });
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["projects", section] });
      toast({ title: "Saved!" });
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["projects", section] });
      toast({ title: "Deleted!" });
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      link: p.link,
      image_url: p.image_url,
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-heading text-2xl font-bold">
          {editingId ? "Edit" : "Add"} {section === "work" ? "Project" : "Behance Project"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary border-border/50" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Category</label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-secondary border-border/50" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Description</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border/50 resize-none" rows={2} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Link URL</label>
          <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="bg-secondary border-border/50" placeholder="https://..." />
        </div>
        <div className="flex items-center gap-4">
          {form.image_url && <img src={form.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-border" />}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <div className="flex gap-3">
          <Button onClick={saveProject} className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold gap-2">
            <Save className="w-4 h-4" />
            {editingId ? "Update" : "Add"} Project
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="glass-card p-4 flex items-center gap-4">
            {p.image_url && <img src={p.image_url} alt={p.title} className="w-16 h-16 object-cover rounded-lg border border-border" />}
            <div className="flex-1 min-w-0">
              <p className="font-heading font-semibold truncate">{p.title}</p>
              <p className="text-muted-foreground text-xs">{p.category}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No projects yet. Add your first one above!</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
