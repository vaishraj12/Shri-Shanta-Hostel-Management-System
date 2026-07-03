import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

interface DataType {
  [key: string]: any;
}

const UploadData: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataType[]>([]);
  const [type, setType] = useState<"student" | "warden">("student");
  const [errorRow, setErrorRow] = useState<any>(null); // ✅ NEW

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
      setData([]);
      setErrorRow(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    setMessage("");
    setData([]);
    setErrorRow(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url =
        type === "student"
          ? "http://localhost:5000/upload-students"
          : "http://localhost:5000/upload-wardens";

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("UPLOAD RESPONSE:", result);

      if (result.success) {
        setMessage(result.message || "Upload successful");
        if (result.data) setData(result.data);

        alert("✅ Upload successful");
      } else {
        setMessage(result.message || "Upload failed");
        setErrorRow(result.errorData || null);

        // ❌ ALERT FOR WRONG DATA
        alert(`❌ ${result.message}`);
      }
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      alert("❌ Server error. Check backend!");
      setMessage("Upload failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Upload CSV/Excel Data
        </h2>

        {/* ✅ DROPDOWN */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Select Upload Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "student" | "warden")}
            className="border p-2 rounded w-60"
          >
            <option value="student">Student</option>
            <option value="warden">Warden</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="flex gap-3 mb-4 items-center text-white">
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />

          <Button onClick={handleUpload} disabled={loading}>
            {loading
              ? "Uploading..."
              : `Upload ${type === "student" ? "Students" : "Wardens"}`}
          </Button>
        </div>

        {/* Selected File */}
        {file && (
          <p className="text-sm text-gray-600 mb-2">
            Selected File: <b>{file.name}</b>
          </p>
        )}

        {/* Message */}
        {message && (
          <p
            className={`mb-4 font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* ❌ ERROR DATA DISPLAY */}
        {errorRow && (
          <div className="bg-red-100 p-3 rounded mb-4">
            <h4 className="font-semibold text-red-600">
              Wrong Data Row:
            </h4>
            <pre className="text-sm">
              {JSON.stringify(errorRow, null, 2)}
            </pre>
          </div>
        )}

        {/* Table Preview */}
        {data.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <h3 className="font-semibold mb-2">
              Uploaded {type === "student" ? "Students" : "Wardens"} ({data.length})
            </h3>

            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="border px-4 py-2 text-left capitalize"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border px-4 py-2">
                        {val === null || val === ""
                          ? "Not Assigned"
                          : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadData;