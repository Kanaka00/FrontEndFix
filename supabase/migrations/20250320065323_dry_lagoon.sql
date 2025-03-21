/*
  # Create default personal info record

  1. Changes
    - Insert default personal info for admin user
    - Ensure single record exists
*/

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM personal_info 
        WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@frontendfix.com')
    ) THEN
        INSERT INTO personal_info (
            bio,
            skills,
            education,
            experience,
            interests,
            social_links,
            user_id
        ) VALUES (
            'Front-end developer with a passion for creating beautiful and functional web applications.',
            ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
            ARRAY['Bachelor of Computer Science'],
            ARRAY['Senior Front-end Developer at TechCorp', 'Web Developer at DesignStudio'],
            ARRAY['Web Development', 'UI/UX Design', 'Open Source'],
            '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}',
            (SELECT id FROM auth.users WHERE email = 'admin@frontendfix.com')
        );
    END IF;
END $$;