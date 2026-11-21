import { Button } from "@/components/ui/button";

export default function SubmitWorkToast({ toast, setToast }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
        <span>{toast.message}</span>
        {toast.action && (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => {
              toast.action.run();
              setToast(null);
            }}
            className="font-semibold text-primary-300 hover:text-primary-200 dark:text-primary-600 dark:hover:text-primary-700"
          >
            {toast.action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
