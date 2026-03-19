import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResumeDialog = ({ open, onOpenChange }: ResumeDialogProps) => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings", "resume"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "resume")
        .maybeSingle();
      return data?.value as { pdf_url?: string; docx_url?: string } | null;
    },
  });

  const pdfUrl = settings?.pdf_url || "/resume.pdf";
  const docxUrl = settings?.docx_url || "/resume.docx"; // fallback

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Download Resume
          </DialogTitle>
          <DialogDescription>Choose your preferred format</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold gap-3 py-6"
            asChild
          >
            <a href={pdfUrl} download="Saurav_Yadav_Resume.pdf">
              <FileText className="w-5 h-5" />
              Download PDF
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary font-heading font-semibold gap-3 py-6"
            asChild
          >
            <a href={docxUrl} download="Saurav_Yadav_Resume.docx">
              <Download className="w-5 h-5" />
              Download DOCX
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog;
