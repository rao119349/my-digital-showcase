
-- Create site_settings table for hero content, about, etc.
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings (public portfolio)
CREATE POLICY "Site settings are publicly readable" ON public.site_settings
  FOR SELECT USING (true);

-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for site_settings
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read roles
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Work/portfolio projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '#',
  section TEXT NOT NULL DEFAULT 'work',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly readable" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for uploads (resumes, hero image)
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Uploads are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Admins can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
