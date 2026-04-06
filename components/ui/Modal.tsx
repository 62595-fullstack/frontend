/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Add proper types when backend API is finalized
'use client'

import { useState, useRef, useEffect, ReactNode } from "react";

// Field type definitions
interface BaseField {
  name: string;
  label: string;
  required?: boolean;
}

interface TextField extends BaseField {
  type: "text";
  placeholder?: string;
}

interface TextAreaField extends BaseField {
  type: "textarea";
  placeholder?: string;
  rows?: number;
}

interface DropdownField extends BaseField {
  type: "dropdown";
  options: { value: string | number; label: string }[];
}

interface FileField extends BaseField {
  type: "file";
  accept?: string;
}

interface DateField extends BaseField {
  type: "date";
}

interface NumberField extends BaseField {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
}

type Field = TextField | TextAreaField | DropdownField | FileField | DateField | NumberField;

interface ModalProps {
  title: string;
  fields: Field[];
  submitLabel?: string;
  submittingLabel?: string;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  error?: string | null;
}

export default function Modal({
  title,
  fields,
  submitLabel = "Submit",
  submittingLabel = "Submitting…",
  onClose,
  onSubmit,
  error,
}: ModalProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "dropdown" && field.options.length > 0) {
        initial[field.name] = field.options[0].value;
      } else if (field.type === "file") {
        initial[field.name] = null;
        initial[`${field.name}Preview`] = "";
      } else if (field.type === "number") {
        initial[field.name] = "";
      } else {
        initial[field.name] = "";
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  function setValue(name: string, value: any) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  }

  function handleFileChange(field: FileField, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setValues((prev) => ({
        ...prev,
        [`${field.name}Preview`]: dataUrl,
        [field.name]: {
          fileName: file.name,
          fileType: file.type,
          content: dataUrl.split(",")[1],
          createdDate: new Date().toISOString(),
        },
      }));
    };
    reader.readAsDataURL(file);
  }

  function clearFile(fieldName: string) {
    setValues((prev) => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}Preview`]: "",
    }));
    const input = fileInputRefs.current[fieldName];
    if (input) input.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    let valid = true;
    const newErrors: Record<string, boolean> = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = values[field.name];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.name] = true;
          valid = false;
        }
      }
    });

    setErrors(newErrors);
    if (!valid) return;

    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
  }

  function renderField(field: Field) {
    const hasError = errors[field.name];

    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <input
              type="text"
              value={values[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`input-field ${
                hasError ? "border-field-required" : "border-brand focus-within:ring-2 focus-within:ring-bg-brand"
              } transition-colors`}
            />
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <textarea
              value={values[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows ?? 4}
              className={`input-field ${
                hasError ? "border-field-required" : "border-brand focus-within:ring-2 focus-within:ring-bg-brand"
              } transition-colors resize-none`}
            />
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );

      case "dropdown":
        const selectedOption = field.options.find((o) => o.value === values[field.name]);
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <div ref={(el) => { dropdownRefs.current[field.name] = el; }} className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === field.name ? null : field.name)}
                className={`w-full input-field ${
                  hasError ? "border-field-required" : "border-brand focus-within:ring-2 focus-within:ring-bg-brand"
                } transition-colors flex items-center justify-between`}
              >
                <span>{selectedOption?.label ?? "Select..."}</span>
                <span className="ml-2 text-brand">▾</span>
              </button>
              {openDropdown === field.name && field.options.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-bg border border-brand rounded-lg overflow-hidden shadow-lg">
                  {field.options.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setValue(field.name, option.value);
                        setOpenDropdown(null);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-highlight ${
                        option.value === values[field.name] ? "text-brand" : "text-text"
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <input
              type="date"
              value={values[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              className={`input-field ${
                hasError ? "border-field-required" : "border-brand focus-within:ring-2 focus-within:ring-bg-brand"
              } transition-colors`}
            />
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <input
              type="number"
              value={values[field.name]}
              onChange={(e) => setValue(field.name, e.target.value === "" ? "" : Number(e.target.value))}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              className={`input-field ${
                hasError ? "border-field-required" : "border-brand focus-within:ring-2 focus-within:ring-bg-brand"
              } transition-colors`}
            />
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );

      case "file":
        const preview = values[`${field.name}Preview`];
        return (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-field-required">*</span>}
            </label>
            <button
              type="button"
              onClick={() => fileInputRefs.current[field.name]?.click()}
              className="self-start btn-regular"
            >
              Upload File
            </button>
            <input
              ref={(el) => { fileInputRefs.current[field.name] = el; }}
              type="file"
              accept={field.accept ?? "image/*"}
              className="hidden"
              onChange={(e) => handleFileChange(field, e)}
            />
            {preview && (
              <div className="relative mt-1">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg border border-brand"
                />
                <button
                  type="button"
                  onClick={() => clearFile(field.name)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm leading-none cursor-pointer"
                  aria-label="Remove file"
                >
                  &times;
                </button>
              </div>
            )}
            {hasError && (
              <span className="text-field-required text-xs">{field.label} is required.</span>
            )}
          </div>
        );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="popup-brand">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-brand hover:text-text text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(renderField)}

          {error && (
            <p className="text-danger text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-text hover:text-danger text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-brand py-2 px-6"
            >
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}