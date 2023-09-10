import Link from 'next/link';

export default function Nav() {
  return (
    <ul className="mt-3">
      <li className="my-1"><Link className="hover:bg-[#3b3b3b]" href="/dashboard">Home</Link></li>
      <li className="my-1"><Link className="hover:bg-[#3b3b3b]" href="/dashboard/hardware">Hardware</Link></li>
      <li className="my-1"><Link className="hover:bg-[#3b3b3b]" href="/teams">Teams</Link></li>
      <li className="my-1"><Link className="hover:bg-[#3b3b3b]" href="/admin">Admin</Link></li>
    </ul>
  );
}