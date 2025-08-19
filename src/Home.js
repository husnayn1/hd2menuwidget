import React, { useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  IconButton,
  Card,
} from "@mui/material";
import { PiDotsThreeCircle } from "react-icons/pi";
import MoreActions from "./components/common-dialog/common-dialog";

const getRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#FFD93D",
    "#6A4C93",
    "#1DD3B0", "#FF922B",
  ];

  const lightenColor = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + Math.round(2.55 * percent);
    let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
    let b = (num & 0x0000ff) + Math.round(2.55 * percent);

    r = r < 255 ? r : 255;
    g = g < 255 ? g : 255;
    b = b < 255 ? b : 255;

    return `rgb(${r}, ${g}, ${b})`;
  };

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return lightenColor(randomColor, 40); // 40% lighter
};



const mediaData = [
  {
    type: "image",
    src: "https://cdn.pixabay.com/objects3d/2025/07/11/05-07-07-679/render_720_720_0_340_0.png",
    title: "Baseus Car Charger",
    description: "30W PPS fast charging car charger",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/06/13/14/48/bird-9658215_640.jpg",
    title: "Beautiful Bird",
    description: "Captured in natural habitat",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2023/10/21/185947-876963225_tiny.mp4",
    title: "Nature Video",
    description: "Relaxing video clip",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2022/09/05/17/15/vancouver-7434702_640.jpg",
    title: "Vancouver View",
    description: "City skyline at sunset",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/02/07/16/09/flower-9390482_640.jpg",
    title: "Flower",
    description: "Blooming flower closeup",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2025/07/22/292827_tiny.mp4",
    title: "Wind Turbines",
    description: "Clean renewable energy",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2025/07/10/07/24/house-9706056_640.jpg",
    title: "Modern House",
    description: "Luxury home architecture",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2025/05/01/276047_tiny.mp4",
    title: "Ocean Waves",
    description: "Relaxing sea sounds",
  },


  { type: "video", src: "https://cdn.pixabay.com/video/2025/03/29/268528_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/12/15/246856_tiny.mp4", title: "Video Clip", description: "Pixabay video" },

  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/21/15/20/eve-9726477_640.jpg", title: "Evening View", description: "Calm evening vibe" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/02/13/20/fishing-rod-9692407_640.png", title: "Fishing Rod", description: "Ready for fishing" },

  { type: "video", src: "https://cdn.pixabay.com/video/2025/03/18/265501_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/10/14/236316_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/17/14/14/sparrow-9719599_640.jpg", title: "Sparrow", description: "Little bird closeup" },

  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/10/14/29/bearded-dragon-9706773_640.jpg", title: "Bearded Dragon", description: "Reptile resting" },
  { type: "video", src: "https://cdn.pixabay.com/video/2025/02/23/260397_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2025/03/03/262215_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/video/2024/03/12/203923-922675870_tiny.jpg", title: "Still Image", description: "Pixabay preview" },
  { type: "video", src: "https://cdn.pixabay.com/video/2025/01/19/253423_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2021/09/11/88207-602915574_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2025/01/19/253436_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/video/2024/08/09/225661_tiny.jpg", title: "Still Image", description: "Pixabay preview" },
  { type: "video", src: "https://cdn.pixabay.com/video/2025/01/07/251262_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/11/07/240330_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/video/2024/12/03/244754_tiny.jpg", title: "Still Image", description: "Pixabay preview" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/11/11/240841_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/26/03/16/butterfly-9735952_640.jpg", title: "Butterfly", description: "Colorful butterfly" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/14/07/23/flower-9713477_640.png", title: "Flower", description: "Beautiful blossom" },

  { type: "video", src: "https://cdn.pixabay.com/video/2024/11/17/241802_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/03/13/204006-923133925_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2022/09/05/20/50/luminous-clouds-7435175_640.jpg", title: "Luminous Clouds", description: "Dramatic sky view" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/21/07/31/facade-9725534_640.jpg", title: "Facade", description: "Modern building design" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/22/22/21/iceberg-9729316_640.jpg", title: "Iceberg", description: "Floating glacier" },

  { type: "video", src: "https://cdn.pixabay.com/video/2024/12/29/249475_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2024/12/05/18/44/mountain-9247234_640.jpg", title: "Mountain", description: "Snow covered peaks" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/05/21/16/21/stork-9614143_640.jpg", title: "Stork", description: "Majestic bird" },

  { type: "video", src: "https://cdn.pixabay.com/video/2024/03/18/204565-924698132_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/15/04/01/grapefruit-9715105_640.jpg", title: "Grapefruit", description: "Fresh juicy fruit" },

  { type: "video", src: "https://cdn.pixabay.com/video/2024/11/09/240531_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2024/10/18/236893_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2022/08/31/06/55/seaside-promenade-7422541_640.jpg", title: "Seaside Promenade", description: "Peaceful walkway" },
  { type: "image", src: "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_640.jpg", title: "Cookie Cutters", description: "Baking essentials" },

  { type: "video", src: "https://cdn.pixabay.com/video/2024/06/02/214940_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  { type: "video", src: "https://cdn.pixabay.com/video/2023/01/30/148594-794221537_tiny.mp4", title: "Video Clip", description: "Pixabay video" },
  // { type: "image", src: "https://cdn.pixabay.com/photo/2025/07/05/13/27/falcon-9697872_640.jpg", title: "Falcon", description: "Powerful bird of prey" },
  // { type: "image", src: "https://cdn.pixabay.com/photo/2024/05/26/16/49/dog-8789154_640.jpg", title: "Dog", description: "Friendly companion" },
];


export default function Home() {

 const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };




  return (
    <>
    <Box p={1} >
      <Grid container spacing={2}  sx={{display:'flex',justifyContent:'center'}}>
        {mediaData.map((item, index) => {
          const borderColor = getRandomColor();
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  border: `3px solid ${borderColor}`,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {/* Media */}
                <Box>
                  {item.type === "image" ? (
                    <Box
                      component="img"
                      src={item.src}
                      alt={item.title}
                      sx={{ width: 300, height: 180, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={item.src}
                      controls
                      sx={{ width: 300, height: 180, objectFit: "cover" }}
                    />
                  )}
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    bgcolor: borderColor,
                    color: "black",
                    px: 2,
                    py: 1.5,
                    opacity : 0.5,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </Box>
                  <IconButton sx={{ color: "black" }} 
                                      onClick={() => handleOpenDialog(item)}

                  >

<PiDotsThreeCircle />
                </IconButton>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
   <MoreActions 
        open={openDialog} 
        onClose={handleCloseDialog} 
        item={selectedItem}
      />
</>

  );
}
