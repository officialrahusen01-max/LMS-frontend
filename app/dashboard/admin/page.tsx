"use client";

import React, { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";
import { Loader2, User, Mail, Calendar, GraduationCap } from "lucide-react";

type Student = {
  _id: string;
  fullName: string;
  publicUsername: string;
  email: string;
  createdAt?: string;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Note: Agar aapka backend endpoint alag hai (jaise "users?role=student"), 
    // toh yahan "admin/students" ko apne actual endpoint se replace kar dein.
    apiJson<{ data: Student[] }>("admin/students")
      .then((res) => {
        setStudents(res?.data || []);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load students list.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Registered Students
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all students enrolled in the institution.
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2.5 rounded-lg font-semibold text-sm">
          Total Students: {students.length}
        </div>
      </div>

      {/* State: Error */}
      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      ) : students.length === 0 ? (
        /* State: Empty */
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No students found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no students registered in the system.
          </p>
        </div>
      ) : (
        /* State: Data Table */
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Info</th>
                  <th className="px-6 py-4 font-medium">Username</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student._id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{student.fullName}</p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Mail size={12} />
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">@{student.publicUsername}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-medium text-sm transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
