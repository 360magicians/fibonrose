-- Insert sample admin user (you'll need to create this user in Supabase Auth first)
-- INSERT INTO public.users (id, email, full_name, user_type) VALUES
-- ('your-admin-uuid-here', '360magicians@gmail.com', 'Pinky Collie', 'admin');

-- Sample interpreter data
INSERT INTO public.users (id, email, full_name, user_type, phone, video_phone) VALUES
(uuid_generate_v4(), 'interpreter1@example.com', 'Sarah Johnson', 'interpreter', '555-0101', 'vp-555-0101'),
(uuid_generate_v4(), 'interpreter2@example.com', 'Michael Chen', 'interpreter', '555-0102', 'vp-555-0102'),
(uuid_generate_v4(), 'interpreter3@example.com', 'Emily Rodriguez', 'interpreter', '555-0103', 'vp-555-0103');

-- Sample deaf professional data
INSERT INTO public.users (id, email, full_name, user_type, phone, video_phone) VALUES
(uuid_generate_v4(), 'deafpro1@example.com', 'David Williams', 'deaf_professional', '555-0201', 'vp-555-0201'),
(uuid_generate_v4(), 'deafpro2@example.com', 'Maria Garcia', 'deaf_professional', '555-0202', 'vp-555-0202');

-- Sample service provider data
INSERT INTO public.users (id, email, full_name, user_type, phone) VALUES
(uuid_generate_v4(), 'provider1@example.com', 'ABC Real Estate', 'service_provider', '555-0301'),
(uuid_generate_v4(), 'provider2@example.com', 'XYZ Tax Services', 'service_provider', '555-0302');

-- Create interpreter profiles for sample interpreters
INSERT INTO public.interpreter_profiles (user_id, asl_proficiency, years_experience, specializations, service_areas, hourly_rate, bio)
SELECT 
    u.id,
    'advanced'::asl_proficiency,
    5,
    ARRAY['financial', 'legal'],
    ARRAY['New York', 'New Jersey'],
    75.00,
    'Experienced ASL interpreter specializing in financial and legal services.'
FROM public.users u 
WHERE u.email = 'interpreter1@example.com';

INSERT INTO public.interpreter_profiles (user_id, asl_proficiency, years_experience, specializations, service_areas, hourly_rate, bio)
SELECT 
    u.id,
    'native'::asl_proficiency,
    8,
    ARRAY['medical', 'educational'],
    ARRAY['California', 'Nevada'],
    85.00,
    'Native ASL user with extensive experience in medical and educational interpretation.'
FROM public.users u 
WHERE u.email = 'interpreter2@example.com';

-- Create deaf professional profiles
INSERT INTO public.deaf_professional_profiles (user_id, asl_proficiency, deaf_community_involvement, skills)
SELECT 
    u.id,
    'native'::asl_proficiency,
    '[{"organization": "National Association of the Deaf", "role": "Board Member", "years": 3}]'::jsonb,
    ARRAY['leadership', 'advocacy', 'community_organizing']
FROM public.users u 
WHERE u.email = 'deafpro1@example.com';

-- Calculate initial trust scores for sample users
SELECT calculate_trust_score(id) FROM public.users WHERE user_type IN ('interpreter', 'deaf_professional');
