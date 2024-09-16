import { useEffect, useState } from "react";

interface Video {
  url: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  // Função para buscar os vídeos
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Upload Video</h1>
      <form action="/api/upload" method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="video">Select Video:</label>
          
          <input type="file" name="video" accept="video/mp4" />
        </div>
        <button type="submit">Upload</button>
      </form>

      <h2>Uploaded Videos</h2>
      <div>
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video, index) => (
            <div key={index}>
              <video width="320" height="240" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
