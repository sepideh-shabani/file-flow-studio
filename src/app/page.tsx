"use client";
import React, { useState, useEffect } from "react";
import { apiGetToken } from "./api-requests";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "uidev",
    password: "abc123",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiGetToken(formData);

      // Set the access token in a cookie without using an additional library
      setCookie("access_token", response.access_token, 7); // expires in 7 days

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("access_token="));

    if (accessToken) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full border rounded py-2 px-3 text-gray-800" // Set text color to gray
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full border rounded py-2 px-3 text-gray-800" // Set text color to gray
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
