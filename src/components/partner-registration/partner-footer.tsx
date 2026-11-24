import { Link } from '@tanstack/react-router'

export function PartnerFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 w-full border-t border-[#E6EAF0] bg-white py-6 text-xs text-[#4F5B70]">
      <div className="mx-auto flex max-w-300 flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex flex-wrap items-center gap-6">
          <Link to="/" className="flex items-center">
            <img
              src="/images/aerowing-logo.png"
              alt="AeroWing"
              className="h-6 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/"
              className="text-[#4F5B70] hover:text-[#012A5E] hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="text-[#4F5B70] hover:text-[#012A5E] hover:underline"
            >
              Terms
            </Link>
            <Link
              to="/"
              className="text-[#4F5B70] hover:text-[#012A5E] hover:underline"
            >
              AeroWing home
            </Link>
          </div>
        </div>

        <p className="text-center sm:text-right text-[11px] text-[#4F5B70] leading-relaxed max-w-md">
          © {currentYear} AeroWing. Businesses, people and documents in this
          prototype are fictional sample content for design review.
        </p>
      </div>
    </footer>
  )
}
