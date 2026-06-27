-- Seed data for AI Video Tool Radar

INSERT INTO tools (name, official_url, category, primary_use_case, free_access_type, free_limit, watermark, audio_support, max_duration, quality_score, speed_score, ease_score, description_en, description_zh, last_verified, source_url) VALUES
('Runway Gen-3', 'https://runwayml.com', 'Text-to-Video', 'Text to video generation with cinematic quality', 'Freemium', '125 credits/month (about 25 generations)', 'Has Watermark', 'No Audio', 10, 5, 3, 4, 'Runway Gen-3 Alpha is a state-of-the-art text-to-video model that produces high-quality, cinematic video clips.', 'Runway Gen-3 Alpha 是最先进的文本生成视频模型，可生成高质量的电影级视频片段。', '2025-06-01', 'https://runwayml.com/research/gen-3-alpha'),

('Pika Labs', 'https://pika.art', 'Text-to-Video', 'Quick social media video creation', 'Freemium', '250 credits/month', 'Has Watermark', 'No Audio', 8, 4, 4, 5, 'Pika Labs offers an intuitive interface for generating short-form videos.', 'Pika Labs 提供直观的短视频生成界面。', '2025-06-01', 'https://pika.art'),

('Kling AI', 'https://kling.kuaishou.com', 'Text-to-Video', 'High quality realistic video generation', 'Freemium', 'Limited daily generations', 'Has Watermark', 'No Audio', 120, 5, 3, 4, 'Kling AI generates remarkably realistic videos up to 2 minutes.', '快手的 Kling AI 可生成长达 2 分钟的逼真视频。', '2025-06-01', 'https://kling.kuaishou.com'),

('Luma Dream Machine', 'https://lumalabs.ai', 'Image-to-Video', 'Image to video with realistic motion', 'Freemium', '30 generations/month', 'Has Watermark', 'No Audio', 5, 4, 2, 5, 'Luma Dream Machine creates smooth, realistic videos from images.', 'Luma Dream Machine 可从图片创建流畅逼真的视频。', '2025-06-01', 'https://lumalabs.ai/dream-machine'),

('HeyGen', 'https://heygen.com', 'Avatar & Talking Head', 'AI avatar and talking head videos', 'Freemium', '1 minute/month free', 'Has Watermark', 'Audio Supported', 60, 5, 4, 5, 'HeyGen creates lifelike AI avatars that can speak any text.', 'HeyGen 可创建逼真的 AI 数字人。', '2025-06-01', 'https://heygen.com'),

('CapCut (剪映)', 'https://capcut.com', 'Video Editing', 'Video editing with AI features', 'Free Forever', 'Most features free', 'No Watermark', 'Audio Supported', NULL, 4, 5, 5, 'CapCut is a free, powerful video editor with AI-powered features.', 'CapCut（剪映）是免费的强大视频编辑器。', '2025-06-01', 'https://capcut.com'),

('Hailuo AI', 'https://hailuoai.com', 'Text-to-Video', 'Long duration video generation', 'Freemium', 'Limited daily generations', 'No Watermark', 'No Audio', 6, 4, 4, 4, 'Hailuo AI delivers high-quality video generation with good prompt adherence.', '海螺 AI 提供高质量视频生成。', '2025-06-01', 'https://hailuoai.com'),

('Pixverse', 'https://pixverse.ai', 'Text-to-Video', 'Anime and stylized video generation', 'Freemium', 'Daily free credits', 'No Watermark', 'No Audio', 8, 4, 4, 5, 'Pixverse excels at anime and stylized video generation.', 'Pixverse 擅长动漫和风格化视频生成。', '2025-06-01', 'https://pixverse.ai'),

('Vidu AI', 'https://vidu.studio', 'Text-to-Video', 'Long video generation up to 32s', 'Freemium', 'Limited credits', 'No Watermark', 'No Audio', 32, 4, 4, 4, 'Vidu AI supports up to 32-second video generation with good quality.', 'Vidu AI 支持最长 32 秒视频生成。', '2025-06-01', 'https://vidu.studio'),

('Sora (OpenAI)', 'https://sora.com', 'Text-to-Video', 'Advanced AI video generation', 'Paid Only', 'Not verified', 'Has Watermark', 'Audio Supported', 60, 5, 2, 4, 'OpenAI Sora represents the cutting edge of AI video generation.', 'OpenAI 的 Sora 代表了 AI 视频生成的前沿水平。', '2025-06-01', 'https://sora.com'),

('DeepBrain AI', 'https://deepbrain.io', 'Avatar & Talking Head', 'Professional AI avatars for business', 'Free Trial', '10 minutes trial', 'Has Watermark', 'Audio Supported', 600, 4, 4, 4, 'DeepBrain AI Studios creates professional AI avatar videos.', 'DeepBrain AI Studios 为商业用途创建专业 AI 数字人视频。', '2025-06-01', 'https://deepbrain.io'),

('Synthesia', 'https://synthesia.io', 'Avatar & Talking Head', 'Enterprise AI video creation', 'Free Trial', '1 free video', 'Has Watermark', 'Audio Supported', 600, 5, 4, 5, 'Synthesia is the leading enterprise AI video platform.', 'Synthesia 是领先的企业级 AI 视频平台。', '2025-06-01', 'https://synthesia.io'),

('Viggle AI', 'https://viggle.ai', 'Character Animation', 'Character animation with motion control', 'Free Forever', 'Unlimited with watermark', 'Has Watermark', 'Audio Supported', 30, 3, 4, 5, 'Viggle AI animates characters with precise motion control.', 'Viggle AI 通过精确运动控制为角色制作动画。', '2025-06-01', 'https://viggle.ai'),

('Meshy AI', 'https://meshy.ai', '3D Generation', 'AI 3D model generation from text/image', 'Freemium', '200 credits/month', 'No Watermark', 'No Audio', NULL, 4, 4, 4, 'Meshy generates 3D models from text descriptions or images.', 'Meshy 从文字描述或图片生成 3D 模型。', '2025-06-01', 'https://meshy.ai'),

('Kaiber', 'https://kaiber.ai', 'Image-to-Video', 'Artistic and music video creation', 'Freemium', 'Limited free credits', 'Has Watermark', 'Audio Supported', 60, 3, 3, 4, 'Kaiber specializes in artistic and music video generation.', 'Kaiber 专注于艺术和音乐视频生成。', '2025-06-01', 'https://kaiber.ai');
