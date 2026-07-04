import { getArticleById } from "@/lib/services/news";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  // In a real app, we'd fetch from Firebase here. Using mock logic for the demo if ID is numeric.
  // const article = await getArticleById(params.id);
  
  // Mock fallback for demonstration
  const article = {
    id: params.id,
    title: "The Autonomous Revolution: How Sarang is Leading Odisha's Robotics Future",
    content: `
      <p>The dawn of a new era has arrived at the Indira Gandhi Institute of Technology (IGIT), Sarang. What started as a small club of enthusiasts has transformed into a powerhouse of innovation, churning out breakthroughs that are catching the attention of the national engineering community.</p>
      
      <p>Robotics is no longer just about building machines; it's about building intelligence. At IGIT, we are focusing on the intersection of artificial intelligence and mechanical precision. Our latest project, the 'Odi-Rover', is a testament to this philosophy. Designed to navigate the rugged terrains of rural Odisha, this autonomous vehicle uses a custom-built SLAM algorithm to map its environment in real-time.</p>
      
      <h3 className="text-2xl font-serif mt-8 mb-4 italic">"Nature is our greatest teacher when it comes to coordination."</h3>
      
      <p>This insight led our research team to explore swarm intelligence. By mimicking the collective behavior of bees, we've developed a drone coordination system that can deploy dozens of units for search and rescue operations without human intervention.</p>
      
      <p>But the journey isn't just about the technology. It's about the people. The late nights in the lab, the failed prototypes, and the ultimate triumph when a robot executes its first successful command—this is the heartbeat of IGIT Robotics.</p>
    `,
    category: "Spotlight",
    date: "April 21, 2026",
    authorName: "Priyamnkar Padhy",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2070",
  };

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-12 reveal">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 block">
          {article.category}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs font-medium grayscale mb-12">
          <span>By {article.authorName}</span>
          <span className="w-1 h-1 bg-black/20 rounded-full"></span>
          <span>{article.date}</span>
        </div>
      </div>

      <div className="relative aspect-video mb-12 filter grayscale contrast-125 border-y border-black/5 py-4">
        <img 
          src={article.coverImage} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div 
        className="prose prose-stone lg:prose-xl mx-auto font-inter leading-relaxed text-foreground/80 first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:mt-3"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      <div className="divider mt-20"></div>
      
      <div className="mt-12 flex flex-col md:flex-row items-center gap-6 p-8 border border-black/5 bg-black/5 rounded-sm">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-serif text-2xl italic">
          P
        </div>
        <div>
          <h4 className="text-lg font-serif italic mb-1">About the Author</h4>
          <p className="text-sm text-muted">
            {article.authorName} is a Lead Researcher at IGIT Robotics Society, specializing in Autonomous Systems and AI ethics.
          </p>
        </div>
      </div>
    </article>
  );
}
