declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: number | string;
        absoluteStrokeWidth?: boolean;
        className?: string;
    }
    export type Icon = FC<IconProps>;

    // Explicitly export ALL icons used to be safe
    export const Scissors: Icon;
    export const Zap: Icon;
    export const Crown: Icon;
    export const Eye: Icon;
    export const Sparkles: Icon;
    export const ScanFace: Icon;
    export const Check: Icon;
    export const ChevronRight: Icon;
    export const ChevronLeft: Icon;
    export const Calendar: Icon;
    export const Clock: Icon;
    export const User: Icon;
    export const Phone: Icon;
    export const CheckCircle: Icon;
    export const Camera: Icon;
    export const RefreshCw: Icon;
    export const ArrowRight: Icon;
    export const X: Icon;
    export const Menu: Icon;
    export const Home: Icon;
    export const Info: Icon;
    export const Star: Icon;
    export const MapPin: Icon;
    export const PhoneCall: Icon;
    export const Mail: Icon;
    export const Facebook: Icon;
    export const Instagram: Icon;
    export const Twitter: Icon;
    export const Linkedin: Icon;

    // Final fallback
    const content: { [key: string]: Icon };
    export default content;
}
