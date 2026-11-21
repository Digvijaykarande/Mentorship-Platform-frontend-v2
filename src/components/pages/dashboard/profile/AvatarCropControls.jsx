import { Contrast, FlipHorizontal2, RefreshCw, RotateCcw, RotateCw, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MIN_ZOOM, MAX_ZOOM } from "./avatarCropUtils";

function SliderRow({ icon: Icon, label, value, min, max, step = 1, onChange, suffix = "", endIcon: EndIcon }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <Slider
        getAriaLabel={() => label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(Number(Array.isArray(v) ? v[0] : v))}
        className="w-full cursor-pointer"
      />
      {EndIcon ? (
        <EndIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      ) : (
        <span className="w-12 shrink-0 text-right text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
          {value}
          {suffix}
        </span>
      )}
    </div>
  );
}

export default function AvatarCropControls({
  zoom,
  setZoom,
  rotation,
  setRotation,
  rotateBy,
  flip,
  setFlip,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  onReset,
}) {
  return (
    <div className="space-y-3">
      <SliderRow
        icon={ZoomOut}
        endIcon={ZoomIn}
        label="Zoom"
        value={zoom}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.01}
        onChange={setZoom}
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => rotateBy(-90)}
          aria-label="Rotate left 90 degrees"
          className="h-8 gap-1.5 text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" /> 90°
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => rotateBy(90)}
          aria-label="Rotate right 90 degrees"
          className="h-8 gap-1.5 text-xs"
        >
          <RotateCw className="h-3.5 w-3.5" /> 90°
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setFlip((f) => !f)}
          aria-pressed={flip}
          aria-label="Flip horizontally"
          className={`h-8 gap-1.5 text-xs ${flip ? "border-primary-400 text-primary-600 dark:text-primary-300" : ""}`}
        >
          <FlipHorizontal2 className="h-3.5 w-3.5" /> Flip
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="ml-auto h-8 gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <SliderRow
        icon={RotateCw}
        label="Straighten"
        value={Math.round(rotation)}
        min={-180}
        max={180}
        onChange={setRotation}
        suffix="°"
      />
      <SliderRow
        icon={Sun}
        label="Brightness"
        value={brightness}
        min={50}
        max={150}
        onChange={setBrightness}
        suffix="%"
      />
      <SliderRow
        icon={Contrast}
        label="Contrast"
        value={contrast}
        min={50}
        max={150}
        onChange={setContrast}
        suffix="%"
      />
    </div>
  );
}
