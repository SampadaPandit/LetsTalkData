
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useArticle } from "@/hooks/use-content";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useArticle(id);
  
  useEffect(() => {
    // Redirect to articles page if there's an error or no article found
    if (isError || (!isLoading && !article)) {
      navigate('/articles');
    }
  }, [isError, isLoading, article, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="container px-6 max-w-7xl mx-auto pt-8 pb-20">
        <br></br>
        <br></br>
        <br></br>
          {/* <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link to="/articles" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
            </Button>
          </div> */}

          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            
            <div className="flex items-center mb-6">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            
            <Skeleton className="w-full aspect-video rounded-lg mb-8" />
            
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no article is found, this will redirect via the useEffect above
  if (!article) return null;

  // Process content to handle both HTML and markdown-like syntax
  const processContent = () => {
    // Check if content contains HTML tags
    const containsHtml = /<[a-z][\s\S]*>/i.test(article.content);
    
    if (containsHtml) {
      // If content contains HTML, return it to be rendered with dangerouslySetInnerHTML
      return article.content;
    } else {
      // If content is markdown-like, process it as before
      const lines = article.content.split('\n');
      let processedContent = '';
      
      lines.forEach((line) => {
        line = line.trim();
        if (!line) {
          processedContent += '<div class="my-4"></div>';
        } else if (line.startsWith('# ')) {
          processedContent += `<h1 class="text-3xl font-bold mt-8 mb-6">${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
          processedContent += `<h2 class="text-2xl font-semibold mt-8 mb-4">${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
          processedContent += `<h3 class="text-xl font-medium mt-6 mb-3">${line.substring(4)}</h3>`;
        } else if (line.startsWith('- ')) {
          processedContent += `<li class="ml-6 mb-2">${line.substring(2)}</li>`;
        } else if (line.startsWith('```')) {
          processedContent += `<pre class="bg-secondary p-4 rounded-lg overflow-x-auto my-4"><code>`;
        } else if (line.includes('```')) {
          processedContent += `</code></pre>`;
        } else {
          processedContent += `<p class="mb-4">${line}</p>`;
        }
      });
      
      return processedContent;
    }
  };

  const processedContent = processContent();

  // Author information - you might need to adjust this based on your database schema
  const authorInfo = {
    name: "Sampada Pandit", // Default author name
    title: "Author", // Default author title
    image: "https://avatars.githubusercontent.com/u/48679174?s=96&v=4" // Default author image
  };

  return (
    <div className="animate-fade-in">
      <div className="container px-6 max-w-7xl mx-auto pt-8 pb-20">
      <br></br>
      <br></br>
      <br></br>
        {/* <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/articles" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div> */}

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={authorInfo.image} 
                  alt={authorInfo.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-medium">{authorInfo.name}</p>
                <p className="text-sm text-muted-foreground">{authorInfo.title}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">{article.date}</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto object-cover" 
            />
          </div>
          
          <div className="prose-custom">
            {/* Replace the renderContent() call with dangerouslySetInnerHTML */}
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          </div>
        </div>
      </div>
    </div>
  );
}
