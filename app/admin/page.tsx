"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Database, Globe, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SourceDomain {
  id: string;
  domain: string;
  tier: string;
  weight: number;
  enabled: boolean;
}

interface CacheEntry {
  id: string;
  queryKey: string;
  mode: string;
  createdAt: string;
  expiresAt: string;
}

interface PairingRequestLog {
  id: string;
  mode: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [domains, setDomains] = useState<SourceDomain[]>([]);
  const [cache, setCache] = useState<CacheEntry[]>([]);
  const [requests, setRequests] = useState<PairingRequestLog[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        loadData();
      } else {
        const data = await response.json();
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Login failed");
    }
    setLoginLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [domainsRes, cacheRes, requestsRes] = await Promise.all([
        fetch("/api/admin/domains"),
        fetch("/api/admin/cache"),
        fetch("/api/admin/requests"),
      ]);
      
      if (domainsRes.ok) setDomains(await domainsRes.json());
      if (cacheRes.ok) setCache(await cacheRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const toggleDomain = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/admin/domains/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      loadData();
    } catch (error) {
      console.error("Error toggling domain:", error);
    }
  };

  const clearCache = async () => {
    try {
      await fetch("/api/admin/cache", { method: "DELETE" });
      loadData();
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage the Wine Pairing Wizard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  data-testid="input-admin-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-testid="input-admin-password"
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-admin-login">
                {loginLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Settings className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage sources, cache, and view activity</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Source Domains</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={loadData}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domains.map(domain => (
                    <div key={domain.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{domain.domain}</span>
                          <Badge variant="outline" className="text-xs">Tier {domain.tier}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Weight: {domain.weight}</span>
                      </div>
                      <Button
                        variant={domain.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDomain(domain.id, domain.enabled)}
                      >
                        {domain.enabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  ))}
                  {domains.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No domains configured</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Evidence Cache</CardTitle>
                  </div>
                  <Button variant="destructive" size="sm" onClick={clearCache}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cache.map(entry => (
                    <div key={entry.id} className="p-2 bg-muted/50 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{entry.queryKey}</span>
                        <Badge variant="outline" className="text-xs">{entry.mode}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Expires: {new Date(entry.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {cache.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Cache is empty</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Pairing Requests</CardTitle>
                <CardDescription>Last 50 anonymized requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 max-h-64 overflow-y-auto">
                  {requests.map(req => (
                    <div key={req.id} className="p-2 bg-muted/50 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{req.mode}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(req.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 col-span-4">No requests yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
