export default function Button({
  className,
  buttonType,
  href,
  onClick,
  children,
}) {
  const buttonIFHrefIsPresent = typeof href !== "undefined";

  return (
    <>
      <button
        className={className}
        type={buttonType}
        onClick={onClick}
        {...(buttonIFHrefIsPresent ? { href } : {})}
      >
        {children}
      </button>
    </>
  );
}
