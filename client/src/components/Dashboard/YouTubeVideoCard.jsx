import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Youtube } from 'lucide-react';

const YouTubeVideoCard = ({ title, channel, videoId, description }) => {
    const handleSearch = () => {
      const query = encodeURIComponent(`${title} ${channel || ''} tutorial`);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-none bg-white h-full flex flex-col">
        <div className="aspect-video w-full relative group bg-gray-100">
          {videoId ? (
            <iframe 
              className="w-full h-full" 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title={title} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
               <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                 <Youtube className="h-8 w-8 text-red-500 opacity-60" />
               </div>
               <p className="text-xs font-semibold text-gray-500 mb-3">No direct preview available</p>
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={handleSearch}
                 className="text-[10px] h-7 bg-white hover:bg-gray-50 border-gray-200"
               >
                 <Search className="h-3 w-3 mr-1" /> Search for Tutorial
               </Button>
            </div>
          )}
        </div>
        <CardHeader className="pb-2 flex-1">
          <CardTitle className="text-sm font-bold line-clamp-2 min-h-[40px]">{title}</CardTitle>
          <div className="flex items-center justify-between mt-2">
            {channel && <p className="text-[10px] font-semibold text-career-blue uppercase tracking-wider">{channel}</p>}
            {videoId && (
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
              >
                Watch on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardHeader>
        {description && (
          <CardContent className="pt-0 pb-4">
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
          </CardContent>
        )}
      </Card>
    );
};

export default YouTubeVideoCard;
