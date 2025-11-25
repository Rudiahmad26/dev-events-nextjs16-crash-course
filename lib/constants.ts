// Centralized event data that can be consumed by components like EventCard
// Images referenced here must exist under the public/images directory.

export interface EventItem {
  title: string
  image: string // path under /public, e.g. "/images/event1.png"
  slug: string
  location: string
  date: string // human-readable date for display
  time: string // human-readable time range
}

// Real or popular developer conferences, hackathons, and meetups.
// Note: Dates are set to realistic upcoming schedules or recurring seasonal windows.
export const events: EventItem[] = [
  {
    title: "AWS re:Invent 2025",
    image: "/images/event1.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, NV, USA",
    date: "Dec 1–5, 2025",
    time: "8:00 AM – 6:00 PM PT",
  },
  {
    title: "NVIDIA GTC 2026",
    image: "/images/event2.png",
    slug: "nvidia-gtc-2026",
    location: "San Jose, CA, USA + Online",
    date: "Mar 2026 (TBA)",
    time: "9:00 AM – 5:00 PM PT",
  },
  {
    title: "Google I/O 2026",
    image: "/images/event3.png",
    slug: "google-io-2026",
    location: "Shoreline Amphitheatre, Mountain View, CA + Online",
    date: "May 2026 (TBA)",
    time: "10:00 AM – 4:00 PM PT",
  },
  {
    title: "Microsoft Build 2026",
    image: "/images/event4.png",
    slug: "microsoft-build-2026",
    location: "Seattle, WA, USA + Online",
    date: "May 2026 (TBA)",
    time: "9:00 AM – 5:00 PM PT",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event5.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "Jun 2026 (TBA)",
    time: "9:00 AM – 6:00 PM CEST",
  },
  {
    title: "HackMIT 2026",
    image: "/images/event6.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "Sep 2026 (Weekend)",
    time: "36-hour hackathon",
  },
  {
    title: "React Summit 2026",
    image: "/images/event-full.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands + Online",
    date: "Jun 2026 (TBA)",
    time: "9:00 AM – 6:00 PM CEST",
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    image: "/images/event2.png",
    slug: "kubecon-eu-2026",
    location: "Vienna, Austria",
    date: "Apr 2026 (TBA)",
    time: "9:00 AM – 6:00 PM CEST",
  },
]

export default events
