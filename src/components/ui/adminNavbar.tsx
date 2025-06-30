"use client";

import Link from "next/link";

export default function AdminNavbar() {
    const branch = localStorage.getItem("branch")
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold">
          {branch}
        </Link>

        {/* Links */}
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {(branch == "Main Branch") && (
            <Link href="/pages/admin/addBranch" className="hover:text-gray-300">
                Add Branch
            </Link>
          )}
          
          <Link href="/pages/admin/addEmployee" className="hover:text-gray-300">
            Add Employee
          </Link>
        </div>
      </div>
    </nav>
  );
}
