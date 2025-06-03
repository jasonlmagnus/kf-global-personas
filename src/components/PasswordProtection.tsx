"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const CORRECT_PASSWORD = "kf2025";
  const AUTH_KEY = "kf_personas_auth";

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                KF Personas Access
              </h1>
              <p className="text-gray-600">
                Please enter the password to access the persona library
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Access Personas
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Korn Ferry Personas • Confidential Access
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Optional: Add logout button in corner */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors opacity-50 hover:opacity-100"
        title="Logout"
      >
        <Lock className="w-4 h-4" />
      </button>
    </>
  );
};

export default PasswordProtection;
