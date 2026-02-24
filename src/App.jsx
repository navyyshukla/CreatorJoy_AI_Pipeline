import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Connect to your exact Supabase project
const supabaseUrl = 'https://ilfffnjchhooppkhusla.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZmZmbmpjaGhvb3Bwa2h1c2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Mjc4OTksImV4cCI6MjA4NzEwMzg5OX0.TY_n4jzVtGNZzOIsY9fEDRwjFu4roA7K_GJOEC6PLqQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const ytId = data.youtube_url.split('v=')[1];
        setVideoData({ ...data, ytId });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>Loading CreatorJoy Data...</h2>;
  if (!videoData) return <h2 style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>No videos found. Run the n8n pipeline!</h2>;

  return (
    <div style={{ padding: '60px 20px', fontFamily: '"Inter", sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '2.5rem', fontWeight: '800' }}>CreatorJoy</h1>
        <h3 style={{ margin: '0 0 20px 0', color: '#64748b', fontWeight: '500' }}>Automated AI Avatar Pipeline</h3>
        <div style={{ display: 'inline-block', backgroundColor: '#e2e8f0', padding: '10px 20px', borderRadius: '50px', color: '#334155', fontWeight: '600' }}>
          Topic: {videoData.topic}
        </div>
      </div>

      {/* Side-by-Side Video Layout */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Original YouTube Video Card */}
        <div style={{ flex: '1 1 450px', maxWidth: '500px', backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>1</div>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Original Source</h3>
          </div>
          <iframe 
            style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px' }}
            src={`https://www.youtube.com/embed/${videoData.ytId}`} 
            title="YouTube video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        {/* AI Generated Video Card */}
        <div style={{ flex: '1 1 450px', maxWidth: '500px', backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>2</div>
            <h3 style={{ margin: 0, color: '#0f172a' }}>AI Generated Avatar</h3>
          </div>
          <video style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', backgroundColor: '#000' }} controls>
            <source src={videoData.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

      </div>
    </div>
  );
}