import React, { useState, useMemo } from "react";
import { EntertainmentGallery } from "./widgets";
import YouTubeVideoModal from './widgets/social-networks/YouTubeVideoModal.jsx';
import FacebookModal from './widgets/social-networks/FacebookModal.jsx';
import AnimatedFacebookModal from './widgets/social-networks/AnimatedFacebookModal.jsx';
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import OfficeGallery from "./widgets/office/OfficeGallery.js";
import OtherGallery from "./widgets/other/OtherGallery.js";
import SportsGallery from "./widgets/sports/SportsGallery.js";
import TextScrollerGallery from "./widgets/text-scrollers/textScrollerGallery.js";
import WeatherGallery from "./widgets/weather/WeatherGallery.js";
import WebMedia from "./widgets/web-media/Webmedia.js";
import RetireMeida from "./widgets/retired-apps/RetiredMedia.js";
import NewMedia from "./widgets/news-rss-feeds/NewsMedia.js";
import FeaturedGallery from "./widgets/office/OfficeGallery.js";
import ClockGallery from "./widgets/clock/ClockGallery.js";
import FinanceGallery from "./widgets/finance/FinanceGallery.js";
import MeetingGallery from "./widgets/meeting-calendar/MeetingGallery.js";
import MenuBoardGallery from "./widgets/menu-boards-tables/MenuBoardGallery.js";


