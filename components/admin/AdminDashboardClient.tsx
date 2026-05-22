"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { 
  Building2, 
  Users, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  Eye, 
  Bed, 
  Bath, 
  Maximize2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Property, UserWithRole } from "@/app/[locale]/admin/page";

interface AdminDashboardClientProps {
  initialProperties: Property[];
  initialUsers: UserWithRole[];
}

export function AdminDashboardClient({ initialProperties, initialUsers }: AdminDashboardClientProps) {
  const t = useTranslations("Admin");
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"properties" | "users">("properties");
  const [properties] = useState<Property[]>(initialProperties);
  const [users, setUsers] = useState<UserWithRole[]>(initialUsers);
  
  // Search states
  const [propertySearch, setPropertySearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // Pagination states
  const [propertyPage, setPropertyPage] = useState(1);
  const [propertyPerPage, setPropertyPerPage] = useState(10);

  // Loading and Notification states
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch logged-in user on mount to prevent self-demotion
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Toast notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle changing user role
  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    if (userId === currentUserId) {
      setNotification({
        type: "error",
        message: t("cannotChangeOwnRole"),
      });
      return;
    }

    try {
      setUpdatingUserId(userId);
      setNotification(null);

      const { error } = await supabase.rpc("update_user_role", {
        target_user_id: userId,
        target_role: newRole,
      });

      if (error) throw error;

      // Update state locally
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      );

      setNotification({
        type: "success",
        message: t("updateRoleSuccess"),
      });
    } catch (err: any) {
      console.error("Error updating role:", err);
      setNotification({
        type: "error",
        message: t("updateRoleError") + `: ${err.message || ""}`,
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = 
        prop.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
        prop.location.toLowerCase().includes(propertySearch.toLowerCase());
      
      const matchesType = propertyTypeFilter === "all" || prop.type.toLowerCase() === propertyTypeFilter.toLowerCase();
      
      return matchesSearch && matchesType;
    });
  }, [properties, propertySearch, propertyTypeFilter]);

  // Paginated properties
  const totalPropertyPages = Math.max(1, Math.ceil(filteredProperties.length / propertyPerPage));
  const paginatedProperties = useMemo(() => {
    const start = (propertyPage - 1) * propertyPerPage;
    return filteredProperties.slice(start, start + propertyPerPage);
  }, [filteredProperties, propertyPage, propertyPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPropertyPage(1);
  }, [propertySearch, propertyTypeFilter, propertyPerPage]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.email || "").toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  // Format currency helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status helper: check if the property is for sale
  const isSale = (status: string) => {
    return status.toUpperCase().includes("SALE");
  };

  // Get distinct property types for filter dropdown
  const propertyTypes = Array.from(new Set(properties.map(p => p.type.toLowerCase())));

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div 
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            notification.type === "success" 
              ? "bg-[#D9ECC8]/90 text-mosque border-mosque/20" 
              : "bg-red-50/90 text-red-700 border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Tabs Switcher Navigation */}
      <div className="flex border-b border-nordic-dark/10 dark:border-mosque/20">
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 duration-200 cursor-pointer ${
            activeTab === "properties"
              ? "border-mosque text-mosque dark:border-primary dark:text-primary"
              : "border-transparent text-nordic-muted hover:text-nordic-dark dark:hover:text-gray-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          {t("propertiesTab")}
          <span className="ml-1.5 px-2 py-0.5 text-xs bg-nordic-dark/5 dark:bg-white/10 rounded-full font-medium">
            {properties.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 duration-200 cursor-pointer ${
            activeTab === "users"
              ? "border-mosque text-mosque dark:border-primary dark:text-primary"
              : "border-transparent text-nordic-muted hover:text-nordic-dark dark:hover:text-gray-200"
          }`}
        >
          <Users className="w-4 h-4" />
          {t("usersTab")}
          <span className="ml-1.5 px-2 py-0.5 text-xs bg-nordic-dark/5 dark:bg-white/10 rounded-full font-medium">
            {users.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT: PROPERTIES */}
      {activeTab === "properties" && (
        <div className="space-y-4">
          {/* Properties Toolbar Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#152e2a] p-4 rounded-xl border border-nordic-dark/5 dark:border-mosque/10 shadow-soft">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic-muted w-4 h-4" />
              <input
                type="text"
                placeholder={t("searchProperties")}
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 bg-transparent text-nordic-dark dark:text-white placeholder-nordic-muted focus:outline-none focus:ring-1 focus:ring-mosque text-sm transition-all"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 bg-white dark:bg-[#1a3833] text-nordic-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-mosque text-sm cursor-pointer transition-all"
              >
                <option value="all">{t("allTypes")}</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl border border-nordic-dark/5 dark:border-mosque/10 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed", minWidth: "800px" }}>
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "27%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-nordic-dark/[0.02] dark:bg-white/[0.02] border-b border-nordic-dark/5 dark:border-mosque/10">
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("photo")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("propertyList")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("type")} & {t("status")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("details")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("price")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nordic-dark/5 dark:divide-mosque/10">
                  {paginatedProperties.length > 0 ? (
                    paginatedProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-nordic-dark/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-14 h-10 rounded bg-gray-100 overflow-hidden relative shadow-sm">
                            <Image
                              src={property.images[0] || "/images/placeholder.jpg"}
                              alt={property.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-nordic-dark dark:text-white max-w-xs truncate">{property.title}</div>
                          <div className="text-xs text-nordic-muted dark:text-gray-400 max-w-xs truncate">{property.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-hint-green/20 text-mosque border border-mosque/10 mr-1.5">
                            {property.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            isSale(property.status)
                              ? "bg-blue-50 text-blue-700 border border-blue-100" 
                              : "bg-[#D9ECC8] text-mosque border border-mosque/20"
                          }`}>
                            {isSale(property.status) ? t("forSale") : t("forRent")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-nordic-muted dark:text-gray-300">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-nordic-muted/70" /> {property.beds}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-nordic-muted/70" /> {property.baths}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5 text-nordic-muted/70" /> {property.area} m²
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-mosque dark:text-[#06f9d0]">
                          {formatPrice(property.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link 
                            href={`/properties/${property.slug}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-nordic-muted hover:text-mosque hover:bg-nordic-dark/5 transition-all"
                            title={t("viewDetail")}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-nordic-muted dark:text-gray-400">
                        {t("noProperties")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-nordic-dark/5 dark:border-mosque/10 bg-nordic-dark/[0.01] dark:bg-white/[0.01]">
              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-sm text-nordic-muted dark:text-gray-400">
                <span>{t("showing")}</span>
                <select
                  value={propertyPerPage}
                  onChange={(e) => setPropertyPerPage(Number(e.target.value))}
                  className="px-2 py-1 rounded-md border border-nordic-dark/10 dark:border-mosque/30 bg-white dark:bg-[#1a3833] text-nordic-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-mosque text-xs cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>{t("perPage")}</span>
                <span className="text-nordic-dark/40 dark:text-gray-500 mx-1">·</span>
                <span>{filteredProperties.length} {t("results")}</span>
              </div>

              {/* Page controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPropertyPage(p => Math.max(1, p - 1))}
                  disabled={propertyPage <= 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 text-nordic-muted hover:text-mosque hover:border-mosque/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-nordic-dark dark:text-white font-medium px-2">
                  {t("page")} {propertyPage} {t("of")} {totalPropertyPages}
                </span>
                <button
                  onClick={() => setPropertyPage(p => Math.min(totalPropertyPages, p + 1))}
                  disabled={propertyPage >= totalPropertyPages}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 text-nordic-muted hover:text-mosque hover:border-mosque/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* User Toolbar Filters */}
          <div className="bg-white dark:bg-[#152e2a] p-4 rounded-xl border border-nordic-dark/5 dark:border-mosque/10 shadow-soft">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nordic-muted w-4 h-4" />
              <input
                type="text"
                placeholder={t("searchUsers")}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 bg-transparent text-nordic-dark dark:text-white placeholder-nordic-muted focus:outline-none focus:ring-1 focus:ring-mosque text-sm transition-all"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl border border-nordic-dark/5 dark:border-mosque/10 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed", minWidth: "700px" }}>
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-nordic-dark/[0.02] dark:bg-white/[0.02] border-b border-nordic-dark/5 dark:border-mosque/10">
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("email")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("userId")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("createdAt")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider">{t("role")}</th>
                    <th className="px-6 py-4 font-semibold text-xs text-nordic-muted uppercase tracking-wider text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nordic-dark/5 dark:divide-mosque/10">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const isMe = user.user_id === currentUserId;
                      const isUpdating = updatingUserId === user.user_id;

                      return (
                        <tr key={user.user_id} className="hover:bg-nordic-dark/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-nordic-dark dark:text-white">{user.email || t("noEmail")}</span>
                              {isMe && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-mosque text-white uppercase tracking-wider">
                                  {t("you")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-nordic-muted dark:text-gray-400">
                            {user.user_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nordic-muted dark:text-gray-300">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-mosque/10 text-mosque dark:bg-primary/10 dark:text-primary"
                                : "bg-nordic-muted/10 text-nordic-muted"
                            }`}>
                              {user.role === "admin" ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  {t("roleAdmin")}
                                </>
                              ) : (
                                <>
                                  <Users className="w-3.5 h-3.5" />
                                  {t("roleUser")}
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="inline-flex items-center gap-2">
                              {isUpdating ? (
                                <span className="flex items-center gap-1 text-xs text-nordic-muted animate-pulse">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  {t("updating")}
                                </span>
                              ) : (
                                <select
                                  value={user.role}
                                  disabled={isMe}
                                  onChange={(e) => handleRoleChange(user.user_id, e.target.value as "admin" | "user")}
                                  className="px-3 py-1.5 rounded-lg border border-nordic-dark/10 dark:border-mosque/30 bg-white dark:bg-[#1a3833] text-nordic-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-mosque text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                  title={isMe ? t("cannotChangeOwnRole") : t("changeRole")}
                                >
                                  <option value="user">{t("roleUser")}</option>
                                  <option value="admin">{t("roleAdmin")}</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-nordic-muted dark:text-gray-400">
                        {t("noUsers")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
