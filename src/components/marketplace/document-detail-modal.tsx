"use client";

import {
  Star,
  Download,
  Clock,
  FileText,
  Tag,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calendar,
  Eye,
  FileCheck2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { formatDownloads, formatPrice } from "@/lib/marketplace/format";

export function DocumentDetailModal() {
  const { activeDocument, setActiveDocument, setEditorDocumentSlug, setEditorDraftId } = useMarketplaceStore();

  const doc = activeDocument;
  const isOpen = doc !== null;

  const handleClose = () => setActiveDocument(null);

  const handleStartEditing = () => {
    if (!doc) return;
    // Open the editor with this document's slug
    setEditorDraftId(null);
    setEditorDocumentSlug(doc.slug);
    handleClose();
  };

  const handleDownload = () => {
    // For now, redirect to editor for actual filling + download
    handleStartEditing();
  };

  const handlePreview = () => {
    if (!doc) return;
    // Open the editor — user can see preview tab there
    handleStartEditing();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[90vh] w-[98vw] max-w-7xl overflow-y-auto p-0 scrollbar-thin">
        {doc && (
          <>
            {/* Header */}
            <div className="border-b border-border bg-gradient-to-br from-secondary/60 to-secondary/30 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 pr-6">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[11px]">
                      {DOCUMENT_CATEGORIES.find((c) => c.id === doc.category)?.nameUz}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {doc.subcategory}
                    </Badge>
                    {doc.isFree && (
                      <Badge className="bg-emerald-600 text-white text-[11px] hover:bg-emerald-600">
                        Bepul
                      </Badge>
                    )}
                    {doc.isNew && (
                      <Badge className="bg-accent text-accent-foreground text-[11px]">Yangi</Badge>
                    )}
                  </div>
                  <DialogTitle className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
                    {doc.titleUz}
                  </DialogTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{doc.descriptionUz}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <strong className="text-foreground">{doc.rating}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {formatDownloads(doc.downloads)} yuklash
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {doc.pages} bet
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {doc.estimatedFillMinutes} daqiqa
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Yangilangan: {doc.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Pricing box */}
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Narx
                    </div>
                    {doc.isFree ? (
                      <div className="mt-1 flex items-center gap-2 text-3xl font-bold text-emerald-700">
                        <Sparkles className="h-6 w-6" />
                        Bepul
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2 text-3xl font-bold text-foreground">
                        <Tag className="h-6 w-6 text-accent" />
                        {formatPrice(doc.priceUzs)}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground">
                      Bir marta to'lov · Cheksiz yuklab olish
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleDownload} size="lg" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      {doc.isFree ? "To'ldirish va yuklab olish" : "To'ldirish va sotib olish"}
                    </Button>
                    <Button onClick={handlePreview} variant="outline" size="sm" className="gap-1.5">
                      <Eye className="h-4 w-4" />
                      Namunani ko'rish
                    </Button>
                  </div>
                </div>

                {/* Formats */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-primary/10 pt-3 text-xs">
                  <span className="font-medium text-muted-foreground">Mavjud formatlar:</span>
                  {doc.formats.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 font-bold uppercase"
                    >
                      <FileCheck2 className="h-3 w-3 text-primary" />
                      {f}
                    </span>
                  ))}
                  <span className="ml-auto text-muted-foreground">
                    {doc.fieldsCount} maydonni to'ldirish kerak
                  </span>
                </div>
              </div>

              {/* What's included */}
              <DialogHeader className="mt-6 text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Hujjatga nima kiradi
                </DialogTitle>
              </DialogHeader>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Feature text="To'liq tayyor matn (O'zbek tilida)" />
                <Feature text={`${doc.fieldsCount} ta to'ldiriladigan maydon`} />
                <Feature text="Har bir maydon uchun maslahatlar" />
                <Feature text="Onlayn konstruktorda tahrirlash" />
                <Feature text={`${doc.formats.join(", ").toUpperCase()} formatlar`} />
                <Feature text="Cheksiz marta yuklab olish" />
                <Feature text="Qonunchilikka muvofiqlik kafolati" />
                <Feature text="Bepul yangilanishlar" />
              </ul>

              <Separator className="my-6" />

              {/* Legal basis */}
              <DialogHeader className="text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Huquqiy asos
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                <FileText className="mr-2 inline h-4 w-4 text-primary" />
                {doc.legalBasisUz}
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Russian title for cross-reference */}
              <div className="mt-4 rounded-lg border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Русское название: </span>
                {doc.titleRu}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground/90">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{text}</span>
    </li>
  );
}
