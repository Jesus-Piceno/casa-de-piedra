import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  type: string;
  images: string[];
  beds: number;
  baths: number;
  area: number;
  slug: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_exclusive: boolean;
  is_active: boolean;
  amenities: string[];
}

export interface UserWithRole {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

export default async function AdminPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  // Fetch all properties
  const { data: propertiesData } = await supabase
    .from("properties")
    .select("*")
    .order("title");

  const properties: Property[] = (propertiesData || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    status: p.status,
    type: p.type,
    images: p.gallery_images || [],
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    slug: p.slug,
    is_featured: p.is_featured || false,
    is_new_arrival: p.is_new_arrival || false,
    is_exclusive: p.is_exclusive || false,
    is_active: p.is_active !== false, // default true if null
    amenities: p.amenities || [],
  }));

  // Fetch all users with their roles using the secure database RPC
  const { data: usersData, error: usersError } = await supabase.rpc("get_users_with_roles");

  if (usersError) {
    console.error("Error fetching users with roles:", usersError);
  }

  const users: UserWithRole[] = usersData || [];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark dark:text-white">
            {t("title")}
          </h1>
          <p className="text-nordic-muted dark:text-gray-400 mt-1">
            {t("subtitle")}
          </p>
        </div>

        <AdminDashboardClient 
          initialProperties={properties} 
          initialUsers={users} 
        />
      </main>
    </>
  );
}