const galleryData = [
  {
    category: "Featured",
    cards: [
      {
        name: "Featured App",
        description: "A featured app for quick access.",
        image: "https://via.placeholder.com/200x120?text=Featured+App"
      }
    ]
  },
  {
    category: "Clock",
    cards: [
      {
        name: "Analog Round Clock",
        description: "Classic analog round clock.",
        image: "https://img.freepik.com/premium-vector/classic-black-white-round-wall-clock_128452-60.jpg",
        type: "analog-round"
      },
      {
        name: "Analog Square Clock",
        description: "Square analog clock widget.",
        image: "https://m.media-amazon.com/images/I/61DCPXXlPOL.jpg",
        type: "analog-square"
      },
      {
        name: "Digital Clock - Simple",
        description: "Simple digital clock.",
        image: "data:image/webp;base64,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"
, // <-- Add this comma
        type: "digital-simple"
      }, // <-- This comma is required!
      {
        name: "Clock Bar - Modern",
        description: "Modern bar clock.",
        image: "https://tse1.mm.bing.net/th/id/OIP.J8tK_Q-pw1Y6poKcdv-AwgAAAA?r=0&pid=ImgDet&w=202&h=310&c=7&dpr=1.3&o=7&rm=3",
        type: "bar-modern"
      },
      {
        name: "Countdown App",
        description: "Countdown timer widget.",
        image: "https://th.bing.com/th/id/OIP.bgwbTVkleP-qVPdIDaAfnwHaFC?w=324&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "countdown-app"
      },
     
      {
        name: "Glow Clock",
        description: "Glow effect clock.",
        image: "https://tse1.explicit.bing.net/th/id/OIP.MvZ6zb2DOtJzA7IVBFKFHwHaLH?r=0&pid=ImgDet&w=202&h=303&c=7&dpr=1.3&o=7&rm=3"
      },
      {
        name: "Holiday Clock",
        description: "Holiday themed clock.",
        image: "https://tse3.mm.bing.net/th/id/OIP.tyvdg8VW7J9O43NdEbQ5_QHaH-?r=0&pid=ImgDet&w=202&h=217&c=7&dpr=1.3&o=7&rm=3"
      },
      {
        name: "LCD Clock",
        description: "LCD style clock.",
        image: "https://tse2.mm.bing.net/th/id/OIP.gl7S-qzCx4qJYT_g2Rx1MwAAAA?r=0&pid=ImgDet&w=202&h=108&c=7&dpr=1.3&o=7&rm=3"
      },
      {
        name: "Multi City Clock",
        description: "Multiple city clocks.",
        image: "https://th.bing.com/th/id/OIP.-ULxSD8ABvT7ZmWOxxApqAHaEZ?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
      }
    ]
  },
  {
    category: "Entertainment",
    cards: [
      {
        name: "American Football",
        description: "The name of the league",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Animal Facts",
        description: "Egyptians and their felines",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Baseball Curiosities",
        description: "Baseball Curiosities",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Basketball",
        description: "Basketball",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Cricket Facts",
        description: "Hundreds of awesome cricket facts.",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Famous Quotes 1",
        description: "Every human being on this earth is born with a tragedy, and it isn't original sin. He's born with the tragedy that he has to grow up... a lot of people don't have the courage to do it. - Helen Hayes",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Famous Quotes 2",
        description: "Every human being on this earth is born with a tragedy, and it isn't original sin. He's born with the tragedy that he has to grow up... a lot of people don't have the courage to do it. - Helen Hayes",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Famous Quotes 3",
        description: "Every human being on this earth is born with a tragedy, and it isn't original sin. He's born with the tragedy that he has to grow up... a lot of people don't have the courage to do it. - Helen Hayes",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Health Tips",
        description: "Health Tips",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Ice Hockey Facts",
        description: "Ice Hockey Facts",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Quiz and Trivia",
        description: "By definition, where does an axolotl commonly live? A) Inside a tree, B) At the bottom of the ocean, C) On top of a mountain, D) In the desert",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Rugby Facts",
        description: "Rugby Facts",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Scientific Curiosities",
        description: "Scientific Curiosities",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Today In History",
        description: "TODAY IN HISTORY",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Travel",
        description: "Travel",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Upcoming movies",
        description: "Annabelle Creation",
        image: "data:image/webp;base64,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"
      },
      {
        name: "Volleyball",
        description: "Volleyball",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      }
    ]
  },
  {
    category: "Finance",
    cards: [
      {
        name: "7 days exchange rate",
        description: "Currency exchange rates with daily and weekly variations.",
        image: "https://th.bing.com/th?q=Exchange+Rate+Issues+Clip+Art&w=120&h=120&c=1&rs=1&qlt=70&r=0&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-WW&cc=PK&setlang=en&adlt=moderate&t=1&mw=247",
        type: "finance"
      },
      {
        name: "Currency Exchange Scroller",
        description: "Scrolling currency exchange rates.",
        image: "https://th.bing.com/th/id/OIP.hNpkMeatsHqJl4rr5UWangAAAA?w=258&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Exchange Rate",
        description: "Multiple currency exchange rates with flags.",
        image: "data:image/webp;base64,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",
        type: "finance"
      },
      {
        name: "Exchange Rate Chart",
        description: "Exchange rate chart with line graphs.",
        image: "https://s3.amazonaws.com/wp-uploads.benzinga-money.prod/wp-content/uploads/2018/07/06195302/Capture2.png",
        type: "finance"
      },
      {
        name: "Exchange Rate Table",
        description: "Select and present up to 10 stocks or financial indexes.",
        image: "https://th.bing.com/th/id/OIP.gJSaqMTBEdBnvXX9Sim_EQHaE8?w=248&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Mini Chart",
        description: "Mini chart by TradingView with currency data.",
        image: "https://th.bing.com/th?id=OIF.9FOkT%2fMwLS%2bTsug7SjYF7Q&w=324&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Multi-currency exchange rate",
        description: "Multi-currency exchange rate display.",
        image: "data:image/webp;base64,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",
        type: "finance"
      },
      {
        name: "Exchange Rate Chart",
        description: "Exchange rate chart with line graphs.",
        image: "https://s3.amazonaws.com/wp-uploads.benzinga-money.prod/wp-content/uploads/2018/07/06195302/Capture2.png",
        type: "finance"
      },
      {
        name: "Exchange Rate Table",
        description: "Select and present up to 10 stocks or financial indexes.",
        image: "https://th.bing.com/th/id/OIP.gJSaqMTBEdBnvXX9Sim_EQHaE8?w=248&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Mini Chart",
        description: "Mini chart by TradingView with currency data.",
        image: "https://th.bing.com/th?id=OIF.9FOkT%2fMwLS%2bTsug7SjYF7Q&w=324&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Multi-currency exchange rate",
        description: "Multi-currency exchange rate display.",
        image: "data:image/webp;base64,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",
        type: "finance"
      },
      {
        name: "Mini Chart",
        description: "Mini chart by TradingView with currency data.",
        image: "https://th.bing.com/th?id=OIF.9FOkT%2fMwLS%2bTsug7SjYF7Q&w=324&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Multi-currency exchange rate",
        description: "Multi-currency exchange rate display.",
        image: "data:image/webp;base64,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",
        type: "finance"
      },
      {
        name: "Single Exchange Rate",
        description: "Single currency exchange rate display.",
        image: "https://th.bing.com/th?q=Multi-Currency+PNG&w=120&h=120&c=1&rs=1&qlt=90&r=0&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=PK&setlang=en&adlt=moderate&t=1&mw=247",
        type: "finance"
      },
      {
        name: "Single Exchange Rate Chart",
        description: "Single exchange rate with chart visualization.",
        image: "https://th.bing.com/th?q=Multi-Currency+PNG&w=120&h=120&c=1&rs=1&qlt=90&r=0&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=PK&setlang=en&adlt=moderate&t=1&mw=247",
        type: "finance"
      },
      
      {
        name: "Symbol Info",
        description: "Symbol information display.",
        image: "https://th.bing.com/th/id/OIP.zYaYpNhx7ocyeJgtXHuiywHaH3?w=241&h=189&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Symbol Overview",
        description: "Comprehensive symbol overview with data.",
        image: "https://th.bing.com/th/id/OIP.zYaYpNhx7ocyeJgtXHuiywHaH3?w=241&h=189&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Ticker",
        description: "Real-time ticker display for financial symbols.",
        image: "https://th.bing.com/th/id/OIP._pP5qUDhnWuq8LK2VqkTOgHaEr?w=284&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Ticker Tape",
        description: "Scrolling ticker tape with multiple symbols.",
        image: "https://th.bing.com/th/id/OIP._pP5qUDhnWuq8LK2VqkTOgHaEr?w=284&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      },
      {
        name: "Ticker Tape 2",
        description: "Another instance of scrolling ticker tape.",
        image: "https://th.bing.com/th/id/OIP.P3U8nU0YhlQZbkgqPBa3kAHaEK?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        type: "finance"
      }
    ]
  },
  {
    category: "Meeting Room & Calendar",
    cards: [
      {
        name: "Birthday Announcement",
        description: "Display upcoming birthdays with data feed integration.",
        image: "https://cdn.pixabay.com/photo/2016/08/16/09/53/international-conference-1597531_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Calendar App",
        description: "Display upcoming events and schedules.",
        image: "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Events Calendar",
        description: "Show daily events and schedules in calendar format.",
        image: "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Happy Birthday",
        description: "Celebrate birthdays with customizable templates.",
        image: "https://cdn.pixabay.com/photo/2016/08/16/09/53/international-conference-1597531_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Happy Birthday - Elegant",
        description: "Elegant birthday announcement with data feed.",
        image: "https://cdn.pixabay.com/photo/2016/08/16/09/53/international-conference-1597531_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Happy Birthday - Enterprise",
        description: "Corporate-style birthday announcements.",
        image: "https://cdn.pixabay.com/photo/2016/08/16/09/53/international-conference-1597531_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Meeting Room Calendar App",
        description: "Display meeting room availability and schedules.",
        image: "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_640.jpg",
        type: "meeting-calendar"
      },
      {
        name: "Meeting Room Calendar Bar",
        description: "Compact view of meeting room status.",
        image: "https://cdn.pixabay.com/photo/2016/08/16/09/53/international-conference-1597531_640.jpg",
        type: "meeting-calendar"
      }
    ]
  },
  {
    category: "Menu Boards & Tables",
    cards: [
      {
        name: "Cafeteria",
        description: "Digital cafeteria menu display with breakfast, lunch, and snack options.",
        image: "https://cdn.pixabay.com/photo/2017/07/31/11/22/man-2557408_640.jpg",
        type: "menu-board"
      },
      {
        name: "Directory List",
        description: "Display room and class schedules in a directory format.",
        image: "https://cdn.pixabay.com/photo/2019/09/17/09/45/to-do-4483048_640.jpg",
        type: "menu-board"
      },
      {
        name: "Menu Board - Basic",
        description: "Simple menu board with pricing information.",
        image: "https://cdn.pixabay.com/photo/2019/09/17/09/45/to-do-4483048_640.jpg",
        type: "menu-board"
      },
      {
        name: "Menu Board - Casual",
        description: "Casual dining menu with images and pricing.",
        image: "https://cdn.pixabay.com/photo/2022/07/16/15/01/checklist-7325314_640.jpg",
        type: "menu-board"
      },
      {
        name: "Sales App - Modern",
        description: "Modern product display with pricing information.",
        image: "https://cdn.pixabay.com/photo/2018/02/14/23/38/shopping-cart-3154149_640.jpg",
        type: "menu-board"
      },
      {
        name: "Sales App - Simple",
        description: "Simple product display with pricing.",
        image: "https://cdn.pixabay.com/photo/2018/02/14/23/38/shopping-cart-3154149_640.jpg",
        type: "menu-board"
      },
      {
        name: "Sales Grid",
        description: "Grid layout for multiple product displays.",
        image: "https://cdn.pixabay.com/photo/2024/09/30/03/57/ai-generated-9084620_640.jpg",
        type: "menu-board"
      },
      {
        name: "Simple Table",
        description: "Basic table layout for displaying information.",
        image: "https://cdn.pixabay.com/photo/2023/11/14/11/33/ai-generated-8387510_640.png",
        type: "menu-board"
      }
    ]
  },
  {
    category: "News & RSS Feeds",
    cards: [
      {
        name: "Configurable News",
        description: "Customizable news feed with configurable sources.",
        image: "https://cdn.pixabay.com/photo/2024/09/30/13/58/cactus-9085905_640.jpg",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      },
      {
        name: "Configurable RSS News",
        description: "RSS-based news feed with customizable sources.",
        image: "https://cdn.pixabay.com/photo/2024/01/01/13/55/strong-8481378_640.jpg",
        type: "rss-feed"
      },
      {
        name: "Creative News Feed",
        description: "Visually appealing news feed with modern design.",
        image: "https://cdn.pixabay.com/photo/2024/09/27/20/10/pantheon-paris-9079834_640.jpg",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      },
      {
        name: "Creative RSS",
        description: "Stylish RSS feed with customizable appearance.",
        image: "https://cdn.pixabay.com/photo/2025/03/19/19/40/square-9481441_640.jpg",
        type: "rss-feed"
      },
      {
        name: "Cycling Media RSS",
        description: "RSS feed focused on cycling and sports news.",
        image: "https://cdn.pixabay.com/photo/2018/01/28/10/59/internet-3113279_640.jpg",
        type: "rss-feed"
      },
      {
        name: "Flexible News Ticker",
        description: "Scrolling news ticker for important updates.",
        image: "https://cdn.pixabay.com/photo/2024/02/18/18/54/retro-8581825_640.jpg",
        type: "news-ticker"
      },
      {
        name: "Media RSS",
        description: "Media-rich RSS feed with images and videos.",
        image: "https://cdn.pixabay.com/photo/2014/03/22/22/15/social-media-292988_640.jpg",
        type: "rss-feed"
      },
      {
        name: "Modern News",
        description: "Contemporary news feed with sleek design.",
        image: "https://cdn.pixabay.com/photo/2020/05/18/16/17/social-media-5187243_640.png",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      },
      {
        name: "Modern RSS",
        description: "Modern RSS feed with clean interface.",
        image: "https://cdn.pixabay.com/photo/2016/01/20/11/54/book-wall-1151405_640.jpg",
        type: "rss-feed"
      },
      {
        name: "News Circle",
        description: "Circular news display with rotating headlines.",
        image: "https://cdn.pixabay.com/photo/2023/06/28/08/13/public-speaking-8093767_640.png",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      },
      {
        name: "News Feed 1",
        description: "Standard news feed with latest headlines.",
        image: "https://cdn.pixabay.com/photo/2021/01/04/23/12/world-trade-center-5889199_640.jpg",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      },
      {
        name: "News Feed 3",
        description: "Alternative news feed layout with featured stories.",
        image: "https://cdn.pixabay.com/photo/2020/05/24/06/54/dumbo-5212670_640.jpg",
        dataFeed: "Data Feed Enabled!",
        type: "news-feed"
      }
    ]
  },
  {
    category: "Office",
cards: [
  {
    name: "Office App",
    description: "Office productivity tools.",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL3l3DN3EfU5a4xM2zYyGsXBrOjdGVfGga2g&s"
  },
  {
    name: "New Employee",
    description: "Data Feed Enabled",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCTVsK2OH5_yxY2hP3UzRIChqpcJKSr7RnkA&s"
  },
  {
    name: "Our Team",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX-oEnKBEvXjSpKmFYZhVEzomjt_WoFHC4yw&s"
  },
  {
    name: "Success Cases",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2h5_fdoT-tCHc0ne6tB_wzq0xvSkcMryxCQ&s"
  },
  {
    name: "Testimonials",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThlZxHmCbNHiCgjbrtSL0Tx2IbLBvl7Xa_fw&s"
  },
  {
    name: "Wi-Fi Zone",
    dataFeed: "Data Feed Enabled!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXM_RLvhPABJvVjduSiHlBIv9dBWsjfeEaA&s"
  }
]

  },
  {
    category: "Other",
cards: [
  {
    name: "Airport Flight Status",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxHuLyKGW9wIJdIpv9OHo3MlhCizJrnPhElw&s"
  },
  {
    name: "Audio Announcement App",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQob8_1uCF1VZ0MPiuz06makVqX7dJlR28h9g&s"
  },
  {
    name: "Flight Status",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQktMqnoGoT7Ettj-RzsbJetDUQDbT_L5ScTw&s"
  },
  {
    name: "HDMI Input",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_tFfQmxyydrYOpvK21dOvVP50i8PiStQbWA&s"
  },
  {
    name: "Weather + Exchange - Ticker",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaNw4L8GknXoD-KfSohUIB7K91Mfr3ItNY8g&s"
  }
]
  },
  {
    category: "Social Networks",
    cards: [
      {
        name: "Animated Facebook App",
        description: "Interactive Facebook feed with animations.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
        type: "social-network"
      },
      {
        name: "Facebook Modern",
        description: "Modern Facebook interface with data feed.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
        dataFeed: "Data Feed Enabled!",
        type: "social-network"
      },
      {
        name: "Facebook Page",
        description: "Facebook page display with content.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
        type: "social-network"
      },
      {
        name: "Follow Us",
        description: "Social media follow widget with QR code.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
        type: "social-network"
      },
      {
        name: "Tagbox Display",
        description: "Social media tag display widget.",
        image: "https://via.placeholder.com/200x120?text=Tagbox+Display",
        type: "social-network"
      },
      {
        name: "Walls.io",
        description: "Walls.io social media wall integration.",
        image: "https://via.placeholder.com/200x120?text=Walls.io",
        type: "social-network"
      },
      {
        name: "YouTube Video",
        description: "YouTube video player widget.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1280px-YouTube_full-color_icon_%282017%29.svg.png",
        type: "social-network"
      }
    ]
  },
{
  category: "Sports",
  cards: [
    {
      name: "Match scores widget",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQya2Q8l1k3YVWNS8XOUPgt_uZYZnjWZKRJeQ&s"
    },
    {
      name: "Match Scores Widget",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2SMgNA_kvaAMZG7pPKsguNGIWEuQjB5L1mw&s"
    },
    {
      name: "Soccer league table",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP0-QHu-42wkyha38UwVsO4UEcD8e_fmF-pg&s"
    },
    {
      name: "Soccer league table",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHIlRDaC05D4FOOgBVToHGyt419jBgv89opg&s"
    },
    {
      name: "Soccer Scores",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqtjQ57tObyOiImHXReapPsc8SAVfcbzyxUQ&s"
    },
    {
      name: "Soccer Tables",
      description: "Sports updates and scores.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsBGB7UEDwBFHWHZ7mbABJFGTSFVo7bbQPNg&s"
    }
  ]
},
{
  category: "Text and Scrollers",
  cards: [
    {
      name: "Message App",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr63tAT-NZcmTkoNF3Tp5P958FyH22c4FtXQ&s"
    },
    {
      name: "QR Code",
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAB9CAMAAAC7zMUWAAAABlBMVEX///8AAABVwtN+AAACS0lEQVR4nO3VQW7DMAwF0eb+l+4mBQSCn5LTppgY8zaJLclpOQt/fUmSdAuPwbr+872eqXtOn6vAIDAGgTEITBrQev/K9/p5+nt6MgiMQWAMAjO9qLvP+n09e+W5CgwCYxAYg8CcDq6uT2evPFeFQWAMAmMQmJPB7e7XGKfPVcMgMAaBMQhMGlAdaF2rA06fp7+nJ4PAGATGIDCPwc/6q5/TcxUYBMYgMAb5QFOk7rvezCAwBoExyD+qQ17vT2vd+Rol7XvH/3EbBoExCIxBYE4GX4d+sl73pnsqDAJjEBiDwFyJsa5NA+/CpN9RYRAYg8AYBCYNNu2pg+7OdWs6ZBAYg8AYBGYaavpcpWelKIbaMAiMQWAMApUGOO2tZ+r9tPaOv/92DAJjEBiDwOyGl+7V9e46ndHAIDAGgTEIRDe03Vo34HTeABcZBMYgMAaBqS/f3ct7vd69yH2pv8AgMAaBMQhYGuAU6jRCd14bBoExCIxBAKYhrusnAz4ZukE2DAJjEBiDgNUwXaBp73ReLzAIjEFgDAJQX8RTjEfQPavbY6ADBoExCIxBPszp4Ne16bxRfskgMAaBMcg/64abBtgNO+1JAQyyYRAYg8AYBCYN6GTINdx6vZ7t9iswCIxBYAwCkwY6DS7FSta9BtkwCIxBYAwCcxqkG3I6k9a756owCIxBYAwCczLcbk8ddH1ed53OaGEQGIPAGAQmDWg37DrcXcC//8tvyiAwBoExCMxjsK7XvXWtPm+9ruvv/68+mEFgDAJjEEmSdBPfFrAaga+xUnIAAAAASUVORK5CYII="
    },
    {
      name: "Text Scroller",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyym-2AAIrx5IwO7TrrhlJcYWOEn57AaRpAQ&s"
    },
    {
      name: "Text Ticker",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMyynWIg_9qEjqCRTYkco0lcL7Jfo3o8eAWg&s"
    }
  ]
},
  {
    category: "Third Party",
    cards: [
            {
        name: "GeckoBoard",
        description: "Third party integrations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcBf4aFMtsmMPHmTUR3OfW756n_AX8xWNjvg&s"
      }
      ,
       {
        name: "Google Slides",
        description: "Third party integrations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuUKnv82KlXZWb6w_OTeWY9wTZxQwGUrUng&s"

      },
            {
        name: "Klipfolio",
        description: "Third party integrations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvuoX8Iw8dv__NozekDABIgzdRBRo7nKMDSw&s"

      },
            
       {
        name: "Screenfeed",
        description: "Third party integrations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU7u91wI7bhxOCeIRqS_GIH1BkAIqhg0pKHA&s"

      },
            {
        name: "Strea.ma",
        description: "Third party integrations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAnachNEeiwg0BKFFt1UO5Mb06qWrovMIL9Q&s"
        
      }

    ]
  },
  {
    category: "Weather",
    cards: [
      {
        name: "Modern Weather Forecast",
        description: "Modern weather forecast with current conditions and daily outlook.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Modern Weather Forecast Tall",
        description: "Tall version of modern weather forecast widget.",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Weather Forecast Tall",
        description: "Tall weather forecast widget with extended layout.",
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Weather Forecast Bar",
        description: "Bar-style weather forecast display.",
        image: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Multi City Weather",
        description: "Weather information for multiple cities with detailed conditions.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Multi City Weather Widget",
        description: "Widget displaying weather for multiple cities with scenic backgrounds.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },

      {
        name: "Multi Day Weather",
        description: "Multi-day weather forecast with daily conditions and icons.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Simple Weather App",
        description: "Flexible weather app that works well for small screen spaces.",
        image: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Single Day Graph Weather",
        description: "Weather widget with temperature graph for a single day.",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Small Weather App",
        description: "Compact weather application for limited display space.",
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Themable Weather Forecast",
        description: "Customizable weather forecast with theme options.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Weather",
        description: "Basic weather display with current conditions.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      },
      {
        name: "Weather Forecast",
        description: "Comprehensive weather forecast with extended outlook.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=400&q=80",
        dataFeed: "Data Feed Enabled!"
      }
    ]
  },
  {
    category: "Web & Media",
  cards: [
    {
      name: "Media Cycling App",
      description: "Cycle through media content.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5g0C2d1zNjp1NXRArinryEP1kcZFeFmUDjA&s"
    },
    {
      name: "Photos",
      description: "Photo gallery display.",
      image: "https://cdn.pixabay.com/photo/2021/08/31/10/34/boat-shed-6588414_640.jpg"
    },
    {
      name: "Streaming Video Link",
      description: "Stream video content.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0N0clUor2WAHBXtDHro8BVDpLIPzhmV4WNg&s"
    },
    {
      name: "Website Link",
      description: "Direct website access.",
      image: "https://cdn.pixabay.com/photo/2013/01/29/00/47/google-76517_1280.png"
    }
  ]
  },
  {
    category: "Retired Apps",
    cards: [
      {
        name: "Twitter Modern",
        description: "Discontinued applications.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaHQriH0opvbpznIbGO7OTZ9qMOxfR1Y9sTQ&s"
      }
    ]
  }
];

function AppGalleryModal({ onClose, onWidgetSelect, selectedCategory, setSelectedCategory }) {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = galleryData.map(cat => cat.category);
  const currentCategory = galleryData.find(cat => cat.category === selectedCategory) || galleryData[0];
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeCard, setYouTubeCard] = useState(null);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookCard, setFacebookCard] = useState(null);
  const [showAnimatedFacebookModal, setShowAnimatedFacebookModal] = useState(false);
  const [animatedFacebookCard, setAnimatedFacebookCard] = useState(null);


  console.log("selectedCategory",selectedCategory);
  // --- Add logic for random featured card ---
  const getRandomFeaturedCard = () => {
    const clockCat = galleryData.find(cat => cat.category === 'Clock');
    const entertainmentCat = galleryData.find(cat => cat.category === 'Entertainment');
    const all = [
      ...(clockCat ? clockCat.cards : []),
      ...(entertainmentCat ? entertainmentCat.cards : [])
    ];
    if (all.length === 0) return [];
    const idx = Math.floor(Math.random() * all.length);
    return [all[idx]];
  };
  
  // Filter cards based on search term
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'Featured') {
      // Always randomize for Featured
      return getRandomFeaturedCard();
    }
    if (!searchTerm.trim()) return currentCategory.cards;
    
    return currentCategory.cards.filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentCategory.cards, searchTerm, selectedCategory]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{ background: '#ececec', borderRadius: 10, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', display: 'flex', width: 900, minHeight: 600,  maxHeight: '90vh' }}>
        {/* Sidebar */}
        <div style={{ width: 220, borderRight: "1px solid #eee", padding: 20, overflowY: 'auto', background: '#f8f8f8' }}>
          {/* Search Bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '70%',
                  padding: '8px 12px 8px 32px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: 14
              }}>

<CiSearch />

              </span>
            </div>
          </div>
          
          {categories.map((cat, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: selectedCategory === cat ? '#1976d2' : '#444',
                cursor: 'pointer',
                background: selectedCategory === cat ? '#e3f0fc' : 'transparent',
                borderRadius: 4,
                padding: '4px 8px'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
        {/* Cards grid */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto', position: 'relative' }}>
          {/* Close button */}
          <button 
            onClick={onClose} 
            style={{ 
              position: "absolute", 
              top: 10, 
              right: 18, 
              fontSize: 22, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#666',
              zIndex: 10
            }}
          >

<IoMdClose />
          </button>

          {selectedCategory === 'Clock' ? (
            <ClockGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          ) 
          :
          selectedCategory === 'Finance' ? (
            <FinanceGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          ) 
          :
          selectedCategory === 'Menu Boards & Tables' ? (
            <MenuBoardGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          ) 
          :
          selectedCategory === 'Meeting Room & Calendar' ? (
            <MeetingGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          ) 
          :
          selectedCategory === 'Entertainment' ? (
            <EntertainmentGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          ) 
          :
           selectedCategory === 'Office' ? (
            <OfficeGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          :
           selectedCategory === 'Featured' ? (
            <FeaturedGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          : 
          selectedCategory === 'Sports' ? (
            <SportsGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          : 

                    selectedCategory === 'Third Party' ? (
            <SportsGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          : 
          selectedCategory === 'Text and Scrollers' ? (
            <TextScrollerGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          : 
          selectedCategory === 'Weather' ? (
            <WeatherGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          :  
          selectedCategory === 'Web & Media' ? (
            <WebMedia cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          :  
          selectedCategory === 'Retired Apps' ? (
            <RetireMeida cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          :
          selectedCategory === 'News & RSS Feeds' ? (
            <NewMedia cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          :

                 
           selectedCategory === 'Other' ? (
            <OtherGallery cards={filteredCards} onWidgetSelect={onWidgetSelect} />
          )
          : 

          (
            <>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18 }}>{currentCategory.category}</div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: 24 
              }}>
                {filteredCards.map((card, i) => (
                  <div
                    key={i}
                    style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', minHeight: 200, position: 'relative' }}
                    onClick={() => {
                      if (selectedCategory === 'Social Networks' && card.name === 'YouTube Video') {
                        setYouTubeCard(card);
                        setShowYouTubeModal(true);
                      } else if (selectedCategory === 'Social Networks' && card.name === 'Facebook Page') {
                        setFacebookCard(card);
                        setShowFacebookModal(true);
                      } else if (selectedCategory === 'Social Networks' && card.name === 'Animated Facebook App') {
                        setAnimatedFacebookCard(card);
                        setShowAnimatedFacebookModal(true);
                      } else if (selectedCategory === 'Social Networks' && card.name === 'Facebook Modern') {
                        setFacebookCard(card);
                        setShowFacebookModal(true);
                      } else if (selectedCategory === 'Social Networks' && card.name === 'Follow Us') {
                        setFacebookCard(card);
                        setShowFacebookModal(true);
                      } else {
                        onWidgetSelect && onWidgetSelect({
                      ...card,
                      type: selectedCategory === 'Weather' ? 'weather' :
                            selectedCategory === 'Meeting Room & Calendar' ? 'meeting-calendar' :
                            selectedCategory === 'Menu Boards & Tables' ? 'menu-board' :
                            selectedCategory === 'News & RSS Feeds' ? (card.name.toLowerCase().includes('rss') ? 'rss-feed' :
                                                                      card.name.toLowerCase().includes('ticker') ? 'news-ticker' : 'news-feed') :
                            card.type
                        });
                      }
                    }}
                  >
                    {card.name === 'Analog Square Clock' ? (
                      <img src={card.image} alt={card.name} style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 10, borderRadius: 6, background: '#f0f0f0', display: 'block' }} />
                    ) : (
                      <img src={card.image} alt={card.name} style={{ width: 180, height: 90, objectFit: 'contain', marginBottom: 10, borderRadius: 6 }} />
                    )}
                    <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{card.name}</div>
                    {card.dataFeed && <div style={{ background: '#2ecc71', color: '#fff', fontWeight: 'bold', fontSize: 13, borderRadius: 4, padding: '2px 8px', marginBottom: 6, position: 'absolute', top: 12, left: 12 }}>{card.dataFeed}</div>}
                    <div style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>{card.description}</div>
                  </div>
                ))}
              </div>
              {filteredCards.length === 0 && searchTerm && (
                <div style={{ textAlign: 'center', color: '#666', marginTop: 50 }}>
                  No results found for "{searchTerm}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showYouTubeModal && (
        <YouTubeVideoModal
          open={showYouTubeModal}
          onClose={() => setShowYouTubeModal(false)}
          initialData={youtubeCard ? { appName: youtubeCard.name, tags: '', url: '', quality: 'auto', subtitle: 'default' } : {}}
          onSave={(data) => {
            // Ensure widget has all required fields for content area
            const widgetToSave = {
              ...data,
              type: 'social-network',
              name: data.appName || 'YouTube Video',
              appName: data.appName || 'YouTube Video',
              originalName: youtubeCard?.name || 'YouTube Video',
              widgetCategory: 'Social Networks',
              widgetSubType: 'youtube-video',
            };
            // Close the modal first
            setShowYouTubeModal(false);
            // Save the widget directly
            onWidgetSelect && onWidgetSelect(widgetToSave);
          }}
        />
      )}
      {showFacebookModal && (
        <FacebookModal
          open={showFacebookModal}
          onClose={() => setShowFacebookModal(false)}
          initialData={facebookCard ? { appName: facebookCard.name, tags: '', url: '' } : {}}
          onSave={(data) => {
            // Ensure widget has all required fields for content area
            const widgetToSave = {
              ...data,
              type: 'social-network',
              name: data.appName || 'Facebook Page',
              appName: data.appName || 'Facebook Page',
              originalName: facebookCard?.name || 'Facebook Page',
              widgetCategory: 'Social Networks',
              widgetSubType: 'facebook-page',
            };
            // Close the modal first
            setShowFacebookModal(false);
            // Save the widget directly
            onWidgetSelect && onWidgetSelect(widgetToSave);
          }}
        />
      )}
      {showAnimatedFacebookModal && (
        <AnimatedFacebookModal
          open={showAnimatedFacebookModal}
          onClose={() => setShowAnimatedFacebookModal(false)}
          initialData={animatedFacebookCard ? { appName: animatedFacebookCard.name, tags: '', url: '' } : {}}
          onSave={(data) => {
            // Ensure widget has all required fields for content area
            const widgetToSave = {
              ...data,
              type: 'social-network',
              name: data.appName || 'Animated Facebook App',
              appName: data.appName || 'Animated Facebook App',
              originalName: animatedFacebookCard?.name || 'Animated Facebook App',
              widgetCategory: 'Social Networks',
              widgetSubType: 'animated-facebook',
            };
            // Close the modal first
            setShowAnimatedFacebookModal(false);
            // Save the widget directly
            onWidgetSelect && onWidgetSelect(widgetToSave);
          }}
        />
      )}
    </div>
  );
}

export default AppGalleryModal;