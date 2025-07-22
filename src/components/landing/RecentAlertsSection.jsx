import React from 'react';
import { Button } from '@/components/ui/button';
import alertImage from '../../assets/news/Alert 1.png';

const articles = [
  {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    source: 'CNN',
    image: alertImage,
  },
  {
    title: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    source: 'BBC News',
    image: alertImage,
  },
  {
    title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    source: 'Reuters',
    image: alertImage,
  },
    {
    title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    source: 'Associated Press',
    image: alertImage,
  },
];

const RecentAlertsSection = () => {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Recent Alerts
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-card shadow-md">
              <img className="h-48 w-full object-cover" src={article.image} alt={article.title} />
              <div className="p-6">
                <p className="text-sm text-muted-foreground">{article.source}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{article.title}</h3>
                <Button variant="link" asChild className="mt-4 px-0">
                  <a href="#">
                    Read More →
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentAlertsSection;