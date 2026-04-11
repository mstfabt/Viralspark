type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
  textClassName?: string
}

export function Logo({ size = 32, className = '', showText = true, textClassName = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-512.svg"
        alt="ViralSpark"
        width={size}
        height={size}
        className="shrink-0"
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className={`text-xl font-semibold tracking-tight ${textClassName}`}>
          ViralSpark.
        </span>
      )}
    </span>
  )
}
