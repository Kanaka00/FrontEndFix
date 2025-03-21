/*
  # Create admin user with email authentication

  1. Changes
    - Enable email authentication
    - Create admin user with specified credentials
    - Set up proper authentication fields
*/

-- Enable email authentication
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin user
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@frontendfix.com'
    ) THEN
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            uuid_generate_v4(),
            'admin@frontendfix.com',
            crypt('Kanaka6074@', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Admin"}',
            'authenticated',
            'authenticated'
        );
    END IF;
END $$;