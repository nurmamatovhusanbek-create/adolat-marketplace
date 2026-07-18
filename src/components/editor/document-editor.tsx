"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  CheckCircle,
  Clock,
  DownloadSimple,
  Eye,
  FileText,
  FloppyDisk,
  Lock,
  Sparkle,
  Spinner,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useAppUser } from "@/lib/auth/user-provider";

// ============================================================================
// Types — match the server-side template schema
// ============================================================================

interface FieldDef {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox";
  required: boolean;
  maxLength?: number;
  defaultValue?: string;
  hint?: string;
  options?: string[];
  placeholder?: string;
}

interface SectionDef {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

interface TemplateData {
  sections: SectionDef[];
}

interface BodyItem {
  type: "text" | "field" | "spacer";
  content?: string;
  style?: "heading" | "subheading" | "paragraph" | "list_item";
  fieldId?: string;
}

interface DocumentData {
  id: string;
  slug: string;
  titleUz: string;
  category: string;
  descriptionUz: string;
  isFree: boolean;
  priceUzs: number;
  legalBasisUz: string | null;
  pages: number;
  template: {
    fieldsSchema: string;
    bodySchema: string;
    estimatedFillMinutes: number;
  };
}

// ============================================================================
// Main editor component — rendered as a full-screen overlay
// ============================================================================

export function DocumentEditor() {
  const {
    editorDocumentSlug,
    setEditorDocumentSlug,
    editorDraftId,
    setEditorDraftId,
    setAuthOpen,
  } = useMarketplaceStore();
  const { user, refresh: refreshUser } = useAppUser();

  const isOpen = editorDocumentSlug !== null;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [body, setBody] = useState<BodyItem[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load document + template (+ existing draft if any)
  useEffect(() => {
    if (!editorDocumentSlug) return;
    setLoading(true);
    setErrors({});
    setValues({});
    setDoc(null);
    setTemplate(null);
    setBody([]);

    (async () => {
      try {
        // Fetch document detail
        const res = await fetch(`/api/documents?slug=${editorDocumentSlug}`);
        if (!res.ok) throw new Error("Hujjat topilmadi");
        const data = await res.json();
        const docData = data.document as DocumentData;
        if (!docData) throw new Error("Hujjat topilmadi");

        setDoc(docData);

        // Parse template
        const tpl = JSON.parse(docData.template.fieldsSchema) as TemplateData;
        const bd = JSON.parse(docData.template.bodySchema) as BodyItem[];
        setTemplate(tpl);
        setBody(bd);

        // If authenticated, check for existing draft
        if (user?.id) {
          const draftsRes = await fetch("/api/drafts", { credentials: "same-origin" });
          if (draftsRes.ok) {
            const draftsData = await draftsRes.json();
            const existing = draftsData.drafts.find(
              (d: { document: { slug: string }; id: string }) =>
                d.document.slug === editorDocumentSlug
            );
            if (existing) {
              // Load full draft values
              const draftRes = await fetch(`/api/drafts/${existing.id}`, {
                credentials: "same-origin",
              });
              if (draftRes.ok) {
                const draftData = await draftRes.json();
                setValues(draftData.draft.values ?? {});
                setEditorDraftId(draftData.draft.id);
                toast.info("Oldingi draf yuklandi", {
                  description: "Davom ettirishingiz mumkin.",
                });
              }
            }
          }
        }
      } catch (err) {
        toast.error("Hujjatni yuklab bo'lmadi", {
          description: err instanceof Error ? err.message : "Noma'lum xato",
        });
        setEditorDocumentSlug(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [editorDocumentSlug, user?.id, setEditorDraftId, setEditorDocumentSlug]);

  // Cleanup autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // Autosave with 1.5s debounce
  const triggerAutosave = useCallback(
    (newValues: Record<string, string>) => {
      if (!user?.id || !doc) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          const res = await fetch("/api/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
              documentId: doc.id,
              fieldValues: newValues,
              draftId: editorDraftId,
            }),
          });
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.draft?.id && data.draft.id !== editorDraftId) {
            setEditorDraftId(data.draft.id);
          }
        } catch {
          // Silent fail on autosave — don't bother user
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [user?.id, doc, editorDraftId, setEditorDraftId]
  );

  const updateField = (fieldId: string, value: string) => {
    const newValues = { ...values, [fieldId]: value };
    setValues(newValues);
    // Clear field error
    if (errors[fieldId]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[fieldId];
        return next;
      });
    }
    triggerAutosave(newValues);
  };

  const validateAll = (): boolean => {
    if (!template) return false;
    const newErrors: Record<string, string> = {};
    for (const section of template.sections) {
      for (const field of section.fields) {
        if (field.required && !values[field.id]?.trim()) {
          newErrors[field.id] = `${field.label} to'ldirilishi shart`;
        }
        if (field.type === "number" && values[field.id] && !/^-?\d+(\.\d+)?$/.test(values[field.id])) {
          newErrors[field.id] = "Faqat raqam kiriting";
        }
        if (field.type === "date" && values[field.id] && !/^\d{4}-\d{2}-\d{2}$/.test(values[field.id])) {
          newErrors[field.id] = "Sana formati: YYYY-MM-DD";
        }
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Formani to'liq to'ldiring", {
        description: `${Object.keys(newErrors).length} ta maydonda xato bor`,
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!user?.id) {
      toast.info("Avval tizimga kiring", {
        description: "Hujjat yuklab olish uchun ro'yxatdan o'tishingiz kerak.",
      });
      setAuthOpen(true, "signin");
      return;
    }
    if (!doc || !validateAll()) return;

    setDownloading(format);
    try {
      const res = await fetch(`/api/documents/${doc.slug}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          format,
          values,
          draftId: editorDraftId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Yuklab olish amalga oshmadi");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.slug}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update draft id from response header
      const newDraftId = res.headers.get("X-Draft-Id");
      if (newDraftId && newDraftId !== editorDraftId) {
        setEditorDraftId(newDraftId);
      }

      toast.success("Hujjat yuklab olindi!", {
        description: `${doc.titleUz} (${format.toUpperCase()})`,
      });
      refreshUser();
    } catch (err) {
      toast.error("Yuklab olish amalga oshmadi", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleReset = () => {
    if (confirm("Barcha maydonlarni tozalashni xohlaysizmi?")) {
      setValues({});
      setErrors({});
      toast.info("Forma tozalandi");
    }
  };

  const handleClose = () => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    setEditorDocumentSlug(null);
    setEditorDraftId(null);
    setShowPreview(false);
  };

  const filledFieldsCount = template
    ? template.sections.reduce(
        (acc, s) => acc + s.fields.filter((f) => values[f.id]?.trim()).length,
        0
      )
    : 0;
  const totalFieldsCount = template
    ? template.sections.reduce((acc, s) => acc + s.fields.length, 0)
    : 0;
  const progress = totalFieldsCount > 0 ? Math.round((filledFieldsCount / totalFieldsCount) * 100) : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="bottom" className="h-[100vh] w-full max-w-none rounded-none p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
              <ArrowLeft weight="regular" className="h-5 w-5" />
            </Button>
            {doc && (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold sm:text-base">{doc.titleUz}</h2>
                <p className="text-xs text-muted-foreground">
                  {totalFieldsCount} maydon · {doc.template.estimatedFillMinutes} daqiqa · {progress}% bajarildi
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <Spinner weight="regular" className="h-3 w-3 animate-spin" />
                Saqlanmoqda...
              </span>
            )}
            {user?.id && editorDraftId && (
              <Badge variant="outline" className="hidden items-center gap-1 text-emerald-700 sm:flex">
                <CheckCircle weight="regular" className="h-3 w-3" />
                Draf saqlangan
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="gap-1.5">
              <Eye weight="regular" className="h-4 w-4" />
              <span className="hidden sm:inline">Namuna</span>
            </Button>
            <Button
              size="sm"
              onClick={() => handleDownload("pdf")}
              disabled={downloading !== null || loading}
              className="gap-1.5"
            >
              {downloading === "pdf" ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <DownloadSimple weight="regular" className="h-4 w-4" />}
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload("docx")}
              disabled={downloading !== null || loading}
              className="gap-1.5"
            >
              {downloading === "docx" ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <FileText weight="regular" className="h-4 w-4" />}
              <span className="hidden sm:inline">DOCX</span>
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Body */}
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner weight="regular" className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : doc && template ? (
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
              {/* Document metadata card */}
              <Card className="mb-6 border-border bg-secondary/30 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-foreground sm:text-xl">{doc.titleUz}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{doc.descriptionUz}</p>
                    {doc.legalBasisUz && (
                      <p className="mt-2 text-xs">
                        <strong className="text-foreground">Huquqiy asos: </strong>
                        <span className="text-muted-foreground">{doc.legalBasisUz}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {doc.isFree ? (
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                        <Sparkle weight="fill" className="mr-1 h-3 w-3" /> Bepul
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{doc.priceUzs.toLocaleString("ru-RU")} so'm</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText weight="regular" className="h-3.5 w-3.5" />
                    {doc.pages} bet
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock weight="regular" className="h-3.5 w-3.5" />
                    {doc.template.estimatedFillMinutes} daqiqa
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle weight="regular" className="h-3.5 w-3.5" />
                    {totalFieldsCount} maydon
                  </span>
                </div>
              </Card>

              {!user?.id && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                  <Lock weight="regular" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div className="flex-1">
                    <strong className="text-amber-900">Draf saqlash va yuklab olish uchun tizimga kiring</strong>
                    <p className="mt-0.5 text-xs text-amber-800">
                      Forma to'ldirib borishingiz mumkin, lekin fayl yuklab olish va
                      keyin davom ettirish uchun hisobingiz bo'lishi shart.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAuthOpen(true, "signin")}
                    className="border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                  >
                    Kirish
                  </Button>
                </div>
              )}

              {/* Form sections */}
              {template.sections.map((section, idx) => (
                <Card key={section.id} className="mb-5 border-border p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="mt-1 pl-9 text-xs text-muted-foreground">{section.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <FieldRenderer
                        key={field.id}
                        field={field}
                        value={values[field.id] ?? ""}
                        error={errors[field.id]}
                        onChange={(v) => updateField(field.id, v)}
                      />
                    ))}
                  </div>
                </Card>
              ))}

              {/* Reset + actions */}
              <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={handleReset} className="gap-1.5 text-muted-foreground">
                  <ArrowCounterClockwise weight="regular" className="h-4 w-4" />
                  Formani tozalash
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload("docx")}
                    disabled={downloading !== null}
                    className="gap-1.5"
                  >
                    {downloading === "docx" ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <FileText weight="regular" className="h-4 w-4" />}
                    DOCX yuklab olish
                  </Button>
                  <Button
                    onClick={() => handleDownload("pdf")}
                    disabled={downloading !== null}
                    className="gap-1.5"
                  >
                    {downloading === "pdf" ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <DownloadSimple weight="regular" className="h-4 w-4" />}
                    PDF yuklab olish
                  </Button>
                </div>
              </div>

              {/* Validation summary */}
              {Object.keys(errors).length > 0 && (
                <Card className="mb-6 border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2 text-sm text-red-800">
                    <WarningCircle weight="regular" className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <strong>{Object.keys(errors).length} ta maydonda xato bor.</strong>
                      <p className="mt-0.5 text-xs">Qizil ramkali maydonlarni to'g'rilang va qayta urinib ko'ring.</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : null}
        </div>

        {/* Preview sheet */}
        <Sheet open={showPreview} onOpenChange={setShowPreview}>
          <SheetContent side="right" className="w-screen h-screen overflow-y-auto p-0" style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2">
                <Eye weight="regular" className="h-4 w-4 text-primary" />
                Hujjat namunasi
              </SheetTitle>
            </SheetHeader>
            <div className="p-6">
              {doc && body.length > 0 ? (
                <DocumentPreview title={doc.titleUz} body={body} values={values} />
              ) : (
                <div className="text-sm text-muted-foreground">Namuna tayyor emas.</div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// Field renderer — handles all field types
// ============================================================================

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const colSpan = field.type === "textarea" ? "sm:col-span-2" : "";

  return (
    <div className={colSpan}>
      <Label htmlFor={`f-${field.id}`} className="text-xs font-semibold">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      {field.type === "textarea" ? (
        <Textarea
          id={`f-${field.id}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={3}
          className={`mt-1.5 resize-none ${error ? "border-red-400" : ""}`}
        />
      ) : field.type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`mt-1.5 ${error ? "border-red-400" : ""}`}>
            <SelectValue placeholder={field.placeholder ?? "Tanlang"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === "checkbox" ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            id={`f-${field.id}`}
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(e.target.checked ? "true" : "false")}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-muted-foreground">{field.placeholder ?? "Ha"}</span>
        </div>
      ) : (
        <Input
          id={`f-${field.id}`}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={`mt-1.5 ${error ? "border-red-400" : ""}`}
        />
      )}

      {field.hint && !error && (
        <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p>
      )}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-red-600">
          <WarningCircle weight="regular" className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Document preview — renders body with substituted values
// ============================================================================

function DocumentPreview({
  title,
  body,
  values,
}: {
  title: string;
  body: BodyItem[];
  values: Record<string, string>;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-xl font-bold">{title}</h1>
      {body.map((item, idx) => {
        if (item.type === "spacer") return <div key={idx} className="h-4" />;
        if (item.type === "field") {
          const val = values[item.fieldId ?? ""] ?? "";
          return (
            <span
              key={idx}
              className={`mx-1 inline-block min-w-32 rounded px-1 ${
                val ? "border-b-2 border-emerald-500 bg-emerald-50 font-medium" : "border-b border-dashed border-gray-400 bg-gray-50 text-gray-400"
              }`}
            >
              {val || "_________________"}
            </span>
          );
        }
        // Text
        const cls =
          item.style === "heading"
            ? "mt-4 mb-2 font-bold text-base"
            : item.style === "subheading"
              ? "mt-3 mb-1 font-semibold text-sm"
              : item.style === "list_item"
                ? "ml-4 text-sm leading-relaxed"
                : "text-sm leading-relaxed";
        return (
          <p key={idx} className={cls}>
            {item.content}
          </p>
        );
      })}
      <Separator className="my-6" />
      <p className="text-center text-[10px] text-muted-foreground">
        Bu namuna — yuklab olingan PDF/DOCX da to'liq formatlanadi.
      </p>
    </div>
  );
}
