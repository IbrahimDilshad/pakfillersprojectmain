import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary-foreground", className)}
      viewBox="0 0 200 150"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1_2)">
        <path
          d="M106.021 34.2889H125.704L93.9912 90.589H74.3079L106.021 34.2889Z"
          fill="currentColor"
        />
        <path
          d="M0 34.2889H72.8427V0H101.411V117.84H0V34.2889Z"
          fill="currentColor"
        />
        <path
          d="M141.229 149.851C152.015 149.851 160.911 140.73 160.911 129.658C160.911 118.586 152.015 109.465 141.229 109.465C130.443 109.465 121.547 118.586 121.547 129.658C121.547 140.73 130.443 149.851 141.229 149.851Z"
          fill="currentColor"
        />
        <path
          d="M127.172 101.996C130.82 100.86 134.629 100.222 138.544 100.222C160.103 100.222 177.654 118.192 177.654 140.231V149.957H138.544C118.847 149.957 102.738 135.539 99.4972 116.64L127.172 101.996Z"
          fill="currentColor"
        />
        <path
          d="M144.116 57.0674C154.902 57.0674 163.798 47.9463 163.798 36.8742C163.798 25.802 154.902 16.681 144.116 16.681C133.33 16.681 124.434 25.802 124.434 36.8742C124.434 47.9463 133.33 57.0674 144.116 57.0674Z"
          fill="currentColor"
        />
        <path
          d="M199.986 70.3667H141.229C119.67 70.3667 102.119 52.3969 102.119 30.3578V0.109375H141.229C160.926 0.109375 177.035 14.5273 180.276 33.4258L199.986 70.3667Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="200" height="150" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
