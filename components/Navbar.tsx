import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-6 bg-blue-600 p-4 text-white">
      <Link href="/">Ana Sayfa</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/events">Etkinlikler</Link>
      <Link href="/participants">Katılımcılar</Link>
      <Link href="/check-in">QR Check-in</Link>
      <Link href="/upload">CSV Yükle</Link>
    </nav>
  );
}