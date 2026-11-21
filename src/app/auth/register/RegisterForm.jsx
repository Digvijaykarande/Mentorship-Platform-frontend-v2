import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RoleSelector from "./RoleSelector";
import PasswordStrengthBar from "./PasswordStrengthBar";
import RegisterNameEmailFields, { RegisterPasswordFields } from "./RegisterFields";

const errorClass =
  "flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400";
const socialClass =
  "h-9 gap-2 rounded-xl border-slate-200 bg-white text-[13px] font-medium text-slate-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
const primaryButton =
  "h-10 w-full gap-2 rounded-xl font-semibold shadow-sm transition active:scale-[0.99] disabled:opacity-70";

export default function RegisterForm({
  form,
  setForm,
  errors,
  setErrors,
  formError,
  loading,
  update,
  handleSubmit,
  handleSocial,
  rules,
  score,
  strength,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      {/* Social signup */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className={socialClass}
          onClick={() => handleSocial("google")}
        >
          <FaGoogle className="h-3.5 w-3.5 text-[#ea4335]" /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className={socialClass}
          onClick={() => handleSocial("github")}
        >
          <FaGithub className="h-4 w-4" /> GitHub
        </Button>
      </div>

      <div className="my-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        or sign up with email
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {formError}
          </div>
        )}

        <RoleSelector
          role={form.role}
          onSelectRole={(role) => setForm((f) => ({ ...f, role }))}
          labelClass="text-xs font-semibold text-slate-700 dark:text-slate-300"
        />

        <RegisterNameEmailFields form={form} errors={errors} update={update} />

        <RegisterPasswordFields form={form} errors={errors} update={update} />

        <PasswordStrengthBar
          password={form.password}
          score={score}
          rules={rules}
          strength={strength}
        />

        {/* Terms */}
        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="register-terms"
              checked={form.terms}
              onCheckedChange={(checked) => {
                setForm((f) => ({ ...f, terms: Boolean(checked) }));
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
              }}
              className="mt-0.5"
            />
            <Label
              htmlFor="register-terms"
              className="cursor-pointer select-none text-[11.5px] leading-5 text-slate-600 dark:text-slate-400"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          {errors.terms && (
            <p role="alert" className={cn(errorClass)}>
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className={primaryButton}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
