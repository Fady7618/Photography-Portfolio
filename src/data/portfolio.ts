export type PortfolioImage = {
  id: string
  title: string
  src: string
  category: 'wedding' | 'portrait' | 'event'
}

export const portfolioImages: PortfolioImage[] = [
  {
    id: '1',
    title: 'Beautiful Wedding Ceremony',
    src: '/wedding.jpg',
    category: 'wedding',
  },
  {
    id: '2',
    title: 'Wedding Reception',
    src: '/wedding.webp',
    category: 'wedding',
  },
  {
    id: '3',
    title: 'Romantic Couple Moments',
    src: '/wedding1.jpg',
    category: 'wedding',
  },
  {
    id: '4',
    title: 'Outdoor Wedding Scene',
    src: '/wedding2.webp',
    category: 'wedding',
  },
  {
    id: '5',
    title: 'Elegant Wedding Details',
    src: '/wedding3.webp',
    category: 'wedding',
  },
]
