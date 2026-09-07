import Svg, { Path } from "react-native-svg";

import { useColors } from "@/hooks/use-colors";

export function ChevronLeftIcon() {
  const colors = useColors();
  return (
    <Svg accessibilityElementsHidden height={20} viewBox="0 0 20 20" width={20}>
      <Path
        d="M12.5 15a25.5 25.5 0 0 1-4.848-4.574.67.67 0 0 1 0-.85A25.5 25.5 0 0 1 12.5 5"
        fill="none"
        stroke={colors.ink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
      />
    </Svg>
  );
}

export function ClockIcon() {
  const colors = useColors();
  return (
    <Svg accessibilityElementsHidden height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M8 5.333v3.211c0 .114.058.22.154.281L10 10m4.1-2A6.1 6.1 0 1 1 1.9 8a6.1 6.1 0 0 1 12.2 0"
        fill="none"
        stroke={colors.muted}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
      />
    </Svg>
  );
}

export function PersonIcon() {
  const colors = useColors();
  return (
    <Svg accessibilityElementsHidden height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M10.667 4.667a2.667 2.667 0 1 1-5.334 0 2.667 2.667 0 0 1 5.334 0M3.91 14h8.18c.687 0 1.243-.557 1.243-1.244a3.11 3.11 0 0 0-3.94-2.997l-.464.129a3.5 3.5 0 0 1-1.858 0l-.464-.129a3.11 3.11 0 0 0-3.94 2.997c0 .687.557 1.244 1.244 1.244"
        fill="none"
        stroke={colors.muted}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
      />
    </Svg>
  );
}

export function CashIcon() {
  const colors = useColors();
  return (
    <Svg accessibilityElementsHidden height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M4 3.333v.534c0 .746 0 1.12-.145 1.405a1.34 1.34 0 0 1-.583.583C2.987 6 2.613 6 1.867 6h-.534M4 3.333h-.533c-.747 0-1.12 0-1.406.146-.25.127-.455.331-.582.582-.146.286-.146.659-.146 1.406V6M4 3.333h8m0 0h.533c.747 0 1.12 0 1.406.146.25.127.454.331.582.582.146.286.146.659.146 1.406V6M12 3.333v.534c0 .746 0 1.12.145 1.405.128.25.332.455.583.583.285.145.659.145 1.405.145h.534M4 12.667v-.534c0-.746 0-1.12-.145-1.405a1.33 1.33 0 0 0-.583-.583C2.987 10 2.613 10 1.867 10h-.534M4 12.667h-.533c-.747 0-1.12 0-1.406-.146a1.33 1.33 0 0 1-.582-.582c-.146-.286-.146-.659-.146-1.406V10M4 12.667h8m0 0h.533c.747 0 1.12 0 1.406-.146.25-.128.454-.332.582-.582.146-.286.146-.659.146-1.406V10M12 12.667v-.534c0-.746 0-1.12.145-1.405a1.34 1.34 0 0 1 .583-.583c.285-.145.659-.145 1.405-.145h.534M1.333 10V6m13.334 4V6M8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4"
        fill="none"
        stroke={colors.muted}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
      />
    </Svg>
  );
}
