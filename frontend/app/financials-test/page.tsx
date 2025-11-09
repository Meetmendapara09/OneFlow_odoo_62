                    <td>✅</td>
                    <td>AuthProvider is working (you can see this page)</td>
                  </tr>
                  <tr>
                    <td>Page Route</td>
                    <td>✅</td>
                    <td>Route /financials-test exists and loads</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">What to do:</h2>
                <div className="space-y-2">
                  {!isAuthenticated && (
                    <div className="alert alert-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <strong>Step 1:</strong> Go to <a href="/signin" className="link link-primary">/signin</a> and sign in
                      </div>
                    </div>
                  )}

                  {isAuthenticated && !canAccess && (
                    <div className="alert alert-error">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <strong>Problem:</strong> Your role ({user?.role}) cannot access Financials page.
                        <br />
                        <strong>Solution:</strong> Sign in with SUPERADMIN, SALES_FINANCE, or PROJECT_MANAGER account.
                      </div>
                    </div>
                  )}

                  {canAccess && (
                    <div className="alert alert-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <strong>Success!</strong> You have permission to access Financials.
                        <br />
                        <button onClick={() => router.push('/financials')} className="btn btn-primary btn-sm mt-2">
                          Go to Financials Page →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Browser Console Info */}
            <div className="alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Check browser console (F12) for detailed diagnostic logs</span>
            </div>

            {/* Test Data */}
            <div className="mockup-code">
              <pre data-prefix="$"><code>localStorage.getItem('token')</code></pre>
              <pre data-prefix=">"><code className="text-success">{localStorage.getItem('token') ? 'Token exists ✓' : 'No token ✗'}</code></pre>
              <pre data-prefix="$"><code>localStorage.getItem('user')</code></pre>
              <pre data-prefix=">"><code className="text-info">{localStorage.getItem('user') || 'No user data'}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function FinancialsTestPage() {
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const router = useRouter();

  const canAccess = hasAnyRole(['SUPERADMIN', 'SALES_FINANCE', 'PROJECT_MANAGER']);

  useEffect(() => {
    console.log("=== FINANCIALS PAGE DIAGNOSTIC ===");
    console.log("1. Authenticated:", isAuthenticated);
    console.log("2. User:", user);
    console.log("3. Can Access:", canAccess);
    console.log("4. Should Redirect:", !canAccess);
    console.log("==================================");
  }, [isAuthenticated, user, canAccess]);

  return (
    <div className="min-h-screen p-8 space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-4">🔍 Financials Page Diagnostic</h1>

          <div className="space-y-4">
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>This diagnostic page helps identify why /financials might not be working.</span>
            </div>

            {/* Authentication Status */}
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Authentication Status</div>
                <div className={`stat-value ${isAuthenticated ? 'text-success' : 'text-error'}`}>
                  {isAuthenticated ? '✅ Signed In' : '❌ Not Signed In'}
                </div>
                <div className="stat-desc">
                  {!isAuthenticated && 'Go to /signin to sign in'}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">User Info</div>
                <div className="stat-value text-sm">
                  {user?.username || 'No user'}
                </div>
                <div className="stat-desc">
                  Role: {user?.role || 'No role'}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Access Permission</div>
                <div className={`stat-value ${canAccess ? 'text-success' : 'text-error'}`}>
                  {canAccess ? '✅ Allowed' : '❌ Denied'}
                </div>
                <div className="stat-desc">
                  {!canAccess && 'Need: SUPERADMIN, SALES_FINANCE, or PROJECT_MANAGER'}
                </div>
              </div>
            </div>

            {/* Detailed Status */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Authenticated</td>
                    <td>{isAuthenticated ? '✅' : '❌'}</td>
                    <td>{isAuthenticated ? 'User is signed in' : 'User needs to sign in at /signin'}</td>
                  </tr>
                  <tr>
                    <td>Has User Data</td>
                    <td>{user ? '✅' : '❌'}</td>
                    <td>{user ? `Username: ${user.username}` : 'No user data in context'}</td>
                  </tr>
                  <tr>
                    <td>Has Role</td>
                    <td>{user?.role ? '✅' : '❌'}</td>
                    <td>{user?.role || 'No role assigned'}</td>
                  </tr>
                  <tr>
                    <td>Can Access Financials</td>
                    <td>{canAccess ? '✅' : '❌'}</td>
                    <td>
                      {canAccess
                        ? 'User has permission'
                        : `Current role (${user?.role || 'none'}) cannot access. Need: SUPERADMIN, SALES_FINANCE, or PROJECT_MANAGER`
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>AuthProvider</td>

