import Link from "next/link";
import { CartLink } from "./CartLink";

export function Header() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Northstar home">NORTHSTAR<span> / SUPPLY</span></Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/shop">Collection</Link>
        <Link href="/category/designer-clothing">Clothing</Link>
        <Link href="/category/luxury-watches">Watches</Link>
        <Link href="/about">About</Link>
        <Link href="/account">Account</Link>
      </nav>
      <div className="header-actions">
        <form className="search-form" action="/search">
          <label className="sr-only" htmlFor="header-search">Search the catalog</label>
          <input id="header-search" name="q" type="search" placeholder="Search" />
          <button type="submit" aria-label="Submit search">⌕</button>
        </form>
        <CartLink />
      </div>
    </header>
  );
}

export function Footer() {
  return <footer className="site-footer"><span>Northstar / Supply</span><span>Luxury fashion, accessories & watches.</span><span>© Northstar / Supply</span></footer>;
}
