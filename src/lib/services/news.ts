import { supabase } from "../supabase-client";

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  authorId: string;
  authorName: string;
  coverImage: string;
  publishedAt: string; // Changed from Timestamp to string for Supabase/Postgres
  status: 'draft' | 'published';
  tags: string[];
}

const ARTICLES_TABLE = "articles";

export const getArticles = async (category?: string, limitCount: number = 10) => {
  try {
    let query = supabase
      .from(ARTICLES_TABLE)
      .select("*")
      .eq("status", "published")
      .order("publishedAt", { ascending: false })
      .limit(limitCount);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export const getArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from(ARTICLES_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as Article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const createArticle = async (article: Omit<Article, 'id' | 'publishedAt'>) => {
  try {
    const { data, error } = await supabase
      .from(ARTICLES_TABLE)
      .insert([
        {
          ...article,
          publishedAt: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

