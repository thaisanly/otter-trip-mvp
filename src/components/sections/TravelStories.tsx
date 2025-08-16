'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { HeartIcon, MessageCircleIcon, ShareIcon } from 'lucide-react';
import InterestTag from '../ui/InterestTag';
type TravelStory = {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  content: string;
  likes: number;
  traits: string[];
};
type TravelStoriesProps = {
  stories: TravelStory[];
};
const TravelStories = ({ stories }: TravelStoriesProps) => {
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const toggleStoryExpansion = (storyId: string) => {
    if (expandedStory === storyId) {
      setExpandedStory(null);
    } else {
      setExpandedStory(storyId);
    }
  };
  const toggleLike = (storyId: string) => {
    setLikedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Travel Stories</h2>
        <span className="text-gray-500 text-sm">{stories.length} stories</span>
      </div>
      <div className="space-y-8">
        {stories.map((story) => (
          <div key={story.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="aspect-[16/9] relative">
              <Image src={story.image} alt={story.title} className="w-full h-full object-cover" width={800} height={450} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{story.title}</h3>
                <div className="flex items-center text-sm">
                  <span className="mr-3">{story.location}</span>
                  <span className="opacity-70">· {story.date}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {story.traits.map((trait, index) => (
                  <InterestTag
                    key={`${story.id}-trait-${index}`}
                    label={trait}
                    className="text-xs"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                {expandedStory === story.id
                  ? story.content
                  : `${story.content.substring(0, 200)}...`}
              </p>
              <button
                onClick={() => toggleStoryExpansion(story.id)}
                className="text-blue-600 font-medium hover:text-blue-800 mb-6"
              >
                {expandedStory === story.id ? 'Read less' : 'Read more'}
              </button>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-gray-500 hover:text-red-500"
                    onClick={() => toggleLike(story.id)}
                  >
                    <HeartIcon
                      size={18}
                      className={`mr-1 ${likedStories[story.id] ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{likedStories[story.id] ? story.likes + 1 : story.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500">
                    <MessageCircleIcon size={18} className="mr-1" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500">
                    <ShareIcon size={18} className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TravelStories;
