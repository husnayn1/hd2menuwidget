import React from "react";
import { IoMdAppstore } from "react-icons/io";
import { IoTvSharp } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { FaDatabase, FaFolder } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { MdOutlineAudioFile } from "react-icons/md";



function NewDropdown({ onAppClick, onUploadClick }) {
  return (
    <div style={{
      position: "absolute", top: 50, left: 10, background: "#fff", border: "1px solid #ccc", zIndex: 10, width: 220, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }} onClick={onUploadClick}>
        <span role="img" aria-label="upload">
          <FaCloudUploadAlt />
        </span> Upload File
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }} onClick={onAppClick}>
        <span role="img" aria-label="app">

< IoMdAppstore />

        </span> App
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="campaign">
          < BiSolidReport />
        </span> Campaign
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="composition">
<IoTvSharp />

        </span> Composition
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="datafeed">
          <FaDatabase />
        </span> Data Feed
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="folder">


<FaFolder />

        </span> Folder
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="playlist">

<FiLayers />


        </span> Playlist
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
        <span role="img" aria-label="audioplaylist">

<MdOutlineAudioFile />


        </span> Audio Playlist
      </div>
    </div>
  );
}

export default NewDropdown; 